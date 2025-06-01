library;

pub struct Campaign {
    pub creator: Identity,
    
    pub is_closed: bool,
    
    pub deadline: u64,

    pub goal: u64,
    pub total_contributed: u64,
}

impl Campaign {
    pub fn new(
        creator: Identity, 
        goal: u64,
        deadline: u64
    ) -> Self {
        Self {
            creator,
            goal,
            deadline,
            total_contributed: 0,
            is_closed: false,
        }
    }
}
