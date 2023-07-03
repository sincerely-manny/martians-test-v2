import {
    Children,
    LabelHTMLAttributes,
    PropsWithChildren,
    cloneElement,
    isValidElement,
} from 'react';
import * as z from 'zod';
import Input from './Input';
import useForm from './useForm';
import Root from './Root';
import Label from './Label';
import Message from './Message';
import scss from './form.module.scss';

type ItemProps<T extends z.AnyZodObject> = PropsWithChildren & {
    name: keyof z.infer<T>;
    control?: ReturnType<typeof useForm<T>>;
};

const Item = <T extends z.AnyZodObject>({ children, name, control = undefined }: ItemProps<T>) => {
    if (!control) {
        throw new Error('Item must have a control');
    }
    return (
        <div className={scss.form__item}>
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
        </div>
    );
};

export default {
    Root,
    Input,
    Label,
    Message,
    Item,
};
