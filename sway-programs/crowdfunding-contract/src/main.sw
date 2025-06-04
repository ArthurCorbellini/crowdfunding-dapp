contract;

pub mod data_structures;
mod errors;
mod interface;

use ::data_structures::{Campaign, Donation};
use ::errors::ValidationError;
use ::interface::Crowdfunding;
use std::{
    asset::transfer,
    auth::msg_sender,
    block::height,
    call_frames::msg_asset_id,
    context::msg_amount,
};

/// Persistent storage for the crowdfunding contract.
storage {
    /// Tracks the total number of campaigns created.
    ///
    /// This counter is used to assign a unique ID to each new campaign.
    /// Starts at 0 and increments with each campaign creation.
    campaign_count: u64 = 0,
    /// Mapping from campaign ID to `Campaign` data.
    ///
    /// Used to store all created campaigns, indexed by their unique ID.
    campaigns: StorageMap<u64, Campaign> = StorageMap {},
    /// Mapping from (identity, campaign ID) to `Donation` data.
    ///
    /// This structure tracks how much each user has donated to each campaign.
    /// It allows querying per-user contributions and updating donation totals
    /// when users donate multiple times to the same campaign.
    donation_bank: StorageMap<(Identity, u64), Donation> = StorageMap {},
}

impl Crowdfunding for Contract {
    #[storage(read, write)]
    fn create_campaign(metadata: str[20], goal: u64, deadline: u64) {
        // Ensure the deadline is set in the future (must be after the current block height)
        require(
            deadline > height().as_u64(),
            ValidationError::DeadlineMustBeAfterToday,
        );

        // Ensure the goal amount is greater than zero
        require(
            0 < goal,
            ValidationError::GoalMustBeBiggerThanZero
        );

        let creator: Identity = msg_sender().unwrap();

        let id: u64 = storage.campaign_count.read();
        let campaign: Campaign = Campaign::new(id, metadata, creator, goal, deadline);

        storage.campaigns.insert(id, campaign);
        storage.campaign_count.write(id + 1);
    }

    #[payable]
    #[storage(read, write)]
    fn donate(campaign_id: u64) {
        // Ensure the campaign ID is within the valid range (between 0 and total campaign count)
        require(
            campaign_id >= 0 && campaign_id <= storage.campaign_count.read(),
            ValidationError::CampaignIdMustBeValid,
        );

        let mut campaign: Campaign = storage.campaigns.get(campaign_id).try_read().unwrap();

        // Ensure the campaign is still active (not closed)
        require(
            !campaign.is_closed,
            ValidationError::CampaignMustBeActive
        );

        // Ensure the campaign deadline has not passed
        require(
            campaign.deadline > height().as_u64(),
            ValidationError::CampaignMustBeActive,
        );

        // Ensure the donation amount is greater than zero
        require(
            0 < msg_amount(),
            ValidationError::DonationMustBeBiggerThanZero,
        );

        // Ensure the donation is made using the base asset ID
        require(
            AssetId::base() == msg_asset_id(),
            ValidationError::DonationMustBeWithBaseAssetId,
        );
        
        let user = msg_sender().unwrap();
        let amount= msg_amount();

        campaign.total_funds += amount;
        storage.campaigns.insert(campaign_id, campaign);

        let mut donation = storage.donation_bank
            .get((user, campaign_id))
            .try_read()
            .unwrap_or(Donation::new(0, campaign_id));

        donation.total_value += amount;
        storage.donation_bank.insert((user, campaign_id), donation);
    }

    #[storage(read, write)]
    fn refund(campaign_id: u64) {
        // Ensure the campaign ID is within the valid range
        require(
            campaign_id >= 0 && campaign_id <= storage.campaign_count.read(),
            ValidationError::CampaignIdMustBeValid,
        );

        let mut campaign: Campaign = storage.campaigns.get(campaign_id).try_read().unwrap();
        
        // Ensure the campaign is still open (not already closed)
        require(
            !campaign.is_closed,
            ValidationError::CampaignMustBeOpen,
        );

        // Ensure the campaign deadline has passed
        require(
            campaign.deadline <= height().as_u64(),
            ValidationError::DeadlineNotReached,
        );

        // Ensure the campaign has not reached its funding goal
        require(
            campaign.goal >= campaign.total_funds,
            ValidationError::GoalNotReached,
        );
        
        let user = msg_sender().unwrap();
        
        let mut donation = storage.donation_bank
            .get((user, campaign_id))
            .try_read()
            .unwrap_or(Donation::new(0, campaign_id));

        // Ensure the user have some value to refound
        require(
            donation.total_value > 0,
            ValidationError::NoValuesToRefound,
        );

        campaign.total_funds -= donation.total_value;
        storage.campaigns.insert(campaign_id, campaign);

        transfer(user, campaign.asset, donation.total_value);

        assert(storage.donation_bank.remove((user, campaign_id)));
    }

