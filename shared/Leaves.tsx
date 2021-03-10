import styled from 'styled-components';
import LeavesSvg from 'assets/leaves.svg';

const StyledFigure = styled.figure`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

interface LeavesProps {
  height?: string;
  width?: string;
}

export const Leaves = ({ height = '112', width = '112' }: LeavesProps) => {
  return (
    <StyledFigure>
      <LeavesSvg height={height} width={width} />
    </StyledFigure>
  );
};
