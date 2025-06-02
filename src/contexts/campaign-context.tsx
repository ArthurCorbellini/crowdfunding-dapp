import { useBalance, useWallet } from '@fuels/react';
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

import { CrowdfundingContract } from '../sway-api';
import { crowdfundingContractId } from '../lib';
import { useNotification } from '../hooks/useNotification';
import { Campaign } from '../types';
import { useBaseAssetId } from '../hooks/useBaseAssetId';
import { toEth, toNano } from '../utils/currency-utils';
import { bn } from 'fuels';

interface CampaignContextType {
  isLoading: boolean,
  allCampaigns: Campaign[],
  loadCampaigns: () => void,
  createCampaign: (title: string, goal: number, deadLine: string) => void,
  donateToCampaign: (capaign: Campaign, amount: number) => void,
  withdrawDonations: (capaign: Campaign) => void,
  disableWithdrawButton: (capaign: Campaign) => boolean,
};

const CampaignContext = createContext<CampaignContextType | undefined>(undefined);

export const CampaignProvider = ({ children }: { children: ReactNode }) => {
  const {
    errorNotification,
    successNotification
  } = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const { wallet } = useWallet();
  const [contract, setContract] = useState<CrowdfundingContract>();
  const [allCampaigns, setAllCampaigns] = useState<Campaign[]>([]);
  const { baseAssetId } = useBaseAssetId();

  const { balance, refetch } = useBalance({ address: wallet?.address.toB256(), assetId: baseAssetId });

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
    const campaigns: Campaign[] = [];
    for (let i = 0; i < campaignCount; i++) {
      const { value: campaign } = await contract.functions.get_campaign(i).get();
      if (!campaign) return;
      campaigns.push({
        id: campaign.id.toNumber(),
        metadata: campaign.metadata,
        creator: campaign.creator,
        isClosed: campaign.is_closed,
        deadline: campaign.deadline.toNumber(),
        goal: campaign.goal,
        totalFunds: campaign.total_funds,
      });
    }
    setAllCampaigns(campaigns);
  }

  const donateToCampaign = async (campaign: Campaign, amount: number) => {
    if (!contract) return;

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      errorNotification("Donation value required.");
      return;
    }

    const realAmount = toNano(amount);

    if (balance?.lt(realAmount)) {
      errorNotification("Insufficient funds.");
      return;
    }

    try {
      setIsLoading(true);
      await contract.functions.donate(campaign.id)
        .txParams({
          variableOutputs: 1,
        })
        .callParams({
          forward: [realAmount, baseAssetId]
        })
        .call();
      successNotification("Donation made successfully!")
    } catch (e) {
      console.error(e);
      errorNotification("Error donate to campaign");
    } finally {
      setIsLoading(false);
    }
    loadCampaigns();
    refetch();
  }

  const withdrawDonations = async (campaign: Campaign) => {
    if (!contract) return;

    try {
      setIsLoading(true);
      await contract.functions.withdraw_donations(campaign.id)
        .txParams({
          variableOutputs: 1,
        }).call();
      successNotification("Funds withdrawn successfully!")
    } catch (e) {
      console.error(e);
      errorNotification("Failed to withdraw from campaign.");
    }
    loadCampaigns();
    refetch();
    setIsLoading(false);
  }

  const createCampaign = async (
    title: string,
    goal: number,
    deadLine: string
  ) => {
    if (!contract) return;

    if (balance?.lt(bn(1_000))) { // TO-DO improve the min funds required
      errorNotification("Insufficient funds.");
      return;
    }
    if (!title || title.trim() === "") {
      errorNotification("Campaign title required.");
      return;
    }
    if (!goal || isNaN(goal) || Number(goal) <= 0) {
      errorNotification("Campaign goal required.");
      return;
    }
    if (
      !deadLine ||
      !/^\d{4}-\d{2}-\d{2}$/.test(deadLine) ||
      isNaN(new Date(deadLine).getTime())
    ) {
      errorNotification("Campaign deadline required (valid format: yyyy-MM-dd).");
      return;
    }

    const dateDeadLine = new Date(deadLine);

    if (dateDeadLine < new Date()) {
      errorNotification("Campaign deadline must be in the future.");
      return;
    }

    const deadlineValue = Math.floor(dateDeadLine.getTime() / 1000);
    const metadata = title.replace(/[^a-zA-Z0-9 ]/g, "").padEnd(20, " ");

    try {
      setIsLoading(true);
      await contract.functions.create_campaign(metadata, toNano(goal), deadlineValue).call();
      successNotification("Campaign created successfully!")
    } catch (error) {
      console.error(error);
      errorNotification("Error saving new campaign");
    } finally {
      setIsLoading(false);
    }
    loadCampaigns();
    refetch();
  }

  const disableWithdrawButton = (
    campaign: Campaign
  ): boolean => {
    if (campaign.isClosed) return true;

    if (campaign.creator.Address?.bits !== wallet?.address.toB256()) return true;

    const deadLine = new Date(campaign.deadline * 1000);
    if (new Date() < deadLine) return true;

    const ethGoal = Number(toEth(campaign.goal));
    const ethFunds = Number(toEth(campaign.totalFunds));
    if (ethGoal >= ethFunds) return true;

    return false;
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
      donateToCampaign,
      withdrawDonations,
      disableWithdrawButton,
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
