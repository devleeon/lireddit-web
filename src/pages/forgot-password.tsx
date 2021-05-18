import { Box, Button, Flex } from "@chakra-ui/core";
import { Form, Formik } from "formik";
import React from "react";
import { InputField } from "../components/InputField";
import { useForgotPasswordMutation } from "../generated/graphql";
import { useRouter } from "next/router";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { useState } from "react";
import { Layout } from "../components/Layout";
import { BACKGROUND_THEMECOLOR, TEXT_THEMECOLOR } from "../constants";
import { withApollo } from "../utils/withApollo";

interface loginProps {}
const ForgotPassword: React.FC<loginProps> = ({}) => {
  // 2nd element of useMutation is name of it
  const [forgotPassword] = useForgotPasswordMutation();
  const [sendEmail, setSendEmail] = useState("");
  const router = useRouter();
  return (
    <Layout variant="small">
      <Formik
        initialValues={{ email: "" }}
        // setErrors() is from formik
        onSubmit={async (values, { setErrors }) => {
          if (!values.email.includes("@")) {
            // doesn't include "@"
            // pattern error
            setErrors({ email: "Type the email you've registered with" });
            return;
          }
          const response = await forgotPassword({
            variables: { email: values.email },
          });
          if (!response.data?.forgotPassword) {
            setErrors({ email: "Type the email you've registered with" });
            return;
          }
          setSendEmail("sent email successfully");
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name="email" placeholder="Email" label="Email" />
            <Box mt={6}>
              {sendEmail ? <Box mb={6}>{sendEmail}</Box> : null}
              <Flex>
                <Button
                  ml="auto"
                  backgroundColor={BACKGROUND_THEMECOLOR}
                  color={TEXT_THEMECOLOR}
                  type="submit"
                  // when this is submitting animates the button
                  isLoading={isSubmitting}
                >
                  send email
                </Button>
              </Flex>
            </Box>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};
// export default withUrqlClient(createUrqlClient)(ForgotPassword);
export default withApollo({ ssr: false })(ForgotPassword);
