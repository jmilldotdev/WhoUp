import { createPublicClient, toHex, http } from "viem";
import { randomBytes } from "crypto";
import { lineaSepolia } from "viem/chains";
import {
  createBundlerClient,
  createPaymasterClient,
} from "viem/account-abstraction";
import { createPimlicoClient } from "permissionless/clients/pimlico";

export const chain = lineaSepolia;

export const BUNDLER_URL = process.env.NEXT_PUBLIC_BUNDLER_URL!;
export const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL!;

export const createSalt = () => toHex(randomBytes(8));

export const publicClient = createPublicClient({
  chain,
  transport: http(RPC_URL),
});

// todo: add policyId
export const paymasterClient = createPaymasterClient({
  transport: http(BUNDLER_URL),
});

export const bundlerClient = createBundlerClient({
  transport: http(BUNDLER_URL),
  chain,
  paymaster: paymasterClient,
});

export const getFeePerGas = async () => {
  // The method for determining fee per gas is dependent on the bundler
  // implementation. For this reason, this is centralised here.
  const pimlicoClient = createPimlicoClient({
    chain,
    transport: http(BUNDLER_URL),
  });

  const { fast } = await pimlicoClient.getUserOperationGasPrice();

  return fast;
};
