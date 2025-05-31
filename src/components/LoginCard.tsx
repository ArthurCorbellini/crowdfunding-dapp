import { useConnectUI } from "@fuels/react";
import Button from "./Button";
import { providerUrl } from "../lib";

const LoginCard = () => {
  const { connect } = useConnectUI();

  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-stone-900 rounded-2xl shadow-xl p-8 border border-stone-700">
        <h2 className="text-2xl font-bold text-stone-100 text-center">
          Welcome to CrowdCoins!
        </h2>
        <p className="text-sm text-stone-400 text-center mt-2 mb-6">
          Connect your wallet to start.
        </p>
        <Button onClick={() => connect()}>
          Connect
        </Button>
        <p className="mt-6 text-center text-sm text-stone-400">
          Requider network:{" "}
          <a
            href={providerUrl}
            target="_blank"
            rel="noreferrer"
            className="text-blue-500 hover:text-blue-700"
          >
            {providerUrl}
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginCard;
