import { useState } from "react";

import MyCard from "../ui/MyCard";
import MyOverlay from "../ui/MyOverlay";
import { H2, H3, Muted } from "../ui/my-typography";
import { MyInput } from "../ui/MyInput";
import MyButton from "../ui/MyButton";

const ModalNewCampaign = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <MyButton className="!w-40" onClick={() => setIsOpen(true)}>
        New campaign
      </MyButton>

      {isOpen && (
        <MyOverlay>
          <MyCard>
            <H2>Create New Campaign</H2>
            <Muted className="mb-4">
              Fill in the details to start a new campaign.
            </Muted>

            <H3>Title</H3>
            <MyInput placeholder="The campaign title..." />

            <div className="flex gap-2 pt-6">
              <MyButton color="secondary" onClick={() => setIsOpen(false)}>
                Cancel
              </MyButton>
              <MyButton onClick={() => {
                // salvar lógica
                setIsOpen(false);
              }}>
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