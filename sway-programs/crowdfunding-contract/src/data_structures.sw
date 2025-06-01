library;

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
