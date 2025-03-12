// src/controllers/chartController.ts
import { Request, Response } from 'express';
import { GraphService } from '../../services/graphServices';

const graphService = new GraphService();

export const getSalesChart = async (req: Request, res: Response) => {
    // const salesData = [
    //     { period: 'Enero', value: 33032092329.54 },
    //     { period: 'Febrero', value: 30376515659.96 },
    //     { period: 'Marzo', value: 29385106103.72 },
    //     { period: 'Abril', value: 30674273494.07 },
    //     { period: 'Mayo', value: 32147342964.93 },
    //     { period: 'Junio', value: 30242442620.91 },
    //     { period: 'Julio', value: 33203536232.33 },
    //     { period: 'Agosto', value: 33506036174.24 },
    //     { period: 'Septiembre', value: 33297889833.28 },
    //     { period: 'Octubre', value: 30965335793.26 }
    // ];

    const {data} = req.body

    try {
        const chartImage = await graphService.generateSalesChart(data);
        res.set('Content-Type', 'image/png');
        res.send(chartImage);
    } catch (error) {
        console.error("Error al generar el gráfico:", error);
        res.status(500).send("Error al generar el gráfico");
    }
};
