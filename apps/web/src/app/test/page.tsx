"use client";

import InstallPrompt from "@/components/InstallPrompt";
import PushNotificationManager from "@/components/PushNotificationManager";
import { BroadcastDialog } from "@/components/BroadcastDialog";
import { createGardenObject } from "@/actions/gardenObjects";
import { useUser } from "@/providers/UserProvider";
import { useState } from "react";
import { toast } from "sonner";
import {
  createAdminDelegatorAccount,
  createDelegation,
  createMetaMaskAccount,
  executeOnBehalfOfDelegator,
} from "@/lib/delegation/delegation";
import { Button } from "@/components/ui/button";
import { Implementation } from "@codefi/delegator-core-viem";
import { MetaMaskSmartAccount } from "@codefi/delegator-core-viem";
import { generatePrivateKey } from "viem/accounts";
import { UserOperationReceipt } from "viem/account-abstraction";

const TestPage = () => {
  const { userId } = useUser();
  const [isCreating, setIsCreating] = useState(false);
  const [userDelegateAccount, setUserDelegateAccount] =
    useState<MetaMaskSmartAccount<Implementation>>();
  const [userOperationReceipt, setUserOperationReceipt] =
    useState<UserOperationReceipt>();
  const [userOperationErrorMessage, setUserOperationErrorMessage] =
    useState<string>();
  const [executeOnBehalfOfLoading, setExecuteOnBehalfOfLoading] =
    useState(false);

  const handleCreateObject = async () => {
    if (!userId) {
      toast.error("Please login first");
      return;
    }

    try {
      setIsCreating(true);
      const result = await createGardenObject(userId);
      toast.success(`Created new ${result.object_component_type}!`);
    } catch (error) {
      toast.error("Failed to create garden object");
      console.error(error);
    } finally {
      setIsCreating(false);
    }
  };

  const getPrivateKey = () => {
    const pk = generatePrivateKey();
    console.log(pk);
  };

  const showDelegatorAccount = async () => {
    const account = await createAdminDelegatorAccount();
    console.log(account);
  };

  const handleCreateAccount = async () => {
    const account = await createMetaMaskAccount();
    setUserDelegateAccount(account);
    console.log(account);
  };

  const handleCreateDelegation = async () => {
    if (!userDelegateAccount) {
      toast.error("Please create an account first");
      return;
    }
    setExecuteOnBehalfOfLoading(true);
    try {
      const account = await createAdminDelegatorAccount();
      const delegation = await createDelegation(
        account,
        userDelegateAccount.address
      );
      console.log(delegation);
      const receipt = await executeOnBehalfOfDelegator(
        userDelegateAccount,
        delegation,
        undefined
      );
      if (receipt.success) {
        setUserOperationReceipt(receipt);
        console.log(receipt);
      } else {
        throw new Error(`User operation failed: ${receipt.reason}`);
      }
    } catch (error) {
      console.error(error);
      setUserOperationErrorMessage((error as Error).message);
    } finally {
      setExecuteOnBehalfOfLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="space-y-4">
        <div>TestPage</div>
        <PushNotificationManager />
        <InstallPrompt />
        <BroadcastDialog />

        <button
          onClick={handleCreateObject}
          disabled={isCreating}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCreating ? "Creating..." : "Create Random Garden Object"}
        </button>

        <Button onClick={getPrivateKey}>Get Private Key</Button>
        <Button onClick={showDelegatorAccount}>Show Delegator Account</Button>
        <Button onClick={handleCreateAccount}>Create Account</Button>
        <Button
          onClick={handleCreateDelegation}
          disabled={executeOnBehalfOfLoading}
        >
          {executeOnBehalfOfLoading
            ? "Creating..."
            : "Create & Redeem Delegation"}
        </Button>
        {userOperationReceipt && (
          <div className="text-green-500">User operation successful!</div>
        )}
      </div>
    </div>
  );
};

export default TestPage;
