import { Address, bn, WalletUnlocked } from "fuels";
import { useWallet } from "@fuels/react";
import { useState } from "react";

import Button from "./buttons/Button.tsx";
import { useNotification } from "../hooks/useNotification.tsx";

type Props = {
  refetch: () => void;
  addressToFund?: string;
};

export default function LocalFaucet({ refetch, addressToFund }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const {
    errorNotification,
    transactionSubmitNotification,
    transactionSuccessNotification,
  } = useNotification();

  const { wallet } = useWallet();

  async function localTransfer() {
    if (!wallet) return;
    setIsLoading(true);
    try {
      const genesis = new WalletUnlocked(
        process.env.VITE_GENESIS_WALLET_PRIVATE_KEY as string,
        wallet.provider,
      );
      const tx = await genesis.transfer(
        Address.fromB256(addressToFund || wallet.address.toB256()),
        bn(5_000_000_000),
      );
      transactionSubmitNotification(tx.id);
      await tx.waitForResult();
      transactionSuccessNotification(tx.id);
    } catch (error) {
      console.error(error);
      errorNotification("Error transferring funds.");
    }
    setIsLoading(false);
    refetch();
  }

  return (
    <Button
      onClick={localTransfer}
      disabled={isLoading}
    >
      Add founds
    </Button>
  );
}
