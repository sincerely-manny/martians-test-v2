import * as z from 'zod';

export default z.object({
    login: z
        .string({
            required_error: 'is required',
            invalid_type_error: 'must be a string',
        })
        .min(1, 'is required')
        .max(50, "isn't supposed to be longer than 50 characters"),
    password: z
        .string({
            required_error: 'is required',
            invalid_type_error: 'must be a string',
        })
        .min(8, 'is too short')
        .max(50, "can't be longer than 50 characters"),
});
