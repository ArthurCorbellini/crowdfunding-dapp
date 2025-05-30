contract;

mod abis;
mod structs;

use abis::Crowdfunding;
use structs::Campaign;

storage {
    campaigns: StorageMap<u64, Campaign> = StorageMap {},
    campaign_count: u64 = 0,
}

impl Crowdfunding for Contract {
    #[storage(read, write)]
    fn create_campaign(title: str[64], goal: u64, deadline: u64) {
        // endereço e contractId do criador da campanha
        let creator: Identity = msg_sender().unwrap();

        let campaign: Campaign = Campaign::new(creator, title, goal, deadline);

        // insere a campanha dentro do map de campanhas
        storage
            .campaigns
            .insert(storage.campaign_count.read(), campaign);

        // atualiza o contador de campanhas, somando +1 na variável
        storage
            .campaign_count
            .write(storage.campaign_count.read() + 1);
    }
}
