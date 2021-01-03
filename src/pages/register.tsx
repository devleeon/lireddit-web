import { Box, Button, Flex } from "@chakra-ui/core";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { InputField } from "../components/InputField";
import { Layout } from "../components/Layout";
import { useMeQuery, useRegisterMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { toErrorMap } from "../utils/toErrorMap";
import { BACKGROUND_THEMECOLOR, TEXT_THEMECOLOR } from "../constants";
import { useIsAuth } from "../utils/useIsAuth";
interface registerProps {}
const Register: React.FC<registerProps> = ({}) => {
  // 2nd element of useMutation is name of it
  const [, register] = useRegisterMutation();
  const router = useRouter();
  useIsAuth();
  return (
    <Layout variant="small">
      <Formik
        initialValues={{ username: "", password: "", email: "" }}
        // setErrors() is from formik
        onSubmit={async (values, { setErrors }) => {
          const response = await register({ input: values });
          if (response.data?.register.errors) {
            setErrors(toErrorMap(response.data.register.errors));
          } else if (response.data?.register.user) {
            // worked -> redirect to home
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="username"
              placeholder="username"
              label="username"
            />

            <Box mt={6}>
              <InputField
                name="password"
                placeholder="password"
                label="password"
                type="password"
              />
            </Box>

            <Box mt={4}>
              <InputField
                name="email"
                placeholder="email"
                label="email"
                type="email"
              />
            </Box>
            <Flex>
              <Button
                ml="auto"
                mt={6}
                backgroundColor={BACKGROUND_THEMECOLOR}
                color={TEXT_THEMECOLOR}
                type="submit"
                // when this is submitting animates the button
                isLoading={isSubmitting}
              >
                register
              </Button>
            </Flex>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(Register);
