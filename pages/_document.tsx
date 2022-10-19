import { Html, Head, Main, NextScript } from "next/document";

const Document = () => (
  <Html>
    <Head>
      <link rel="icon" href="/favicon.ico" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />
    </Head>
    <body className="bg-zinc-900 font-inter text-white">
      <Main />
      <NextScript />
    </body>
  </Html>
);

export default Document;
