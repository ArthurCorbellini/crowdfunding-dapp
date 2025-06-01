import { IdentityOutput } from "../sway-api/contracts/CrowdfundingContract";

export type Campaign = {
    id: number,
    metadata: string,
    creator: IdentityOutput,
    isClosed: boolean,
    deadline: number,
    goal: number,
    totalContributed: number,
};
