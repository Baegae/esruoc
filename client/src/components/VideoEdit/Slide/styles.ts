import styled, { css } from 'styled-components';
import hexToRgba from '@src/styles/hexToRgba';

const selectedStyle = css`
  border: solid 0.125rem ${({theme}) => hexToRgba(theme.colors.text.default, 0.1)};
`;

export const CardView = styled.div<{isSelected: boolean}>`
  border: solid 0.125rem transparent;
  ${({isSelected}) => isSelected ? selectedStyle : undefined}
  padding: 1rem 2rem 2rem;
  margin-bottom: 4.5rem;
  border-radius: 0.25rem;

  transition: border 0.3s ease-in-out;

  .codex-editor__redactor {
    padding: 0 !important;
  }
`;
