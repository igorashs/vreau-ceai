import styled from 'styled-components';
import { Button } from './Button';
import Link from 'next/link';

const StyledA = styled.a`
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 7px;

  :hover {
    filter: brightness(0.7);
  }

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
  button = false,
  children
}) => (
  <Link href={href} passHref>
    {button ? (
      <Button as="a" icon={!text} aria-label={label} target={target} rel={rel}>
        {Icon && <Icon />}
        {text}
      </Button>
    ) : (
      <StyledA
        aria-label={label}
        accent={accent}
        target={target}
        rel={rel}
        underline={underline}
      >
        {Icon && <Icon />}
        {text || children}
      </StyledA>
    )}
  </Link>
);
