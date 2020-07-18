import { createGlobalStyle } from 'styled-components';
import normalizeCss from './normalize';
import hexToRgba from './hexToRgba';
import { tooltipStyle } from './EditorWrapper';

const GlobalStyles = createGlobalStyle`
  ${normalizeCss};
  ${tooltipStyle};

  html {
    font-family: -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Malgun Gothic", "맑은 고딕", helvetica, sans-serif;
    letter-spacing: -0.0425em;
    -webkit-font-smoothing: antialiased;

    &.spoqa-han-sans-loaded {
      font-family: 'Spoqa Han Sans', sans-serif;
    }
  }

  ::selection {
    background: ${({theme}) => hexToRgba(theme.colors.primary, 0.4)};
  }
`;

export default GlobalStyles;
