import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      accent: string;
      text: {
        default: string;
        caption: string;
      };
      black: string;
      white: string;
    }
  }
}
