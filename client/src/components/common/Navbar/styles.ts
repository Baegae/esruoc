import LogoSvg from '@src/assets/logo.svg';
import styled from 'styled-components';

export const Logo = styled(LogoSvg)`
  width: auto;
  height: 2rem;
`;

export const NavbarWrapper = styled.div`
  padding: 1rem 0;
`;

export const MenuWrapper = styled.ul`
  list-style: none;
  display: flex;
  justify-content: flex-end;
  padding: 0;
  margin: 0;

  li {
    margin-left: 1rem;
    padding: 0 0.25rem;
  }
`;
