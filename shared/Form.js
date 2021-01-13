import styled from 'styled-components';

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: calc(var(--baseline) / 2);
`;

export const FormAction = styled.div`
  margin-top: calc(var(--baseline) / 2);
  display: flex;
  justify-content: space-between;
`;
