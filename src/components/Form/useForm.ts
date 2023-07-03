import {
    useState,
} from 'react';
import * as z from 'zod';

type UseFormParams<T extends z.AnyZodObject> = {
    schema: T;
    initialValues: z.infer<T>;
};

const useForm = <T extends z.AnyZodObject>({ schema, initialValues }: UseFormParams<T>) => {
    const [formData, setFormData] = useState(initialValues);
    const [errors, setErrors] = useState<z.ZodFormattedError<T> | null>(null);
    const [touched, setTouched] = useState<Partial<Record<keyof z.infer<T>, boolean>>>({});
    const [isSubmitted, setIsSubmitted] = useState(false);

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
    };
};

export default useForm;
