import styled from 'styled-components';
import { Container } from './Container';
import breakpoints from 'GlobalStyle/breakpoints';
import { footerBlockLinksList } from 'links';
import { StyledLink } from 'shared/StyledLink';

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
        <footer>
          <BlockLinkList>
            {footerBlockLinksList.map(({ path, text, label, links }) => (
              <li key={path}>
                <LinkList>
                  <LinkListHeaderItem>
                    <StyledLink href={path} text={text} label={label} />
                  </LinkListHeaderItem>
                  {links.map(({ path, text, label, Icon, accent }) => (
                    <LinkListItem key={path}>
                      <StyledLink
                        href={path}
                        text={text}
                        label={label}
                        Icon={Icon}
                        accent={accent}
                      />
                    </LinkListItem>
                  ))}
                </LinkList>
              </li>
            ))}
          </BlockLinkList>
          <CopyRight>
            <StyledLink
              href="https://github.com/igorashs/vreau-ceai"
              text="@Igorash"
              label="Visit Project Repo"
              target="_blank"
              rel="noreferrer"
            />
            <Divider />
            <p>
              made by <AccentWord>tea</AccentWord> nature
            </p>
          </CopyRight>
        </footer>
      </Container>
    </Wrapper>
  );
}