    #[storage(read, write)]
    fn withdraw_donations(campaign_id: u64) {
        // Ensure the campaign ID is within the valid range
        require(
            campaign_id >= 0 && campaign_id <= storage.campaign_count.read(),
            ValidationError::CampaignIdMustBeValid,
        );

        let mut campaign: Campaign = storage.campaigns.get(campaign_id).try_read().unwrap();

        // Ensure the campaign is still open (not already closed)
        require(
            !campaign.is_closed,
            ValidationError::CampaignMustBeOpen,
        );

        // Ensure that only the campaign creator can withdraw the funds
        require(
            campaign.creator == msg_sender().unwrap(),
            ValidationError::UnauthorizedWithdraw,
        );

        // Ensure the campaign deadline has passed
        require(
            campaign.deadline <= height().as_u64(),
            ValidationError::DeadlineNotReached,
        );

        // Ensure the campaign has reached its funding goal
        require(
            campaign.goal <= campaign.total_funds,
            ValidationError::GoalNotReached,
        );

        campaign.is_closed = true;
        storage.campaigns.insert(campaign_id, campaign);

        transfer(campaign.creator, campaign.asset, campaign.total_funds);
    }

    #[storage(read)]
    fn get_refund_value(campaign_id: u64) -> u64 {
        let user = msg_sender().unwrap();

        let mut donation = storage.donation_bank
            .get((user, campaign_id))
            .try_read()
            .unwrap_or(Donation::new(0, campaign_id));

        donation.total_value
    }

    #[storage(read)]
    fn get_campaign(campaign_id: u64) -> Option<Campaign> {
        storage.campaigns.get(campaign_id).try_read()
    }

    #[storage(read)]
    fn get_campaign_count() -> u64 {
        storage.campaign_count.read()
    }
}

/// Ensures that donations to a non-existent campaign ID fail.
/// 
/// Scenario:
/// - An attempt is made to donate to a campaign with an ID that does not exist.
/// 
/// Expectation:
/// - The contract should revert with `CampaignIdMustBeValid`,
///   indicating that the campaign ID is out of range or invalid.
#[test(should_revert)]
fn should_fail_donate_to_nonexistent_campaign() {
    let instance = abi(Crowdfunding, CONTRACT_ID);
    instance.donate { coins: 1 }(99);
}

/// Ensures that withdrawing donations before the campaign deadline fails.
/// 
/// Scenario:
/// - A campaign is created with a future deadline.
/// - A donation is made to the campaign.
/// - An attempt is made to withdraw the donations before the deadline has passed.
/// 
/// Expectation:
/// - The contract should revert with `DeadlineNotReached` or
///   `CampaignMustBeActive`, indicating that the withdrawal is not allowed
///   until after the deadline.
#[test(should_revert)]
fn should_fail_withdraw_before_deadline() {
    let instance = abi(Crowdfunding, CONTRACT_ID);
    let metadata: str[20] = "01234567890123456789".try_as_str_array().unwrap();
    let deadline = height().as_u64() + 10;
    let goal = 10;

    instance.create_campaign(metadata, goal, deadline);
    instance.donate { coins: 10 }(0);

    instance.withdraw_donations(0);
}

/// Ensures that a campaign cannot be created with a past deadline.
///
/// Expectation:
/// - The contract should revert with `DeadlineMustBeAfterToday`.
#[test(should_revert)]
fn should_fail_create_campaign_with_past_deadline() {
    let instance = abi(Crowdfunding, CONTRACT_ID);
    let metadata: str[20] = "01234567890123456789".try_as_str_array().unwrap();
    let deadline = height().as_u64() - 1;

    instance.create_campaign(metadata, 100, deadline);
}

