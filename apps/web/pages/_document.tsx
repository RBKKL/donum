import { Head, Html, Main, NextScript } from "next/document";

const Document = () => (
  <Html>
    <Head>
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <body className="bg-zinc-900 text-white">
      <Main />
      <NextScript />
    </body>
  </Html>
);

export default Document;
