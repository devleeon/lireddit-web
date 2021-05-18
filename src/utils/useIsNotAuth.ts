import Router, { useRouter } from "next/router";
import { useEffect } from "react";
import { useMeQuery } from "../generated/graphql";

export const useIsNotAuth = () => {
  const { data, loading } = useMeQuery();
  const router = useRouter();
  useEffect(() => {
    if (!data?.me && !loading) {
      router.replace(`/login?from=${router.pathname}`);
    }
  }, [loading, data, router]);
};
