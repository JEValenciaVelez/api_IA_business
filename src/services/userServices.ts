import { AppDataSource } from "../config/data-source";
import { UserDto } from "../dto";
import { User } from '../models/User';



export const postUserServices = async (data : UserDto) => {
    try{
        const newUser = await AppDataSource.getRepository(User).save(data)
        return newUser
    }catch(error){
        console.log(error)
        return error
    }
}

export const getUserServices = async (id: number|null) => {
    try {
        console.log('id --> ', id)
        //si no hay id traer todos los usarios
        if (id === null) {
            const newUser = await AppDataSource.getRepository(User).find()
            return newUser
        }else{
            //si hay id traer solo ese usuario
            const newUser = await AppDataSource.getRepository(User).findOne({where :{id}})
            if(!newUser) return `No se encontro usuario`
            return newUser
        }
       
    } catch (error) {
        console.log(error)
        return error
    }
}


export const putUserService = async (id: number, data: object) => {
    try {
        await AppDataSource.getRepository(User).update(id, data)
        const user = await AppDataSource.getRepository(User).findOne({where:{id}})
        return user
    } catch (error) {
        console.log(error)
        return error
    }
}

export const setUserService = async (id: number) => {
    try {
        const newUser = await AppDataSource.getRepository(User).findOne({where :{id}})
        if (!newUser) {
            throw new Error('User not found')
        }
        let setUser = !newUser.isActive
        await AppDataSource.getRepository(User).update({ id }, { isActive: setUser })
        return newUser
    } catch (error) {
        console.log(error)
        return error
    }
}

export const deleteUserService = async (id: number) => {
    try {
        const newUser = await AppDataSource.getRepository(User).findOne({where :{id}})
        if (!newUser) {
            throw new Error('User not found')
        }
        let setUser = !newUser.isDeleted
        await AppDataSource.getRepository(User).update({ id }, { isDeleted: setUser })
        return newUser
    } catch (error) {
        console.log(error)
        return error
    }
}