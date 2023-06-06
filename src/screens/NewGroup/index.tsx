import { useState } from 'react';
import { Alert } from 'react-native';
import { Container, Content, Icon } from "./styles";
import { useNavigation } from '@react-navigation/native';

import { Input } from "@components/Input";
import { Header } from "@components/Header";
import { Button } from "@components/Button";
import { HighLight } from "@components/Highlight";
import { groupCreate } from '@storage/group/groupCreate';
import { AppError } from '@utils/AppError';

export default function NewGroup(){

    const[group, setGroup] = useState('');
    const navigation = useNavigation();

    async function handleNew(){
        try {
            await groupCreate(group);
            navigation.navigate('players', {group: group})
        } catch (error) {
            if (error instanceof AppError){
                Alert.alert('Novo Grupo', error.message);
            } else {
                Alert.alert('Novo Grupo', 'Não foi possível criar um novo grupo');
                console.log(error);
            }
        }
    }


    return(
        <Container>
            <Header showBackButton />
            <Content>
                
                <Icon />
                
                <HighLight 
                    title="Nova turma"
                    subtitle="crie a turma para adicionar as pessoas"
                />
                
                <Input 
                    placeholder="Nome da turma"
                    onChangeText={text => setGroup(text)}  
                />
                
                <Button 
                    title="Criar"
                    style={{ marginTop: 20 }}
                    onPress={handleNew}
                />
            </Content>
        </Container>
    );
}