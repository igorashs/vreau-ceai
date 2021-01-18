import styled from 'styled-components';

export const Label = styled.label`
  font-weight: 500;

  ${({ error }) => error && 'color: var(--text-danger);'}

  ${({ success, error }) =>
    success && !error && 'color: var(--accent-text-dark); font-weight: 400'}
`;
