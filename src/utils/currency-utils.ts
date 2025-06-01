import { bn, BN } from "fuels";

const ETH_DECIMALS = 1_000_000_000;

export const toNano = (amount: number): BN => {
  return bn(Math.round(amount * ETH_DECIMALS));
}

export const toEth = (amount: BN): string => {
  const ethString = amount.div(ETH_DECIMALS).toString();
  const remainder = amount.mod(ETH_DECIMALS).toString().padStart(9, '0');
  return `${ethString}.${remainder}`;
};