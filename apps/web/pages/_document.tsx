import { Head, Html, Main, NextScript } from "next/document";

const Document = () => (
  <Html>
    <Head>
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#18181b" />
      <meta name="msapplication-TileColor" content="#18181b" />
      <meta name="theme-color" content="#18181b" />
      {/* prettier-ignore-end */}
    </Head>
    <body className="bg-zinc-900 text-white">
      <Main />
      <NextScript />
    </body>
  </Html>
);

export default Document;
