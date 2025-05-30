library;

abi Crowdfunding {
    #[storage(read, write)]
    fn create_campaign(title: str[64], goal: u64, deadline: u64);
}