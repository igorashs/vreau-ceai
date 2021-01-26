import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/dist/ie11/joi';
import { productSchema } from '@/utils/validator/schemas/product';
import { Form, FormAction } from '@/shared/Form';
import { TextField } from '@/shared/TextField';
import { CheckBox } from '@/shared/CheckBox';
import { Button } from '@/shared/Button';
import { useState, useEffect } from 'react';
import { Select } from '@/shared/Select';
import { InputFile } from '@/shared/InputFile';
import { Textarea } from '@/shared/Textarea';
import { getCategories } from 'services/ceaiApi';

export function CreateProductForm({ onCreateProductSubmit }) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm({
    mode: 'onChange',
    resolver: joiResolver(productSchema),
    defaultValues: {
      price: 0,
      quantity: 0,
      total_quantity: 0
    }
  });

  const [dbCategories, setDbCategories] = useState();

  useEffect(async () => {
    const res = await getCategories();

    if (res.success) {
      setDbCategories(res.categories);
    }
  }, []);

  const onSubmit = async (data) => {
    const errors = await onCreateProductSubmit(data);

    if (errors) {
      errors.forEach((error) => {
        const { message, name } = error;
        setError(name, { message });
      });
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        name="name"
        label="nume produs"
        error={errors?.name?.message}
        passRef={register}
        type="text"
      />
      <TextField
        name="price"
        label="preț (lei)"
        error={errors?.price?.message}
        passRef={register}
        type="number"
      />
      <TextField
        name="quantity"
        label="preț per cantitate (g)"
        error={errors?.quantity?.message}
        passRef={register}
        type="number"
      />
      <TextField
        name="total_quantity"
        label="cantitatea totală (g)"
        error={errors?.total_quantity?.message}
        passRef={register}
        type="number"
      />
      <Textarea
        name="description"
        label="descriere"
        passRef={register}
        error={errors?.description?.message}
        rows="7"
      />
      <Select
        name="category"
        label="categorie"
        passRef={register}
        error={errors?.category?.message}
      >
        {dbCategories ? (
          dbCategories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))
        ) : (
          <option>no category</option>
        )}
      </Select>
      <InputFile
        name="src"
        label={'(max 1MB) imagine'}
        passRef={register}
        error={errors?.src?.message}
        accept=".png, .jpg, .jpeg"
      >
        Încarcă imagine
      </InputFile>
      <FormAction justify="space-between">
        <CheckBox name="recommend" label="recomandată" passRef={register} />
        <Button>salvează</Button>
      </FormAction>
    </Form>
  );
}
