import { useState } from "react";
import Button from "../buttons/Button";

import MyCard from "../ui/MyCard";
import MyOverlay from "../ui/MyOverlay";
import { H2, H3, Muted } from "../ui/my-typography";
import { MyInput } from "../ui/MyInput";

const ModalNewCampaign = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button className="!w-40" onClick={() => setIsOpen(true)}>
        New campaign
      </Button>

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
              <Button color="secondary" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                // salvar lógica
                setIsOpen(false);
              }}>
                Save
              </Button>
            </div>
          </MyCard>
        </MyOverlay>
      )}
    </>
  );
};

export default ModalNewCampaign;