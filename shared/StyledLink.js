import styled from 'styled-components';
import { buttonStyle } from './styled/buttonStyle';
import Link from 'next/link';

const StyledA = styled.a`
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 7px;

  ${({ accent }) => {
    switch (accent) {
      case 'light':
        return 'color: var(--accent-text-light);';
      case 'dark':
        return 'color: var(--accent-text-dark);';
      default:
        return 'color: var(--text-light);';
    }
  }}

  ${({ underline }) => `text-decoration: ${underline ? 'underline' : 'none'};`}

  ${({ button }) => button && buttonStyle}
`;

export const StyledLink = ({
  href,
  label,
  text,
  accent,
  Icon,
  target,
  rel,
  underline,
  button
}) => (
  <Link href={href} passHref>
    <StyledA
      aria-label={label}
      accent={accent}
      target={target}
      rel={rel}
      underline={underline}
      button={button}
    >
      {Icon && <Icon />}
      {text}
    </StyledA>
  </Link>
);
