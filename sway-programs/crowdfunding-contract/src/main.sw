contract;

use std::{asset::transfer, auth::msg_sender, context::msg_amount};

// --------------------
// ---- data_structures
// --------------------

pub struct Campaign {
    pub id: u64,
    pub creator: Identity,
    pub asset: AssetId,
    pub is_closed: bool,
    pub deadline: u64,
    pub goal: u64,
    pub total_funds: u64,
    pub metadata: str[20],
}

impl Campaign {
    pub fn new(
        id: u64,
        metadata: str[20],
        creator: Identity,
        goal: u64,
        deadline: u64,
    ) -> Self {
        Self {
            id,
            metadata,
            creator,
            goal,
            deadline,
            total_funds: 0,
            is_closed: false,
            asset: AssetId::base(),
        }
    }
}

// --------------------
// --------- interfaces
// --------------------
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

// --------------------
// ---------- contracts
// --------------------
storage {
    campaigns: StorageMap<u64, Campaign> = StorageMap {},
    campaign_count: u64 = 0,
}

impl Crowdfunding for Contract {
    #[storage(read)]
    fn get_campaign(campaign_id: u64) -> Option<Campaign> {
        storage.campaigns.get(campaign_id).try_read()
    }

    #[storage(read)]
    fn get_campaign_count() -> u64 {
        storage.campaign_count.read()
    }

    #[storage(read, write)]
    fn create_campaign(metadata: str[20], goal: u64, deadline: u64) {
        let creator: Identity = msg_sender().unwrap();
        let id: u64 = storage.campaign_count.read();
        let campaign: Campaign = Campaign::new(id, metadata, creator, goal, deadline);

        // insere a campanha dentro do map de campanhas        
        storage.campaigns.insert(id, campaign);
        // atualiza o contador de campanhas, somando +1 na variável
        storage.campaign_count.write(id + 1);
    }

    #[payable]
    #[storage(read, write)]
    fn donate(campaign_id: u64) {
        // pega a campanha
        let mut campaign: Campaign = storage.campaigns.get(campaign_id).try_read().unwrap();
        // soma o valor doado no valor antigo da campanha
        campaign.total_funds += msg_amount();
        // substitui a campanha antiga pela nova
        storage.campaigns.insert(campaign_id, campaign);
    }

    #[storage(read, write)]
    fn withdraw_donations(campaign_id: u64) {
        let mut campaign: Campaign = storage.campaigns.get(campaign_id).try_read().unwrap();

        campaign.is_closed = true;
        storage.campaigns.insert(campaign_id, campaign);

        transfer(campaign.creator, campaign.asset, campaign.total_funds);
    }
}
