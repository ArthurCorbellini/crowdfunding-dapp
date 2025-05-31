import { useEffect, useState } from "react";
import { useWallet } from "@fuels/react";

import MyCard from "../ui/MyCard";
import MyOverlay from "../ui/MyOverlay";
import { Destructive, H2, H3, Muted } from "../ui/my-typography";
import { MyInput } from "../ui/MyInput";
import MyButton from "../ui/MyButton";
import { CrowdfundingContract } from "../../sway-api";
import { crowdfundingContractId } from "../../lib";
import { useNotification } from "../../hooks/useNotification";

const ModalNewCampaign = () => {
  const [isOpen, setIsOpen] = useState(false);

  const {
    errorNotification,
    transactionSubmitNotification,
    transactionSuccessNotification,
  } = useNotification();
  const [isLoading, setIsLoading] = useState(false);

  const [title, setTitle] = useState<string>();
  const [goal, setGoal] = useState<number>(0);
  const [deadLine, setDeadLine] = useState<string>();

  const { wallet } = useWallet();
  const [contract, setContract] = useState<CrowdfundingContract>();

  const isInvalidForm = (): boolean => {
    if (!title || title.trim() === "") {
      errorNotification("Please inform the title.");
      return true;
    }
    if (!goal || isNaN(goal) || Number(goal) <= 0) {
      errorNotification("Please inform the goal.");
      return true;
    }
    if (
      !deadLine ||
      !/^\d{4}-\d{2}-\d{2}$/.test(deadLine) ||
      isNaN(new Date(deadLine).getTime())
    ) {
      errorNotification("Please provide a valid deadline (format: yyyy-MM-dd).");
      return true;
    }

    return false;
  }

  const saveAction = async () => {
    if (isInvalidForm()) return;

    if (!wallet || !contract) return;
    setIsLoading(true);

    const deadlineValue = Math.floor(new Date(deadLine!).getTime() / 1000);

    try {
      const call = await contract.functions.create_campaign(goal, deadlineValue).call();
      transactionSubmitNotification(call.transactionId);
      const result = await call.waitForResult();
      transactionSuccessNotification(result.transactionId);
    } catch (error) {
      console.error(error);
      errorNotification("Error saving new campaign");
    }

    setIsLoading(false);
    setIsOpen(false);
  }

  useEffect(() => {
    if (wallet) setContract(new CrowdfundingContract(crowdfundingContractId, wallet));
  }, [wallet]);

  return (
    <>
      <MyButton className="!w-40" onClick={() => setIsOpen(true)}>
        New campaign
      </MyButton>

      {isOpen && (
        <MyOverlay>
          <MyCard className="flex flex-col gap-4">
            <div>
              <H2>Create New Campaign</H2>
              <Muted>
                Fill in the details to start a new campaign.
              </Muted>
            </div>
            <div>
              <H3>Title</H3>
              <MyInput
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="The campaign title..."
                disabled={isLoading}
              />
            </div>
            <div>
              <H3>Goal</H3>
              <MyInput
                type="number"
                value={goal}
                onChange={(e) => setGoal(Number(e.target.value))}
                placeholder="The funding goal..."
                disabled={isLoading}
              />
            </div>
            <div>
              <H3>
                Deadline
              </H3>
              <MyInput
                type="text"
                value={deadLine}
                onChange={(e) => setDeadLine(e.target.value)}
                placeholder="The yyyy-MM-dd deadline..."
                disabled={isLoading}
              />
              <Destructive className="pl-1">
                Please, use the yyyy-MM-dd format.
              </Destructive>
            </div>
            <div className="flex gap-2 mt-4">
              <MyButton
                color="secondary"
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </MyButton>
              <MyButton
                onClick={saveAction}
                disabled={isLoading}
              >
                Save
              </MyButton>
            </div>
          </MyCard>
        </MyOverlay>
      )}
    </>
  );
};

export default ModalNewCampaign;