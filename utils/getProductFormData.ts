import { ProductFields } from 'types';

const getProductFormData = (data: ProductFields & { src: FileList }) => {
  const formData = new FormData();

  Object.entries(data).forEach(([name, value]) => {
    if (name === 'src') {
      if (data.src[0]) formData.append(name, data.src[0]);
      return;
    }

    formData.append(name, value.toString());
  });

  return formData;
};

export default getProductFormData;
