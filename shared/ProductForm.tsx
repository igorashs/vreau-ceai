import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import { productSchema } from '@/utils/validator/schemas/product';
import Form, { FormAction } from '@/shared/Form';
import TextField from '@/shared/TextField';
import CheckBox from '@/shared/CheckBox';
import Button from '@/shared/Button';
import Select from '@/shared/Select';
import InputFile from '@/shared/InputFile';
import Textarea from '@/shared/Textarea';
import { useEffect } from 'react';
import { Category, Product, ProductErrorDetail, ProductFields } from 'types';
import getProductFormData from '@/utils/getProductFormData';

type ProductInputs = ProductFields & { src: FileList };

type ProductFormProps = {
  onProductSubmit: (
    data: FormData,
  ) => Promise<ProductErrorDetail[] | undefined>;
  categories: Category[];
  product?: Product;
};

const ProductForm = ({
  onProductSubmit,
  categories,
  product,
}: ProductFormProps) => {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    watch,
    formState: { errors },
  } = useForm<ProductInputs>({
    mode: 'onChange',
    resolver: joiResolver(productSchema),
  });

  const watchSrc = watch('src');

  useEffect(() => {
    reset({
      name: product?.name ?? '',
      price: product?.price ?? 0,
      quantity: product?.quantity ?? 0,
      total_quantity: product?.total_quantity ?? 0,
      description: product?.description ?? '',
      category_id: product?.category_id,
      recommend: product?.recommend ?? false,
      src: '',
    });
  }, [product, categories]);

  const onSubmit = async (data: ProductInputs) => {
    const formData = getProductFormData(data);
    const submitErrors = await onProductSubmit(formData);

    if (submitErrors) {
      submitErrors.forEach((error) => {
        const { message, name } = error;
        if (name) setError(name, { message });
      });
    } else {
      reset();
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        id={product && `name_${product._id}`}
        name="name"
        label="nume produs"
        error={errors?.name?.message}
        passRef={register}
        type="text"
      />
      <TextField
        id={product && `price_${product._id}`}
        name="price"
        label="preț (lei)"
        error={errors?.price?.message}
        passRef={register}
        type="number"
      />
      <TextField
        id={product && `quantity_${product._id}`}
        name="quantity"
        label="preț per cantitate (g)"
        error={errors?.quantity?.message}
        passRef={register}
        type="number"
      />
      <TextField
        id={product && `total_quantity_${product._id}`}
        name="total_quantity"
        label="cantitatea totală (g)"
        error={errors?.total_quantity?.message}
        passRef={register}
        type="number"
      />
      <Textarea
        id={product && `description_${product._id}`}
        name="description"
        label="descriere"
        passRef={register}
        error={errors?.description?.message}
        rows={7}
      />
      <Select
        id={product && `category_id_${product._id}`}
        name="category_id"
        label="categorie"
        passRef={register}
        error={errors?.category_id?.message}
      >
        {categories.length ? (
          categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))
        ) : (
          <option>no category</option>
        )}
      </Select>
      <InputFile
        id={product && `src_${product._id}`}
        name="src"
        label={`(max 1MB) imagine ${(watchSrc && watchSrc[0]?.name) || ''}`}
        passRef={register}
        error={errors?.src?.message}
        accept=".png, .jpg, .jpeg"
      >
        Încarcă imagine
      </InputFile>
      <FormAction justify="space-between">
        <CheckBox
          id={product && `recommend_${product._id}`}
          name="recommend"
          label="recomandată"
          passRef={register}
        />
        <Button>salvează</Button>
      </FormAction>
    </Form>
  );
};

export default ProductForm;
