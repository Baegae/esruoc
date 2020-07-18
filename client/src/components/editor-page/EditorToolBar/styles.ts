import styled from 'styled-components';
import SymbolSvg from '@src/assets/symbol.svg';
import { Container } from 'react-grid-system';
import hexToRgba from '@src/styles/hexToRgba';

export const ToolbarWrapper = styled(Container)`
  padding: 1rem 0;
  border-bottom: 1px solid ${({theme}) => hexToRgba(theme.colors.text.default, 0.2)};
  background: ${({theme}) => theme.colors.white};
`;

export const Symbol = styled(SymbolSvg)`
  height: 2rem;
  width: auto;
  margin-right: 1rem;
`;

export const TitleWrapper = styled.div`
  display: flex;
  align-items: center;

  > div {
    width: 100%;
  }

  p {
    font-size: 0.875rem;
    color: ${({theme}) => theme.colors.text.caption};
  }

  input {
    appearance: none;
    font-family: inherit;
    font-size: 1.5rem;
    border: 0;
    margin: 0;
    outline-color: ${({theme}) => theme.colors.primary};
    color: ${({theme}) => theme.colors.black};
    font-weight: 700;
    width: 100%;

    &:disabled {
      cursor: default;
    }

    &:placeholder {
      font-weight: 400;
      color: ${({theme}) => theme.colors.text.caption};
    }
  }
`;

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;
