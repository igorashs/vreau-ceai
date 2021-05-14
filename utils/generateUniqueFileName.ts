import { nanoid } from 'nanoid';

const generateUniqueFileName = (fileName: string) => {
  // grab file extension
  const matches = fileName?.match(/\..+$/);

  // create new file name
  const uniqueFileName = nanoid() + (matches && matches[0]);

  return uniqueFileName;
};

export default generateUniqueFileName;
