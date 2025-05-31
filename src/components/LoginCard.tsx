import { useConnectUI, useIsConnected, useNetwork } from "@fuels/react";

import { providerUrl } from "../lib";
import { ButtonDisconnect } from "./buttons/ButtonDisconnect";
import { Destructive, H1, Muted, } from "./ui/my-typography";
import MyCard from "./ui/MyCard";
import MyButton from "./ui/MyButton";

const LoginCard = () => {
  const { connect } = useConnectUI();
  const { network } = useNetwork();
  const { isConnected } = useIsConnected();
  const isConnectedToCorrectNetwork = network?.url === providerUrl;

  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center px-4">
      <MyCard>
        <H1 className="text-center">
          Welcome to CrowdCoins!
        </H1>
        <Muted className="text-center mt-2 mb-6">
          You need to connect your wallet to start.
        </Muted>
        <MyButton onClick={() => connect()} disabled={isConnected && !isConnectedToCorrectNetwork}>
          Connect
        </MyButton>
        {isConnected && !isConnectedToCorrectNetwork &&
          <>
            <ButtonDisconnect className="mt-2" />
            <Destructive className="mt-4 text-center">
              It looks like you're connected to the wrong network. Please access your wallet and switch to the network below.
            </Destructive>
          </>
        }
        <Muted className="text-center mt-4">
          Requider network:{" "}
          <a
            href={providerUrl}
            target="_blank"
            rel="noreferrer"
            className="text-blue-500 hover:text-blue-700"
          >
            {providerUrl}
          </a>
        </Muted>
      </MyCard>
    </div>
  );
};

export default LoginCard;
