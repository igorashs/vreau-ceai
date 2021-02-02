import styled from 'styled-components';
import Image from 'next/image';
import { StyledLink } from '@/shared/StyledLink';
import breakpoints from 'GlobalStyle/breakpoints';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: calc(var(--baseline) / 2);
  border-radius: 4px;
  border: 1px solid var(--accent-dark);
  padding: calc(var(--baseline) / 2);
  background-color: #fff;

  @media (min-width: ${breakpoints.lg}) {
    display: grid;
    grid-template-columns: auto 1fr;
  }
`;

const ImgContainer = styled.figure`
  width: 224px;
  height: 224px;
  overflow: hidden;
  border-radius: 4px;
  border: 1px solid var(--accent-text-light);
`;

const Title = styled.h5`
  grid-column: 1;
  text-align: center;
`;

const Description = styled.p`
  align-self: center;
  grid-row: 1;
  grid-column: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;

  @media (min-width: ${breakpoints.lg}) {
    -webkit-line-clamp: 4;
  }
`;

const Price = styled.p`
  text-align: center;
  grid-column: 1;
  font-weight: 500;
`;

const Actions = styled.div`
  display: grid;

  @media (min-width: ${breakpoints.lg}) {
    display: flex;
    justify-content: flex-end;
    gap: var(--baseline);
  }
`;

export const TeaCard = ({ tea, category }) => {
  return (
    <Wrapper>
      <ImgContainer>
        <Image
          width={700}
          height={700}
          src={`/uploads/${tea.src}`}
          alt={tea.name}
        />
      </ImgContainer>
      <Title>{tea.name}</Title>
      <Description>{tea.description}</Description>
      <Price>{`${tea.price}lei - ${tea.quantity}g`}</Price>
      <Actions>
        <StyledLink
          href={`/categories/${category}/${tea.name}`}
          button
          text="vezi produs"
        />
      </Actions>
    </Wrapper>
  );
};
