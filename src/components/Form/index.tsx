import {
    Children,
    LabelHTMLAttributes,
    PropsWithChildren,
    cloneElement,
    isValidElement,
    useId,
} from 'react';
import * as z from 'zod';
import Input from './Input';
import useForm from './useForm';
import Root from './Root';
import Label from './Label';
import Message from './Message';
import Description from './Description';
import scss from './form.module.scss';

type ItemProps<T extends z.Schema> = PropsWithChildren & {
    name: keyof z.infer<T>;
    control?: ReturnType<typeof useForm<T>>;
};

const Item = <T extends z.Schema>({ children, name, control = undefined }: ItemProps<T>) => {
    if (!control) {
        throw new Error('Item must have a control');
    }
    const itemID = useId();
    return (
        <div className={scss.form__item} id={`item-${itemID}`}>
            {Children.map(children, (child) => {
                if (!isValidElement(child)) {
                    return child;
                }
                return cloneElement(child, {
                    name,
                    htmlFor: name,
                    control,
                    itemID,
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
    Description,
};
