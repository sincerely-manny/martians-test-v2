import * as z from 'zod';

export default z.object({
    username: z
        .string({
            required_error: 'is required',
            invalid_type_error: 'must be a string',
        })
        .min(1, 'is required')
        .max(50, 'isn\'t supposed to be longer than 50 characters')
        .regex(/^[a-zA-Z0-9]+$/, 'can\'t contain special characters')
        .regex(/^[a-zA-Z]+$/, 'must start with a letter'),
    password: z
        .string({
            required_error: 'is required',
            invalid_type_error: 'must be a string',
        })
        .min(8, 'is too short')
        .max(50, 'can\'t be longer than 50 characters'),
    passwordConfirmation: z
        .string(),
    email: z
        .string()
        .email({ message: 'is not a valid adress' }),
}).refine((data) => data.password === data.passwordConfirmation, {
    message: 'doesn\'t match password',
    path: ['passwordConfirmation'],
});
