import React from 'react';
import { Container} from 'react-grid-system';

import * as S from './styles';

interface TitleSectionProps {
  title: string;
  description: string;
}

const TitleSection: React.FC<TitleSectionProps> = ({title, description}) => {
  return (
    <Container fluid>
      <S.ContainerTitle>{title}</S.ContainerTitle>
      <S.ContainerDescription>{description}</S.ContainerDescription>
    </Container>
  );
};

export default TitleSection;
