import styled from 'styled-components';

const FlatButton = styled.button`
  display: block;
  outline: 0;
  padding: 0.25rem 1.5rem;
  background: transparent;
  border: 0;
  font-family: inherit;
  font-weight: 700;
  font-size: 1.125rem;
  cursor: pointer;
  transition: background 0.15s ease-in-out, transform 0.15s ease-in-out, color 0.15s ease-in-out;
  text-decoration: underline;

  &:hover {
    background: ${({theme}) => theme.colors.black};
    text-decoration: none;
    color: ${({theme}) => theme.colors.white};
    transform: scale(1.05);
  }
`;

export default FlatButton;
