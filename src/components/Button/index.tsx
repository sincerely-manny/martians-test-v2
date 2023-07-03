import { ButtonHTMLAttributes } from 'react';
import scss from './button.module.scss';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    type?: 'button' | 'submit';
};

export default ({
    children, type = 'button', className, disabled,
}: ButtonProps) => (
    <button
        type={type === 'submit' ? 'submit' : 'button'}
        className={`${scss.button || ''} ${className || ''}`}
        disabled={disabled}
    >
        <div className={scss.button__background} />
        <div className={scss.button__content}>{children}</div>
    </button>
);
