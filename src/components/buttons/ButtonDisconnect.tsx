import { useDisconnect } from "@fuels/react";

import MyButton, { Props } from "../ui/MyButton";

export const ButtonDisconnect = (props: Props) => {
  const { disconnect } = useDisconnect();

  return (
    <MyButton
      onClick={() => disconnect()}
      color="destructive"
      {...props}
    >
      Disconnect
    </MyButton>
  );
};