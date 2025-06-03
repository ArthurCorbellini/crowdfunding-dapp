import { useContext } from "react";
import { CampaignContext } from "../contexts/campaign-context";

export const useCampaign = () => {
  const context = useContext(CampaignContext);
  if (!context)
    throw new Error("useCampaign must be used within a CampaignProvider");
  return context;
}
