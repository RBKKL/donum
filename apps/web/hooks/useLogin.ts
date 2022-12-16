import { useAccount, useNetwork, useSignMessage } from "wagmi";
import { getCsrfToken, signIn } from "next-auth/react";
import { SiweMessage } from "siwe";
import { SIGN_IN_MESSAGE } from "@donum/shared/constants";
import { useRouter } from "next/router";

export const useLogin = () => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { signMessageAsync } = useSignMessage();
  const router = useRouter();
  const { callbackUrl } = router.query;

  const login = async () => {
    try {
      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: SIGN_IN_MESSAGE,
        uri: window.location.origin,
        version: "1",
        chainId: chain?.id,
        nonce: await getCsrfToken(),
      });
      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      });
      await signIn("credentials", {
        redirect: true,
        message: JSON.stringify(message),
        signature,
        callbackUrl: Array.isArray(callbackUrl)
          ? callbackUrl[0]
          : callbackUrl || "/",
      });
    } catch (e) {
      console.log(e);
    }
  };

  return { login };
};
