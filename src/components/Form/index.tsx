import {
    Children,
    FormHTMLAttributes,
    HTMLAttributes,
    InputHTMLAttributes,
    LabelHTMLAttributes,
    PropsWithChildren,
    cloneElement,
    isValidElement,
    useEffect,
    useState,
} from 'react';
import * as z from 'zod';
import scss from './form.module.scss';

type UseFormParams<T extends z.AnyZodObject> = {
    schema: T;
    initialValues: z.infer<T>;
};

export const useForm = <T extends z.AnyZodObject>({ schema, initialValues }: UseFormParams<T>) => {
    const [formData, setFormData] = useState(initialValues);
    const [errors, setErrors] = useState<z.ZodFormattedError<T> | null>(null);
    const [touched, setTouched] = useState<Partial<Record<keyof z.infer<T>, boolean>>>({});
    return {
        schema,
        formData,
        setFormData,
        errors,
        setErrors,
        touched,
        setTouched,
    };
};

type FromProps<T extends z.AnyZodObject> = FormHTMLAttributes<HTMLFormElement> & {
    control: ReturnType<typeof useForm<T>>;
};

const Root = <T extends z.AnyZodObject>({
    children,
    onSubmit,
    control,
}: FromProps<T>) => {
    const {
        formData,
        schema,
        setErrors,
    } = control;

    useEffect(() => {
        const parsedData = schema.safeParse(formData);
        if (!parsedData.success) {
            setErrors(parsedData.error.format() as z.ZodFormattedError<T>);
        } else {
            setErrors(null);
        }
    }, [formData, schema, setErrors]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const parsedData = schema.safeParse(formData);
        if (!parsedData.success) {
            // console.log(parsedData.error);
        } else {
            // console.log(parsedData.data);
        }
        if (onSubmit) {
            onSubmit(e);
        }
    };
    return (
        <form className={scss.form} onSubmit={handleSubmit}>
            {Children.map(children, (child) => {
                if (
                    !isValidElement(child)
                    || (child?.type as () => void)?.name !== 'Item'

                ) {
                    return child;
                }
                return cloneElement(child, {
                    control,
                } as { control: ReturnType<typeof useForm<T>> });
            })}
        </form>
    );
};

type InputProps<T extends z.AnyZodObject> = InputHTMLAttributes<HTMLInputElement> & {
    control?: ReturnType<typeof useForm<T>>;
    name?: keyof z.infer<T>;
};

const Input = <T extends z.AnyZodObject>({
    type, className, name = undefined, control = undefined, onBlur, onChange,
}: InputProps<T>) => {
    if (!name) {
        throw new Error('Input must have a name');
    }
    if (!control) {
        throw new Error('Item must have a control');
    }
    const { formData, setFormData, setTouched } = control;
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [name]: e.target.value }));
        if (onChange) {
            onChange(e);
        }
    };
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        setTouched((prev) => ({ ...prev, [name]: true }));
        if (onBlur) {
            onBlur(e);
        }
    };
    return (
        <input
            type={type}
            name={name}
            className={`${scss.form__input || ''} ${className || ''}`}
            onChange={handleChange}
            onBlur={handleBlur}
            value={formData[name] || ''}
        />
    );
};

type LabelProps = LabelHTMLAttributes<HTMLLabelElement>;

const Label = ({ children, className, htmlFor }: LabelProps) => (
    <label className={`${scss.form__label || ''} ${className || ''}`} htmlFor={htmlFor}>{children}</label>
);

type MessageProps = HTMLAttributes<HTMLDivElement>;

const Message = ({ children }: MessageProps) => (
    <div className={scss.form__message}>{children}</div>
);

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
                return cloneElement(
                    child,
                    {
                        name, htmlFor: name, control,
                    } as InputHTMLAttributes<HTMLElement> & LabelHTMLAttributes<HTMLElement>,
                );
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
