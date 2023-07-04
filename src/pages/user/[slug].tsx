import * as Tabs from '@radix-ui/react-tabs';
import throttle from 'lodash.throttle';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { useCookies } from 'react-cookie';
import { CheckCircle, Disc3 } from 'lucide-react';
import scss from '@/styles/pages/user.module.scss';
import signInSchema from '@/lib/schema/signIn';
import MainLayout from '@/components/MainLayout';
import Form from '@/components/Form';
import Button from '@/components/Button';
import useForm from '@/components/Form/useForm';
import { api } from '@/utils/api';
import signUpSchema from '@/lib/schema/signUp';

export default () => {
    const router = useRouter();
    const { slug } = router.query;
    const cursorDiv = useRef<HTMLDivElement>(null);
    const setCookie = useCookies(['x-access-token'])[1];
    const [isSuccess, setIsSuccess] = useState(false);

    const signInForm = useForm({
        schema: signInSchema,
        initialValues: {
            login: '',
            password: '',
        },
    });
    const signInQuery = api.user.signIn.useMutation();
    const handleSignInFormSubmit = () => {
        const { login, password } = signInForm.formData;
        signInQuery
            .mutateAsync({ login, password })
            .then((user) => {
                setIsSuccess(true);
                setCookie('x-access-token', user.token, { path: '/' });
                router.push('/protected').catch(() => {
                    // eslint-disable-next-line no-console
                    console.log('Error redirecting to /protected');
                });
            })
            .catch(() => {});
    };
    useEffect(() => {
        signInForm.setDisabled(signInQuery.isLoading);
    }, [signInForm, signInQuery.isLoading]);

    useEffect(() => {
        if (signInQuery.isError) {
            const errors = signInQuery.error?.data?.zodError?.fieldErrors;
            if (errors?.login) {
                signInForm.setError('login', errors.login);
            }
            if (errors?.password) {
                signInForm.setError('password', errors.password);
            }
            if (signInQuery.error?.data?.code === 'UNAUTHORIZED') {
                signInForm.setError('root', ['Invalid login or password']);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        signInQuery.error?.data?.code,
        signInQuery.error?.data?.zodError?.fieldErrors,
        signInQuery.isError,
    ]);

    const signUpForm = useForm({
        schema: signUpSchema,
        initialValues: {
            username: '',
            password: '',
            passwordConfirmation: '',
            email: '',
        },
    });
    const signUpQuery = api.user.signUp.useMutation();
    const handleSignUpFormSubmit = () => {
        const {
            username, email, password, passwordConfirmation,
        } = signUpForm.formData;
        signUpQuery
            .mutateAsync({
                username,
                email,
                password,
                passwordConfirmation,
            })
            .then((user) => {
                setIsSuccess(true);
                setCookie('x-access-token', user.token, { path: '/' });
                router.push('/protected').catch(() => {
                    // eslint-disable-next-line no-console
                    console.log('Error redirecting to /protected');
                });
            })
            .catch(() => {});
    };

    useEffect(() => {
        if (isSuccess) {
            signInForm.setDisabled(true);
        }
    }, [isSuccess, signInForm]);

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
                <div className={scss['cursor-shadow']} ref={cursorDiv}>
                    <div className={scss.fill} />
                </div>
            </div>
            <div className={scss['background__blur-over-cursor-shadow']} />
            <div className={scss['background__fuzz-gif']} />
            <div className={scss.background__gradient} />
            <div className={scss['content-grid']}>
                <div className={scss.container}>
                    <Tabs.Root value={slug?.toString() || 'sign-in'} className={scss.tabs__root}>
                        <nav>
                            <h1 className={scss.tabs__navbar}>
                                LET&apos;S
                                {' '}
                                <Link
                                    href="/user/sign-in"
                                    aria-selected={slug === 'sign-in' || !slug}
                                    className={scss.navlink}
                                >
                                    <span>SIGN IN</span>
                                    <div
                                        className={`${scss.underline || ''} ${
                                            scss.underline_end || ''
                                        }`}
                                    />
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
                                    <div
                                        className={`${scss.underline || ''} ${
                                            scss.underline_start || ''
                                        }`}
                                    />
                                </Link>
                            </h1>
                        </nav>
                        <Tabs.Content value="sign-in" className={scss.tabs__content} tabIndex={-1}>
                            <Form.Root control={signInForm} onSubmit={handleSignInFormSubmit}>
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
                                    <Form.Description>
                                        E-mail or username
                                    </Form.Description>
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
                                    disabled={!!signInForm.errors || signInForm.disabled}
                                >
                                    Submit
                                </Button>
                                {signInQuery.isLoading && (
                                    <Disc3
                                        className={`${scss['form__state-icon'] || ''} ${
                                            scss['form__state-icon_loading'] || ''
                                        }`}
                                        size={60}
                                    />
                                )}
                                {isSuccess && (
                                    <CheckCircle
                                        size={60}
                                        className={`${scss['form__state-icon'] || ''} ${
                                            scss['form__state-icon_success'] || ''
                                        }`}
                                    />
                                )}
                                <span className={scss['form__state-message']}>
                                    {signInForm.errors?.root?.join(', ')}
                                </span>
                            </Form.Root>
                        </Tabs.Content>

                        <Tabs.Content value="sign-up" className={scss.tabs__content} tabIndex={-1}>
                            <Form.Root control={signUpForm} onSubmit={handleSignUpFormSubmit}>
                                <Form.Item name="email">
                                    <Form.Label>
                                        Email
                                        {' '}
                                        <Form.Message />
                                    </Form.Label>
                                    <Form.Input
                                        placeholder="mail@gmail.com"
                                        autoComplete="off"
                                        type="text"
                                    />
                                </Form.Item>
                                <Form.Item name="username">
                                    <Form.Label>
                                        Username
                                        {' '}
                                        <Form.Message />
                                    </Form.Label>
                                    <Form.Input type="text" autoComplete="off" />
                                    <Form.Description>
                                        1-50 characters, starts with a letter, only letters and
                                        numbers
                                    </Form.Description>
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
                                    <Form.Description>
                                        8-50 characters
                                    </Form.Description>
                                </Form.Item>
                                <Form.Item name="passwordConfirmation">
                                    <Form.Label>
                                        Password confirmation
                                        {' '}
                                        <Form.Message />
                                    </Form.Label>
                                    <Form.Input
                                        placeholder="one more time"
                                        autoComplete="off"
                                        type="password"
                                    />
                                </Form.Item>
                                <Button
                                    type="submit"
                                    disabled={!!signUpForm.errors || signUpForm.disabled}
                                >
                                    Submit
                                </Button>
                                {signUpQuery.isLoading && (
                                    <Disc3
                                        className={`${scss['form__state-icon'] || ''} ${
                                            scss['form__state-icon_loading'] || ''
                                        }`}
                                        size={60}
                                    />
                                )}
                                {isSuccess && (
                                    <CheckCircle
                                        size={60}
                                        className={`${scss['form__state-icon'] || ''} ${
                                            scss['form__state-icon_success'] || ''
                                        }`}
                                    />
                                )}
                                <span className={scss['form__state-message']}>
                                    {signUpForm.errors?.root?.join(', ')}
                                </span>
                            </Form.Root>
                        </Tabs.Content>
                    </Tabs.Root>
                </div>
            </div>
        </MainLayout>
    );
};
