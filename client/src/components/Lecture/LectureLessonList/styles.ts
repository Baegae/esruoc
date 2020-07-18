import styled from 'styled-components';
import { Container, Row } from 'react-grid-system';

export const ListContainer = styled(Container)`
  margin-bottom: 10rem;
`;

export const ListTitle = styled.p`
  font-weight: 700;
  font-size: 2rem;
  color: ${({theme}) => theme.colors.text.default};
  margin: 7.5rem 0 0.5rem;
`;

export const LessonIndex = styled.p`
  color: ${({theme}) => theme.colors.text.caption};
  font-size: 3.75rem;
  font-weight: 100;
`;

export const LessonTitle = styled.p`
  font-size: 2rem;
  font-weight: 700;
  color: ${({theme}) => theme.colors.text.default};
  padding: 2.75rem 0 1rem;
`;

export const MetaWrapper = styled.div`
  display: flex;
  color: ${({theme}) => theme.colors.text.caption};
`;

export const ItemWrapperRow = styled(Row)`
  margin-bottom: 1.5rem;
  cursor: pointer;
  transition: transform 0.15s ease-in-out;

  &:hover {
    transform: scale(1.025);
  }
`;
