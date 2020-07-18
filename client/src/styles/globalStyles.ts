import { createGlobalStyle } from 'styled-components';
import normalizeCss from './normalize';

const GlobalStyles = createGlobalStyle`
  ${normalizeCss};

  html {
    font-family: -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Malgun Gothic", "맑은 고딕", helvetica, sans-serif;
    letter-spacing: -0.0425em;

    &.spoqa-han-sans-loaded {
      font-family: 'Spoqa Han Sans', sans-serif;
    }
  }
`;

export default GlobalStyles;
