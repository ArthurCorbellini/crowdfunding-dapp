import { useWallet } from '@fuels/react';
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

import { CrowdfundingContract } from '../sway-api';
import { crowdfundingContractId } from '../lib';
import { useNotification } from '../hooks/useNotification';
import { Campaign } from '../types';

interface CampaignContextType {
  isLoading: boolean,
  allCampaigns: Campaign[],
  loadCampaigns: () => void,
  createCampaign: (goal: number, deadLine: string) => void,
};

const CampaignContext = createContext<CampaignContextType | undefined>(undefined);

export const CampaignProvider = ({ children }: { children: ReactNode }) => {
  const {
    errorNotification,
    transactionSubmitNotification,
    transactionSuccessNotification,
  } = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const { wallet } = useWallet();
  const [contract, setContract] = useState<CrowdfundingContract>();
  const [allCampaigns, setAllCampaigns] = useState<Campaign[]>([]);

  const loadContract = () => {
    if (wallet) setContract(new CrowdfundingContract(crowdfundingContractId, wallet));
  }

  const getCampaignCount = async () => {
    if (!contract) return 0;
    const { value } = await contract.functions.get_campaign_count().get();
    return value.toNumber();
  }

  const loadCampaigns = async () => {
    if (!contract) return;
    const campaignCount = await getCampaignCount();
    const campaigns = [];
    for (let i = 0; i < campaignCount; i++) {
      const { value: campaign } = await contract.functions.get_campaign(i).get();
      if (!campaign) return;
      campaigns.push({
        creator: campaign.creator,
        isClosed: campaign.is_closed,
        deadline: campaign.deadline.toNumber(),
        goal: campaign.goal.toNumber(),
        totalContributed: campaign.total_contributed.toNumber(),
      });
    }
    setAllCampaigns(campaigns);
  }

  const createCampaign = async (
    goal: number,
    deadLine: string
  ) => {
    if (!contract) return;
    try {
      setIsLoading(true);
      const deadlineValue = Math.floor(new Date(deadLine!).getTime() / 1000);
      const call = await contract.functions.create_campaign(goal, deadlineValue).call();
      transactionSubmitNotification(call.transactionId);
      const result = await call.waitForResult();
      transactionSuccessNotification(result.transactionId);
    } catch (error) {
      console.error(error);
      errorNotification("Error saving new campaign");
    }
    loadCampaigns();
    setIsLoading(false);
  }

  useEffect(() => {
    loadContract();
    loadCampaigns();
  }, [wallet]);

  return (
    <CampaignContext.Provider value={{
      isLoading,
      allCampaigns,
      loadCampaigns,
      createCampaign,
    }}>
      {children}
    </CampaignContext.Provider>
  );
}

export const useCampaign = () => {
  const context = useContext(CampaignContext);
  if (!context)
    throw new Error("useCampaign must be used within a CampaignProvider");
  return context;
}
