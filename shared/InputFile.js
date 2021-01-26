import styled from 'styled-components';
import { Label } from '@/shared/Label';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
`;

const StyledInputFile = styled.label`
  align-self: flex-start;
  padding: calc(var(--baseline) / 4) calc(var(--baseline) / 2);
  border-radius: 4px;
  border: 0;
  color: var(--text-light);
  background-color: var(--accent-dark);
  box-shadow: 1px 1px 2px #00000066;
  text-transform: lowercase;
  text-decoration: none;

  cursor: pointer;

  :hover {
    background-color: var(--accent);
  }

  ${({ fullWidth }) => fullWidth && 'width: 100%;'}
`;

const Input = styled.input`
  display: none;
`;

const I = styled.i`
  word-break: break-word;
`;

export function InputFile({
  name,
  label,
  error,
  passRef,
  id = name,
  fullWidth,
  accept,
  children
}) {
  return (
    <Wrapper>
      <Label htmlFor={id} error={error}>
        {error || label}
      </Label>
      <StyledInputFile fullWidth={fullWidth}>
        <Input type="file" ref={passRef} id={id} name={name} accept={accept} />
        {children}
      </StyledInputFile>
    </Wrapper>
  );
}
