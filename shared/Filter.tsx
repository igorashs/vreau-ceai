import styled from 'styled-components';
import CheckSvg from '@/icons/check.svg';
import Button from '@/shared/Button';

const StyledFilter = styled.div`
  display: flex;
  align-items: center;

  > *:focus {
    outline: none;
  }
`;

interface FilterProps {
  label?: string;
  text: string;
  checked?: boolean;
  onChange: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export const Filter = ({
  label = '',
  text,
  checked = false,
  onChange,
}: FilterProps) => {
  return (
    <StyledFilter>
      <Button
        icon={checked}
        onClick={onChange}
        aria-label={label}
        btnStyle="accent-text"
        noPadding
      >
        {checked && <CheckSvg />}
        {text}
      </Button>
    </StyledFilter>
  );
};
