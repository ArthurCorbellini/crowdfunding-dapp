import { useState } from "react";

import MyCard from "../ui/MyCard";
import MyOverlay from "../ui/MyOverlay";
import { H2, H3, Muted } from "../ui/my-typography";
import { MyInput } from "../ui/MyInput";
import MyButton from "../ui/MyButton";
import { useCampaign } from "../../contexts/campaign-context";
import { Campaign } from "../../types";

const ModalDonateCampaign = ({ campaign }: { campaign: Campaign }) => {
  const [isOpen, setIsOpen] = useState(false);

  const { isLoading, donateToCampaign } = useCampaign();
  const [donation, setDonation] = useState<number>(0);

  const saveAction = async () => {
    donateToCampaign(campaign, donation);
  }

  return (
    <>
      <MyButton disabled={campaign.isClosed} className="!w-40" onClick={() => setIsOpen(true)}>
        Donate
      </MyButton>
      {isOpen && (
        <MyOverlay>
          <MyCard className="flex flex-col gap-4">
            <div>
              <H2>Donate to Campaign</H2>
              <Muted>
                Fill in the amount you want to donate to this campaign.
              </Muted>
            </div>
            <div>
              <H3>Value</H3>
              <MyInput
                type="number"
                value={donation}
                onChange={(e) => setDonation(Number(e.target.value))}
                disabled={isLoading}
              />
            </div>
            <div className="flex gap-2 mt-4">
              <MyButton
                color="secondary"
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
              >
                Back
              </MyButton>
              <MyButton
                onClick={saveAction}
                disabled={isLoading}
              >
                Donate
              </MyButton>
            </div>
          </MyCard>
        </MyOverlay>
      )}
    </>
  );
};

export default ModalDonateCampaign;