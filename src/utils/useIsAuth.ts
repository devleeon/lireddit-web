import Router, { useRouter } from "next/router";
import { useEffect } from "react";
import { useMeQuery } from "../generated/graphql";

export const useIsAuth = () => {
  const [{ data, fetching }] = useMeQuery();
  const router = useRouter();
  useEffect(() => {
    if (data?.me && !fetching) {
      router.replace("/");
    }
  }, [fetching, data, router]);
};
