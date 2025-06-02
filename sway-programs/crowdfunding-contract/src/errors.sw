library;

/// Errors that can occur during the execution of crowdfunding operations.
pub enum ValidationError {

    /// The campaign deadline must be a future block height.
    /// Triggered when trying to create a campaign with a past or current block as deadline.
    DeadlineMustBeAfterToday: (),

    /// The campaign funding goal must be greater than zero.
    /// Triggered when trying to create a campaign with a goal of zero or less.
    GoalMustBeBiggerThanZero: (),

    /// The provided campaign ID does not exist or is out of the valid range.
    /// Triggered when attempting to access or interact with a non-existent campaign.
    CampaignIdMustBeValid: (),

    /// The campaign must be active (not closed and not past deadline).
    /// Triggered when attempting to donate to a closed or expired campaign.
    CampaignMustBeActive: (),

    /// The campaign must be open to allow operations like withdrawal.
    /// Triggered when trying to withdraw from a campaign that is already closed.
    CampaignMustBeOpen: (),

    /// Donations must be made using the base asset ID.
    /// Triggered when a user attempts to donate using a different token/asset.
    DonationMustBeWithBaseAssetId: (),

    /// The donation amount must be greater than zero.
    /// Triggered when a user tries to donate a zero or negative amount.
    DonationMustBeBiggerThanZero: (),

    /// Only the campaign creator is authorized to perform this operation.
    /// Triggered when someone other than the creator attempts to withdraw funds.
    UnauthorizedWithdraw: (),

    /// The campaign's deadline has not yet been reached.
    /// Triggered when trying to withdraw funds before the campaign has ended.
    DeadlineNotReached: (),

    /// The campaign has not reached its funding goal yet.
    /// Triggered when attempting to withdraw funds from an underfunded campaign.
    GoalNotReached: (),

    /// The user has no donations to refund for the specified campaign.
    /// Triggered when a refund is requested but the user has not contributed to the campaign,
    /// or their donation record has already been removed.
    NoValuesToRefound: (),
}
