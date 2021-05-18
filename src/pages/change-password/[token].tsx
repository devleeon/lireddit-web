import { Box, Button, Flex, Link } from "@chakra-ui/core";
import { Formik, Form } from "formik";
import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import NextLink from "next/link";
import React from "react";
import { useState } from "react";
import { InputField } from "../../components/InputField";
import { Wrapper } from "../../components/Wrapper";
import { useChangePasswordMutation } from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { toErrorMap } from "../../utils/toErrorMap";
import { BACKGROUND_THEMECOLOR, TEXT_THEMECOLOR } from "../../constants";
import { withApollo } from "../../utils/withApollo";

const ChagePassword: NextPage = () => {
  const router = useRouter();
  const [changePassword] = useChangePasswordMutation();
  const [tokenError, setTokenError] = useState("");
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ newPassword1: "", newPassword2: "" }}
        // setErrors() is from formik
        onSubmit={async (values, { setErrors }) => {
          if (values.newPassword1 !== values.newPassword2) {
            return setErrors({
              newPassword2: "confirm your password",
            });
          }
          const response = await changePassword({
            variables: {
              token:
                typeof router.query.token === "string"
                  ? router.query.token
                  : "",
              newPassword: values.newPassword2,
            },
          });
          if (response.data?.changePassword.errors) {
            const errorMap = toErrorMap(response.data.changePassword.errors);
            if ("token" in errorMap) {
              setTokenError(errorMap.token);
            }
            setErrors(errorMap);
          } else if (response.data?.changePassword.user) {
            // worked -> redirect to home
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="newPassword1"
              placeholder="type new password"
              label="type new password"
              type="password"
            />
            {tokenError ? (
              <Flex mt={2}>
                <Box style={{ color: "red" }}>{tokenError}</Box>
                <Box ml="auto">
                  <NextLink href="/forgot-password">
                    <Link>get the link again</Link>
                  </NextLink>
                </Box>
              </Flex>
            ) : null}

            <Box mt={6}>
              <InputField
                name="newPassword2"
                placeholder="type new password again"
                label="type new password again"
                type="password"
              />
            </Box>
            <Flex>
              <Button
                ml="auto"
                mt={8}
                backgroundColor={BACKGROUND_THEMECOLOR}
                color={TEXT_THEMECOLOR}
                type="submit"
                // when this is submitting animates the button
                isLoading={isSubmitting}
              >
                change password
              </Button>
            </Flex>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

// without getInitialProps
// nextjs optimize the page so if it's possible don't use it
// ChagePassword.getInitialProps = ({ query }) => {
//   return {
//     token: query.token as string,
//   };
// };

export default withApollo({ ssr: false })(ChagePassword);
