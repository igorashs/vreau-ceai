import styled from 'styled-components';
import Label from './Label';

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 7px;
`;

const StyledInput = styled.input`
  width: 100%;
  background-color: var(--input);
  border: 1px solid var(--layout-dark);
  border-radius: 4px;
  padding: calc(var(--baseline) / 4) 0 calc(var(--baseline) / 4)
    calc(var(--baseline) / 2);
  color: var(--text-dark);

  /* Chrome, Safari, Edge, Opera */
  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  &[type='number'] {
    -moz-appearance: textfield;
  }
`;

type TextFieldProps = {
  name: string;
  label: string;
  error?: string;
  type?: string;
  id?: string;
  placeholder?: string;
  passRef?:
    | ((instance: HTMLInputElement) => void)
    | React.RefObject<HTMLInputElement>;
};

const TextField = ({
  name,
  label,
  error = '',
  passRef,
  type = 'text',
  id = name,
  placeholder,
}: TextFieldProps) => {
  return (
    <Wrapper>
      <Label htmlFor={id} error={!!error}>
        {error || label}
      </Label>
      <StyledInput
        id={id}
        ref={passRef}
        name={name}
        type={type}
        placeholder={placeholder}
      />
    </Wrapper>
  );
};

export default TextField;
