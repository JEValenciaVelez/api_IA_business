
import { AppDataSource } from "../config/data-source";
import { MessageHistory } from "../models/Messages";
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import 'dotenv/config'


export async function createMessage(data: object) {
    try {
        // Insertar el registro en la tabla
        console.log('Antes de insertar mensaje');
        const repository = AppDataSource.getRepository(MessageHistory);
        
        // Crear la instancia del nuevo mensaje
        const item = repository.create(data);
        console.log('Nuevo registro (instancia): ', item);

        // Guardar el registro en la base de datos
        const savedItem = await repository.save(item);
        console.log('Nuevo registro guardado: ', savedItem);

        // Devolver el nuevo registro guardado
        return savedItem;

    } catch (error) {
        console.error('Error al crear el mensaje: ', error);
        return `${error}`;
    }
}

// Define las credenciales y configuración de AWS (debes configurar tus propias credenciales)
const s3: S3Client = new S3Client({
    region: process.env.AWS_REGION!, // Asegúrate de manejar estas variables de entorno de manera segura
    credentials: {
      accessKeyId: process.env.ACCESS_KEY_ID!,
      secretAccessKey: process.env.SECRET_ACCESS_KEY!
    }
  });
  
  // Define los tipos para los parámetros de entrada y salida
  type UploadImageToS3Params = {
    img: string; // Base64 image string
  };
  
  export async function uploadImageToS3({ img }: UploadImageToS3Params): Promise<string> {
    // Decodifica la imagen base64
    const base64Data = img.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
  
    // Genera un nombre único para la imagen
    const imageName = `Chat_IA_Empresarial/image_${Date.now()}.png`;
  
    // Configura los parámetros para subir la imagen
    const params = {
      Bucket: process.env.BUCKET_NAME!, // Nombre del bucket (debe estar definido en variables de entorno)
      Key: imageName,
      Body: buffer,
      ContentType: 'image/png', // Especifica el tipo de contenido del archivo
      ACL: 'public-read' // Hace la imagen pública
    };
  
    try {
      // Sube la imagen a S3
      await s3.send(new PutObjectCommand({
        ...params,
        ACL: 'public-read' as const // Explicitly specify the type as 'public-read'
      }));
  
      // Obtiene la URL de la imagen en S3
      const imageUrl = `https://${params.Bucket}.s3.amazonaws.com/${imageName}`;
      console.log(`Imagen subida exitosamente a: ${imageUrl}`);
  
      return imageUrl;
    } catch (error) {
      console.error('Error al guardar la imagen:', error);
      throw error;
    }
  }