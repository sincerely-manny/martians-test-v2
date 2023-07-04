import * as z from 'zod';

export type FormErrors<T extends z.Schema> = Partial<Record<keyof z.infer<T> | 'root', string[]>>;
