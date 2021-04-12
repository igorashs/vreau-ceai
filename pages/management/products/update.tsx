import { withManagementStoreLayout } from '@/layouts/StoreLayout';
import { withSessionServerSideProps } from '@/utils/withSession';
import { Label } from '@/shared/Label';
import { useState, useEffect } from 'react';
import { DropDown } from '@/shared/DropDown';
import { FindProductForm } from '@/shared/FindProductForm';
import { ProductForm } from '@/shared/ProductForm';
import {
  getCategories,
  findProduct,
  updateProduct,
  deleteProduct,
} from 'services/ceaiApi';
import Head from 'next/head';
import { Category, LabelMessage, Product, ProductName } from 'types';

export default function Update() {
  const [dbProduct, setDbProduct] = useState<Product | null>();
  const [label, setLabel] = useState<LabelMessage>();
  const [dbCategories, setDbCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getCategories();

      if (res.success) {
        setDbCategories(res.categories);
      }
    };

    fetchData();
  }, []);

  const handleFindProductSubmit = async (data: ProductName) => {
    const res = await findProduct(data);

    if (res.success) {
      setLabel({ success: true, message: 'Produsul a fost găsit' });
      setDbProduct({ ...res.product });
    } else {
      setLabel({ success: false, message: 'Produsul nu a fost găsit :(' });
      setDbProduct(null);
    }

    return res.errors;
  };

  const handleProductSubmit = async (data: FormData) => {
    if (!dbProduct) return [];

    const res = await updateProduct(dbProduct._id, data);

    if (res.success) {
      setLabel({ success: true, message: 'produsul a fost modificat' });
      setDbProduct({ ...res.product });
    } else {
      setLabel({ success: false, message: 'ceva nu a mers bine :(' });
    }

    return res.errors;
  };

  const handleDeleteProduct = async () => {
    if (!dbProduct) return;

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
          showInitial
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

export const getServerSideProps = withSessionServerSideProps(
  async ({ req }) => {
    const { isAuth, user } = req.session;

    if (!isAuth || !(user?.isAdmin || user?.isManager)) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

    return { props: {} };
  },
);

Update.withLayout = withManagementStoreLayout;
