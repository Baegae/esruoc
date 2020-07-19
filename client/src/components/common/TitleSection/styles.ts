import styled from 'styled-components';

export const ContainerTitle = styled.p`
  color: ${({theme}) => theme.colors.black};
  font-size: 3rem;
  font-weight: 700;
  margin-top: 48px;
`;

export const ContainerDescription = styled.p`
  color: ${({theme}) => theme.colors.text.caption};
  font-size: 1.125rem;
  margin-top: 10px;
`;
