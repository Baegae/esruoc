import styled from 'styled-components';

const BaseTag = styled.p`
  display: inline-block;
  font-size: 12px;
  text-align: center;
  color: ${({theme}) => theme.colors.text.caption};
  border-radius: 12px;
  padding: 2px 14px;
`;

export const ProcessingTag = styled(BaseTag)`
  background: ${({theme}) => theme.colors.primary};
`;

export const CompleteTag = styled(BaseTag)`
  background: ${({theme}) => theme.colors.accent};
`;

export const DraftTag = styled(BaseTag)`
  background: rgba(51, 58, 61, 0.55);
`;
