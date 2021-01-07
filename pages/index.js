import styled from 'styled-components';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';
import { Container } from '../shared/Container';
import { ButtonLink } from '../shared/Button';
import breakpoints from '../GlobalStyle/breakpoints';

const Hero = styled.div`
  position: relative;
  height: auto;
`;

const HeroOverlay = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: var(--layout-overlay);
`;

const Hgroup = styled.hgroup`
  position: relative;
  padding: calc(var(--baseline) * 2) 0;
  max-width: 720px;
  min-height: calc(100vh - (var(--baseline) * 2));
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;

  * {
    color: var(--text-light);
  }

  h2 {
    margin: var(--baseline) 0;
  }

  @media (min-width: ${breakpoints.lg}) {
    h1 {
      font-size: 4.209rem;
    }

    h2 {
      margin: calc(var(--baseline) * 2) 0;
    }
  }
`;

const Recommendations = styled.section`
  h3 {
    text-align: center;
  }
`;

const FlexContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: calc(var(--baseline) * 2);
`;

export default function Home() {
  return (
    <>
      <Head>
        <title>Vreau Ceai!</title>
        <meta
          name="description"
          content="Vezi produsele oferite și comandele acum! livrarea gratuită, în orice regiune al Moldovei"
        />
      </Head>

      <main>
        <FlexContainer>
          <Hero>
            <Image
              alt="Tea plantation"
              src="/tea-plantation.jpg"
              layout="fill"
              objectFit="cover"
              quality={75}
            />
            <HeroOverlay />
            <Container>
              <Hgroup>
                <h1>Vreau Ceai!</h1>
                <h2>
                  Vezi produsele oferite și comandele acum! livrarea gratuită,
                  în orice regiune al Moldovei!
                </h2>
                <Link href="/categories" passHref>
                  <ButtonLink aria-label="Vezi Catalogul">
                    vezi catalogul
                  </ButtonLink>
                </Link>
              </Hgroup>
            </Container>
          </Hero>

          <Container>
            <Recommendations>
              <h3>Ceaiuri Recomandate</h3>
            </Recommendations>
          </Container>
        </FlexContainer>
      </main>
    </>
  );
}
