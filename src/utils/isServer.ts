export const isServer = () => {
  // winodw is undefined it on the server
  return typeof window === "undefined";
};
