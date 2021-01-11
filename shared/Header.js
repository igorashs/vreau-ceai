import styled from 'styled-components';
import Link from 'next/link';
import Image from 'next/image';
import { IconButton } from './IconButton';
import { Container } from './Container';
import MenuSvg from '@/icons/menu.svg';
import breakpoints from 'GlobalStyle/breakpoints';
import { useState, useRef } from 'react';
import { navLinks } from '@/utils/links';
import { StyledLink } from '@/shared/StyledLink';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  background-color: var(--layout-dark);
`;

const StyledHeader = styled.header`
  display: grid;
  column-gap: var(--baseline);
  grid-template-columns: auto 1fr;
  grid-template-rows: calc(var(--baseline) * 2) auto;
  align-items: center;
  justify-items: end;
`;

const Nav = styled.nav`
  width: 100%;
  justify-self: start;
  grid-column: span 2;
  padding-bottom: calc(var(--baseline) / 2);

  @media (min-width: ${breakpoints.lg}) {
    display: initial;
    grid-column: 2;
    grid-row: span 2;
    padding: 0;
    border: 0;
  }

  ${({ hide }) => hide && 'display: none'}
`;

const NavList = styled.ul`
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid var(--layout);

  @media (min-width: ${breakpoints.lg}) {
    flex-wrap: wrap;
    column-gap: var(--baseline);
    flex-direction: row;
    justify-content: flex-end;
    border: 0;
  }
`;

const NavListItem = styled.li`
  border-top: 1px solid var(--layout);
  padding: 7px 0;

  @media (min-width: ${breakpoints.lg}) {
    display: flex;
    align-items: center;
    height: calc(var(--baseline) * 2);
    border: 0;
  }
`;

const Logo = styled.div`
  justify-self: start;
  display: flex;
  height: 32px;
  min-width: 158px;
`;

const NavToggle = styled.div`
  @media (min-width: ${breakpoints.lg}) {
    display: none;
  }
`;

export function Header() {
  const [isHidden, setIsHidden] = useState(true);

  //TODO PrivatePaths / AdminPath (when authed)
  const links = useRef(navLinks.filter((link) => !link.privatePath));

  return (
    <Wrapper>
      <Container>
        <StyledHeader>
          <Logo>
            <Link href="/">
              <a aria-label="Acasă">
                <Image
                  src="/logo.svg"
                  alt="vreau ceai logo"
                  quality="100"
                  width="158px"
                  height="32px"
                />
              </a>
            </Link>
          </Logo>
          <NavToggle>
            <IconButton
              aria-label="Comutați Navigarea"
              onClick={() => setIsHidden((prev) => !prev)}
            >
              <MenuSvg />
            </IconButton>
          </NavToggle>
          <Nav hide={isHidden}>
            <NavList>
              {links.current.map((link) => (
                <NavListItem key={link.href}>
                  <StyledLink {...link} />
                </NavListItem>
              ))}
            </NavList>
          </Nav>
        </StyledHeader>
      </Container>
    </Wrapper>
  );
}
