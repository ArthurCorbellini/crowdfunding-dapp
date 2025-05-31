library;

abi Crowdfunding {
    #[storage(read, write)]
    fn create_campaign(goal: u64, deadline: u64);
}