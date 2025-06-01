import { useCampaign } from "../../contexts/campaign-context";
import ModalDonateCampaign from "../modals/ModalDonateCampaign";
import { H2, H3, Mono, P, Span } from "../ui/my-typography";

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
          <div className="flex">
            <div>
              <H2>{c.metadata}</H2>
              <div className="flex gap-2">
                <Mono className="text-stone-300">Id:</Mono>
                <Mono>{c.id}</Mono>
              </div>
            </div>
            <div className="ml-auto">
              <ModalDonateCampaign campaign={c} />
            </div>
          </div>
          <div className="py-6">
            <H3>Dev comments:</H3>
            <P>
              It's not a good practice to store long or dynamic strings directly in a smart contract, as on-chain storage is expensive and inefficient.
              Instead, it's recommended to store only essential data (like short identifiers) and keep larger or changing content off-chain,
              referencing them by their hash or CID in the contract. This approach reduces gas costs and improves scalability while maintaining data integrity.
            </P>
            <P>
              For this project, I included the campaign title directly in the on-chain metadata field as a simple example — in a real-world scenario, this kind of
              information would typically be stored off-chain.
            </P>
          </div>
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
        </div>
      ))}
    </>
  );
};

export default DataViewCampaign;