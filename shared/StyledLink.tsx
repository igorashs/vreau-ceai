import styled from 'styled-components';
import Link from 'next/link';
import Button from './Button';

interface StyledAProps {
  accent?: 'light' | 'dark';
  underline?: boolean;
}

const StyledA = styled.a<StyledAProps>`
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

interface StyledLinkProps {
  href: string;
  label: string;
  text?: string;
  accent?: 'light' | 'dark';
  Icon?: React.FC<React.SVGProps<SVGElement>>;
  target?: string;
  rel?: string;
  underline?: boolean;
  button?: boolean;
}

export const StyledLink = ({
  href,
  label,
  text = '',
  accent,
  Icon,
  target = '',
  rel = '',
  underline = false,
  button = false,
  children,
}: React.PropsWithChildren<StyledLinkProps>) => (
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
