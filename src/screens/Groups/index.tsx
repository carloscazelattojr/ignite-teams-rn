import { useState, useCallback } from 'react';
import { FlatList } from 'react-native';
import { Container } from './styles';
import { useNavigation, useFocusEffect } from '@react-navigation/native'


import { Header } from '@components/Header';
import { HighLight } from '@components/Highlight';
import { GroupCard } from '@components/GroupCard';
import { ListEmpty } from '@components/ListEmpty';
import { Button } from '@components/Button';
import { groupGetAll } from '@storage/group/groupGetAll';
import { Loading } from '@components/Loading';


export default function Groups() {
  
  const[isLoading, setIsLoading] = useState(true);
  const [groups, setGroups] = useState<string[]>([]);

  const navigation = useNavigation();

  function handleNewGroup(){
    navigation.navigate('new');
  }

  async function fetchGroups(){
    try {

      const data = await groupGetAll();
      setGroups(data);
     
    } catch (error) {
      console.log(error);
    }finally{
      setIsLoading(false);
    }
  }

function handleOpenGroup(group: string){
  navigation.navigate('players', { group });
}


  useFocusEffect( useCallback(() => {
    fetchGroups()
  },[groups]));

  return (
    <Container>
      <Header  />
      <HighLight 
        title='Turmas' 
        subtitle='Jogue com sua turma'
      />
      
      {
        isLoading ? <Loading /> : 
      
        <FlatList 
          data={groups}
          keyExtractor={item => item}
          renderItem={({item}) => (
            <GroupCard 
              title={item} 
              onPress={ () => handleOpenGroup(item)}
            />
          )}
          contentContainerStyle={groups.length === 0 && { flex: 1} }
          ListEmptyComponent={() => (
            <ListEmpty 
              message = "Que tal cadastrar a primeira turma?" 
            />
          ) }
        />
      }
      <Button 
        title ='Criar nova turma'
        onPress={handleNewGroup}
       />
    </Container>
  );
}
 