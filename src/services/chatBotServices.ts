



import { completionFunction, generalResponse, interpretationResponse, readTableMessages } from '../config/gpt.config';
import { completionFunctionClaude, generalResponseClaude, interpretationResponseClaude } from '../config/claude.config';
import { isSQLQuery } from '../helpers/dbShemasAndQueries';
import { DataSource } from "typeorm";
// import { DB_SUPER_PASSWORD, DB_SUPER_USER, SUPER_DB_HOST } from "../config/envs";
import { DatabaseSchema } from '../dto';
import { AppDataSource } from '../config/data-source';
import { MessageHistory } from '../models/Messages';
import { Company } from '../models/Company';

export interface IAResponse {
    response: string;
    query: string;
}


export const getResponseIA = async (message: string, databaseSchema : DatabaseSchema, userId: number) => {
       try {
        if (!message) {
            return "El mensaje es requerido";
        }if(!userId){
            return "El usuario es requerido";
        }
        const company = await AppDataSource.getRepository(Company).findOne({where: { userId }});
        if (!company) {
            return "No se encontró la compañía asociada al usuario";
        }   
        const dbm = company.dbm
        if (isSQLQuery(message)) {
            const generatedQuery = await completionFunction(message, databaseSchema, dbm);

            console.log(databaseSchema.database)
            const AppDataSource = new DataSource({
               type: "mssql", // Cambia el tipo a "mssql" para SQL Server
               host: company.databaseHost, // Dirección del host
               port: 1433, // Puerto típico para SQL Server
               username: company.databaseUsername, // Nombre de usuario
               password: company.databasePassword, // Contraseña
               database: company.databaseName, // Nombre de la base de datos
               synchronize: true,
               dropSchema: false, // No eliminar registros
               logging: false,
               options: {
                   encrypt: false, // Desactiva la encriptación si no está habilitada en el servidor
               },
               entities: [], // Aquí puedes agregar tus entidades como User, Vehicle, etc.
               subscribers: [],
               migrations: [],
           });
  
            // Asegurarse de que la conexión está inicializada
            if (!AppDataSource.isInitialized) {
              await AppDataSource.initialize();
          }
           // Ejecutar la consulta en la base de datos usando TypeORM
           const results = await AppDataSource.query(generatedQuery);
  
           console.log('Resultados de la consulta --->  ',results)
  
           // Formatear los resultados en una cadena JSON para OpenAI
           const formattedResults = JSON.stringify(results);
  
           const response = await interpretationResponse(formattedResults, message);
        //    await processResponseKPIs(response)
          
       
           return {
           response,
           query : generatedQuery
           }

        }else{
            console.log('**********flujo de respuesta general*****')
            const response = await generalResponse(message, databaseSchema)
            return {
                response
            }
        }
       } catch (error) {
        console.error(error);
        return `${error}`;
       }
}

export const getResponseIAClaude = async (message: string, databaseSchema : DatabaseSchema) : Promise <string | object > => {
    try {
     if (!message) {
         return "El mensaje es requerido";
     }
     if (isSQLQuery(message)) {
         const generatedQuery = await completionFunctionClaude(message, databaseSchema);

        
         console.log(databaseSchema.database)
         const AppDataSource = new DataSource({
            type: "mssql", // Cambia el tipo a "mssql" para SQL Server
            host: '', // Dirección del host
            port: 1433, // Puerto típico para SQL Server
            username: '', // Nombre de usuario
            password: '', // Contraseña
            database: databaseSchema.database, // Nombre de la base de datos
            synchronize: true,
            dropSchema: false, // No eliminar registros
            logging: false,
            options: {
                encrypt: false, // Desactiva la encriptación si no está habilitada en el servidor
            },
            entities: [], // Aquí puedes agregar tus entidades como User, Vehicle, etc.
            subscribers: [],
            migrations: [],
        });

          // Asegurarse de que la conexión está inicializada
          if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }
         // Ejecutar la consulta en la base de datos usando TypeORM
         const results = await AppDataSource.query(generatedQuery);

         console.log('Resultados de la consulta --->  ',results)

         // Formatear los resultados en una cadena JSON para OpenAI
         const formattedResults = JSON.stringify(results);

         const response = await interpretationResponseClaude(formattedResults, message);
     
         return response;
     }else{
         const response = await generalResponseClaude(message)
         return response
     }
    } catch (error) {
     console.error(error);
     return `${error}`;
    }
}

export const getMessagesHistory = async (id : number)  => {
    try {
        // traer registros solo del usuario de la  tabla messages
        const messages = await AppDataSource.getRepository(MessageHistory).find({
            where: {
                userId: id
            }
        });
        if(messages.length < 1) return 'No hay historial de registros'
        // return messages
        //pasar los resultados al modelo ia
        const proccess = await readTableMessages(messages)
        return proccess
        
    } catch (error) {
     console.error(error);
     return `${error}`;
    }
}