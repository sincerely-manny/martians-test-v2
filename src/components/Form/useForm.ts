import {
    useState,
} from 'react';
import * as z from 'zod';
import { FormErrors } from './errors.type';

type UseFormParams<T extends z.Schema> = {
    schema: T;
    initialValues: z.infer<T>;
};

const useForm = <T extends z.Schema>({ schema, initialValues }: UseFormParams<T>) => {
    const [formData, setFormData] = useState(initialValues);
    const [errors, setErrors] = useState<FormErrors<T> | null>(null);
    const [touched, setTouched] = useState<Partial<Record<keyof z.infer<T>, boolean>>>({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [disabled, setDisabled] = useState(false);

    const setError = (
        field: keyof FormErrors<T>,
        messages: string[],
    ) => setErrors({ ...errors as FormErrors<T>, [field]: messages });

    return {
        schema,
        formData,
        setFormData,
        errors,
        setErrors,
        touched,
        setTouched,
        isSubmitted,
        setIsSubmitted,
        disabled,
        setDisabled,
        setError,
    };
};

export default useForm;
