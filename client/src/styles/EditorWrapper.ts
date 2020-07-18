import styled, { css } from 'styled-components';
import hexToRgba from './hexToRgba';

const activeActionStyle = css`
  color: ${({theme}) => theme.colors.primary};
  background: ${({theme}) => hexToRgba(theme.colors.primary, 0.3)};
  border: 1px solid ${({theme}) => theme.colors.primary};
  transition: color 0.3s ease-in-out, background 0.3s ease-in-out, border 0.3s ease-in-out;
`;

// TODO: EditorJS가 계속 새로 생성될때마다 망함 ^^
// const markAnimation = (theme: DefaultTheme) => keyframes`
//   from {
//     background: ${theme.colors.white};
//   }

//   to {
//     background: ${theme.colors.primary};
//   }
// `;

const markStyle = css`
  mark.cdx-marker {
    display: inline-block;
    color: ${({theme}) => theme.colors.text.default};
    padding: 0 0.25rem;
    margin: 0 0.125rem;
    border-radius: 0.25rem;
    background: ${({theme}) => theme.colors.primary};

    /* animation: ${({theme}) => markAnimation(theme)} 0.3s ease-in-out forwards; */
  }
`;

const paragraphStyle = css`
  .ce-paragraph {
    font-family: 'KoPubWorldBatang_Pro', serif;
    color: ${({theme}) => theme.colors.text.default};
    font-size: 1.375rem;
  }
`;

// TODO: EditorJS가 계속 새로 생성될때마다 망함 ^^
// const underlineAnimation = keyframes`
//   from {
//     width: 0%;
//   }

//   to {
//     width: 100%;
//   }
// `;


const underlineStyle = css`
  u.cdx-underline {
    display: inline-block;
    text-decoration: none;
    position: relative;
    white-space: pre;

    &:after {
      content: '';
      position: absolute;
      display: block;
      height: 0.125rem;
      background: ${({theme}) => theme.colors.primary};
      border-radius: 1rem;
      width: 100%;
      bottom: -0.125rem;
      /* animation: ${underlineAnimation} 0.3s ease-in-out forwards; */
    }
  }
`;

const headerStyle = css`
  .ce-header {
    margin: 0.5em 0;
    padding: 0;
  }

  h1 {
    font-size: 3rem;
    color: ${({theme}) => theme.colors.black};
  }
  h2 {
    font-size: 2.5rem;
    color: ${({theme}) => theme.colors.black};
  }

  h3 {
    font-size: 2rem;
    color: ${({theme}) => theme.colors.black};
  }
`;

const inlineToolStyle = css`
  .ce-inline-toolbar {
    color: ${({theme}) => theme.colors.white};
    border: 0;
    background: ${({theme}) => theme.colors.black};
    padding: 0.25rem;
    &__buttons {
      align-items: center;
    }
    &__dropdown {
      border: 0;
      &:hover {
        background: transparent;
        color: ${({theme}) => theme.colors.primary};
      }
    }
  }

  .ce-inline-tool {
    height: 2rem;
    width: 2rem;
    border-radius: 0.5rem;
    color: ${({theme}) => theme.colors.white};
    border: 1px solid transparent;

    &--active {
      ${activeActionStyle}
    }

    &:hover {
      ${activeActionStyle}
      border: 1px solid transparent;
    }
  }

  .ce-conversion-toolbar {
    background: ${({theme}) => theme.colors.black};
    .ce-conversion-tool {
      &:hover {
        background: ${({theme}) => hexToRgba(theme.colors.primary, 0.3)};
        transition: background 0.3s ease-in-out;
      }
      &__icon {
        background: ${({theme}) => theme.colors.text.default};
      }
      &--focused {
        background: ${({theme}) => hexToRgba(theme.colors.primary, 0.3)} !important;
        box-shadow: inset 0 0 0 1px ${({theme}) => hexToRgba(theme.colors.primary, 0.3)};
      }
    }
  }
`;

const blockStyle = css`
  .ce-block {
    &--drop-target {
      > div {
        border: 0;
        &:after,
        &:before {
          display: none;
        }
        position: relative;

        &::after {
          height: 0.25rem;
          width: 100%;
          position: absolute;
          bottom: 0.125rem;
          background: ${({theme}) => theme.colors.accent};
          display: block;
          transition: background 0.3s ease-in-out;
          border-radius: 1rem;
        }
      }
    }
  }
`;

export const tooltipStyle = css`
  .ct {
    &__content {
      border-radius: 0;
      padding: 0.25rem 0.5rem;
      line-height: 1.5;
      > div {
        display: flex;
        align-items: center;
        font-size: 0.75rem;
        .ce-inline-toolbar__shortcut {
          padding-left: 0.5rem;
          font-size: 0.75rem;
        }
      }
    }
    &:after {
      display: none;
    }

    &:before {
      background-color: ${({theme}) => theme.colors.black};
      border-radius: 0.25rem;
      -webkit-mask-box-image: none;
    }
  }
`;

const settingStyle = css`
  .ce-settings {
    background: ${({theme}) => theme.colors.black};
    .cdx-settings-button {
      &:not(:nth-child(3n+3)) {
        margin: 0;
      }
      color: ${({theme}) => theme.colors.white};
      &:hover {
        color: ${({theme}) => theme.colors.primary};
        background: ${({theme}) => hexToRgba(theme.colors.primary, 0.3)} !important;
        transition: background 0.3s ease-in-out;
      }
      &--active {
        color: ${({theme}) => theme.colors.primary} !important;
        background: ${({theme}) => hexToRgba(theme.colors.primary, 0.3)} !important;
        box-shadow: inset 0 0 0 1px ${({theme}) => theme.colors.primary};
      }
    }
    &__button {
      color: ${({theme}) => theme.colors.white};
      &:hover {
        color: ${({theme}) => theme.colors.primary};
        background: ${({theme}) => hexToRgba(theme.colors.primary, 0.3)} !important;
        transition: background 0.3s ease-in-out;
      }
      &--focused {
        color: ${({theme}) => theme.colors.primary} !important;
        background: ${({theme}) => hexToRgba(theme.colors.primary, 0.3)} !important;
      }
    }
  }
`;

// TODO: Should move to Editor component
const EditorWrapper = styled.div`
  ${inlineToolStyle}
  ${markStyle}
  ${underlineStyle}
  ${paragraphStyle}
  ${headerStyle}
  ${blockStyle}
  ${tooltipStyle}
  ${settingStyle}
`;

export default EditorWrapper;
