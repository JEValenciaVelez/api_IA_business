export interface DatabaseSchema {
    database: string;
    tables: {
        [key: string]: TableSchema;
    };
}

interface TableSchema {
    description: string;
    attributes: {
        [key: string]: string;
    };
}


export interface MessageDTO {
  prompt: string,
  response: string,
  messageType: string,
  userId: number,
  isProcessed: boolean,
  createdAt: string,
  updatedAt: string
}



export interface UserDto {
    fullName: string
    email: string
    password: string
    planId: number
    roleId: number
}


// Definir la estructura de los datos esperados, si es necesario
export interface WhatsAppMessageData {
    messaging_product: 'whatsapp';
    type: 'template';
    to: string; // Campo agregado para el destinatario
    template: {
      name: string;
      language: {
        code: string;
      };
      components: Array<{
        type: 'header' | 'body';
        parameters: Array<{
          type: 'image' | 'text';
          image?: {
            link: string;
          };
          text?: string;
        }>;
      }>;
    };
  }


export interface CompanyDto {
    databaseUsername: string;
    databasePassword: string;
    nit: number | null;
    databaseHost: string;
  }

export interface ProccessDTO {
  prompt: string;
  response: string;
  match: boolean;
  userId: number;
  queryId: number;
  confidenceScore: number | null;
  metadata: object | null;
}