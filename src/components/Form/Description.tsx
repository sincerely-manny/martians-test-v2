import { HTMLProps } from 'react';
import scss from './form.module.scss';

type DescriptionProps = HTMLProps<HTMLParagraphElement>;

export default ({ children, itemID }: DescriptionProps) => (
    <p className={scss.form__description} id={`description-${itemID || ''}`}>
        {children}
    </p>
);
