import { useDisconnect } from "@fuels/react";

import Button, { Props } from "./Button";

export const ButtonDisconnect = (props: Props) => {
  const { disconnect } = useDisconnect();

  return (
    <Button
      onClick={() => disconnect()}
      color="secondary"
      {...props}
    >
      Disconnect
    </Button>
  );
};