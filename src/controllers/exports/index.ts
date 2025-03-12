import { Request, Response } from 'express';
import { Document, Packer, Paragraph, TextRun, AlignmentType, IRunOptions } from 'docx';

export const exportQuery = async (req: Request, res: Response) => {
    try {
        const { responseData, image } = req.body;
        // console.log({ prompt, responseData });

        if (!responseData) {
            return res.status(400).json({ message: 'Prompt y responseData son requeridos.' });
        }

        const date = new Date().toLocaleDateString("es-ES", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });

        // Dividir responseData por líneas usando '\n' como delimitador
        const responseLines = responseData.split('\n').map((line: string | IRunOptions) => new Paragraph({
            children: [new TextRun(line)],
        }));

        // Crear el documento de Word con un mejor formato
        const doc = new Document({
            sections: [
                {
                    properties: {},
                    children: [
                        new Paragraph({
                            children: [
                                new TextRun("proceso :"),
                                new TextRun({ text: `Analitix Data`, bold: true }),
                            ],
                            spacing: { after: 200 },
                        }),
                        new Paragraph({
                            children: [new TextRun("Respuesta :")],
                            spacing: { after: 100 },
                        }),
                        ...responseLines, // Insertar cada línea de respuesta en su propio párrafo
                        new Paragraph({
                            children: [
                                new TextRun("Fecha:"),
                                new TextRun({ text: ` ${date}`, bold: true }),
                            ],
                            alignment: AlignmentType.RIGHT,
                        }),
                    ],
                },
            ],
        });

        // Convertir el documento a un buffer
        const buffer = await Packer.toBuffer(doc);

        // Configurar la respuesta para enviar el archivo
        res.setHeader('Content-Disposition', 'attachment; filename=consulta.docx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');

        // Enviar el archivo al cliente
        res.send(buffer);

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};
