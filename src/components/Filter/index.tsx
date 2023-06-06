import { TouchableOpacityProps } from 'react-native';
import styled from "styled-components/native";
import { Container, Title, FilterStyleProps } from './styles';

type Props = FilterStyleProps & TouchableOpacityProps & {
    title: string;
}

export function Filter({title, isActive = false, ...rest}: Props){
    return(
        <Container isActive={isActive} {...rest}>
            <Title>{title}</Title>
        </Container>
    );

}