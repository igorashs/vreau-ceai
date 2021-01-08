import styled from 'styled-components';
import Link from 'next/link';

const StyledA = styled.a`
  color: var(--text-light);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 7px;

  ${({ accent }) => accent && 'color: var(--accent-text-light)'}
`;

export const StyledLink = ({
  href,
  label,
  text,
  accent,
  Icon,
  target,
  rel
}) => (
  <Link href={href} passHref>
    <StyledA aria-label={label} accent={accent} target={target} rel={rel}>
      {Icon && <Icon />}
      {text}
    </StyledA>
  </Link>
);
