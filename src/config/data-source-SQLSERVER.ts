import { DataSource } from "typeorm";
import { Company } from "../models/Company";

export const createDataSource = (company: Company): DataSource => {
    return new DataSource({
        type: "mssql", // Tipo de base de datos
        host: company.databaseHost,
        port: 1433, // Puerto típico para SQL Server
        username: company.databaseUsername,
        password: company.databasePassword,
        database: company.databaseName,
        synchronize: true,
        logging: false,
        options: {
            encrypt: false, // Desactivar encriptación si no está habilitada en el servidor
        },
        entities: [], // Agrega tus entidades si es necesario
        subscribers: [],
        migrations: [],
    });
};
