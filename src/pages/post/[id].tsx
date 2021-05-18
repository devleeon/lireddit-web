import React from "react";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { useRouter } from "next/router";
import { usePostQuery } from "../../generated/graphql";
import { Layout } from "../../components/Layout";
import { Heading, Box, Flex } from "@chakra-ui/core";
import { withApollo } from "../../utils/withApollo";

const Post = ({}) => {
  const router = useRouter();
  console.log(router);
  const intId =
    typeof router.query.id === "string" ? parseInt(router.query.id) : -1;
  const { data, error, loading } = usePostQuery({
    // -1 is a signal to pause
    skip: intId === -1,
    variables: {
      id: intId,
    },
  });

  if (loading) {
    return (
      <Layout>
        <div>loading...</div>
      </Layout>
    );
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  if (!data?.post) {
    return (
      <Layout>
        <Box>could not find post</Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Flex mb={4}>
        <Heading ml={0}>{data.post.title}</Heading>
        <Box mr={0}>{data.post.creator.username}</Box>
      </Flex>
      {data.post.text}
    </Layout>
  );
};

// export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
export default withApollo({ ssr: true })(Post);
