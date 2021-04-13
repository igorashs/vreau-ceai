import styled from 'styled-components';

type LabelProps = {
  error?: boolean;
  success?: boolean;
};

const Label = styled.label<LabelProps>`
  font-weight: 500;

  ${({ error }) => error && 'color: var(--text-danger);'}

  ${({ success, error }) =>
    success && !error && 'color: var(--accent-text-dark); font-weight: 400'}
`;

export default Label;
