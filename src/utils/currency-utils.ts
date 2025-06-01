import { bn, BN } from "fuels";

const ETH_DECIMALS = 1_000_000_000;

export const toNano = (amount: number): BN => {
  return bn(Math.round(amount * ETH_DECIMALS));
}

export const toEth = (amount: BN): String => {
  return amount.format({ precision: 9 });
};
