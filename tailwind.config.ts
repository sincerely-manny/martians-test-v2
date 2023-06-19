/* eslint-disable global-require */
import { type Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';

export default {
    content: ['./src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            transitionTimingFunction: {
                elastic: 'cubic-bezier(.75,-0.5,0,1.75)',
            },
            fontFamily: {
                mono: ['var(--font-mono)', ...fontFamily.mono],
                sans: ['var(--font-sans)', ...fontFamily.sans],
                sansAlt: ['var(--font-sans-alt)', ...fontFamily.serif],
            },
            keyframes: {
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-accordion-content-height)' },
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' },
                },
                'gradient-flow': {
                    '0%, 100%': { transform: 'translate(0%, 0%)' },
                    '25%': { transform: 'translate(-50%, 0%)' },
                    '50%': { transform: 'translate(-50%, -50%)' },
                    '75%': { transform: 'translate(0%, -50%)' },
                },
                shakeX: {
                    'from, to': { transform: 'translate3d(0, 0, 0)' },
                    '10%, 30%, 50%, 70%, 90%': { transform: 'translate3d(-10px, 0, 0)' },
                    '20%, 40%, 60%, 80%': { transform: 'translate3d(10px, 0, 0)' },
                },
                tabHide: {
                    from: { opacity: '1', maxHeight: '1000px' },
                    to: { opacity: '0', maxHeight: '0' },
                },
                tabShow: {
                    from: { opacity: '0', maxHeight: '0' },
                    to: { opacity: '1', maxHeight: '1000px' },
                },
                fadeIn: {
                    from: { opacity: '0' },
                    to: { opacity: '1' },
                },
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
                'gradient-flow': 'gradient-flow 5s infinite',
                'shake-x': 'shakeX 0.5s ease-in-out',
                'tab-show': 'tabShow 0.5s ease-out',
                'tab-hide': 'tabHide 0.5s ease-out',
                'fade-in': 'fadeIn 1s ease-out',
            },
            data: {
                loading: 'loading~="true"',
            },
            transitionDuration: {
                5000: '5000ms',
            },
        },
    },
    // eslint-disable-next-line global-require
    plugins: [
        require('tailwindcss-animate'),
        require('@thoughtbot/tailwindcss-aria-attributes'),
    ],
} satisfies Config;
