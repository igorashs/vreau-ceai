import styled from 'styled-components';
import Link from 'next/link';
import Image from 'next/image';
import MenuSvg from '@/icons/menu.svg';
import breakpoints from 'GlobalStyle/breakpoints';
import { useState, useEffect } from 'react';
import { navLinks } from '@/utils/links';
import { StyledLink } from '@/shared/StyledLink';
import { useSession } from 'contexts/SessionContext';
import AccountSvg from 'assets/icons/account.svg';
import LogoutSvg from '@/icons/logout.svg';
import { logout } from 'services/ceaiApi';
import { useRouter } from 'next/router';
import { Container } from './Container';
import Button from './Button';

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

interface NavProps {
  hide?: boolean;
}

const Nav = styled.nav<NavProps>`
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
  display: flex;
  align-items: center;
  height: calc(var(--baseline) * 2);

  @media (min-width: ${breakpoints.lg}) {
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

const Account = styled(NavListItem)`
  display: flex;
  align-items: center;
  gap: 7px;
  color: var(--text-light);
`;

export const Header = () => {
  const [isHidden, setIsHidden] = useState(true);
  const { isAuth, user } = useSession();
  const [links, setLinks] = useState(navLinks.public);
  const router = useRouter();

  const onLogoutClick = async () => {
    const res = await logout();

    if (res.success) {
      router.reload();
    }
  };

  useEffect(() => {
    if (!isAuth) {
      setLinks(navLinks.public);
    } else if (user.isManager || user.isAdmin) {
      setLinks(navLinks.management);
    } else {
      setLinks(navLinks.private);
    }
  }, [isAuth, user]);

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
            <Button
              icon
              btnStyle="none"
              aria-label="Comutați Navigarea"
              onClick={() => setIsHidden((prev) => !prev)}
            >
              <MenuSvg />
            </Button>
          </NavToggle>
          <Nav hide={isHidden}>
            <NavList>
              {links?.map((link) => (
                <NavListItem key={link.href}>
                  <StyledLink {...link} />
                </NavListItem>
              ))}
              {isAuth && (
                <>
                  <Account key="user">
                    <AccountSvg />
                    {user?.name}
                  </Account>
                  <NavListItem key="user-logout">
                    <Button
                      aria-label="Deconectare din account"
                      onClick={onLogoutClick}
                      btnStyle="danger-text"
                      noPadding
                    >
                      <LogoutSvg />
                      Deconectare
                    </Button>
                  </NavListItem>
                </>
              )}
            </NavList>
          </Nav>
        </StyledHeader>
      </Container>
    </Wrapper>
  );
};
