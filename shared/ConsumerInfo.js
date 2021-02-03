import styled from 'styled-components';
import AccountSvg from '@/icons/account.svg';
import EmailSvg from '@/icons/email.svg';
import PhoneSvg from '@/icons/phone.svg';
import HomeSvg from '@/icons/home.svg';

const Wrapper = styled.div`
  display: grid;
  gap: 7px;
  padding-top: 7px;
  border-top: 1px solid var(--layout);
`;

const Title = styled.p`
  font-weight: 500;
`;

const Small = styled.small`
  font-weight: 500;
`;

const Info = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;

  svg {
    flex-shrink: 0;
  }
`;

export const ConsumerInfo = ({ name, email, tel, address }) => {
  return (
    <Wrapper>
      <Title>Consumator</Title>
      <Info>
        <AccountSvg />
        <Small>{name}</Small>
      </Info>
      <Info>
        <EmailSvg />
        <Small>{email}</Small>
      </Info>
      <Info>
        <PhoneSvg />
        <Small>{tel}</Small>
      </Info>
      <Info>
        <HomeSvg />
        <Small>{address}</Small>
      </Info>
    </Wrapper>
  );
};
