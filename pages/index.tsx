import styled from 'styled-components';
import Image from 'next/image';
import Head from 'next/head';
import Container from '@/shared/Container';
import StyledLink from '@/shared/StyledLink';
import { categoriesLink } from '@/utils/links';
import breakpoints from 'GlobalStyle/breakpoints';
import Recommendation from '@/shared/Recommendation';

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
  max-width: var(--max-text-width);
  min-height: calc(100vh - (var(--baseline) * 2));
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;

  * {
    color: var(--text-light);
  }

  h1 {
    font-size: var(--h3-font-size);
  }

  h2 {
    margin: var(--baseline) 0;
    font-size: var(--h4-font-size);
  }

  @media (min-width: ${breakpoints.lg}) {
    h1 {
      font-size: var(--h1-font-size);
    }

    h2 {
      margin: calc(var(--baseline) * 2) 0;
      font-size: var(--h3-font-size);
    }
  }
`;

const RecommendationSection = styled.section`
  h5 {
    text-align: center;

    margin-bottom: var(--baseline);
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
            />
            <HeroOverlay />
            <Container>
              <Hgroup>
                <h1>Vreau Ceai!</h1>
                <h2>
                  Vezi produsele oferite și comandele acum! livrarea gratuită,
                  în orice regiune al Moldovei!
                </h2>
                <StyledLink
                  {...{
                    ...categoriesLink,
                    text: 'vezi catalogul',
                    button: true,
                  }}
                />
              </Hgroup>
            </Container>
          </Hero>

          <Container>
            <RecommendationSection>
              <h5>Ceaiuri Recomandate</h5>

              <Recommendation />
            </RecommendationSection>
          </Container>
        </FlexContainer>
      </main>
    </>
  );
}
