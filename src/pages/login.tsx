import { Box, Button, Divider, Flex, Link } from "@chakra-ui/core";
import { Form, Formik } from "formik";
import React from "react";
import { InputField } from "../components/InputField";
import { MeDocument, MeQuery, useLoginMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import { createUrqlClient } from "../utils/createUrqlClient";
import { Layout } from "../components/Layout";
import { BACKGROUND_THEMECOLOR, TEXT_THEMECOLOR } from "../constants";
import { useIsAuth } from "../utils/useIsAuth";
import { withApollo } from "../utils/withApollo";

interface loginProps {}
const Login: React.FC<loginProps> = ({}) => {
  // 2nd element of useMutation is name of it
  const [login] = useLoginMutation();
  const router = useRouter();
  useIsAuth();
  return (
    <Layout variant="small">
      {router.query.from === "/create-post" ? (
        <>
          <Flex
            w="100%"
            h="50px"
            backgroundColor={BACKGROUND_THEMECOLOR}
            color={TEXT_THEMECOLOR}
          >
            <Box mx="auto" my="auto" fontSize="20px" borderRadius="5px">
              Login first to create a post
            </Box>
          </Flex>
          <Divider borderColor="lightgray" my={6} />
        </>
      ) : null}

      <Formik
        initialValues={{ usernameOrEmail: "", password: "" }}
        // setErrors() is from formik
        onSubmit={async (values, { setErrors }) => {
          const response = await login({
            variables: values,
            update: (cache, { data }) => {
              cache.writeQuery<MeQuery>({
                query: MeDocument,
                data: {
                  __typename: "Query",
                  me: data?.login.user,
                },
              });
              cache.evict({ fieldName: "posts:{}" });
            },
          });
          if (response.data?.login.errors) {
            setErrors(toErrorMap(response.data.login.errors));
          } else if (response.data?.login.user) {
            // worked -> redirect to home
            router.push(
              typeof router.query.from === "string"
                ? `${router.query.from}`
                : "/"
            );
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="usernameOrEmail"
              placeholder="Username Or Email"
              label="Username Or Email"
            />

            <Box mt={6}>
              <InputField
                name="password"
                placeholder="password"
                label="password"
                type="password"
              />
            </Box>
            <Flex mt={6}>
              <Button
                backgroundColor={BACKGROUND_THEMECOLOR}
                color={TEXT_THEMECOLOR}
                type="submit"
                // when this is submitting animates the button
                isLoading={isSubmitting}
              >
                Log in
              </Button>
              <Box ml="auto">
                {/* needed to be completed forgot password button  */}
                <NextLink href="/forgot-password">
                  <Link>
                    <Button variant="link">Forgot password?</Button>
                  </Link>
                </NextLink>
              </Box>
            </Flex>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};
// export default withUrqlClient(createUrqlClient)(Login);
export default withApollo({ ssr: false })(Login);
