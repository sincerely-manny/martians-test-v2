/* eslint-disable react/no-unknown-property */
import { AppProps } from 'next/app';
import { Big_Shoulders_Text, Inconsolata, Montserrat } from 'next/font/google';
import { CookiesProvider } from 'react-cookie';
import { api } from '@/utils/api';
import '@/styles/globals.css';

const sans = Montserrat({
    weight: ['400'],
    style: ['normal'],
    subsets: ['latin'],
    variable: '--font-sans',
});

const sansAlt = Big_Shoulders_Text({
    weight: ['400'],
    style: ['normal'],
    subsets: ['latin'],
    variable: '--font-sans-alt',
});

const mono = Inconsolata({
    weight: ['400'],
    style: ['normal'],
    subsets: ['latin'],
    variable: '--font-mono',
});

const App = ({ Component, pageProps }: AppProps) => (
    <>
        <style jsx global>
            {`
                :root {
                    --font-sans: ${sans.style.fontFamily};
                    --font-sans-alt: ${sansAlt.style.fontFamily};
                    --font-mono: ${mono.style.fontFamily};
                }
                `}
        </style>
        <CookiesProvider>
            <Component {...pageProps} />
        </CookiesProvider>
    </>
);

export default api.withTRPC(App);
