import Image from 'next/image';
import { LogOutIcon } from 'lucide-react';
import { useRouter } from 'next/router';
import { useCookies } from 'react-cookie';
import MainLayout from '@/components/MainLayout';
import kitten from '@/../public/img/cute-kitten.jpg';
import Button from '@/components/Button';
import scss from '@/styles/pages/protected.module.scss';

export default () => {
    const router = useRouter();
    const removeCookie = useCookies(['x-access-token'])[2];
    return (
        <MainLayout>
            <div className={scss.content}>
                <h1 className={scss.heading}>
                    Congrats! You&apos;re authorized to see this adorable kitten!
                </h1>
                <Image
                    src={kitten}
                    alt="kitten"
                    width={600}
                    className={scss.image}
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
                >
                    <LogOutIcon className={scss.icon} />
                    {' '}
                    Sign out
                </Button>
            </div>
        </MainLayout>
    );
};
