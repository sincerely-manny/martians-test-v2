import {
    Children,
    FormHTMLAttributes,
    cloneElement,
    isValidElement,
} from 'react';
import * as z from 'zod';
import scss from './form.module.scss';
import useForm from './useForm';

type FromProps<T extends z.Schema> = FormHTMLAttributes<HTMLFormElement> & {
    control: ReturnType<typeof useForm<T>>;
};

export default <T extends z.Schema>({ children, onSubmit, control }: FromProps<T>) => {
    const {
        formData, schema, setIsSubmitted,
    } = control;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitted(true);
        const parsedData = schema.safeParse(formData);
        if (!parsedData.success) {
            return;
        }
        if (onSubmit) {
            onSubmit(e);
        }
    };

    return (
        <form className={scss.form} onSubmit={handleSubmit}>
            {Children.map(children, (child) => {
                if (!isValidElement(child) || (child?.type as () => void)?.name !== 'Item') {
                    return child;
                }
                return cloneElement(child, {
                    control,
                } as { control: ReturnType<typeof useForm<T>> });
            })}
        </form>
    );
};
