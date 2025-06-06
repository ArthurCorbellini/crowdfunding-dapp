import { useCampaign } from "../../hooks/useCampaign";
import { Campaign } from "../../types";
import { toEth } from "../../utils/currency-utils";
import ModalDonateCampaign from "../modals/ModalDonateCampaign";
import { Destructive, H2, H3, Mono, Muted, Span } from "../ui/my-typography";
import MyButton from "../ui/MyButton";

const DataViewCampaign = () => {
  const {
    allCampaigns,
    withdrawDonations,
    disableWithdrawButton,
    refund,
    disableRefundButton,
  } = useCampaign();

  const convertDate = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('pt-BR');
  };

  const withdrawFunds = (campaign: Campaign): void => {
    withdrawDonations(campaign);
  };

  return (
    <>
      {allCampaigns.length === 0 ? (
        <div className="bg-stone-900 rounded-md p-4 mt-6 text-center">
          <H3>No campaigns found.</H3>
        </div>
      ) : (
        allCampaigns.map((c, index) => (
          <div className="bg-stone-900 rounded-md p-4 mt-6" key={index}>
            <div className="flex">
              <div>
                <H2>{c.metadata}</H2>
                <div className="flex gap-2">
                  <Mono className="text-stone-300">Id:</Mono>
                  <Mono>{c.id}</Mono>
                </div>
                {c.isClosed &&
                  <Destructive className="pt-6">
                    CAMPAIGN CLOSED!
                  </Destructive>
                }
              </div>
              <div className="ml-auto">
                <MyButton
                  className="!w-40 mr-2"
                  color="secondary"
                  onClick={() => refund(c)}
                  disabled={disableRefundButton(c)}
                >
                  Refund
                </MyButton>
                <MyButton
                  className="!w-40 mr-2"
                  color="secondary"
                  onClick={() => withdrawFunds(c)}
                  disabled={disableWithdrawButton(c)}
                >
                  Withdraw funds
                </MyButton>
                <ModalDonateCampaign campaign={c} />
              </div>
            </div>
            <div className="py-6">
              <div className="flex flex-col gap-3">
                <Muted>Dev comments:</Muted>
                <Muted className="pl-6">
                  It's not a good practice to store long or dynamic strings directly in a smart contract, as on-chain storage is expensive and inefficient.
                  Instead, it's recommended to store only essential data (like short identifiers) and keep larger or changing content off-chain,
                  referencing them by their hash or CID in the contract. This approach reduces gas costs and improves scalability while maintaining data integrity.
                </Muted>
                <Muted className="pl-6">
                  For this project, I included the campaign title directly in the on-chain metadata field as a simple example — in a real-world scenario, this kind of
                  information would typically be stored off-chain.
                </Muted>
              </div>
            </div>
            <div className="flex justify-between border-b border-stone-700 py-1">
              <Span>Goal</Span>
              <Span>{`${toEth(c.goal)} ETH`}</Span>
            </div>
            <div className="flex justify-between border-b border-stone-700 py-1">
              <Span>Total Contributed</Span>
              <Span>{`${toEth(c.totalFunds)} ETH`}</Span>
            </div>
            <div className="flex justify-between py-1">
              <Span>DeadLine</Span>
              <Span>{convertDate(c.deadline)}</Span>
            </div>
          </div>
        ))
      )}
    </>
  );
};

export default DataViewCampaign;