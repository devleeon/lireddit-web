import { Box, Button, Flex, useToast } from "@chakra-ui/core";
import React from "react";
import { useCreatePostMutation, useMeQuery } from "../../generated/graphql";
import { BACKGROUND_THEMECOLOR, TEXT_THEMECOLOR } from "../../constants";
import { Formik, Form } from "formik";
import { InputField } from "../InputField";
import { useRouter } from "next/router";
import { useIsNotAuth } from "../../utils/useIsNotAuth";
import { toErrorMap } from "../../utils/toErrorMap";

interface CreatePostProps {
  handleToggle: Function;
  show: boolean;
}

export const CreatePost: React.FC<CreatePostProps> = ({
  handleToggle,
  show,
}) => {
  const [, createPost] = useCreatePostMutation();
  const toast = useToast();
  // const router = useRouter();
  return (
    <Formik
      initialValues={{ title: "", text: "" }}
      // setErrors() is from formik
      onSubmit={async (values, { setErrors }) => {
        const response = await createPost({ input: values });
        if (response.data?.createPost.errors) {
          setErrors(toErrorMap(response.data.createPost.errors));
        } else {
          handleToggle();
          values.title = "";
          values.text = "";
          toast({
            position: "top",
            title: "created a post",
            description: "We've created a new post",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <Box mt={4}>
            <InputField name="title" placeholder="title" />
          </Box>
          <Box mt={1}>
            <InputField textarea name="text" placeholder="text" />
          </Box>
          <Flex mt={4}>
            <Button
              ml="auto"
              backgroundColor={BACKGROUND_THEMECOLOR}
              color={TEXT_THEMECOLOR}
              type="submit"
              // when this is submitting animates the button
              isLoading={isSubmitting}
            >
              Create Post
            </Button>
          </Flex>
        </Form>
      )}
    </Formik>
  );
};
