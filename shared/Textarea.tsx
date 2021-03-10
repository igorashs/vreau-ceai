import styled from 'styled-components';
import { Label } from './Label';

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 7px;
`;

const StyledTextarea = styled.textarea`
  width: 100%;
  background-color: var(--input);
  border: 1px solid var(--layout-dark);
  border-radius: 4px;
  padding: calc(var(--baseline) / 4) 0 calc(var(--baseline) / 4)
    calc(var(--baseline) / 2);
  color: var(--text-dark);

  resize: none;
`;

interface TextareaProps {
  name: string;
  label: string;
  error?: boolean;
  id?: string;
  rows?: number;
  passRef:
    | ((instance: HTMLTextAreaElement) => void)
    | React.RefObject<HTMLTextAreaElement>;
}

export const Textarea = ({
  name,
  label,
  error = false,
  passRef = null,
  id = name,
  rows = 2,
}: TextareaProps) => {
  return (
    <Wrapper>
      <Label htmlFor={id} error={error}>
        {error || label}
      </Label>

      <StyledTextarea id={id} ref={passRef} name={name} rows={rows} />
    </Wrapper>
  );
};
