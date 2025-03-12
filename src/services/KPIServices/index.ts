// src/services/kpiService.ts
import { AppDataSource } from "../../config/data-source";
import { KPI } from "../../models/KPI";
import { Repository } from "typeorm";

export class KPIService {
    private kpiRepository?: Repository<KPI>;

    private getRepository(): Repository<KPI> {
        // Verifica si AppDataSource está inicializado y si el repositorio está configurado
        if (!AppDataSource.isInitialized) {
            throw new Error("AppDataSource no está inicializado");
        }
        if (!this.kpiRepository) {
            this.kpiRepository = AppDataSource.getRepository(KPI);
        }
        return this.kpiRepository;
    }

    // Retorna todos los KPIs
    public async getAllKPIs(idUser : number): Promise<KPI[] | undefined> {
        try {
            const kpis = await this.getRepository().find({
                where: {idUser},
                order: { createdAt: "DESC" } 
            })
            console.log("KPIs encontrados:", kpis);
            return kpis;
        } catch (error) {
            console.error("Error al obtener los KPIs:", error);
            return undefined;
        }
    }

    // Retorna un KPI específico por ID
    public async getKPIById(id: number): Promise<KPI | undefined> {
        try {
            const kpi = await this.getRepository().findOneBy({ id });
            console.log("KPI encontrado:", kpi);
            return kpi || undefined;
        } catch (error) {
            console.error("Error al obtener el KPI:", error);
            return undefined;
        }
    }

    // Guarda un array de KPIs en la base de datos
    public async saveResultsKpi(kpis: KPI[]): Promise<KPI[] | undefined> {
        try {
            const newKpis = this.getRepository().create(kpis);
            const savedKpis = await this.getRepository().save(newKpis);
            console.log("KPIs guardados:", savedKpis);
            return savedKpis;
        } catch (error) {
            console.error("Error al guardar los KPIs:", error);
            return undefined;
        }
    }
}
