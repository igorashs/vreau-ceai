import styled from 'styled-components';
import Link from 'next/link';
import { Container } from './Container';
import breakpoints from '../GlobalStyle/breakpoints';
import PhoneSvg from '../assets/icons/phone.svg';
import EmailSvg from '../assets/icons/email.svg';

const blockLinkList = [
  {
    path: '/about',
    text: 'Despre',
    label: 'Deschideți pagina cu informații despre noi',
    links: [
      {
        path: '/about',
        text: 'vreau ceai',
        label: 'Deschideți pagina cu informații despre noi',
        Icon: null,
        accent: true
      }
    ]
  },
  {
    path: '/faq',
    text: 'FAQ',
    label: 'Deschideți pagina cu întrebări frecvente',
    links: [
      {
        path: '/faq#cum-comand',
        text: 'cum comand',
        label: 'Deschideți pagina cu întrebarea cum comand',
        Icon: null,
        accent: true
      },
      {
        path: '/faq#cum-achit',
        text: 'cum achit',
        label: 'Deschideți pagina cu întrebarea cum achit',
        Icon: null,
        accent: true
      },
      {
        path: '/faq#livrare',
        text: 'cum are loc livrarea',
        label: 'Deschideți pagina cu întrebarea despre cum are loc livrarea',
        Icon: null,
        accent: true
      }
    ]
  },
  {
    path: '/contacts',
    text: 'Contacte',
    label: 'Deschideți pagina cu contacte',
    links: [
      {
        path: 'tel:062222222',
        text: '062222222',
        label: 'apelați nr de tel',
        Icon: PhoneSvg,
        accent: true
      },
      {
        path: 'mailto:vreauceai@gmail.com',
        text: 'vreauceai@gmail.com',
        label: 'trimiteți email',
        Icon: EmailSvg,
        accent: true
      }
    ]
  }
];

const Wrapper = styled.div`
  margin-top: calc(var(--baseline) * 2);
  padding: var(--baseline) 0;
  color: var(--text-light);
  background-color: var(--layout-dark);

  @media (min-width: ${breakpoints.lg}) {
    margin-top: calc(var(--baseline) * 4);
    padding: calc(var(--baseline) * 2) 0;
  }
`;

const StyledFooter = styled.footer`
  a {
    color: var(--text-light);
    text-decoration: none;
  }
`;

const BlockLinkList = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: calc(var(--baseline) / 2);

  @media (min-width: ${breakpoints.lg}) {
    display: grid;
    align-items: start;
    grid-template-columns: repeat(3, 225px);
    justify-content: space-between;
  }
`;

const LinkList = styled.ul`
  @media (min-width: ${breakpoints.lg}) {
    display: flex;
    flex-direction: column;
    gap: 7px;
  }
`;

const LinkListHeaderItem = styled.li`
  @media (min-width: ${breakpoints.lg}) {
    border-bottom: 1px solid #fff;
    padding-bottom: 7px;
  }
`;

const LinkListItem = styled.li`
  display: none;

  @media (min-width: ${breakpoints.lg}) {
    display: initial;

    a {
      display: flex;
      align-items: center;
      gap: 7px;

      ${({ accent }) => accent && 'color: var(--accent-text-light);'}
    }
  }
`;

const CopyRight = styled.div`
  margin-top: var(--baseline);
  display: flex;
  gap: var(--baseline);
  justify-content: center;
  text-align: center;
  font-size: 0.75rem;

  p {
    margin: 0;
  }

  @media (min-width: ${breakpoints.lg}) {
    margin-top: calc(var(--baseline) * 2);
  }
`;

const AccentWord = styled.span`
  color: var(--accent-text-light);
`;

const Divider = styled.span`
  width: 1px;
  background-color: var(--layout-light);
`;

export function Footer() {
  return (
    <Wrapper>
      <Container>
        <StyledFooter>
          <BlockLinkList>
            {blockLinkList.map(({ path, text, label, links }) => (
              <li key={path}>
                <LinkList>
                  <LinkListHeaderItem>
                    <Link href={path}>
                      <a aria-label={label}>{text}</a>
                    </Link>
                  </LinkListHeaderItem>

                  {links.map(({ path, text, label, Icon, accent }) => (
                    <LinkListItem accent={accent} key={path}>
                      <Link href={path}>
                        <a aria-label={label}>
                          {Icon && <Icon />}
                          {text}
                        </a>
                      </Link>
                    </LinkListItem>
                  ))}
                </LinkList>
              </li>
            ))}
          </BlockLinkList>
          <CopyRight>
            <p>@Igorash</p>
            <Divider />
            <p>
              made by <AccentWord>tea</AccentWord> nature
            </p>
          </CopyRight>
        </StyledFooter>
      </Container>
    </Wrapper>
  );
}
