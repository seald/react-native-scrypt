import { Buffer } from 'buffer';
import ReactNativeScrypt from './NativeReactNativeScrypt';

type Encoding = 'hex' | 'base64' | 'buffer';

async function scrypt(
  passwd: string,
  salt: string,
  N?: number,
  r?: number,
  p?: number,
  dkLen?: number,
  encoding?: 'hex' | 'base64'
): Promise<string>;

async function scrypt(
  passwd: Buffer,
  salt: Buffer,
  N?: number,
  r?: number,
  p?: number,
  dkLen?: number,
  encoding?: 'buffer'
): Promise<Buffer>;

async function scrypt(
  passwd: string | Buffer,
  salt: string | Buffer,
  N: number = 16384,
  r: number = 8,
  p: number = 1,
  dkLen: number = 64,
  encoding: Encoding = 'hex'
): Promise<string | Buffer> {
  let encodedInput: string;
  let encodedSalt: string;

  if (encoding === 'base64') {
    encodedInput = Buffer.from(passwd as string, 'base64').toString('hex');
    encodedSalt = Buffer.from(salt as string, 'base64').toString('hex');
  } else if (encoding === 'buffer') {
    encodedInput = (passwd as Buffer).toString('hex');
    encodedSalt = (salt as Buffer).toString('hex');
  } else {
    // hex
    encodedInput = passwd as string;
    encodedSalt = salt as string;
  }

  const result = await ReactNativeScrypt.scrypt(
    encodedInput,
    encodedSalt,
    N,
    r,
    p,
    dkLen
  );

  if (encoding === 'base64') {
    return Buffer.from(result, 'hex').toString('base64');
  } else if (encoding === 'buffer') {
    return Buffer.from(result, 'hex');
  }
  return result;
}

export default scrypt;
