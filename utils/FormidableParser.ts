import * as validator from '@/utils/validator';
import FormidableNameSpace, { Files, File, IncomingForm } from 'formidable';
import { NextApiRequest } from 'next';
import { Formidable, ProductFields } from 'types';
import { productMessages } from './validator/schemas/product';
import { NextApiSessionRequest } from './withSession';

type ParsedData = {
  fields: Partial<ProductFields>;
  files: Files & { src?: File };
};

type HandleProductForm = (
  req: NextApiRequest | NextApiSessionRequest,
  options: Partial<FormidableNameSpace.Options>,
  allowedFileTypes: string[],
) => Promise<ParsedData>;

const handleProductForm: HandleProductForm = async (
  req,
  options,
  allowedFileTypes,
) => {
  const data: ParsedData = await new Promise((resolve, reject) => {
    const form: Formidable = new IncomingForm(options);

    form.onPart = (part) => {
      if (part.filename) {
        // get file extension
        const fileType = part.mime?.split('/').pop() ?? '';

        // validate allowed file types
        if (!allowedFileTypes.includes(fileType)) {
          form.emit(
            'error',
            validator.createValidationError({
              message: productMessages.src.invalid,
              key: 'src',
            }),
          );
        }
      }

      form.handlePart(part);
    };

    form.parse(req, (err, fields, files) => {
      if (err) {
        // custom error on maxFileSize
        if (err.message.includes('maxFileSize')) {
          reject(
            validator.createValidationError({
              message: productMessages.src.max,
              key: 'src',
            }),
          );
        } else {
          reject(err);
        }
      }

      resolve({ fields, files });
    });
  });

  return data;
};

export default {
  handleProductForm,
};
