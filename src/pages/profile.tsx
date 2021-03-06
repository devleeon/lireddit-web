import { Heading } from "@chakra-ui/core";
import { withUrqlClient } from "next-urql";
import React from "react";
import { Layout } from "../components/Layout";
import { createUrqlClient } from "../utils/createUrqlClient";
import { withApollo } from "../utils/withApollo";

interface profileProps {}
const Profile: React.FC<profileProps> = ({}) => {
  return (
    <Layout variant="regular">
      <Heading mx="auto">profile</Heading>
    </Layout>
  );
};

// export default withUrqlClient(createUrqlClient)(Profile);
export default withApollo({ ssr: false })(Profile);
