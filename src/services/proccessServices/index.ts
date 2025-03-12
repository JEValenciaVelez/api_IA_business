import { AppDataSource } from "../../config/data-source";
import { ProccessDTO } from "../../dto";
import { Proccess } from "../../models/Proccess";


export const postProccessService = async (data: ProccessDTO) => {
    try {
        const repository = AppDataSource.getRepository(Proccess);
        const proccess = repository.create(data);
        const savedProccess = await repository.save(proccess);
        return savedProccess;
    } catch (error) {
        throw new Error((error as Error).message); // Lanza la excepción
    }
};


export const getProccessService = async (id?: number) => {
    try {
        const repository = AppDataSource.getRepository(Proccess);
        
        let proccess;
        if (id) {
            // Buscar la compañía por ID
            proccess= await repository.findOne({ where: { id } });
            
            if (!proccess) {
                return `No se encontró la compañía con ID: ${id}`;
            }
        } else {
            // Obtener todas las compañías
            proccess = await repository.find();
        }
        
        return proccess;
    } catch (error) {
        console.log('Error al obtener la compañía: ', error);
        return `${error}`;
    }
}


export const setMatchService = async (id: number) => {
    try {
        const item = await AppDataSource.getRepository(Proccess).findOne({where :{id}})
        if (!item) {
            return 'No hay proceso con ese id'
        }
        let setProccess = !item.match
        await AppDataSource.getRepository(Proccess).update({ id }, { match: setProccess })
        return item
    } catch (error) {
        console.log(error)
        return error
    }
}