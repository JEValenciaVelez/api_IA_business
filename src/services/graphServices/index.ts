// src/services/graphService.ts
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import { ChartConfiguration } from 'chart.js';

export class GraphService {
    private width = 800; // Ancho del gráfico
    private height = 600; // Alto del gráfico
    private chartJSNodeCanvas = new ChartJSNodeCanvas({ width: this.width, height: this.height });

    // Genera un gráfico de ventas y lo devuelve como un buffer
    public async generateSalesChart(data: Array<{ period: string; value: number; title: string; name: string }>): Promise<Buffer> {
        if (!data || data.length === 0) {
            throw new Error('No se proporcionaron datos para generar el gráfico.');
        }

        // Extrae las etiquetas, valores y el título de los datos
        const labels = data.map(item => item.period); // Usamos el campo "period" para las etiquetas (ej. "Noviembre 2022")
        const values = data.map(item => item.value);  // Valores de ventas
        const name = data.map(item => item.name);  
        const title = data[0].title;  // Título del gráfico, tomado del primer registro

        // Configuración del gráfico
        const configuration: ChartConfiguration = {
            type: 'bar', // Cambia a 'line' si quieres un gráfico de línea
            data: {
                labels: name,
                datasets: [
                    {
                        label: title, // Título del conjunto de datos
                        data: values,
                        backgroundColor: 'rgba(54, 162, 235, 0.6)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: 'Estadisticas' // Título general del gráfico
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        };

        // Renderiza el gráfico en un buffer
        const image = await this.chartJSNodeCanvas.renderToBuffer(configuration);
        return image;
    }
}
