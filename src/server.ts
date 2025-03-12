import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import path from 'path';
import router from './routes';
import { login } from './controllers/login';
import { verifyToken } from './middlewares/auth';

const server = express();

// Middleware para habilitar CORS (Control de Acceso a Recursos de Origen Cruzado)
server.use(cors());


// Configuración de CORS para manejar las cabeceras de las solicitudes HTTP
server.use((req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*'); // Actualizar para que coincida con el dominio desde el que se realizará la solicitud
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

// Middleware para registrar las solicitudes HTTP

server.use(morgan('dev'));

// Middleware para parsear cookies
server.use(cookieParser());

// Middleware para manejar datos enviados en el cuerpo de la solicitud (formulario, JSON, etc.)
server.use(bodyParser.json()); // Para datos en JSON
server.use(bodyParser.urlencoded({ extended: true })); // Para datos codificados en URL (formularios)

// Middleware para manejar archivos estáticos (como imágenes, CSS, etc.)
server.use(express.static(path.join(__dirname, '../public')));

// Usar el router para manejar las rutas
server.post('/login',login)
server.use(router);

// Middleware de manejo de errores.
server.use((err: any, req: Request, res: Response, next: NextFunction) => {
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    console.error(err);
    res.status(status).json({ message });
});

export default server;
