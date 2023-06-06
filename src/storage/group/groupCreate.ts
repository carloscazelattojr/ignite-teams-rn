import AsyncStorage from "@react-native-async-storage/async-storage";

import { GROUP_COLLECTION } from "@storage/storeConfig";
import { groupGetAll } from "./groupGetAll";
import { AppError } from "@utils/AppError";

export async function groupCreate(newGroupName: string ){
    try {
        newGroupName = newGroupName.trim();

        if (newGroupName.length === 0 ){
            throw new AppError('Informe o nome da turma'); 
        }
        
        const storageGroups = await groupGetAll();
        
        const groupAlreadExists = storageGroups.includes(newGroupName);
        if (groupAlreadExists){
            throw new AppError('Já existe um grupo cadastrado com este nome');
        }

        const storage = JSON.stringify([...storageGroups, newGroupName]);
        
        await AsyncStorage.setItem( GROUP_COLLECTION, storage );
    } catch (error) {
        throw error;
    }
}