/// Ensures that a campaign cannot be created with a goal of zero.
///
/// Expectation:
/// - The contract should revert with `GoalMustBeBiggerThanZero`.
#[test(should_revert)]
fn should_fail_create_campaign_with_zero_goal() {
    let instance = abi(Crowdfunding, CONTRACT_ID);
    let metadata: str[20] = "01234567890123456789".try_as_str_array().unwrap();
    let deadline = height().as_u64() + 10;

    instance.create_campaign(metadata, 0, deadline);
}

/// Ensures that refunds are not allowed after the campaign goal has been reached.
///
/// Scenario:
/// - A campaign is created with a small goal.
/// - A donation is made that meets the campaign's funding goal.
/// - An attempt is made to request a refund after the goal is reached.
///
/// Expectation:
/// - The contract should revert, indicating that refunds are no longer allowed
///   once the campaign has successfully reached its funding goal.
#[test(should_revert)]
fn should_fail_refund_after_goal_reached() {
    let instance = abi(Crowdfunding, CONTRACT_ID);

    let metadata: str[20] = "01234567890123456789".try_as_str_array().unwrap();
    let deadline: u64 = height().as_u64() + 10;
    let goal: u64 = 1;

    instance.create_campaign(metadata, goal, deadline);
    let campaign_id = 0;

    instance.donate { coins: 1 }(campaign_id);
    instance.refund(campaign_id);
}

/// Ensures that donations using a non-base asset are rejected.
///
/// Scenario:
/// - A campaign is created successfully using default parameters.
/// - A donation is attempted using a non-base asset ID.
///
/// Expectation:
/// - The contract should revert with `DonationMustBeWithBaseAssetId`,
///   indicating that only the native (base) asset is accepted for donations.
#[test(should_revert)]
fn should_fail_donate_with_wrong_asset() {
    let instance = abi(Crowdfunding, CONTRACT_ID);

    let metadata: str[20] = "01234567890123456789".try_as_str_array().unwrap();
    let deadline: u64 = height().as_u64() + 10;
    let goal: u64 = 100;

    instance.create_campaign(metadata, goal, deadline);

    let wrong_asset = 0x09c0b2d1a486c439a87bcba6b46a7a1a23f3897cc83a94521a96da5c23bc58db;

    let campaign_id = 0;
    instance
        .donate {
            coins: 1,
            asset_id: wrong_asset,
        }(campaign_id);
}

/// Ensures that donations are rejected if the campaign has already expired.
///
/// Scenario:
/// - A campaign is created with a deadline in the past.
/// - A donation is attempted after the campaign is no longer active.
///
/// Expectation:
/// - The contract should revert with `CampaignMustBeActive`,
///   indicating that contributions are not allowed after the deadline.
#[test(should_revert)]
fn should_fail_donate_after_deadline() {
    let instance = abi(Crowdfunding, CONTRACT_ID);

    let metadata: str[20] = "01234567890123456789".try_as_str_array().unwrap();
    let deadline: u64 = height().as_u64() - 1;
    let goal: u64 = 100;

    instance.create_campaign(metadata, goal, deadline);
    let campaign_id = 0;

    instance.donate {
        coins: 1,
    }(campaign_id);
}

/// Tests a successful donation to an active, valid campaign.
///
/// This test verifies that:
/// 1. The donation is accepted.
/// 2. The campaign's total_funds are updated.
/// 3. The campaign remains open after the donation.
#[test]
fn should_donate_successfully() {
    let instance = abi(Crowdfunding, CONTRACT_ID);

    let metadata: str[20] = "01234567890123456789".try_as_str_array().unwrap();
    let deadline: u64 = height().as_u64() + 10;
    let goal: u64 = 100;

    instance.create_campaign(metadata, goal, deadline);
    let campaign_id = 0;

    let donation_amount: u64 = 1;
    instance.donate {
        coins: donation_amount,
    }(campaign_id);

    let updated = instance.get_campaign(campaign_id);
    match updated {
        Option::Some(c) => {
            assert(c.total_funds == donation_amount);
            assert(!c.is_closed);
        },
        Option::None => assert(false),
    }
}

