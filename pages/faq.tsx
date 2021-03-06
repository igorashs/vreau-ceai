import Head from 'next/head';
import styled from 'styled-components';
import withBaseLayout from '@/layouts/BaseLayout';
import breakpoints from 'GlobalStyle/breakpoints';

const Wrapper = styled.div`
  max-width: var(--max-text-width);

  h1 {
    font-size: var(--h4-font-size);
  }

  h2 {
    font-size: var(--h5-font-size);
    margin: var(--baseline) 0 calc(var(--baseline) / 2);
  }

  @media (min-width: ${breakpoints.lg}) {
    h1 {
      font-size: var(--h3-font-size);
    }

    h2 {
      font-size: var(--h4-font-size);
    }
  }

  ol {
    counter-reset: item-counter;
    display: flex;
    flex-direction: column;
    gap: calc(var(--baseline) / 2);

    li {
      display: grid;
      grid-template-columns: calc(var(--baseline) / 2) 1fr;
      gap: 7px;
      counter-increment: item-counter;
    }

    li::before {
      content: counter(item-counter) '.';
    }
  }
`;

export default function Faq() {
  return (
    <>
      <Head>
        <title>Întrebări frecvente</title>
        <meta name="description" content="Răspunsuri la întrebări frecvente" />
      </Head>

      <Wrapper>
        <h1>Întrebări frecvente</h1>
        <h2 id="cum-comand">Cum comand?</h2>
        <ol>
          <li>
            <p>Adăugați produsele dorite în coș</p>
          </li>
          <li>
            <p>Vizualizați coșul și accesați butonul comandă</p>
          </li>
          <li>
            <p>Înregistrațivă/conectațivă în contul personal</p>
          </li>
          <li>
            <p>Introduceți datele necesare cum ar fi adresa, nr de tel...</p>
          </li>
          <li>
            <p>
              Un operator va lua contact cu dvs. între orele de lucru
              (luni-vineri) (09:00-18:00).
            </p>
          </li>
        </ol>
        <h2 id="cum-achit">Cum achit?</h2>
        <p>
          Achitarea la moment se face doar prin bani cash (la livrarea
          produsului).
        </p>
        <h2 id="livrare">Cum are loc livrarea?</h2>
        <p>
          Livrarea are loc în timp de 24ore între orele de lucru după
          confirmarea comenzii.
        </p>
      </Wrapper>
    </>
  );
}

Faq.withLayout = withBaseLayout;
