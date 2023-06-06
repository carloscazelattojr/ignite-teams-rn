import AsyncStorage from "@react-native-async-storage/async-storage";

import { PLAYER_COLLECTION } from "@storage/storeConfig";
import { playerGetByGroup } from "./playerGetByGroup";

export async function playerRemoveByGroup(playerName: string, group: string){
    try {
        
        const storage = await playerGetByGroup(group);

        const filtered = storage.filter(player => player.name !== playerName);
        const players = JSON.stringify(filtered);
        
        AsyncStorage.setItem(`${PLAYER_COLLECTION}-${group}`, players);
    } catch (error) {
        throw error;
    }
}