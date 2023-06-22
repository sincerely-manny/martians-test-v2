import Head from 'next/head';
import { PropsWithChildren } from 'react';
import scss from './main-layout.module.scss';

export default ({ children }: PropsWithChildren) => (
    <>
        <Head>
            <title>Test item for martians - v2 (vanilla)</title>
            <meta name="description" content="Test sing-in form" />
            <link rel="icon" href="/favicon.ico" />
            <link rel="manifest" href="/manifest.json" />
            <meta name="theme-color" content="rgb(100 116 139)" />
        </Head>
        <main className={scss['main-layout']}>
            {children}
        </main>
    </>
);
