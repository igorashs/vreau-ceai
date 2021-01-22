import styled from 'styled-components';
import { Label } from './Label';

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 7px;
`;

const StyledInput = styled.input`
  background-color: var(--input);
  border: 1px solid var(--layout-dark);
  border-radius: 4px;
  padding: calc(var(--baseline) / 4) 0 calc(var(--baseline) / 4)
    calc(var(--baseline) / 2);
  color: var(--text-dark);
`;

export const TextField = ({ name, label, error, passRef, type, id = name }) => {
  return (
    <Wrapper>
      <Label htmlFor={id} error={error}>
        {error || label}
      </Label>
      <StyledInput id={id} ref={passRef} name={name} type={type} />
    </Wrapper>
  );
};