import { withManagementStoreLayout } from '@/layouts/StoreLayout';
import { withSession } from '@/utils/withSession';
import { Label } from '@/shared/Label';
import { useState, useEffect } from 'react';
import { DropDown } from '@/shared/DropDown';
import { FindProductForm } from '@/shared/FindProductForm';
import { ProductForm } from '@/shared/ProductForm';
import { getFormData } from '@/utils/getFormData';
import {
  getCategories,
  findProduct,
  updateProduct,
  deleteProduct
} from 'services/ceaiApi';
import Head from 'next/head';

export default function Products() {
  const [dbProduct, setDbProduct] = useState();
  const [label, setLabel] = useState();
  const [dbCategories, setDbCategories] = useState();

  useEffect(async () => {
    const res = await getCategories();

    if (res.success) {
      setDbCategories(res.categories);
    }
  }, []);

  const handleFindProductSubmit = async ({ name }) => {
    const res = await findProduct(name);

    if (res.success) {
      setLabel({ success: true, message: 'Produsul a fost găsit' });
      setDbProduct({ ...res.product });
    } else {
      setLabel({ success: false, message: 'Produsul nu a fost găsit :(' });
      setDbProduct(null);
      return res.errors;
    }
  };

  const handleProductSubmit = async (data) => {
    const formData = getFormData(data);
    const res = await updateProduct(dbProduct._id, formData);

    if (res.success) {
      setLabel({ success: true, message: 'produsul a fost modificat' });
      setDbProduct({ ...res.product });
    } else {
      setLabel({ success: false, message: 'ceva nu a mers bine :(' });
      return res.errors;
    }
  };

  const handleDeleteProduct = async () => {
    const res = await deleteProduct(dbProduct._id);

    if (res.success) {
      setLabel({ success: true, message: 'Produsul a fost șters' });
      setDbProduct(null);
    } else {
      setLabel({ success: false, message: 'Produsul nu a fost șters :(' });
    }
  };

  return (
    <>
      <Head>
        <title>Update product</title>
      </Head>

      <h4>Modificare produs</h4>
      <FindProductForm onFindProductSubmit={handleFindProductSubmit} />

      {label && (
        <Label error={!label.success} success={label.success}>
          {label.message}
        </Label>
      )}

      {dbProduct && (
        <DropDown
          title={dbProduct?.name}
          showInitial={true}
          onDeleteClick={handleDeleteProduct}
        >
          <ProductForm
            onProductSubmit={handleProductSubmit}
            product={dbProduct}
            categories={dbCategories}
          />
        </DropDown>
      )}
    </>
  );
}

export const getServerSideProps = withSession(async ({ req }) => {
  const { isAuth, user } = req.session;

  if (!isAuth || !(user.isAdmin || user.isManager)) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    };
  }

  return { props: {} };
});

Products.withLayout = withManagementStoreLayout;
