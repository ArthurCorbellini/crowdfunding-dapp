library;

use ::data_structures::Campaign;

abi Crowdfunding {
    #[storage(read, write)]
    fn create_campaign(metadata: str[20], goal: u64, deadline: u64);

    #[storage(read)]
    fn get_campaign(campaign_id: u64) -> Option<Campaign>;

    #[storage(read)]
    fn get_campaign_count() -> u64;

    #[storage(read, write), payable]
    fn donate(campaign_id: u64);

    #[storage(read, write)]
    fn withdraw_donations(campaign_id: u64);
}
