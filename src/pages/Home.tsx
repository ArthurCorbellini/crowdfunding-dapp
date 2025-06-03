import { H2, H3, LI, P } from "../components/ui/my-typography";

const Home = () => {
  return (
    <>
      <H2>Home</H2>
      <div className="bg-stone-900 rounded-md p-6 mt-6">
        <H2>About this Project</H2>
        <P>
          This is a Web3 crowdfunding dapp built with <strong>Sway</strong> on the <strong>Fuel Network</strong>. It allows users to <strong>create crowdfunding campaigns</strong>, make <strong>token-based donations</strong>, and handle <strong>withdrawals or refunds</strong> based on campaign outcomes.
          Each campaign includes a title, a funding goal, and a deadline. Users can donate to active campaigns, and once the goal is reached and the deadline has passed, the campaign creator can withdraw the funds.
          If the goal is not reached by the deadline, donors are eligible to claim refunds.
        </P>
      </div>
      <div className="flex gap-6">
        <div className="flex flex-col bg-stone-900 rounded-md p-6 mt-6 w-1/2">
          <H2>Rules</H2>
          <div className="py-3">
            <H3>Create Campaign Rules:</H3>
            <ul>
              <LI>Title, goal, and deadline are required fields;</LI>
              <LI>The goal must be greater than zero;</LI>
              <LI>The deadline must be a future date;</LI>
              <LI>You must have sufficient funds in your wallet.</LI>
            </ul>
          </div>
          <div className="py-3">
            <H3>Donation Rules:</H3>
            <ul>
              <LI>The campaign must be open;</LI>
              <LI>The donation amount must be greater than zero;</LI>
              <LI>You must have sufficient funds in your wallet.</LI>
            </ul>
          </div>
          <div className="py-3">
            <H3>Withdraw Donations Rules:</H3>
            <ul>
              <LI>The campaign must be open;</LI>
              <LI>Only the campaign creator can withdraw the funds;</LI>
              <LI>The campaign deadline must have passed;</LI>
              <LI>The campaign must have reached its funding goal.</LI>
            </ul>
          </div>
          <div className="py-3">
            <H3>Refund Donations Rules:</H3>
            <ul>
              <LI>The campaign must be open;</LI>
              <LI>Only donors can request a refund;</LI>
              <LI>The campaign deadline must have passed;</LI>
              <LI>The campaign must <strong>not</strong> have reached its funding goal.</LI>
            </ul>
          </div>
        </div>
        <div className="flex flex-col bg-stone-900 rounded-md p-6 mt-6 w-1/2">
          <H2>Tips</H2>
          <P>
            👉 You can see your connected wallet at the bottom left corner of the screen. Additionally,
            if this dApp is running locally, you can transfer 5 ETH to your address by clicking the "add funds" button.
          </P>
          <P>
            👉 To get started, click on the "/campaigns" tab in the left sidebar menu and create a campaign.
          </P>
          <P>
            👉 You must have a connected wallet to use this dApp.
          </P>
          <P>
            👉 You can access the project repository <a href="https://github.com/ArthurCorbellini/crowdfunding-dapp" target="_blank" className="text-stone-300 hover:underline">here</a>.
          </P>
          <div className="mt-8 border-t border-stone-700 pt-6 text-sm text-center">
            <P>
              Developed by Arthur Corbellini.
            </P>
            <P>
              LinkedIn: <a href="https://linkedin.com/in/arthurcorbellini/" target="_blank" className="text-stone-300 hover:underline">linkedin.com/in/arthurcorbellini/</a> <br />
              GitHub: <a href="https://github.com/ArthurCorbellini" target="_blank" className="text-stone-300 hover:underline">github.com/ArthurCorbellini</a>
            </P>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;