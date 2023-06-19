import { createHash, randomBytes } from 'crypto';

const encode = (str: string, salt: string | undefined = undefined) => {
    const usedSalt = salt || randomBytes(16).toString('hex');
    const buffer = Buffer.from(`${usedSalt}${str}`);
    const hash = createHash('sha256').update(buffer).digest('hex');
    return { hash, salt: usedSalt };
};

const compare = (str: string, hash: string, salt: string) => hash === encode(str, salt).hash;

export default { encode, compare };
