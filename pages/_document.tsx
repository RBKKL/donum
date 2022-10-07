import { Html, Head, Main, NextScript } from "next/document";

const Document = () => (
  <Html>
    <Head>
      <link rel="icon" href="/favicon.ico" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter&display=optional"
        rel="stylesheet"
      />
    </Head>
    <body className="bg-zinc-900 text-white font-inter">
      <Main />
      <NextScript />
    </body>
  </Html>
);

export default Document;
