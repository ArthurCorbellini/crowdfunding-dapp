contract;

// --------------------
// ---- data_structures
// --------------------

pub struct Campaign {
    pub creator: Identity,
    pub is_closed: bool,
    pub deadline: u64,
    pub goal: u64,
    pub total_contributed: u64,
}

impl Campaign {
    pub fn new(creator: Identity, goal: u64, deadline: u64) -> Self {
        Self {
            creator,
            goal,
            deadline,
            total_contributed: 0,
            is_closed: false,
        }
    }
}

// --------------------
// --------- interfaces
// --------------------
abi Crowdfunding {
    #[storage(read, write)]
    fn create_campaign(goal: u64, deadline: u64);

    #[storage(read)]
    fn get_campaign(campaign_id: u64) -> Option<Campaign>;

    #[storage(read)]
    fn get_campaign_count() -> u64;
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
    fn create_campaign(goal: u64, deadline: u64) {
        // endereço e contractId do criador da campanha
        let creator: Identity = msg_sender().unwrap();

        let campaign: Campaign = Campaign::new(creator, goal, deadline); 
        
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
