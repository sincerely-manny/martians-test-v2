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
import { FormErrors } from './errors.type';

type FromProps<T extends z.Schema> = FormHTMLAttributes<HTMLFormElement> & {
    control: ReturnType<typeof useForm<T>>;
};

export default <T extends z.Schema>({ children, onSubmit, control }: FromProps<T>) => {
    const {
        formData, schema, setErrors, setIsSubmitted,
    } = control;

    const validate = useMemo(() => (data: z.TypeOf<T>) => {
        const parsedData = schema.safeParse(data);
        if (!parsedData.success) {
            const errors: FormErrors<T> = {};
            Object.entries(parsedData.error.format()).forEach(([key, value]) => {
                const v = value as z.ZodFormattedError<T>;
                // eslint-disable-next-line no-underscore-dangle
                if (v && v._errors && key !== '_errors') {
                    // eslint-disable-next-line no-underscore-dangle
                    errors[key as keyof z.infer<T>] = v._errors;
                }
            });
            setErrors(errors);
        } else {
            setErrors(null);
        }
    }, [schema, setErrors]);

    const validateDebounced = useMemo(() => debounce(validate, 100), [validate]);

    useEffect(() => {
        validateDebounced(formData);
    }, [validateDebounced, formData, schema, setErrors]);

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
