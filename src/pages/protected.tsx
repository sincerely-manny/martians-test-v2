import Image from 'next/image';
import { LogOutIcon } from 'lucide-react';
import { useRouter } from 'next/router';
import { useCookies } from 'react-cookie';
import MainLayout from '@/components/MainLayout';
import kitten from '@/../public/img/cute-kitten.jpg';
import Button from '@/components/Button';

export default () => {
    const router = useRouter();
    const removeCookie = useCookies(['x-access-token'])[2];
    return (
        <MainLayout>
            <div className="flex flex-col items-center justify-center animate-fade-in py-20">
                <h1 className="text-4xl mb-20">Congrats! You&apos;re authorized to see this adorable kitten!</h1>
                <Image
                    src={kitten}
                    alt="kitten"
                    width={600}
                    className="w-[600px] max-w-full rounded-xl object-fill animate-bounce"
                    placeholder="blur"
                />
                <Button
                    onClick={() => {
                        removeCookie('x-access-token');
                        router.push('/').catch(() => {
                        // eslint-disable-next-line no-console
                            console.log('Error routing to /');
                        });
                    }}
                    className="mt-5"
                >
                    <LogOutIcon className="inline align-text-bottom" />
                    {' '}
                    Sign out
                </Button>
            </div>
        </MainLayout>
    );
};
