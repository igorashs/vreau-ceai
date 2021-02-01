import Image from 'next/image';
import styled from 'styled-components';
import { StyledLink } from '@/shared/StyledLink';

const Wrapper = styled.div`
  display: grid;
`;

const ImgWrapper = styled.div`
  display: flex;
  justify-content: center;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  border: 1px solid var(--accent-dark);
  padding: calc(var(--baseline) / 2);
  background-color: #fff;
`;

const ImgContainer = styled.div`
  width: 224px;
  height: 224px;
  overflow: hidden;
  border-radius: 4px;
  border: 1px solid var(--accent-text-light);
`;

const Label = styled.p`
  line-height: calc(var(--baseline) * 2);
  text-align: center;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  color: var(--text-light);
  background-color: var(--accent-dark);
`;

export const CategoryCard = ({ category }) => {
  return (
    <StyledLink href={`/categories/${category.name}`}>
      <Wrapper>
        <ImgWrapper>
          <ImgContainer>
            <Image
              width={700}
              height={700}
              src={`/uploads/${category.src}`}
              alt={category.name}
            />
          </ImgContainer>
        </ImgWrapper>
        <Label>{category.name}</Label>
      </Wrapper>
    </StyledLink>
  );
};
