import styled from 'styled-components';
import ArrowSvg from 'assets/icons/arrow.svg';
import { Label } from '@/shared/Label';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
`;

const SelectWrapper = styled.div`
  position: relative;
  align-self: flex-start;

  ${({ fullWidth }) => fullWidth && 'width: 100%;'}
`;

const StyledSelect = styled.select`
  width: 100%;
  padding: 7px 38px 7px 14px;
  border-radius: 4px;
  border: 0;
  color: var(--text-light);
  background-color: var(--accent-dark);
  box-shadow: 1px 1px 2px #00000066;
  text-transform: lowercase;
  text-decoration: none;
  appearance: none;
  cursor: pointer;

  :hover {
    background-color: var(--accent);
  }

  option {
    padding: 7px 14px;
  }
`;

const StyledSvg = styled(ArrowSvg)`
  position: absolute;
  transform: rotate(90deg);
  color: var(--text-light);
  right: 7px;
  top: calc(50% - 12px);
  pointer-events: none;
`;

export function Select({
  name,
  label,
  error,
  passRef,
  id = name,
  fullWidth,
  disabled,
  children
}) {
  return (
    <Wrapper>
      <Label htmlFor={id} error={error}>
        {error || label}
      </Label>
      <SelectWrapper fullWidth={fullWidth}>
        <StyledSelect name={name} ref={passRef} id={id} disabled={disabled}>
          {children}
        </StyledSelect>
        <StyledSvg />
      </SelectWrapper>
    </Wrapper>
  );
}
