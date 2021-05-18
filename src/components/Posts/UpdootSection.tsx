import { ApolloCache } from "@apollo/client";
import { Flex, IconButton } from "@chakra-ui/core";
import gql from "graphql-tag";
import React, { useState } from "react";
import {
  PostQuery,
  PostsQuery,
  RegularPostFragment,
  useVoteMutation,
  VoteMutation,
} from "../../generated/graphql";

interface UpdootSectionProps {
  post: PostQuery["post"];
}

const updateAfterVote = (
  value: number,
  postId: number,
  cache: ApolloCache<VoteMutation>
) => {
  const data = cache.readFragment<{
    id: number;
    points: number;
    voteStatus: number | null;
  }>({
    id: "Post:" + postId,
    fragment: gql`
      fragment _ on Post {
        id
        points
        voteStatus
      }
    `,
  });
  if (data) {
    if (data.voteStatus === value) {
      // if user has already voted for the same value?
      // return;

      const nullify = (data.points as number) + -1 * value;
      // new cache write
      cache.writeFragment({
        id: "Post:" + postId,
        fragment: gql`
          fragment __ on Post {
            points
            voteStatus
          }
        `,
        data: {
          points: nullify,
          voteStatus: null,
        },
      });
      return;
    } else {
      const newPoints =
        (data.points as number) + (!data.voteStatus ? 1 : 2) * value;
      cache.writeFragment({
        id: "Post:" + postId,
        fragment: gql`
          fragment __ on Post {
            points
            voteStatus
          }
        `,
        data: {
          points: newPoints,
          voteStatus: value,
        },
      });
    }
  }
};

export const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
  const [loadingState, setLoadingState] = useState<
    "updoot-loading" | "downdoot-loading" | "not-loading"
  >("not-loading");
  const [vote, { data }] = useVoteMutation();
  console.log(post!.id);

  return (
    <Flex
      direction="column"
      justifyContent="center"
      alignItems="center"
      maxW="40px"
      backgroundColor="lightgray"
      color="Gray"
      mr={4}
    >
      {/* 좋아요 누르기 완성하기 */}
      <IconButton
        aria-label="updoot post"
        icon="arrow-up"
        size="xs"
        variant="ghost"
        onClick={async () => {
          setLoadingState("updoot-loading");
          await vote({
            variables: { value: 1, postId: post!.id },
            update: (cache) => updateAfterVote(1, post.id, cache),
          });
          setLoadingState("not-loading");
        }}
        isLoading={loadingState === "updoot-loading"}
        variantColor={post!.voteStatus === 1 ? "green" : undefined}
      />

      <div>{post?.points}</div>
      <IconButton
        aria-label="downdoot post"
        icon="add"
        size="xs"
        variant="ghost"
        onClick={async () => {
          setLoadingState("downdoot-loading");
          await vote({
            variables: { value: -1, postId: post!.id },
            update: (cache) => updateAfterVote(-1, post.id, cache),
          });
          setLoadingState("not-loading");
        }}
        isLoading={loadingState === "downdoot-loading"}
        variantColor={post!.voteStatus === -1 ? "red" : undefined}
      />
    </Flex>
  );
};
