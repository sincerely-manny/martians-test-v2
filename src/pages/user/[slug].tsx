import * as Tabs from '@radix-ui/react-tabs';
import throttle from 'lodash.throttle';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
    useEffect, useRef,
} from 'react';
import * as z from 'zod';
import scss from '@/styles/pages/user.module.scss';
import signInSchema from '@/lib/schema/signIn';
import MainLayout from '@/components/MainLayout';
import Form, { useForm } from '@/components/Form';
import Button from '@/components/Button';

export default () => {
    const router = useRouter();
    const { slug } = router.query;
    const cursorDiv = useRef<HTMLDivElement>(null);
    // const setCookie = useCookies(['x-access-token'])[1];

    const signInFormInitialData: z.infer<typeof signInSchema> = {
        login: '',
        password: '',
    };
    const signInForm = useForm({ schema: signInSchema, initialValues: signInFormInitialData });

    useEffect(() => {
        const cursor = cursorDiv.current;
        const mouseMoveHandler = throttle((e: MouseEvent) => {
            window.requestAnimationFrame(() => {
                if (cursor) {
                    cursor.style.transform = `translate(${e.pageX}px, ${e.pageY}px)`;
                }
            });
        }, 10);
        window.addEventListener('mousemove', mouseMoveHandler);
        return () => window.removeEventListener('mousemove', mouseMoveHandler);
    });

    return (
        <MainLayout>
            <div className={scss['background__cursor-shadow-container']}>
                <div
                    className={scss['cursor-shadow']}
                    ref={cursorDiv}
                >
                    <div className={scss.fill} />
                </div>
            </div>
            <div className={scss['background__blur-over-cursor-shadow']} />
            <div className={scss['background__fuzz-gif']} />
            <div className={scss.background__gradient} />
            <div className={scss['content-grid']}>
                <div className={scss.container}>
                    <Tabs.Root
                        value={slug?.toString() || 'sign-in'}
                        className={scss.tabs__root}
                    >
                        <h1 className={scss.tabs__navbar}>
                            LET&apos;S
                            {' '}
                            <nav>
                                <Link
                                    href="/user/sign-in"
                                    aria-selected={slug === 'sign-in' || !slug}
                                    className={scss.navlink}
                                >
                                    <span>SIGN IN</span>
                                    <div className={`${scss.underline || ''} ${scss.underline_end || ''}`} />
                                </Link>
                                {' '}
                                /
                                {' '}
                                <Link
                                    href="/user/sign-up"
                                    aria-selected={slug === 'sign-up'}
                                    className={scss.navlink}
                                >
                                    <span>SIGN UP</span>
                                    <div className={`${scss.underline || ''} ${scss.underline_start || ''}`} />
                                </Link>
                            </nav>
                        </h1>
                        <Tabs.Content
                            value="sign-in"
                            className={scss.tabs__content}
                            tabIndex={-1}
                        >
                            <Form.Root
                                control={signInForm}
                            >
                                <Form.Item name="login">
                                    <Form.Label>
                                        Login
                                        {' '}
                                        <Form.Message />
                                    </Form.Label>
                                    <Form.Input
                                        placeholder="mail@gmail.com"
                                        autoComplete="off"
                                        type="text"
                                    />
                                </Form.Item>
                                <Form.Item name="password">
                                    <Form.Label>
                                        Password
                                        {' '}
                                        <Form.Message />
                                    </Form.Label>
                                    <Form.Input
                                        placeholder="********"
                                        autoComplete="off"
                                        type="password"
                                    />
                                </Form.Item>
                                <Button
                                    type="submit"
                                    disabled={!!signInForm.errors}
                                >
                                    Submit
                                </Button>
                            </Form.Root>
                        </Tabs.Content>

                        <Tabs.Content
                            value="sign-up"
                            className={scss.tabs__content}
                            tabIndex={-1}
                        >
                            -
                        </Tabs.Content>
                    </Tabs.Root>
                </div>
            </div>
        </MainLayout>
    );
};
