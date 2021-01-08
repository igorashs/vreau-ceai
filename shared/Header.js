import styled from 'styled-components';
import Link from 'next/link';
import Image from 'next/image';
import { IconButton } from './IconButton';
import { Container } from './Container';
import MenuSvg from '@icons/menu.svg';
import CartSvg from '@icons/cart.svg';
import LoginSvg from '@icons/login.svg';
import breakpoints from 'GlobalStyle/breakpoints';
import { useState } from 'react';

const navLinks = [
  {
    path: '/categories',
    text: 'Ceai',
    label: 'Deschideți pagina cu categorii',
    Icon: null,
    accent: false
  },

  {
    path: '/about',
    text: 'Despre',
    label: 'Deschideți pagina cu informații despre noi',
    Icon: null,
    accent: false
  },
  {
    path: '/contacts',
    text: 'Contacte',
    label: 'Deschideți pagina cu contacte',
    Icon: null,
    accent: false
  },

  {
    path: '/cart',
    text: 'Coș',
    label: 'Deschideți pagina cu coșul personal',
    Icon: CartSvg,
    accent: false
  },
  {
    path: '/login',
    text: 'Conectați-vă',
    label: 'Deschideți pagina pentru conectare',
    Icon: LoginSvg,
    accent: true
  }
];

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  background-color: var(--layout-dark);
`;

const StyledHeader = styled.header`
  display: grid;
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
    grid-row: 1;
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
    flex-direction: row;
    justify-content: flex-end;
    gap: var(--baseline);
    border: 0;
  }
`;

const NavListItem = styled.li`
  border-top: 1px solid var(--layout);
  padding: 7px 0;

  a {
    color: var(--text-light);
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 7px;
  }

  @media (min-width: ${breakpoints.lg}) {
    border: 0;
  }

  ${({ accent }) => accent && ' a {color: var(--accent-text-light)}'}
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
              {navLinks.map(({ path, text, label, Icon, accent }) => (
                <NavListItem key={path} accent={accent}>
                  <Link href={path}>
                    <a aria-label={label}>
                      {Icon && <Icon />}
                      {text}
                    </a>
                  </Link>
                </NavListItem>
              ))}
            </NavList>
          </Nav>
        </StyledHeader>
      </Container>
    </Wrapper>
  );
}
