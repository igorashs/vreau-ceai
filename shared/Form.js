import styled from 'styled-components';

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: calc(var(--baseline) / 2);
`;

export const FormAction = styled.div`
  margin-top: calc(var(--baseline) / 2);
  display: flex;

  ${({ justify }) => {
    switch (justify) {
      case 'space-between':
        return 'justify-content: space-between;';
      case 'flex-end':
        return 'justify-content: flex-end;';
      case 'flex-start':
        return 'justify-content: flex-start;';
      case 'center':
        return 'justify-content: center;';
      default:
        return 'justify-content: stretch;';
    }
  }}

  ${({ align }) => {
    switch (align) {
      case 'flex-end':
        return 'align-items: flex-end;';
      case 'flex-start':
        return 'align-items: flex-start;';
      case 'center':
        return 'align-items: center;';
      default:
        return 'align-items: stretch;';
    }
  }}
`;
