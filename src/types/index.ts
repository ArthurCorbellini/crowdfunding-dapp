import { IdentityOutput } from "../sway-api/contracts/CrowdfundingContract";

export type Campaign = {
    creator: IdentityOutput;
    isClosed: boolean;
    deadline: number;
    goal: number;
    totalContributed: number;
};
