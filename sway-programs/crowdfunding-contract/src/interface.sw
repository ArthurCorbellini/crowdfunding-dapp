library;

use ::data_structures::Campaign;

abi Crowdfunding {
    /// Creates a new crowdfunding campaign.
    ///
    /// # Parameters
    /// - `metadata`: A short string (max 20 characters) describing the campaign.
    /// - `goal`: The funding goal the campaign aims to reach (must be greater than 0).
    /// - `deadline`: The block height by which the campaign must reach its goal 
    ///               (must be greater than the current block height).
    ///
    /// # Behavior
    /// - Only succeeds if the goal is positive and the deadline is in the future.
    /// - Assigns a unique ID to the new campaign and stores it.
    #[storage(read, write)]
    fn create_campaign(metadata: str[20], goal: u64, deadline: u64);

    /// Allows users to donate funds to a specific campaign.
    ///
    /// # Parameters
    /// - `campaign_id`: The ID of the campaign to donate to.
    ///
    /// # Payable
    /// - Must send a non-zero amount of the base asset.
    ///
    /// # Behavior
    /// - Validates that the campaign is open, active, and accepting donations.
    /// - Adds the donated amount to the campaign’s total funds.
    #[storage(read, write), payable]
    fn donate(campaign_id: u64);

    /// Allows the campaign creator to withdraw collected donations.
    ///
    /// # Parameters
    /// - `campaign_id`: The ID of the campaign to withdraw from.
    ///
    /// # Behavior
    /// - Can only be called by the campaign creator.
    /// - Only allowed if:
    ///   - The campaign has reached its goal,
    ///   - The deadline has passed,
    ///   - The campaign has not already been closed.
    /// - Transfers the collected funds to the creator and closes the campaign.
    #[storage(read, write)]
    fn withdraw_donations(campaign_id: u64);

    /// Allows a donor to request a refund from a campaign that failed to meet its goal.
    ///
    /// # Parameters
    /// - `campaign_id`: The ID of the campaign from which to request a refund.
    ///
    /// # Behavior
    /// - Can only be called by a user who has previously donated to the specified campaign.
    /// - Refunds are only allowed if:
    ///   - The campaign is still open (not closed),
    ///   - The deadline has passed,
    ///   - The funding goal has **not** been reached,
    ///   - The user has a non-zero donation recorded.
    /// - Transfers the donated amount back to the donor.
    /// - Removes the user's donation record from storage.
    #[storage(read, write)]
    fn refund(campaign_id: u64);

    /// Returns a specific campaign by its ID.
    ///
    /// # Parameters
    /// - `campaign_id`: The unique identifier of the campaign.
    ///
    /// # Returns
    /// - `Option<Campaign>`: The campaign if it exists, or `None` if not found.
    #[storage(read)]
    fn get_campaign(campaign_id: u64) -> Option<Campaign>;

    /// Returns the total number of campaigns created so far.
    ///
    /// # Returns
    /// - `u64`: The current number of campaigns (used to derive new campaign IDs).
    #[storage(read)]
    fn get_campaign_count() -> u64;

    /// Returns the refundable amount for the sender in a specific campaign.
    ///
    /// # Parameters
    /// - `campaign_id`: The unique identifier of the campaign.
    ///
    /// # Returns
    /// - `u64`: The total value donated by the caller to the specified campaign, which is eligible for refund.
    #[storage(read)]
    fn get_refund_value(campaign_id: u64) -> u64;
}
