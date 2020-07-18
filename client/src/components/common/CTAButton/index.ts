import styled from 'styled-components';

const CTAButton = styled.button`
  background: ${({theme}) => theme.colors.accent};
  display: block;
  outline: 0;
  border: .25rem solid ${({theme}) => theme.colors.black};
  padding: 0.625rem 3rem;
  font-family: inherit;
  font-weight: 700;
  font-size: 1.25rem;
  cursor: pointer;
  transition: background 0.15s ease-in-out, transform 0.15s ease-in-out, color 0.15s ease-in-out;

  &:hover {
    background: ${({theme}) => theme.colors.black};
    color: ${({theme}) => theme.colors.white};
    transform: scale(1.05);
  }
`;

export default CTAButton;
