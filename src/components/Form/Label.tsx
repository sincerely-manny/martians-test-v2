import {
    Children,
    LabelHTMLAttributes,
    cloneElement,
    isValidElement,
} from 'react';
import * as z from 'zod';
import scss from './form.module.scss';
import useForm from './useForm';

type LabelProps<T extends z.Schema> = LabelHTMLAttributes<HTMLLabelElement> & {
    control?: ReturnType<typeof useForm<T>>;
    name?: keyof z.infer<T>;
};

export default <T extends z.Schema>({
    children,
    className,
    htmlFor,
    name = undefined,
    control = undefined,
    itemID,
}: LabelProps<T>) => {
    if (!name) {
        throw new Error('Label must have a name');
    }
    if (!control) {
        throw new Error('Label must have a control');
    }
    return (
        <label className={`${scss.form__label || ''} ${className || ''}`} htmlFor={htmlFor} id={`label-${itemID || ''}`}>
            {Children.map(children, (child) => {
                if (!isValidElement(child)) {
                    return child;
                }
                return cloneElement(child, {
                    name,
                    htmlFor: name,
                    control,
                } as LabelHTMLAttributes<HTMLElement>);
            })}
        </label>
    );
};
