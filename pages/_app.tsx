import "@/styles/globals.css";
import 'react-quill-new/dist/quill.snow.css';
import NextNProgress from 'nextjs-progressbar';

import type { AppProps } from "next/app";
import Layout from "@/components/Layout";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout pageProps={pageProps}>
      <NextNProgress color="#7FFF00" startPosition={0.3} stopDelayMs={200} height={3} showOnShallow={true} />
      <Component {...pageProps} />
    </Layout>
  );
}
