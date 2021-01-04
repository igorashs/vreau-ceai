import Head from 'next/head';
import styled from 'styled-components';
import { useEffect, useState } from 'react';

const Main = styled.main`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default function Home() {
  const [message, setMessage] = useState();

  useEffect(async () => {
    const data = await fetch('./api/hello');
    const message = await data.json();

    setMessage(message);
  }, []);

  return (
    <div>
      <Head>
        <title>Vreau Ceai</title>
        <link rel="icon" href="/favicon.svg" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Main>
        <p>Wooosh</p>
        <h1>{message?.text}</h1>
      </Main>
    </div>
  );
}
