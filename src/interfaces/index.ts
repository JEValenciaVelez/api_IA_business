// Definir la interfaz para el contenido de la respuesta
export interface CompletionContent {
    type: string;
    text: string;
}


// src/models/KPI.ts
export interface Kpi {
    id: string;
    idUser: number;
    name: string;
    value: number;
    period: string;
    region?: string;
    productCategory?: string;
}
