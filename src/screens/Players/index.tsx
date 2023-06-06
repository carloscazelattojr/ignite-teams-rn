import { useState, useEffect, useRef } from "react";
import { FlatList, Alert, TextInput } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native'

import { Input } from "@components/Input";
import { Filter } from "@components/Filter";
import { Header } from "@components/Header";
import { HighLight } from "@components/Highlight";
import { ButtonIcon } from "@components/ButtonIcon";
import { PlayerCard } from "@components/PlayerCard";
import { ListEmpty } from "@components/ListEmpty";
import { Button } from "@components/Button";

import { Container, Form, HeaderList, NumbersOfPlayers } from "./styles";
import { AppError } from "@utils/AppError";
import { playerAddByGroup } from "@storage/player/playerAddByGroup";
import { playerGetByGroupAndTeam } from "@storage/player/playerGetByGroupAndTeam";
import { PlayerStorageDTO } from "@storage/player/PlayerStorageDTO";
import { playerRemoveByGroup } from "@storage/player/playerRemoveByGroup";
import { groupRemoveByName } from "@storage/group/groupRemoveByName";
import { Loading } from "@components/Loading";

type RouteParams = {
    group: string;
}

export default function Players(){

    const[isLoading, setIsLoading] = useState(true);
    const [newPlayerName, setNewPlayerName] = useState('');
    const [team, setTeam] = useState('Time A');
    const [players, setPlayers] = useState<PlayerStorageDTO[]>([]);
    
    const navigation = useNavigation();
    const route = useRoute();
    const { group } = route.params as RouteParams;
    
    const newPlayerNameInputRef = useRef<TextInput>(null);


     async function handleAddPlayer(){

        if (newPlayerName.trim().length === 0){
            return Alert.alert('Novo Player', 'Informe o nome do novo Player');
        }

        const newPlayer = {
            name: newPlayerName,
            team: team,
        }

        try {
            
            await playerAddByGroup(newPlayer, group);
            
            newPlayerNameInputRef.current?.blur();

            setNewPlayerName('');
            fetchPlayersByTeam();

        } catch (error) {
            if (error instanceof AppError){
                Alert.alert('Novo Player', error.message);
            } else {
                Alert.alert('Novo Player', 'Não foi possível adicionar o player');
            }
        }
    }

    async function fetchPlayersByTeam(){
        try {
            setIsLoading(true);

            const playersByTeam = await playerGetByGroupAndTeam(group, team);
            setPlayers(playersByTeam);
            
           
        } catch (error) {
            Alert.alert('Pessoas', 'Não foi possível carregar as pessoas do time selecionada')
        } finally {
            setIsLoading(false);
        }
    }

    async function handlerPlayerRemove(playerName: string){
        try {
            await playerRemoveByGroup(playerName, group);
            fetchPlayersByTeam();
        } catch (error) {
            Alert.alert('Remover Player', 'Não foi possível remover este player');
        }
    }

    async function groupRemove(){
        try {
            await groupRemoveByName(group);
            navigation.navigate('groups');
        } catch (error) {
            Alert.alert('Remover turma', 'Não foi possível remover a turma');
        }
    }

    async function handleGroupRemove(){
        Alert.alert(
            'Remover Turma', 
            'Deseja remover a turma ?',
            [
                {text: 'Não', style: 'cancel'},
                {text: 'Sim', onPress: () => groupRemove() }
            ]

        )
    }

    useEffect( () => {
        fetchPlayersByTeam();
    },[team]);

    return(
        <Container>
            <Header showBackButton />
            <HighLight
                title={group}
                subtitle="adicione a galera e separe os times"
            />

            <Form>
                <Input 
                    inputRef={newPlayerNameInputRef}
                    placeholder="Nome da pessoa"
                    autoCorrect={false}
                    onChangeText={text => setNewPlayerName(text)} 
                    value={newPlayerName} 
                    onSubmitEditing={handleAddPlayer}
                    returnKeyType="done"
                />   
                <ButtonIcon icon="add" onPress={handleAddPlayer} />
            </Form>
            <HeaderList>
                <FlatList 
                    data={['Time A', 'Time B']}
                    keyExtractor={item => item}
                    renderItem={({item}) => (
                        <Filter 
                            title={item} 
                            isActive= {item === team}
                            onPress={() => setTeam(item) }
                        />
                    )}
                    horizontal
                />
                <NumbersOfPlayers>{players.length}</NumbersOfPlayers>
            </HeaderList>
            
            {
                isLoading ? <Loading /> :
            
                <FlatList 
                    data={players}
                    keyExtractor={item => item.name}
                    renderItem={ ({item}) => ( 
                        <PlayerCard name={item.name} onRemove={ () => handlerPlayerRemove(item.name) }/>
                    )}
                    ListEmptyComponent={() => (
                        <ListEmpty 
                            message = "Não há pessoas neste time" 
                        />
                    )}
                    showsVerticalScrollIndicator = {false}
                    contentContainerStyle={[
                        { paddingBottom: 50 },
                        players.length === 0 && {flex: 1}
                    ]}
                />
            }
            <Button 
                title="Remover turma" 
                type="SECUNDARY" 
                onPress={handleGroupRemove} 
            />
        </Container>
    );
}