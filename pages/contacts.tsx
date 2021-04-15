import Head from 'next/head';
import styled from 'styled-components';
import CalendarClock from '@/icons/calendar-clock.svg';
import withBaseLayout from '@/layouts/BaseLayout';
import StyledLink from '@/shared/StyledLink';
import { phoneLink, emailLink } from '@/utils/links';
import breakpoints from 'GlobalStyle/breakpoints';

const Wrapper = styled.div`
  h1 {
    margin-bottom: calc(var(--baseline) / 2);
    font-size: var(--h4-font-size);
  }

  @media (min-width: ${breakpoints.lg}) {
    h1 {
      font-size: var(--h3-font-size);
      margin-bottom: var(--baseline);
    }
  }

  a {
    color: var(--accent-text-dark);
  }

  ul {
    display: flex;
    flex-direction: column;
    gap: calc(var(--baseline) / 2);
  }

  li {
    display: flex;
    align-items: center;
    gap: 7px;
  }
`;

export default function Contacts() {
  return (
    <>
      <Head>
        <title>Contacte</title>
        <meta
          name="description"
          content="Contacte, număr de telefon, email, ore de lucru"
        />
      </Head>

      <Wrapper>
        <h1>Contacte</h1>
        <ul>
          <li>
            <StyledLink {...phoneLink} />
          </li>
          <li>
            <StyledLink {...emailLink} />
          </li>
          <li>
            <CalendarClock /> <p>luni - vineri (09:00 - 18:00)</p>
          </li>
        </ul>
      </Wrapper>
    </>
  );
}

Contacts.withLayout = withBaseLayout;
