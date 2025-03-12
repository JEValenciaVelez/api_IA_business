import { AppDataSource } from "../../config/data-source"
import { CompanyDto } from "../../dto"
import { Company } from "../../models/Company"




export const postcompany = async (data : CompanyDto) => {
    try{
        const repository = AppDataSource.getRepository(Company)
        const company = repository.create(data)
        const savedCompany = await repository.save(company)
        return savedCompany
    }catch(error){
        console.log(error)
        return `${error}`
    }
}

export const getCompanyService = async (id?: number) => {
    try {
        const repository = AppDataSource.getRepository(Company);
        
        let company;
        if (id) {
            // Buscar la compañía por ID
            company = await repository.findOne({ where: { id } });
            
            if (!company) {
                return `No se encontró la compañía con ID: ${id}`;
            }
        } else {
            // Obtener todas las compañías
            company = await repository.find();
        }
        
        return company;
    } catch (error) {
        console.log('Error al obtener la compañía: ', error);
        return `${error}`;
    }
};

export const putCompanyService = async (id: number, data: CompanyDto) => {
    try {
        await AppDataSource.getRepository(Company).update(id, data)
        const update = await AppDataSource.getRepository(Company).findOne({where:{id}})
        return update
    } catch (error) {
        console.log(error)
        return error
    }
}


export const deleteCompanyService = async (id: number) => {
    try {
        const newUser = await AppDataSource.getRepository(Company).findOne({where :{id}})
        if (!newUser) {
            throw new Error('User not found')
        }
        let setUser = !newUser.isDeleted
        await AppDataSource.getRepository(Company).update({ id }, { isDeleted: setUser })
        return newUser
    } catch (error) {
        console.log(error)
        return error
    }
}