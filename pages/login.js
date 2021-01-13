import Head from 'next/head';
import styled from 'styled-components';
import breakpoints from 'GlobalStyle/breakpoints';
import { withBaseLayout } from '@/layouts/BaseLayout';
import { useForm } from 'react-hook-form';
import { useCallback } from 'react';
import { joiResolver } from '@hookform/resolvers/dist/ie11/joi';
import { loginSchema } from '@/utils/validator/schemas/user';
import { Button } from '@/shared/Button';
import { StyledLink } from '@/shared/StyledLink';
import { signupLink } from '@/utils/links';
import { Input } from '@/shared/Input';
import { useRouter } from 'next/router';
import { getSession } from '@/utils/getSession';
import { Form, FormAction } from '@/shared/Form';

const Wrapper = styled.div`
  width: var(--max-input-width);
  display: grid;
  gap: calc(var(--baseline) / 2);
  margin: 0 auto;

  @media (min-width: ${breakpoints.lg}) {
    width: auto;
    margin: 0;
    gap: var(--baseline);
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
    formState: { errors }
  } = useForm({
    mode: 'onChange',
    resolver: joiResolver(loginSchema)
  });

  const router = useRouter();

  const onSubmit = useCallback(async (data) => {
    const res = await fetch('http://localhost:3000/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (res.status === 201) {
      router.reload();
    }

    const resData = await res.json();

    if (resData?.errors) {
      resData.errors.forEach((error) => {
        const { message, name } = error;
        setError(name, { message });
      });
    }
  }, []);

  return (
    <>
      <Head>
        <title>Conectare</title>
        <meta
          name="description"
          content="Conecteazăte pentru a putea face comenzi din magazinul vreauceai!"
        />
      </Head>

      <Wrapper>
        <h1>Conectare</h1>

        <FormWrapper>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Input
              name="email"
              label="e-mail"
              error={errors?.email?.message}
              passRef={register}
              type="email"
            />
            <Input
              name="password"
              label="parola"
              error={errors?.password?.message}
              passRef={register}
              type="password"
            />
            <FormAction>
              <StyledLink
                {...{
                  ...signupLink,
                  accent: 'dark',
                  underline: true
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

export const getServerSideProps = async ({ req, res }) => {
  const session = getSession(req);

  if (session) {
    return {
      redirect: {
        destination: '/'
      }
    };
  }

  return { props: {} };
};

Signup.withLayout = withBaseLayout;
