import { OpenAI } from 'openai';
import { API_KEY_GPT } from './envs';
// import { queries, tables } from '../helpers/dbShemasAndQueries';
import { DatabaseSchema } from '../dto';
import { Kpi } from '../interfaces/index';

// Conexión a la instancia de OpenAI
export const openai = new OpenAI({
    apiKey: API_KEY_GPT
});

// Modelo ia que procesa el contexto de base de datos y tablas y procesa peticion en lenguaje natural y devuelve una consulta sql para analisis de datos
export const completionFunction = async (message: string, databaseSchema: DatabaseSchema, dbm: string): Promise<string> => {
    // const dbm = 'MSSQL'
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [

                { role: "system", content: `Eres un asistente que usa consultas SQL , no uses limit en las consultas para dbm MSSQL , usa sentencias 'like' cuando veas que corresponda, Aplicar mejores prácticas en SQL, tales como: evitar subconsultas innecesarias, usar índices cuando sea posible, y optimizar las uniones (JOINs) para mejorar el rendimiento. Aquí está la información sobre las tablas disponibles: ${JSON.stringify(databaseSchema.tables)}. Genera una consulta SQL basada en el mensaje del usuario, revisa los resultados y devuélvelos. Solo quiero que des la consulta sin commillas sin textos aparte solo la consulta. limitate a realizar consultas las cuales puedan ser demasiado grandes solo usa lo esencial no superes la cantidad de datos` },

                { role: "user", content: message },
                { role: "assistant", content: `solo generare consultas sql para base de datos ${dbm} especificas a totales o promedios` }
            ],
            max_tokens: 1000,
            temperature: 0.2,
            top_p: 1,
            n: 1
        });

        // Extraer la consulta generada por el modelo
        const dataQuery = completion.choices[0]?.message?.content?.trim();
        const sqlQuery = dataQuery?.replace(/`/g, '').replace(/\b(sql|SQL|Sql|SqL)\b/gi, '')
        console.log("Consulta generada:", sqlQuery);

        if (!sqlQuery) {
            throw new Error("No se pudo generar la consulta SQL");
        }

        // Retornar la consulta SQL generada
        return sqlQuery;

    } catch (error) {
        console.error("Error al generar la consulta SQL:", error);
        throw error;  // Re-lanzar el error para que sea manejado externamente
    }
};


// modelo que interpreta los reultados de la consulta sql en la base de datos en formato json y los devuelve en lenguaje natural
export const interpretationResponse = async (formattedResults: string, message: string): Promise<string> => {
    try {

        const completions = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: `Eres el responsable escribir los resultados de un json. Aquí están los resultados: ${formattedResults} y esta es donde viene la pregunta ${message}. NO des contexto del json que recibes solo da la informacion relevante con periodos analizados, muestralo de una forma agradable con puntos, lineas, listas, numeraciones, evita los mensajes que esten repetidos. limitate a dar respuestas que sean estremadasmente largas y ve a punto necesario si detectas campos repetidos solo muestra uno solo, puedes quita los guiones bajo y medios, dale estilo al texto dandoles los titulos subtitulos etc` },
                { role: "user", content: "Interpreta estos resultados" },
                { role: "assistant", content: "Claro como analista de datos te entrego los resultados para ser insertados en informes generenciales limitate a realizar consultas las cuales puedan ser demasiado grandes enfocate al mes actual, si ya se te piden mas meses lo haces" }
            ],
            max_tokens: 1500,
            temperature: 0.5,
            top_p: 1,
            n: 1
        });

        let interpretedData = completions.choices[0]?.message?.content?.trim() ?? '';
        console.log("Respuesta interpretada:", interpretedData);

        // Responder al cliente con los resultados interpretados
        return interpretedData;
    } catch (error) {
        console.error("Error al interpretar los resultados:", error);
        throw new Error("Ocurrió un error al procesar la respuesta del modelo de IA.");
    }
}



//modelo ia para preguntas generales q nos son consultas a base de datos
export const generalResponse = async (message: string, databaseSchema: DatabaseSchema): Promise<string> => {
    console.log('API KEY GPT -->', API_KEY_GPT)
    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "system",
                content: `Eres el asistente de analitixData encargado de proporcionar datos de relevancia para la toma de desiciones a nivel gerencial para tu empresa le puedes dar sugerencias de como hacer las preguntas o ayudar a como realizar preguntas con estos datos genera preguntas que puede realizar ${JSON.stringify(databaseSchema.tables)}. tienes la capacidad de crear tablas crea los codigos para realizar las tablas y poder renderizarlo`
            },
            {
                role: "user",
                content: message
            },
            {
                role: "assistant",
                content: `Claro, como tu analista de datos de AnalitixData, te proporcionaré los datos más relevantes de tu negocio para la toma de decisiones gerenciales.`
            }
        ],
        max_tokens: 1500,
        temperature: 0.5,
        top_p: 1,
        n: 1
    });

    let responseText = response.choices[0]?.message?.content?.trim();
    console.log("Respuesta general:", responseText);

    // Responder al cliente con la respuesta general
    return responseText || 'No hay respuesta';
}


// modelo ia que lee el contexto de una tabla historico de mensajes y devuelve el historial de la ultima semana 
export const readTableMessages = async (formattedResults: object): Promise<string> => {
    const completions = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            { role: "system", content: `eres el encargado de leer una tabla que viene en formato json , esta es la tabla ${JSON.stringify(formattedResults)} ` },
            { role: "user", content: "Interpreta estos resultados y devuelve un resumen del historial de conversaciones de la ultima semana con fechas de forma corta y concisa" }
        ],
        max_tokens: 1500,
        temperature: 0.5,
        top_p: 1,
        n: 1
    });

    let interpretedData = completions.choices[0]?.message?.content?.trim() ?? '';
    console.log("Respuesta interpretada:", interpretedData);

    // Responder al cliente con los resultados interpretados
    return interpretedData;

}


// modelo ia encargado de proccesar kpis  y devolverolos en el  schema de la tabla kpi de base de datos
export const processResponseKPIs = async (results: string, userId: number): Promise<string> => {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: `Eres el encargado de interpretar resultados de KPIs y formatearlos en el siguiente esquema JSON:
                    {
                        id: string;
                        idUser: number = ${userId};
                        name: string;
                        title: string; //titulo de la consulta igual para todos
                        value: number;
                        period: string;
                        region?: string;
                        productCategory?: string;
                    }
                    Devuélvelos en el formato adecuado para su inserción en la base de datos.sin son varios registros , todos en un solo array `
                },
                {
                    role: "user",
                    content: `Interpreta y devuelve estos resultados en el esquema solicitado: ${results}`,
                },
                {
                    role: "assistant",
                    content: `Claro devolvere los resultados en el esquema solicitado y en la propiedad title hubicare el nombre de la consulta general el cual sera el titulo de la grafica`,
                },
            ],
            max_tokens: 3000,
            temperature: 0.
        });

        const interpretedData = completion.choices[0]?.message?.content?.trim() || '';
        console.log("Respuesta interpretada:", interpretedData);

        return interpretedData;
    } catch (error) {
        console.error("Error al interpretar la respuesta de KPIs:", error);
        return 'Error en la interpretación de los resultados.';
    }
};


export const analitixData = async (results: Kpi | Kpi[], userId: number): Promise<string> => {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: `Eres un asistente experto en análisis predictivo. Tu tarea es interpretar los datos históricos de KPIs proporcionados y generar predicciones futuras y proyecciones. 
                    Analiza los datos en base a tendencias, crecimiento y estacionalidad, y devuélvelos en el formato especificado con una estructura clara y concisa con periodos de tiempos analizados.`
                },
                {
                    role: "user",
                    content: `Interpreta y proyecta los siguientes datos en un esquema KPI. Proporciona predicciones de ingresos, demanda y otras métricas basadas en estos datos históricos: ${JSON.stringify(results)}, solo ten en cuenta los datos del usuario con id ${userId}, suministra informacion de intervalos de tiempo`
                }
            ],
            max_tokens: 2000, // Aumentar tokens para respuestas completas
            temperature: 0.3, // Mantener temperatura baja para respuestas más determinísticas
            top_p: 0.9,       // Asegura respuestas de alta probabilidad
            frequency_penalty: 0, // Sin penalización para evitar repetición innecesaria
            presence_penalty: 0   // Sin penalización adicional para coherencia
        });

        const interpretedData = completion.choices[0]?.message?.content?.trim() || '';
        console.log("Respuesta interpretada:", interpretedData);

        return interpretedData;
    } catch (error) {
        console.error("Error al interpretar la respuesta de KPIs:", error);
        return 'Error en la interpretación de los resultados.';
    }
};

export const graphs = async (results: string) => {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: `Eres un asistente experto en análisis tu funcion sera la de generar graficas estadisticas segun los datos que recibas del usuario`
                },
                {
                    role: "user",
                    content: `  graficar estos indicadores que vienen en formato json ${JSON.stringify(results)}`
                }
            ],
            max_tokens: 2000, // Aumentar tokens para respuestas completas
            temperature: 0.3, // Mantener temperatura baja para respuestas más determinísticas
            top_p: 0.9,       // Asegura respuestas de alta probabilidad
            frequency_penalty: 0, // Sin penalización para evitar repetición innecesaria
            presence_penalty: 0   // Sin penalización adicional para coherencia
        });

        const response = completion.choices[0]?.message?.content?.trim() || '';
        console.log("Respuesta interpretada:", response);

        return response;
    } catch (error) {
        console.error("Error al interpretar la respuesta de KPIs:", error);
        return 'Error en la interpretación de los resultados.';
    }
};