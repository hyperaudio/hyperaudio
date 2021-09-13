import bs58 from 'bs58';
import { v4 as uuidv4, v5 as uuidv5 } from 'uuid';

export const generateId = () => {
  const buffer = Buffer.alloc(16);
  uuidv4(null, buffer);
  return bs58.encode(buffer);
};

export const computeId = (name, namespace) => {
  const buffer = new Buffer(16);
  let ns = namespace;
  try {
    ns = Array.from(bs58.decode(namespace));
  } catch (ignored) {}
  uuidv5(name, ns, buffer);
  return bs58.encode(buffer);
};
