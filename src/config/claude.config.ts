import { Anthropic } from '@anthropic-ai/sdk';
import { API_KEY_ANTHROPIC } from './envs';
// import { queries  } from '../helpers/dbShemasAndQueries';
import { CompletionContent } from '../interfaces';
import { DatabaseSchema } from '../dto';

// Conexión a la instancia de Anthropic
export const anthropic = new Anthropic({
    apiKey: API_KEY_ANTHROPIC
});


// Generar la consulta SQL usando Anthropic y devolverla (corregido para alternar roles correctamente)
export const completionFunctionClaude = async (message: string, databaseSchema : DatabaseSchema): Promise<string > => {
  console.log(databaseSchema)
  try {
      const completion = await anthropic.messages.create({
          model: "claude-3-5-sonnet-20240620",
          max_tokens: 1024,
          temperature: 0.5,
          system: "Eres un asistente especializado en consultas  SQL .",
          messages: [
              { role: "user", content: `Eres un asistente que usa SQL server. Aquí está la información sobre el esquema de las tablas --> ${JSON.stringify(databaseSchema.tables)}  . Genera una consulta SQL basada en el mensaje del usuario, revisa los resultados y devuélvelos. Solo quiero que des la consulta sin commillas sin textos aparte solo la consulta.`},
              { role: "assistant", content: 'Entendido. Generaré una consulta SQL basada en la información proporcionada y el mensaje del usuario.' },
              { role: "user", content: `Por favor, proporciona solo la consulta SQL generada con esta peticion ${message}` }
          ]
      });

      const content = completion.content[0] as CompletionContent;


      // Extraer la consulta generada por el modelo
      const sqlQuery = content.text;
      console.log("Consulta SQL generada:", sqlQuery);


      if (!sqlQuery) {
          return"No se pudo generar la consulta SQL";
      }

      return sqlQuery

      

  } catch (error) {
      console.error("Error al generar la consulta SQL:", error);
      throw error;
  }
};

// Pedir a Anthropic que interprete los resultados (migrado a Messages API)
export const interpretationResponseClaude = async (formattedResults: string, message: string): Promise<string> => {
  
  const completions = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 1500,
      system: "Eres responsable de interpretar resultados en formato JSON.",
      messages: [
          { role: "user", content: `Aquí están los resultados: ${formattedResults}, y esta es la pregunta: ${message}. Por favor, interpreta estos resultados. NO des contexto del json que recibes solo da la informacion relevante, muestralo de una forma agradable con puntos, lineas, listas, numeraciones, evita los mensajes que esten repetidos.devuelve un resumen corto con atributos y valores , si detectas campos repetidos solo muestra uno solo, puedes quita los guiones bajo y medios, dale estilo al texto dandoles los titulos subtitulos etc` }
      ]
  });

  const content = completions.content[0] as CompletionContent;

  let interpretedData = content.text;
  console.log("Respuesta interpretada:", interpretedData);

  return interpretedData;
};

// Generar respuesta general usando Anthropic (migrado a Messages API)
export const generalResponseClaude = async (message: string): Promise<string | object> => {
  const mensajeDelSistema = `
  Como analista de datos de analytixData, puedes realizar análisis de tendencias de ventas por región, segmentación de clientes según hábitos de compra, y otros análisis descriptivos detallados. Las respuestas deben incluir tablas de resultados o SQL detallado.
  `;

  try {
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 1024,
      system: mensajeDelSistema,
      messages: [
        { role: "user", content: message }
      ]
    });

    const content = response.content[0] as CompletionContent;


    const responseContent = content.text || 'No hay respuesta';
    console.log("Respuesta general:", responseContent);
    
    return responseContent;
  } catch (error) {
    console.error("Error al obtener respuesta:", error);
    return 'Hubo un error al procesar la respuesta.';
  }
};