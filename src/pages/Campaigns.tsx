import ModalNewCampaign from "../components/modals/ModalNewCampaign";
import { H2 } from "../components/ui/my-typography";

const Campaigns = () => {
  return (
    <div className="flex gap-4 w-full">
      <H2>Campaigns</H2>
      <ModalNewCampaign />
    </div>
  );
};

export default Campaigns;