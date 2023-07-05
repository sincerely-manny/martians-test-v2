import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';
import * as z from 'zod';
import debounce from 'lodash.debounce';
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

    const validate = useCallback((data: z.TypeOf<T>) => {
        const parsedData = schema.safeParse(data);
        if (!parsedData.success) {
            const validationErrors: FormErrors<T> = {};
            Object.entries(parsedData.error.format()).forEach(([key, value]) => {
                const v = value as z.ZodFormattedError<T>;
                // eslint-disable-next-line no-underscore-dangle
                if (v && v._errors && key !== '_errors') {
                    // eslint-disable-next-line no-underscore-dangle
                    validationErrors[key as keyof z.infer<T>] = v._errors;
                }
            });
            setErrors(validationErrors);
        } else {
            setErrors(null);
        }
    }, [schema]);

    const validateDebounced = useMemo(() => debounce(validate, 100), [validate]);

    useEffect(() => {
        validateDebounced(formData);
    }, [formData, validateDebounced]);

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
        validate,
        validateDebounced,
    };
};

export default useForm;
