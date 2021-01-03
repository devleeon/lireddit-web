import {
  Menu,
  MenuButton,
  Link,
  MenuList,
  MenuItem,
  useToast,
  Button,
} from "@chakra-ui/core";
import React from "react";
import NextLink from "next/link";
import {
  PostQuery,
  useDeletePostMutation,
  useMeQuery,
} from "../../generated/graphql";

interface DeletePostProps {
  post: PostQuery["post"];
}

export const PostMenu: React.FC<DeletePostProps> = ({ post }) => {
  const [, deletePost] = useDeletePostMutation();
  const [{ data }] = useMeQuery();

  const toast = useToast();

  return (
    <Menu
    // placement="bottom-start"
    >
      <MenuButton ml="auto" as={Link} transition="all 0.2s">
        ...
      </MenuButton>
      <MenuList>
        <MenuItem>My Account</MenuItem>

        {data?.me?.id === post?.creatorId ? (
          <>
            <NextLink href="/post/edit/[id]" as={`/post/edit/${post!.id}`}>
              <MenuItem>Edit Post</MenuItem>KR
            </NextLink>
            <MenuItem
              onClick={async () => {
                const success = await deletePost({ id: post!.id });
                if (success.data?.deletePost) {
                  toast({
                    position: "top",
                    title: "deleted a post",
                    description: `We've deleted the post titled ${post!.title}`,
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                  });
                } else {
                  toast({
                    position: "top",
                    title: "Error",
                    description: "you are not the user who create this post",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                  });
                }
              }}
            >
              Delete Post
            </MenuItem>
          </>
        ) : null}
      </MenuList>
    </Menu>
  );
};
