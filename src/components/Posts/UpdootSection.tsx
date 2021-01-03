import { Flex, IconButton } from "@chakra-ui/core";
import React, { useState } from "react";
import {
  PostQuery,
  PostsQuery,
  useVoteMutation,
} from "../../generated/graphql";

interface UpdootSectionProps {
  post: PostQuery["post"];
}

export const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
  const [loadingState, setLoadingState] = useState<
    "updoot-loading" | "downdoot-loading" | "not-loading"
  >("not-loading");
  const [{ data }, vote] = useVoteMutation();
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
        onClick={() => {
          setLoadingState("updoot-loading");
          vote({ value: 1, postId: post!.id });
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
        onClick={() => {
          setLoadingState("downdoot-loading");
          vote({ value: -1, postId: post!.id });
          setLoadingState("not-loading");
        }}
        isLoading={loadingState === "downdoot-loading"}
        variantColor={post!.voteStatus === -1 ? "red" : undefined}
      />
    </Flex>
  );
};
