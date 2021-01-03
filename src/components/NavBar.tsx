import { Box, Button, Flex, Heading, Link } from "@chakra-ui/core";
import React from "react";
import NextLink from "next/link";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";
import { BACKGROUND_THEMECOLOR, TEXT_THEMECOLOR } from "../constants";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const [{ fetching, data }] = useMeQuery({
    pause: isServer(),
  });
  let body = <></>;
  if (fetching) {
    //data is loading
    body = (
      <>
        <div>loading</div>
      </>
    );
  } else if (!data?.me) {
    // user is not logged in
    body = (
      <>
        <NextLink href="/login">
          <Link fontSize="18px" color="white">
            log in
          </Link>
        </NextLink>
        <NextLink href="/register">
          <Link fontSize="18px" color="white" mx={4}>
            register
          </Link>
        </NextLink>
      </>
    );
  } else {
    //user is logged in
    body = (
      <>
        <NextLink href="/profile">
          <Link fontSize="16px" fontWeight={700} color="white">
            Hello! {data.me.username}
          </Link>
        </NextLink>
        <Button
          mx={4}
          backgroundColor={BACKGROUND_THEMECOLOR}
          color={TEXT_THEMECOLOR}
          isLoading={logoutFetching}
          onClick={() => logout()}
          variant="link"
        >
          log out
        </Button>
      </>
    );
  }
  return (
    <Flex position="sticky" top={0} zIndex={1} bg={BACKGROUND_THEMECOLOR} p={4}>
      <Flex maxW={800} flex={1} m="auto" align="center">
        <NextLink href="/">
          <Button
            backgroundColor={BACKGROUND_THEMECOLOR}
            color={TEXT_THEMECOLOR}
            variant="link"
          >
            <Heading>LiReddit</Heading>
          </Button>
        </NextLink>
        <Box ml={"auto"}>{body}</Box>
      </Flex>
    </Flex>
  );
};
