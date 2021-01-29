import styled, { css } from 'styled-components';
import CheckSvg from '@/icons/check.svg';
import { Button } from '@/shared/Button';

const StyledFilter = styled.div`
  display: flex;
  align-items: center;

  > *:focus {
    outline: none;
  }
`;

export const Filter = ({ label, text, checked, onChange }) => {
  return (
    <StyledFilter disableOutline={checked}>
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