/// Tests the successful creation of a campaign.
///
/// This test verifies that:
/// 1. A new campaign can be created with valid input parameters.
/// 2. The campaign count increases by one after creation.
/// 3. The created campaign is correctly stored and retrievable with expected properties:
///     - `id` matches the expected campaign ID.
///     - `goal` and `deadline` are stored as passed.
///     - `total_funds` is initialized to zero.
///     - `is_closed` is initialized to false.
///     - `asset` is set to the base asset.
///
/// Note:
/// - The `metadata` and `creator` fields are marked as TODOs and need proper comparison:
#[test]
fn should_create_campaign_successfully() {
    let instance = abi(Crowdfunding, CONTRACT_ID);

    let metadata: str[20] = "01234567890123456789".try_as_str_array().unwrap();
    let deadline: u64 = height().as_u64() + 10;
    let goal: u64 = 100;

    let initial_campaign_count = instance.get_campaign_count();

    instance.create_campaign(metadata, goal, deadline);

    let final_campaign_count = instance.get_campaign_count();
    assert(final_campaign_count == initial_campaign_count + 1);

    let campaign_id = initial_campaign_count;
    let created_campaign = instance.get_campaign(campaign_id);

    match created_campaign {
        Option::Some(v) => {
            assert(v.id == campaign_id);
            // assert(v.metadata == metadata); // TODO corrigir comparacao
            // assert(v.creator == ?????); // TODO corrigir comparacao
            assert(v.goal == goal);
            assert(v.deadline == deadline);
            assert(v.total_funds == 0);
            assert(v.is_closed == false);
            assert(v.asset == AssetId::base());
        },
        Option::None => {
            assert(false);
        },
    }
}

/// Tests that the campaign count increments correctly after creating a new campaign.
///
/// This test performs the following steps:
/// 1. Sets up valid campaign metadata, deadline, and goal.
/// 2. Instantiates the crowdfunding contract interface.
/// 3. Calls `create_campaign` on the contract with the valid parameters.
/// 4. Retrieves the current campaign count using `get_campaign_count`.
/// 5. Asserts that the campaign count has incremented to 1, confirming that the campaign was created successfully.
///
/// # Panics
/// - If `create_campaign` fails.
/// - If the campaign count does not increment as expected.
#[test]
fn should_increment_campaign_count() {
    let valid_metadata: str[20] = "01234567890123456789".try_as_str_array().unwrap();
    let valid_deadline: u64 = height().as_u64() + 10;
    let valid_goal: u64 = 100;

    let contract_instance = abi(Crowdfunding, CONTRACT_ID);

    contract_instance.create_campaign(valid_metadata, valid_goal, valid_deadline);
    let real_counter = contract_instance.get_campaign_count();

    assert(real_counter == 1);
}

/// Tests that the initial campaign count is zero.
///
/// This test performs the following steps:
/// 1. Instantiates the crowdfunding contract interface.
/// 2. Retrieves the current campaign count using `get_campaign_count`.
/// 3. Asserts that the campaign count is zero, indicating no campaigns have been created yet.
///
/// # Panics
/// - If the campaign count is not zero.
#[test]
fn should_get_campaign_count() {
    let contract_instance = abi(Crowdfunding, CONTRACT_ID);
    let expected = 0;

    let actual = contract_instance.get_campaign_count();

    assert(actual == expected);
}

/// Tests the retrieval of a created campaign by ID.
///
/// This test performs the following steps:
/// 1. Prepares valid metadata, deadline, and goal for a campaign.
/// 2. Instantiates the crowdfunding contract interface.
/// 3. Calls `create_campaign` to create a new campaign.
/// 4. Retrieves the campaign with ID 0 using `get_campaign`.
/// 5. Asserts that the retrieved campaign has ID 0, indicating successful creation and retrieval.
///
/// # Panics
/// - If the campaign is not found (i.e., `get_campaign` returns `Option::None`).
/// - If the retrieved campaign's ID is not 0.
#[test]
fn should_get_campaign() {
    let valid_metadata: str[20] = "01234567890123456789".try_as_str_array().unwrap();
    let valid_deadline: u64 = height().as_u64() + 10;
    let valid_goal: u64 = 100;

    let contract_instance = abi(Crowdfunding, CONTRACT_ID);

    contract_instance.create_campaign(valid_metadata, valid_goal, valid_deadline);

    let campaign = contract_instance.get_campaign(0);

    let campaign_id: u64 = match campaign {
        Option::Some(v) => v.id,
        Option::None => 9999,
    };
    assert(campaign_id == 0);
}
