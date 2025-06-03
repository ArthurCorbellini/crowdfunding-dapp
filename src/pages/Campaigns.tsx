import DataViewCampaign from "../components/data-view/DataViewCampaign";
import ModalNewCampaign from "../components/modals/ModalNewCampaign";
import { H2 } from "../components/ui/my-typography";
import { CampaignProvider } from "../providers/campaign-provider";

const Campaigns = () => {
  return (
    <CampaignProvider>
      <div className="flex gap-4 w-full">
        <H2>Campaigns</H2>
        <ModalNewCampaign />
      </div>
      <DataViewCampaign />
    </CampaignProvider>
  );
};

export default Campaigns;