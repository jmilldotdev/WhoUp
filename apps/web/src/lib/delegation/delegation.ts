import {
  type Call,
  type DelegationStruct,
  type ExecutionStruct,
  createCaveatBuilder,
  createRootDelegation,
  DelegationFramework,
  Implementation,
  MetaMaskSmartAccount,
  SINGLE_DEFAULT_MODE,
  toMetaMaskSmartAccount,
} from "@codefi/delegator-core-viem";
import { privateKeyToAccount, generatePrivateKey } from "viem/accounts";
import {
  bundlerClient,
  createSalt,
  publicClient,
  getFeePerGas,
} from "@/lib/delegation/delegation-setup";
import {
  type Address,
  encodeAbiParameters,
  encodeFunctionData,
  type Hex,
  isAddressEqual,
  zeroAddress,
} from "viem";

/**
 * Create a new MetaMaskSmartAccount representing a Hybrid Delegator Smart
 * Account where the signer is a "burner" account.
 * @resolves to the MetaMaskSmartAccount instance.
 */
export const createMetaMaskAccount = async () => {
  const owner = privateKeyToAccount(generatePrivateKey());

  const account = await toMetaMaskSmartAccount({
    client: publicClient,
    implementation: Implementation.Hybrid,
    deployParams: [owner.address, [], [], []],
    deploySalt: createSalt(),
    signatory: { account: owner },
  });
  return account;
};

export const createAdminDelegatorAccount = async () => {
  const owner = privateKeyToAccount(
    process.env.NEXT_PUBLIC_DELEGATOR_PRIVATE_KEY as Hex
  );
  const account = await toMetaMaskSmartAccount({
    client: publicClient,
    implementation: Implementation.Hybrid,
    deployParams: [owner.address, [], [], []],
    deploySalt: "0x",
    signatory: { account: owner },
  });
  return account;
};

/**
 * Create and sign a root delegation, from the delegatorAccount, to the
 * delegateAddress, allowing only a transfer of 0 ether to the zero address.
 * @param delegatorAccount - The MetaMaskSmartAccount that is creating the delegation.
 * @param delegateAddress - The address of the recipient of the delegation.
 * @resolves to the signed delegation.
 */
export const createDelegation = async (
  delegatorAccount: MetaMaskSmartAccount<Implementation>,
  delegateAddress: Address
) => {
  // These caveats are allowing only a transfer of 0 ether to the zero address.
  // Not a very useful operation, but it demonstrates how caveats that can be
  // applied to a delegation.
  const caveats = createCaveatBuilder(delegatorAccount.environment).addCaveat(
    "erc20TransferAmount",
    process.env.NEXT_PUBLIC_ERC20_ADDRESS as Address,
    10n
  );

  const delegation = createRootDelegation(
    delegateAddress,
    delegatorAccount.address,
    caveats,
    // The salt is used to create a unique delegation for each call.
    BigInt(createSalt())
  );
  const signature = await delegatorAccount.signDelegation({ delegation });

  return {
    ...delegation,
    signature,
  };
};

/**
 * Redeem the delegation, executing a zero value Call to the zero address. If
 * the Delegator is not deployed, a Call will be inserted to deploy the account
 * before redeeming the delegation.
 * @param redeemerAccount - The MetaMaskSmartAccount redeeming the delegation.
 * Must be the `delegate` on the delegation.
 * @param delegation - The delegation being redeemed.
 * @param delegatorFactoryArgs - The factoryArgs for the delegator account, if
 * the account is not deployed.
 * @resolves to the UserOperationHash, once it has been settled on chain.
 */
export const executeOnBehalfOfDelegator = async (
  redeemerAccount: MetaMaskSmartAccount<Implementation>,
  delegation: DelegationStruct,
  delegatorFactoryArgs?: { factory: Address; factoryData: Hex }
) => {
  if (!isAddressEqual(redeemerAccount.address, delegation.delegate)) {
    throw new Error(
      `Redeemer account address not equal to delegate. Redeemer: ${redeemerAccount.address}, delegate: ${delegation.delegate}`
    );
  }

  const delegationChain = [delegation];

  // The action that the redeemer is executing on behalf of the delegator.
  const executions: ExecutionStruct[] = [
    {
      target: process.env.NEXT_PUBLIC_ERC20_ADDRESS as Address,
      value: 10n,
      callData: encodeFunctionData({
        abi: [
          {
            name: "transfer",
            type: "function",
            inputs: [
              { name: "recipient", type: "address" },
              { name: "amount", type: "uint256" },
            ],
            outputs: [{ type: "bool" }],
            stateMutability: "nonpayable",
          },
        ],
        functionName: "transfer",
        args: [delegation.delegate, 10n],
      }),
    },
  ];

  const redeemDelegationCalldata = DelegationFramework.encode.redeemDelegations(
    [delegationChain],
    [SINGLE_DEFAULT_MODE],
    [executions]
  );

  const calls: Call[] = [
    {
      to: redeemerAccount.address,
      data: redeemDelegationCalldata,
    },
  ];

  // If the delegator account is not deployed, it must be deployed before
  // redeeming the delegation.
  if (delegatorFactoryArgs) {
    const { factory, factoryData } = delegatorFactoryArgs;

    calls.unshift({
      to: factory,
      data: factoryData,
    });
  }

  const feePerGas = await getFeePerGas();

  const userOperationHash = await bundlerClient.sendUserOperation({
    account: redeemerAccount,
    calls,
    ...feePerGas,
  });

  // This could be in a separate function, for a more responsive user operation,
  // but we leave it here for simplicity.
  return await bundlerClient.waitForUserOperationReceipt({
    hash: userOperationHash,
  });
};