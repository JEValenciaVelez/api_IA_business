// src/controllers/kpiController.ts
import { Request, Response } from "express";
import { KPIService } from "../../services/KPIServices";
import { KPI } from "../../models/KPI";
import { processResponseKPIs } from "../../config/gpt.config";


const kpiService = new KPIService();

export const getAllKPIs = async (req: Request, res: Response) => {
    try {
        const {idUser} = req.query
        if (!idUser) {
            return res.status(400).json({ message: "Debe proveer un ID de usuario" });
        }
        const kpis: KPI[] = await kpiService.getAllKPIs(Number(idUser)) || [];
        if(kpis.length === 0) {
            return res.status(404).json({ message: "No se encontraron KPIs con ese usuario" });
        }
        res.status(200).json(kpis);
    } catch (error) {
        console.error("Error al obtener los KPIs:", error);
        res.status(500).json({ message: "Error al obtener los KPIs" });
    }
};

export const getKPIById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const kpi = await kpiService.getKPIById(parseInt(id));
        if (kpi) {
            res.status(200).json(kpi);
        } else {
            res.status(404).json({ message: "KPI no encontrado" });
        }
    } catch (error) {
        console.error("Error al obtener el KPI:", error);
        res.status(500).json({ message: "Error al obtener el KPI" });
    }
};


// Controlador para crear un nuevo KPI
export const createKPI = async (req: Request, res: Response): Promise<void> => {
    try {
        const { response, idUser } = req.body;
        const kpiDataString = await processResponseKPIs(response, idUser);
        
        // Convertir el string en un array de KPI
        const kpiData: KPI[] = JSON.parse(kpiDataString);
        
        console.log('kpiData --> ', kpiData);

        const newKPI = await kpiService.saveResultsKpi(kpiData);
        
        if (newKPI) {
            res.status(201).json(newKPI);
        } else {
            res.status(400).json({ message: "Datos de KPI incompletos o inválidos" });
        }
    } catch (error) {
        console.error("Error al crear el KPI:", error);
        res.status(500).json({ message: "Error al crear el KPI" });
    }
}
