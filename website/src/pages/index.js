import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>Hyperaudio</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Hyperaudio</h1>

        <p>
          The Hyperaudio Project is a global non-profit group producing Open Source software
        </p>
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
  )
};
