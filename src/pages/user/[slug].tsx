import { zodResolver } from '@hookform/resolvers/zod';
import * as Tabs from '@radix-ui/react-tabs';
import debounce from 'lodash.debounce';
import throttle from 'lodash.throttle';
import { CheckCircle, Disc3, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
    useCallback, useEffect, useRef, useState,
} from 'react';
import { useCookies } from 'react-cookie';
import { useForm, useWatch } from 'react-hook-form';
import * as z from 'zod';
import { api } from '@/utils/api';
import signUpSchema from '@/lib/schema/signUp';
import signInSchema from '@/lib/schema/signIn';
import { Input } from '@/components/ui/Input';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/Form';
import { Button } from '@/components/ui/Button';
import MainLayout from '@/components/MainLayout';
import scss from '@/styles/pages/user.module.scss';

export default () => {
    const router = useRouter();
    const { slug } = router.query;
    const cursorDiv = useRef<HTMLDivElement>(null);
    const setCookie = useCookies(['x-access-token'])[1];
    const [isSuccess, setIsSuccess] = useState(false);

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

    const signInForm = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            login: '',
            password: '',
        },
    });
    const [signInFormDisabled, setSignInFormDisabled] = useState(false);
    const signInQuery = api.user.signIn.useMutation();
    useEffect(() => {
        if (signInQuery.isError) {
            const errors = signInQuery.error?.data?.zodError?.fieldErrors;
            if (errors?.login) {
                signInForm.setError('login', { message: errors.login.join(', ') });
            }
            if (errors?.password) {
                signInForm.setError('password', { message: errors.password.join(', ') });
            }
            if (signInQuery.error?.data?.code === 'UNAUTHORIZED') {
                signInForm.setError('root', { message: 'Invalid login or password' });
            }
        }
    }, [
        signInForm,
        signInQuery.error?.data?.code,
        signInQuery.error?.data?.zodError?.fieldErrors,
        signInQuery.isError,
        signInQuery.status,
    ]);
    useEffect(() => {
        setSignInFormDisabled(signInQuery.isLoading || isSuccess);
    }, [isSuccess, signInQuery.isLoading]);
    const onSingInSubmit = (data: z.infer<typeof signInSchema>) => {
        const { login, password } = data;
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

    const signUpForm = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: '',
            password: '',
            passwordConfirmation: '',
            email: '',
        },
    });
    const [signUpFormDisabled, setSignUpFormDisabled] = useState(false);
    const signUpQuery = api.user.signUp.useMutation();

    useEffect(() => {
        setSignUpFormDisabled(signUpQuery.isLoading || isSuccess);
    }, [isSuccess, signUpQuery.isLoading]);
    const onSingUpSubmit = (data: z.infer<typeof signUpSchema>) => {
        const {
            username, email, password, passwordConfirmation,
        } = data;
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

    const { email, username } = useWatch(signUpForm);

    const [debouncedEmail, setDebouncedEmail] = useState(email);
    const [debouncedUsername, setDebouncedUsername] = useState(username);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedSetDebouncedEmail = useCallback(debounce(setDebouncedEmail, 500), []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedSetDebouncedUsername = useCallback(debounce(setDebouncedUsername, 500), []);

    useEffect(() => {
        debouncedSetDebouncedEmail(email);
        debouncedSetDebouncedUsername(username);
    }, [debouncedSetDebouncedEmail, debouncedSetDebouncedUsername, email, username]);

    const checkUniqueEmail = api.user.checkUnique.useQuery({ email: debouncedEmail });
    const checkUniqueUsername = api.user.checkUnique.useQuery({ username: debouncedUsername });

    useEffect(() => {
        signUpForm.clearErrors('email');
        signUpForm.clearErrors('username');
        if (
            signUpQuery.isError
            || checkUniqueEmail.data?.email
            || checkUniqueUsername.data?.username
        ) {
            const errors = signUpQuery.error?.data?.zodError?.fieldErrors;
            if (errors?.email || checkUniqueEmail.data?.email) {
                const message: string[] = [];
                if (errors?.email) {
                    message.concat(errors.email);
                }
                if (checkUniqueEmail.data?.email) {
                    message.push('is already registered');
                }
                signUpForm.control.setError('email', { message: message.join(', ') });
            }
            if (errors?.username || checkUniqueUsername.data?.username) {
                const message: string[] = [];
                if (errors?.username) {
                    message.concat(errors.username);
                }
                if (checkUniqueUsername.data?.username) {
                    message.push('is already taken');
                }
                signUpForm.setError('username', { message: message.join(', ') });
            }
            if (errors?.password) {
                signUpForm.setError('password', { message: errors.password.join(', ') });
            }
            if (errors?.passwordConfirmation) {
                signUpForm.setError('passwordConfirmation', {
                    message: errors.passwordConfirmation.join(', '),
                });
            }
        }
    }, [
        checkUniqueEmail.data?.email,
        checkUniqueUsername.data?.username,
        signUpForm,
        signUpQuery.error?.data?.zodError?.fieldErrors,
        signUpQuery.isError,
        signUpQuery.status,
    ]);

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
                        className="w-full min-w-fit max-w-lg transition-all sm:w-1/2"
                    >
                        <h1 className="mb-10 w-full text-right text-2xl md:text-6xl xl:text-8xl">
                            LET&apos;S
                            {' '}
                            <nav>
                                <Link
                                    href="/user/sign-in"
                                    aria-selected={slug === 'sign-in' || !slug}
                                    className="group inline-flex flex-col opacity-50 transition-all duration-500 ease-in aria-selected:opacity-100"
                                >
                                    <span>SIGN IN</span>
                                    <div className="h-1 w-0 self-end bg-slate-700 transition-all duration-500 ease-in group-aria-selected:w-full" />
                                </Link>
                                {' '}
                                /
                                {' '}
                                <Link
                                    href="/user/sign-up"
                                    aria-selected={slug === 'sign-up'}
                                    className="group inline-flex flex-col opacity-50 transition-all duration-500 ease-in aria-selected:opacity-100"
                                >
                                    <span>SIGN UP</span>
                                    <div className="h-1 w-0 self-start bg-slate-700 transition-all duration-500 ease-in group-aria-selected:w-full" />
                                </Link>
                            </nav>
                        </h1>
                        <Tabs.Content
                            value="sign-in"
                            className="w-full origin-top-left data-[state=active]:animate-tab-show data-[state=inactive]:animate-tab-hide"
                        >
                            <Form {...signInForm}>
                                <form
                                    onSubmit={
                                        (e) => void signInForm.handleSubmit(onSingInSubmit)(e)
                                    }
                                    className="group w-full space-y-8"
                                    data-loading={signInForm.formState.isSubmitting}
                                >
                                    <FormField
                                        control={signInForm.control}
                                        name="login"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Login
                                                    {' '}
                                                    <FormMessage className="text-red-700" />
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="mail@gmail.com"
                                                        autoComplete="off"
                                                        aria-disabled={signInFormDisabled}
                                                        disabled={signInFormDisabled}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription className="text-xs opacity-70">
                                                    E-mail or username
                                                </FormDescription>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={signInForm.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Password
                                                    {' '}
                                                    <FormMessage className="text-red-700" />
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="********"
                                                        autoComplete="off"
                                                        type="password"
                                                        aria-disabled={signInFormDisabled}
                                                        disabled={signInFormDisabled}
                                                        {...field}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <Button
                                        type="submit"
                                        aria-disabled={
                                            signInFormDisabled
                                            || !!signInForm.formState.errors.login
                                            || !!signInForm.formState.errors.password
                                        }
                                        disabled={
                                            signInFormDisabled
                                            || !!signInForm.formState.errors.login
                                            || !!signInForm.formState.errors.password
                                        }
                                    >
                                        Submit
                                    </Button>
                                    {signInQuery.isLoading && (
                                        <Disc3
                                            className="ml-5 inline animate-spin align-top"
                                            size={60}
                                        />
                                    )}
                                    {isSuccess && <CheckCircle size={60} className="inline align-top text-emerald-600 animate-ping ml-5" />}
                                    <span className="float-right text-red-700">
                                        {signInForm.formState.errors.root?.message}
                                    </span>
                                </form>
                            </Form>
                        </Tabs.Content>

                        <Tabs.Content
                            value="sign-up"
                            className="w-full origin-top-left data-[state=active]:animate-tab-show data-[state=inactive]:animate-tab-hide"
                        >
                            <Form {...signUpForm}>
                                <form
                                    onSubmit={
                                        (e) => void signUpForm.handleSubmit(onSingUpSubmit)(e)
                                    }
                                    className="group w-full space-y-8"
                                    data-loading={signUpForm.formState.isSubmitting}
                                >
                                    <FormField
                                        control={signUpForm.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Email
                                                    {' '}
                                                    <FormMessage className="text-red-700" />
                                                </FormLabel>
                                                <div className="grid grid-cols-[1fr_2rem] items-center">
                                                    <FormControl>
                                                        <Input
                                                            placeholder="mail@gmail.com"
                                                            autoComplete="off"
                                                            aria-disabled={signUpFormDisabled}
                                                            disabled={signUpFormDisabled}
                                                            {...field}
                                                            className="col-span-2 col-start-1 row-span-1 row-start-1"
                                                        />
                                                    </FormControl>
                                                    {checkUniqueEmail.isFetching && (
                                                        <Loader2 className="col-start-2 row-start-1 animate-spin" />
                                                    )}
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={signUpForm.control}
                                        name="username"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Username
                                                    {' '}
                                                    <FormMessage className="text-red-700" />
                                                </FormLabel>
                                                <div className="grid grid-cols-[1fr_2rem] items-center">
                                                    <FormControl>
                                                        <Input
                                                            autoComplete="off"
                                                            aria-disabled={signUpFormDisabled}
                                                            disabled={signUpFormDisabled}
                                                            {...field}
                                                            className="col-span-2 col-start-1 row-span-1 row-start-1"
                                                        />
                                                    </FormControl>
                                                    {checkUniqueUsername.isFetching && (
                                                        <Loader2 className="col-start-2 row-start-1 animate-spin" />
                                                    )}
                                                </div>
                                                <FormDescription className="text-xs opacity-70">
                                                    1-50 characters, starts with a letter, only
                                                    letters and numbers
                                                </FormDescription>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={signUpForm.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Password
                                                    {' '}
                                                    <FormMessage className="text-red-700" />
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="********"
                                                        autoComplete="off"
                                                        type="password"
                                                        aria-disabled={signUpFormDisabled}
                                                        disabled={signUpFormDisabled}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription className="text-xs opacity-70">
                                                    8-50 characters
                                                </FormDescription>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={signUpForm.control}
                                        name="passwordConfirmation"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Password confirmation
                                                    {' '}
                                                    <FormMessage className="text-red-700" />
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="one more time"
                                                        autoComplete="off"
                                                        type="password"
                                                        aria-disabled={signUpFormDisabled}
                                                        disabled={signUpFormDisabled}
                                                        {...field}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <Button
                                        type="submit"
                                        aria-disabled={
                                            signUpFormDisabled
                                            || !!signUpForm.formState.errors.email
                                            || !!signUpForm.formState.errors.password
                                            || !!signUpForm.formState.errors.passwordConfirmation
                                            || !!signUpForm.formState.errors.username
                                        }
                                        disabled={
                                            signUpFormDisabled
                                            || !!signUpForm.formState.errors.email
                                            || !!signUpForm.formState.errors.password
                                            || !!signUpForm.formState.errors.passwordConfirmation
                                            || !!signUpForm.formState.errors.username
                                        }
                                    >
                                        Submit
                                    </Button>
                                    {signUpQuery.isLoading && (
                                        <Disc3
                                            className="ml-5 inline animate-spin align-top"
                                            size={60}
                                        />
                                    )}
                                    {isSuccess && <CheckCircle size={60} className="inline align-top text-emerald-600 animate-ping ml-5" />}
                                </form>
                            </Form>
                        </Tabs.Content>
                    </Tabs.Root>
                </div>
            </div>
        </MainLayout>
    );
};
