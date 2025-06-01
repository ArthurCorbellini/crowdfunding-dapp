import { useCampaign } from "../../contexts/campaign-context";
import ModalDonateCampaign from "../modals/ModalDonateCampaign";
import { Span } from "../ui/my-typography";

const DataViewCampaign = () => {
  const { allCampaigns } = useCampaign();

  const convertDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('pt-BR');
  }

  return (
    <>
      {allCampaigns.map((c, index) => (
        <div className="bg-stone-900 rounded-md p-4 mt-6" key={index}>
          <div className="flex justify-between border-b border-stone-700 py-1">
            <Span>Goal</Span>
            <Span>{`${c.goal} ETH`}</Span>
          </div>
          <div className="flex justify-between border-b border-stone-700 py-1">
            <Span>Total Contributed</Span>
            <Span>{`${c.totalContributed} ETH`}</Span>
          </div>
          <div className="flex justify-between py-1">
            <Span>DeadLine</Span>
            <Span>{convertDate(c.deadline)}</Span>
          </div>
          <div className="pt-4 flex justify-end">
            <ModalDonateCampaign />
          </div>
        </div>
      ))}
    </>
  );
};

export default DataViewCampaign;