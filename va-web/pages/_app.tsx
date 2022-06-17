import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useApollo } from '../lib/apollo-client'
import { ApolloProvider } from '@apollo/client';
import { SnackbarProvider } from 'notistack';
import { useState } from 'react';

function MyApp({ Component, pageProps }: AppProps) {

  const apolloClient = useApollo(pageProps.initialApolloState)
  const [count, setCount] = useState(0);

  return (
    <ApolloProvider client={apolloClient}>
      <SnackbarProvider maxSnack={3}>
        <Component {...pageProps} count={count} setCount={setCount} />
      </SnackbarProvider>
    </ApolloProvider>
  );
}

export default MyApp
