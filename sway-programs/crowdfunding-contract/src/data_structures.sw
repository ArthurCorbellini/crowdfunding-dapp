library;

/// Represents a crowdfunding campaign.
pub struct Campaign {
    /// Unique identifier for the campaign.
    pub id: u64,

    /// Address or identity of the campaign creator.
    pub creator: Identity,

    /// The asset used for donations (defaults to the base asset).
    pub asset: AssetId,

    /// Flag indicating whether the campaign is closed.
    /// - `true`: No further donations or withdrawals can occur.
    /// - `false`: The campaign is still active or pending completion.
    pub is_closed: bool,

    /// Deadline block height by which the campaign must reach its funding goal.
    pub deadline: u64,

    /// Target amount of funds to be collected.
    pub goal: u64,

    /// Total amount of funds collected so far.
    pub total_funds: u64,

    /// Short description or metadata of the campaign (max 20 characters).
    pub metadata: str[20],
}

impl Campaign {
    /// Creates a new campaign instance with default values for collected funds,
    /// status (open), and asset (base asset).
    ///
    /// # Parameters
    /// - `id`: Unique campaign ID assigned by the contract.
    /// - `metadata`: A brief description or title for the campaign (max 20 chars).
    /// - `creator`: The identity of the campaign's creator.
    /// - `goal`: The funding goal the campaign aims to achieve.
    /// - `deadline`: The block height after which the campaign expires.
    ///
    /// # Returns
    /// - A new `Campaign` instance with initialized state.
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
