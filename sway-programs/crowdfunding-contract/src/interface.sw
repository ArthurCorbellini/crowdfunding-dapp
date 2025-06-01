library;

use ::data_structures::Campaign;

abi Crowdfunding {
    #[storage(read, write)]
    fn create_campaign(goal: u64, deadline: u64);

    #[storage(read)]
    fn get_campaigns(id: u64) -> Option<Campaign>;
}
