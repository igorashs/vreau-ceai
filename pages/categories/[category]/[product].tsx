import { withCategoryStoreLayout } from '@/layouts/StoreLayout';
import ProductModel, { Product as ProductModelType } from '@/models/Product';
import dbConnect from '@/utils/dbConnect';
import Head from 'next/head';
import breakpoints from 'GlobalStyle/breakpoints';
import styled from 'styled-components';
import Image from 'next/image';
import Button from '@/shared/Button';
import { useState } from 'react';
import { useCartDispatch } from 'contexts/CartContext';
import Counter from '@/shared/Counter';
import Label from '@/shared/Label';
import { GetServerSideProps } from 'next';
import { LabelMessage, Product as ProductType } from 'types';

const Wrapper = styled.div`
  display: flex;
  gap: var(--baseline);
  flex-direction: column;

  @media (min-width: ${breakpoints.lg}) {
    display: grid;
    grid-template-rows: 308px auto;
  }
`;

const ImgContainer = styled.figure`
  align-self: center;
  min-width: 290px;
  min-height: 290px;
  max-width: 308px;
  max-height: 308px;
  border-radius: 4px;
  overflow: hidden;

  @media (min-width: ${breakpoints.lg}) {
    align-self: start;
  }
`;

const Description = styled.div`
  display: flex;
  flex-direction: column;
  max-width: var(--max-text-width);
  gap: calc(var(--baseline) / 2);
  white-space: pre-line;

  @media (min-width: ${breakpoints.lg}) {
    grid-column: 2;
    grid-row: span 2;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: var(--baseline);
`;

const ActionsWrapper = styled.div`
  display: grid;
  align-self: start;
  gap: 7px;
`;

const Price = styled.p`
  font-weight: 500;
  grid-column: 1 / -1;
`;

type ProductProps = {
  product: ProductType;
};

export default function Product({ product }: ProductProps) {
  const [count, setCount] = useState(1);
  const [label, setLabel] = useState<LabelMessage>();
  const cartDispatch = useCartDispatch();

  return (
    <>
      <Head>
        <title>Produs: {product.name}</title>
        <meta name="description" content={`Despre produsul: ${product.name}`} />
      </Head>

      <Wrapper>
        <ImgContainer>
          <Image
            width={700}
            height={700}
            src={`/uploads/${product.src}`}
            alt={product.name}
          />
        </ImgContainer>
        <Description>
          <h5>{product.name}</h5>
          <p>{product.description}</p>
        </Description>
        <ActionsWrapper>
          <Price>{`${product.price}lei - ${product.quantity}g`}</Price>
          <Actions>
            <Counter
              count={count}
              min={1}
              max={100}
              onChange={(c) => setCount(c)}
            />
            <Button
              onClick={() => {
                cartDispatch({
                  type: 'add-item',
                  payload: {
                    product,
                    count,
                  },
                });

                setLabel({
                  success: true,
                  message: 'produsul a fost adăugat în coș',
                });
              }}
            >
              adaugă în coș
            </Button>
          </Actions>
          {label && <Label success={label.success}>{label.message}</Label>}
        </ActionsWrapper>
      </Wrapper>
    </>
  );
}

Product.withLayout = withCategoryStoreLayout;

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  await dbConnect();

  try {
    const dbProduct: ProductModelType = await ProductModel.findOne(
      { name: query.product },
      'name description price quantity src',
    );

    if (!dbProduct) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        product: JSON.parse(JSON.stringify(dbProduct)),
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};
