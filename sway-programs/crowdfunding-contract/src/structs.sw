library;

pub struct Campaign {
    pub creator: Identity,
    pub title: str[64],
    pub goal: u64,
    pub deadline: u64,
    pub total_contributed: u64,
    pub is_closed: bool,
}

impl Campaign {
    pub fn new(
        creator: Identity, 
        title: str[64], 
        goal: u64,
        deadline: u64
    ) -> Self {
        Self {
            creator,
            title,
            goal,
            deadline,
            total_contributed: 0,
            is_closed: false,
        }
    }
}
