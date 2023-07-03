import {
    Children,
    FormHTMLAttributes,
    cloneElement,
    isValidElement,
    useEffect,
    useMemo,
} from 'react';
import * as z from 'zod';
import debounce from 'lodash.debounce';
import scss from './form.module.scss';
import useForm from './useForm';

type FromProps<T extends z.AnyZodObject> = FormHTMLAttributes<HTMLFormElement> & {
    control: ReturnType<typeof useForm<T>>;
};

export default <T extends z.AnyZodObject>({ children, onSubmit, control }: FromProps<T>) => {
    const {
        formData, schema, setErrors, setIsSubmitted,
    } = control;

    const errorCheck = useMemo(() => (data: z.TypeOf<T>) => {
        const parsedData = schema.safeParse(data);
        if (!parsedData.success) {
            setErrors(parsedData.error.format() as z.ZodFormattedError<T>);
        } else {
            setErrors(null);
        }
    }, [schema, setErrors]);

    const errorCheckDebounced = useMemo(() => debounce(errorCheck, 100), [errorCheck]);

    useEffect(() => {
        errorCheckDebounced(formData);
    }, [errorCheckDebounced, formData, schema, setErrors]);

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
