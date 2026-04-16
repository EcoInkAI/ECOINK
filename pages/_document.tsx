import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" className="dark">
      <Head>
        <link rel="icon" href="/logo/logo.png" type="image/png" />
        <meta name="theme-color" content="#0a0a0a" />
        <meta name="google-site-verification" content="IYY41q_TNuCvYtr-NF3llV0zHLjAO0Wsq3caqbgy5W8" />
        
        {/* Fonts are imported in globals.css, but preconnect helps */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </Head>
      <body className="antialiased bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
