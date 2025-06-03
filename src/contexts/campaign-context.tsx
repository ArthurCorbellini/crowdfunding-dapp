import { createContext } from "react";
import { Campaign } from "../types";

interface CampaignContextType {
  isLoading: boolean,
  allCampaigns: Campaign[],
  loadCampaigns: () => void,
  createCampaign: (title: string, goal: number, deadLine: string) => void,
  donateToCampaign: (capaign: Campaign, amount: number) => void,
  withdrawDonations: (capaign: Campaign) => void,
  disableWithdrawButton: (capaign: Campaign) => boolean,
  refund: (capaign: Campaign) => void,
  disableRefundButton: (capaign: Campaign) => boolean,
};

export const CampaignContext = createContext<CampaignContextType | undefined>(undefined);