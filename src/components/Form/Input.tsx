import {
    InputHTMLAttributes,
} from 'react';
import * as z from 'zod';
import scss from './form.module.scss';
import useForm from './useForm';

type InputProps<T extends z.Schema> = InputHTMLAttributes<HTMLInputElement> & {
    control?: ReturnType<typeof useForm<T>>;
    name?: keyof z.infer<T>;
};

export default <T extends z.Schema>({
    type,
    className,
    name = undefined,
    control = undefined,
    onBlur,
    onChange,
    placeholder,
    autoComplete,
    itemID,
}: InputProps<T>) => {
    if (!name) {
        throw new Error('Input must have a name');
    }
    if (!control) {
        throw new Error('Input must have a control');
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
            id={`input-${itemID || name}`}
            placeholder={placeholder}
            autoComplete={autoComplete}
            className={`${scss.form__input || ''} ${className || ''}`}
            onChange={handleChange}
            onBlur={handleBlur}
            value={formData[name] || ''}
            disabled={control.disabled}
            aria-disabled={control.disabled}
            aria-invalid={!!(control.errors && control.errors[name]) && control.touched[name]}
            aria-labelledby={`label-${itemID || name}`}
            aria-describedby={`description-${itemID || name}`}
            aria-placeholder={placeholder}
        />
    );
};
