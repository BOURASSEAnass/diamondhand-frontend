import styled from 'styled-components';

export const CardFooterRowLink = styled.div`
  display: flex;
  flex: 1;
  width: 100%;
  justify-content: flex-end;
`;

export const CardFooterRowLinkHref = styled.a`
  color: ${({ theme }) => theme.color.orange[500]};
  font-size: 16px;
  font-weight: 500;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
  &:after {
    content: '\f08e';
    font-family: 'Font Awesome 5 Pro';
    margin-left: 5px;
  }
`;
