import {
    HTMLAttributes,
} from 'react';
import * as z from 'zod';
import scss from './form.module.scss';
import useForm from './useForm';

type MessageProps<T extends z.AnyZodObject> = HTMLAttributes<HTMLDivElement> & {
    control?: ReturnType<typeof useForm<T>>;
    name?: keyof z.infer<T>;
};

export default <T extends z.AnyZodObject>({
    children,
    control = undefined,
    name = undefined,
}: MessageProps<T>) => {
    if (!name) {
        throw new Error('Message must have a name');
    }
    if (!control) {
        throw new Error('Message must have a control');
    }
    const errors = control.errors
    // eslint-disable-next-line no-underscore-dangle
        ? (control.errors[name] as z.ZodFormattedError<T> | undefined)?._errors.join(', ') : null;
    const touched = control.touched[name];
    return (
        <span className={scss.form__message}>
            {children}
            {' '}
            {errors && (touched || control.isSubmitted) && <span>{errors}</span>}
        </span>
    );
};
