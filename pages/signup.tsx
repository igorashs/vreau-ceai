import Head from 'next/head';
import styled from 'styled-components';
import breakpoints from 'GlobalStyle/breakpoints';
import withBaseLayout from '@/layouts/BaseLayout';
import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import { signupSchema } from '@/utils/validator/schemas/user';
import Button from '@/shared/Button';
import StyledLink from '@/shared/StyledLink';
import { loginLink } from '@/utils/links';
import TextField from '@/shared/TextField';
import { useRouter } from 'next/router';
import Form, { FormAction } from '@/shared/Form';
import { signup } from 'services/ceaiApi';
import { withSessionServerSideProps } from '@/utils/withSession';
import { UserSignup } from 'types';

const Wrapper = styled.div`
  width: var(--max-input-width);
  display: grid;
  gap: calc(var(--baseline) / 2);
  margin: 0 auto;

  h1 {
    font-size: var(--h4-font-size);
  }

  @media (min-width: ${breakpoints.lg}) {
    width: auto;
    margin: 0;
    gap: var(--baseline);

    h1 {
      font-size: var(--h3-font-size);
    }
  }
`;

const FormWrapper = styled.div`
  max-width: var(--max-input-width);
  width: var(--max-input-width);
`;

export default function Signup() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    resolver: joiResolver(signupSchema),
  });

  const router = useRouter();

  const onSubmit = async (data: UserSignup) => {
    const res = await signup(data);

    if (res.success) {
      router.reload();
    }

    if (res?.errors) {
      res.errors.forEach((error) => {
        const { message, name } = error;
        if (name) setError(name, { message });
      });
    }
  };

  return (
    <>
      <Head>
        <title>Înregistrare</title>
        <meta
          name="description"
          content="Înregistreazăte pentru a putea face comenzi din magazinul vreauceai!"
        />
      </Head>

      <Wrapper>
        <h1>Creare Cont</h1>

        <FormWrapper>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              name="name"
              label="nume"
              error={errors?.name?.message}
              passRef={register}
              type="text"
            />
            <TextField
              name="email"
              label="e-mail"
              error={errors?.email?.message}
              passRef={register}
              type="email"
            />
            <TextField
              name="password"
              label="parola"
              error={errors?.password?.message}
              passRef={register}
              type="password"
            />
            <TextField
              name="repeat_password"
              label="repetați parola"
              error={errors?.repeat_password?.message}
              passRef={register}
              type="password"
            />
            <FormAction justify="space-between">
              <StyledLink
                {...{
                  ...loginLink,
                  Icon: null,
                  accent: 'dark',
                  underline: true,
                }}
              />
              <Button>înainte</Button>
            </FormAction>
          </Form>
        </FormWrapper>
      </Wrapper>
    </>
  );
}

export const getServerSideProps = withSessionServerSideProps(
  async ({ req }) => {
    const { isAuth } = req.session;

    if (isAuth) {
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

Signup.withLayout = withBaseLayout;
