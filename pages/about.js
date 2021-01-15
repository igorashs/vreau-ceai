import Head from 'next/head';
import styled from 'styled-components';
import { withBaseLayout } from '@/layouts/BaseLayout';
import breakpoints from 'GlobalStyle/breakpoints';
import { StyledLink } from '@/shared/StyledLink';
import { categoriesLink } from '@/utils/links';

const Wrapper = styled.div`
  max-width: var(--max-text-width);

  h1 {
    font-size: var(--h4-font-size);
  }

  h1,
  p {
    margin-bottom: calc(var(--baseline) / 2);
  }

  @media (min-width: ${breakpoints.lg}) {
    h1 {
      font-size: var(--h3-font-size);
    }

    h1,
    p {
      margin-bottom: var(--baseline);
    }
  }
`;

export default function About() {
  return (
    <>
      <Head>
        <title>Despre noi</title>
        <meta
          name="description"
          content="Serviciile Vreau Ceai! Procurarea și livrare gratuită a ceaiurilor"
        />
      </Head>

      <Wrapper>
        <h1>Despre noi</h1>
        <p>
          Ceaiul este cea mai deosebită băutură din lume. Noi oferim prin
          intermediul magazinului online, posibilitatea de a comanda și oferi
          tuturor locuitorilor R. Moldova, diverse arome de ceai, pe care
          fiecare poate să-le savureze acasă! Noi oferim livrare gratuită,
          pentrucă nouă ne pasă!
        </p>

        <StyledLink
          {...{
            ...categoriesLink,
            text: 'vezi catalogul',
            accent: 'dark',
            underline: true
          }}
        />
      </Wrapper>
    </>
  );
}

About.withLayout = withBaseLayout;
