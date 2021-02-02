import { withCategoryStoreLayout } from '@/layouts/StoreLayout';
import ProductModel from '@/models/Product';
import dbConnect from '@/utils/dbConnect';
import Head from 'next/head';
import breakpoints from 'GlobalStyle/breakpoints';
import styled from 'styled-components';
import Image from 'next/image';
import { Button } from '@/shared/Button';
import MinusSvg from '@/icons/minus.svg';
import PlusSvg from '@/icons/plus.svg';
import { useState } from 'react';

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

const Counter = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
`;

const CountInput = styled.input`
  border: 0;
  width: calc(var(--baseline) * 2);
  background-color: transparent;
  color: var(--accent-text-dark);
  border-bottom: 1px solid var(--accent);
  text-align: center;

  /* Chrome, Safari, Edge, Opera */
  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  &[type='number'] {
    -moz-appearance: textfield;
  }
`;

export default function Product({ product }) {
  const [count, setCount] = useState(1);

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
            <Counter>
              <Button
                icon
                noPadding
                onClick={() => setCount((c) => (c > 1 ? c - 1 : 1))}
              >
                <MinusSvg />
              </Button>
              <CountInput
                type="number"
                value={count}
                onBlur={(e) => !e.currentTarget.value && setCount(1)}
                onChange={(e) => {
                  if (!e.currentTarget.value) {
                    setCount('');
                  } else {
                    const value = +e.currentTarget.value;

                    if (value >= 1 && value <= 100) {
                      setCount(value);
                    }
                  }
                }}
              />
              <Button
                icon
                noPadding
                onClick={() => setCount((c) => (c < 100 ? c + 1 : c))}
              >
                <PlusSvg />
              </Button>
            </Counter>
            <Button>adaugă în coș</Button>
          </Actions>
        </ActionsWrapper>
      </Wrapper>
    </>
  );
}

Product.withLayout = withCategoryStoreLayout;

export const getServerSideProps = async ({ query }) => {
  await dbConnect();

  try {
    const dbProduct = await ProductModel.findOne({ name: query.product });

    if (!dbProduct) {
      return {
        notFound: true
      };
    }

    return {
      props: {
        product: JSON.parse(JSON.stringify(dbProduct))
      }
    };
  } catch (error) {
    return {
      notFound: true
    };
  }
};
