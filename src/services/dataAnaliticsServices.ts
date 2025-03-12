
import { AppDataSource } from "../config/data-source";
import { createDataSource } from "../config/data-source-SQLSERVER";
import { Company } from "../models/Company";

export const getBdsServices = async (userId: number) => {
    try {
        const company = await AppDataSource.getRepository(Company).findOne({ where: { userId } });
        if (!company) {
            return "No se encontró la compañía asociada al usuario";
        }

        const tempDataSource = createDataSource(company);

        if (!tempDataSource.isInitialized) {
            await tempDataSource.initialize();
        }

        const query = `SELECT name AS NombreBaseDatos FROM sys.databases WHERE name NOT IN ('master', 'tempdb', 'model', 'msdb', 'SSISDB')`;
        const result = await tempDataSource.query(query);

        await tempDataSource.destroy();

        return result;
    } catch (error) {
        console.error("Error al obtener las bases de datos:", error);
        return `Error: ${error}`;
    }
};

export const getTablesServices = async (database: string, company: Company) => {
    try {
        if (!database) return 'Se requiere nombre de la base de datos';

        const tempDataSource = createDataSource(company);

        if (!tempDataSource.isInitialized) {
            await tempDataSource.initialize();
        }

        const query = `SELECT * FROM ${database}.sys.tables`;
        const result = await tempDataSource.query(query);

        await tempDataSource.destroy();

        return result;
    } catch (error) {
        console.error("Error al obtener las tablas:", error);
        return `Error: ${error}`;
    }
};

export const getColumnsTablesServices = async (database : string ,table : string, company : Company) => {
    try{

        if(!database || !table) return 'Se requieren el nombre de la base de datos y de la tabla'
        const query = `EXEC sp_ObtenerColumnasYTipos '${database}', '${table}'`
        const conn = await createDataSource(company)
        if (!conn.isInitialized) {
            await conn.initialize();
        }
        const result = await conn.query(query)
        return result

    }catch(error){
        console.error(error)
        return `${error}`
    }
}
