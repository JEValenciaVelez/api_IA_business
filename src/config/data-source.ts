import { DataSource } from "typeorm";
import { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_USER } from "./envs";
import { User } from "../models/User";
import { Proccess } from "../models/Proccess";
import { Company } from "../models/Company";
import { MessageHistory } from "../models/Messages";
import { Plan } from "../models/Plan";
import { Role } from "../models/Role";
import { KPI } from "../models/KPI";
// import { User } from "../entities/User";
// import { Vehicle } from "../entities/Vehicles";

export const AppDataSource = new DataSource({
    type: "postgres", // Cambia el tipo a "mssql" para SQL Server
    host: DB_HOST, // Dirección del host
    port: 5432, // Puerto típico para SQL Server
    username: DB_USER, // Nombre de usuario
    password: DB_PASSWORD, // Contraseña
    database: DB_DATABASE, // Nombre de la base de datos
    synchronize: true,
    dropSchema: false, // No eliminar registros
    logging: false,
    entities: [User,Proccess,Company,MessageHistory,Plan,Role,KPI], // Aquí puedes agregar tus entidades como User, Vehicle, etc.
    subscribers: [],
    migrations: [],
});
