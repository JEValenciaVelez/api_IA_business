import { Request, Response } from 'express';
import { GraphService } from '../../services/graphServices';
import { processResponseKPIs } from '../../config/gpt.config';
import { AppDataSource } from '../../config/data-source';
import { MessageHistory } from '../../models/Messages';
import { uploadImageToS3 } from '../../functions';

async function generateGraphs(req: Request, res: Response): Promise<Response> {
    try {
        const { data, userId } = req.body;

        // Validación de los datos de entrada
        if (!data || !userId) {
            return res.status(400).json({ message: 'Faltan datos requeridos: data o userId' });
        }

        // Procesa los KPIs
        const kpi = await processResponseKPIs(data, userId);
        const kpiJSON = JSON.parse(kpi);

        // Valida que kpiJSON sea un array de objetos con las propiedades necesarias
        if (
            !Array.isArray(kpiJSON) || 
            !kpiJSON.every((item: any) => item.period && item.value && item.title && item.name)
        ) {
            return res.status(400).json({ message: 'El formato de los KPIs es inválido' });
        }

        // Genera el gráfico
        const graphService = new GraphService();
        const generateGraph = await graphService.generateSalesChart(
            kpiJSON as { period: string; value: number; title: string; name: string }[]
        );

        if (!generateGraph || !(generateGraph instanceof Buffer)) {
            return res.status(500).json({ message: 'Error al generar el gráfico' });
        }

        // Sube la imagen a S3
        const imageUrl = await uploadImageToS3({ img: generateGraph.toString('base64') });

        // Crea y guarda un nuevo registro en MessageHistory
        const messageRepository = AppDataSource.getRepository(MessageHistory);
        const newMessage = messageRepository.create({
            prompt: 'Gráfico generado',
            response: imageUrl,
            messageType: 'user',
            userId,
            metadata: {},
            isProcessed: false,
        });

        await messageRepository.save(newMessage);

        // Retorna la URL de la imagen subida
        return res.status(200).json({ message: 'Gráfico generado exitosamente', imageUrl });

    } catch (error) {
        console.error('Error al generar el gráfico:', (error as Error).message);
        return res.status(500).json({ message: 'Error al procesar la solicitud' });
    }
}

export default generateGraphs;
