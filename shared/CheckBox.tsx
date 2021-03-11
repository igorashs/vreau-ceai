import styled from 'styled-components';
import { Label } from './Label';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
`;

const StyledInput = styled.input`
  margin: 0;
  width: 16px;
  height: 16px;
  order: -1;

  cursor: pointer;
`;

interface CheckBoxProps {
  name: string;
  label: string;
  error?: boolean;
  passRef?:
    | ((instance: HTMLInputElement) => void)
    | React.RefObject<HTMLInputElement>;
  id?: string;
}

const CheckBox = ({
  name,
  label,
  error = false,
  passRef = null,
  id = name,
}: CheckBoxProps) => {
  return (
    <Wrapper>
      <Label htmlFor={id} error={error} success>
        {error || label}
      </Label>

      <StyledInput id={id} ref={passRef} name={name} type="checkbox" />
    </Wrapper>
  );
};

export default CheckBox;
