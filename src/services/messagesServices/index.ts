import { MessageHistory } from './../../models/Messages';
import { AppDataSource } from "../../config/data-source";
import { Repository } from "typeorm";

// clase para messag_history con sus metodos 
export class MessageHistoryService {
    private messageHistoryRepository?: Repository<MessageHistory>

    private getRepository(): Repository<MessageHistory> {
          // Verifica si AppDataSource está inicializado y si el repositorio está configurado
          if (!AppDataSource.isInitialized) {
            throw new Error("AppDataSource no está inicializado");
        }
        if (!this.messageHistoryRepository) {
            this.messageHistoryRepository = AppDataSource.getRepository(MessageHistory)
        }
        return this.messageHistoryRepository;
    }

    public async getMessages (idUser : number) : Promise<MessageHistory[]> {
        return this.getRepository().find({where: {userId: idUser}, order: { id: "DESC" } });
    }
}