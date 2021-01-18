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
        break;
    }
  }}
`;
