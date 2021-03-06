import {
  Box,
  Button,
  Collapse,
  Flex,
  Heading,
  Link,
  Stack,
  Text,
} from "@chakra-ui/core";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import React, { useState } from "react";
import { Layout } from "../components/Layout";
import { CreatePost } from "../components/Posts/CreatePost";
import { PostMenu } from "../components/Posts/PostMenu";
import { UpdootSection } from "../components/Posts/UpdootSection";
import { PostsQuery, useMeQuery, usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { withApollo } from "../utils/withApollo";

const Index = () => {
  // const [variables, setVariables] = useState({
  //   limit: 10,
  //   cursor: null as null | string,
  // });
  const { data: meData } = useMeQuery();
  const { data, error, loading, fetchMore, variables } = usePostsQuery({
    variables: {
      limit: 10,
      cursor: null,
    },
    notifyOnNetworkStatusChange: true,
  });
  const [show, setShow] = useState(false);

  const showMoreText = () => {};
  const handleToggle = () => {
    setShow(!show);
  };
  if (!loading && !data) {
    // no data when loading is done.
    // => something went wrong
    return (
      <Layout variant="regular">
        <Heading mx="auto">
          something went wrong <br /> there is no post
        </Heading>
      </Layout>
    );
  }

  return (
    <Layout variant="regular">
      <Flex align="center">
        <Heading>LiReddit</Heading>
        {/* <NextLink href="/create-post"> */}
        {!meData?.me ? (
          <></>
        ) : (
          <>
            <Button ml="auto" variant="solid" onClick={handleToggle}>
              create post
            </Button>
          </>
        )}
        {/* </NextLink> */}
      </Flex>
      <Collapse isOpen={show}>
        <CreatePost handleToggle={handleToggle} show={show} />
      </Collapse>

      <br />
      {!data && loading ? (
        <div>loading...</div>
      ) : (
        <Stack spacing={8}>
          {data!.posts.posts.map((p) =>
            !p ? null : (
              <Box key={p.id} shadow="md" borderWidth="1px">
                <Flex>
                  <UpdootSection post={p} />
                  <Box p={2} w={"100%"}>
                    <Flex>
                      <NextLink href="/post/[id]" as={`/post/${p.id}`}>
                        <Link>
                          <Heading fontSize="xl">{p.title}</Heading>
                        </Link>
                      </NextLink>
                      <PostMenu post={p} />
                    </Flex>
                    <Box ml={4}>
                      posted by <strong>{p.creator.username}</strong>
                    </Box>
                    <Text mt={4}>
                      {p.textSnippet}
                      {/* see more 완성하기 */}
                      {p.hasMoreText ? (
                        <Button ml={2} variant="link" onClick={() => {}}>
                          ... see more
                        </Button>
                      ) : null}
                    </Text>
                  </Box>
                </Flex>
              </Box>
            )
          )}
        </Stack>
      )}
      {/* only show "load more" when there's more data  */}
      {data && data.posts.hasMore ? (
        <Flex>
          <Button
            onClick={() => {
              fetchMore({
                variables: {
                  limit: variables?.limit,
                  cursor:
                    data.posts.posts[data.posts.posts.length - 1].createdAt,
                },
                // updateQuery: (
                //   previousValue,
                //   { fetchMoreResult }: { fetchMoreResult: PostsQuery }
                // ): PostsQuery => {
                //   if (fetchMoreResult) {
                //     return previousValue as PostsQuery;
                //   }
                //   return {
                //     __typename: "Query",
                //     posts: {
                //       __typename: "PaginatedPosts",
                //       hasMore: fetchMoreResult.posts.hasMore,
                //       posts: [
                //         ...previousValue.posts.posts,
                //         ...fetchMoreResult.posts.posts,
                //       ],
                //     },
                //   };
                // },
              });
              // setVariables({
              //   // stringifyVariables(data.posts[data.posts.length - 1].id),
              // });
            }}
            isLoading={loading}
            m="auto"
            my={8}
          >
            load more
          </Button>
        </Flex>
      ) : null}
    </Layout>
  );
};
// if you wanna use urql then add the line below
// export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
export default withApollo({ ssr: true })(Index);
