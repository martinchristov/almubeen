import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang='en' translate='no'>
      <Head>
        <meta 
            name='viewport' 
            content='width=device-width' 
        />
        <meta name="application-name" content="Al Mubeen" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Al Mubeen | المبين" />
        <meta name="description" content="A fine digital mushaf for students of Arabic and The Quran" />
        <meta name="theme-color" content="#04703D" />
        <link rel="manifest" href="./manifest.json" />
        <link rel="apple-touch-icon" href="./icon-192.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="./icon-152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="./icon-180.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="./icon-167.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin></link>
        <link href="https://fonts.googleapis.com/css2?family=Reem+Kufi&display=swap" rel="stylesheet"></link>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}