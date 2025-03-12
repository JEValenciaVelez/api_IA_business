import { STSClient, GetSessionTokenCommand } from '@aws-sdk/client-sts';
import AnthropicBedrock from '@anthropic-ai/bedrock-sdk';
import { ACCES_KEY_ID, SECRETACCESKEY } from './envs';

// Inicializamos el cliente STS
const stsClient = new STSClient({
  region: 'us-west-2',
  credentials: {
    accessKeyId: `${ACCES_KEY_ID}`,
    secretAccessKey: `${SECRETACCESKEY}`,
  },
});

// Función para obtener el token temporal
async function getWebAccessToken(): Promise<string | undefined> {
  try {
    const command = new GetSessionTokenCommand();
    const sessionToken = await stsClient.send(command);

    // Aquí se obtiene el token temporal (session token)
    const webAccessToken = sessionToken.Credentials?.SessionToken;

    console.log('Web Access Token:', webAccessToken);
    return webAccessToken;
  } catch (error) {
    console.error('Error getting Web Access Token:', error);
    return undefined;
  }
}

// Función principal que crea el cliente de Anthropic y realiza la petición
export async function iaBedrock() {
  try {
    // Obtenemos el token antes de crear el cliente
    const tokenWeb = await getWebAccessToken();
    
    if (!tokenWeb) {
      throw new Error('Token de sesión inválido');
    }

    // Creamos el cliente de AnthropicBedrock con el token obtenido
    const client = new AnthropicBedrock({
      awsAccessKey: `${ACCES_KEY_ID}`,
      awsSecretKey: `${SECRETACCESKEY}`,
      awsSessionToken: tokenWeb,  // Aquí usamos el token obtenido
      awsRegion: 'us-west-2',
    });

    const message = await client.messages.create({
      model: 'anthropic.claude-3-5-sonnet-20240620-v1:0',
      max_tokens: 256,
      messages: [{ "role": "user", "content": "Hello, world" }]
    });
    
    console.log(message);
    return message;
    
  } catch (error) {
    console.error('Error en iaBedrock:', error);
    return error;
  }
}

// Llamar a la función principal
// iaBedrock().catch(console.error);
export default iaBedrock