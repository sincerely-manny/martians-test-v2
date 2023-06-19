import Head from 'next/head';
import { PropsWithChildren } from 'react';

export default ({ children }: PropsWithChildren) => (
    <>
        <Head>
            <title>Test item for martians</title>
            <meta name="description" content="Test sing-in form" />
            <link rel="icon" href="/favicon.ico" />
            <link rel="manifest" href="/manifest.json" />
            <meta name="theme-color" content="rgb(100 116 139)" />
        </Head>
        <main className="grid min-h-screen grid-cols-1 items-stretch bg-slate-300">
            {children}
        </main>
    </>
);
