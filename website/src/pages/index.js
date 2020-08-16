/* eslint-disable jsx-a11y/anchor-is-valid */
import Head from 'next/head';
import Link from 'next/link';
import styled from 'styled-components';

const Title = styled.h1`
  font-size: 50px;
  color: ${({ theme }) => theme.colors.primary};
`;

const Home = () => {
  return (
    <div>
      <Head>
        <title>Hyperaudio</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Title>Hyperaudio</Title>

        <p>The Hyperaudio Project is a global non-profit group producing Open Source software</p>
      </main>

      <footer>
        <ul>
          <li>
            <Link href="/TOS">
              <a>Terms of Service</a>
            </Link>
          </li>
          <li>
            <Link href="/License">
              <a>License</a>
            </Link>
          </li>
          <li>
            <Link href="/CLA">
              <a>CLA</a>
            </Link>
          </li>
          <li>
            <Link href="/COC">
              <a>Code of Conduct</a>
            </Link>
          </li>
        </ul>
      </footer>
    </div>
  );
};

export default Home;
