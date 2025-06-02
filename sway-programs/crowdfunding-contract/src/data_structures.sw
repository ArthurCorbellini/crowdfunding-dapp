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

/// Represents a donation made by a user to a specific crowdfunding campaign.
///
/// This struct stores the cumulative amount a single user has contributed
/// to a given campaign. It enables the contract to track individual
/// contribution histories and associate them with specific campaigns.
pub struct Donation {
    /// Total amount donated by the user to the specified campaign.
    ///
    /// This value is cumulative—if the user donates multiple times,
    /// it represents the sum of all contributions.
    pub total_value: u64,
    /// ID of the campaign to which this donation is linked.
    ///
    /// Used to associate the donation with a specific campaign,
    /// enabling multi-campaign donation tracking per user.
    pub campaign_id: u64,
}

impl Donation {
    /// Creates a new `Donation` instance with an initial amount and campaign ID.
    ///
    /// This is typically called when a user donates to a campaign for the first time.
    ///
    /// # Parameters
    /// - `total_value`: The initial donation amount.
    /// - `campaign_id`: The ID of the campaign receiving the donation.
    ///
    /// # Returns
    /// - A new `Donation` instance with the provided data.
    pub fn new(total_value: u64, campaign_id: u64) -> Self {
        Self {
            total_value,
            campaign_id,
        }
    }
}
