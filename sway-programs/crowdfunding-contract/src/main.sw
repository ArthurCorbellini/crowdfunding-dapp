contract;

pub mod data_structures;
mod errors;
mod interface;

use ::data_structures::Campaign;
use ::errors::ValidationError;
use ::interface::Crowdfunding;
use std::{asset::transfer, auth::msg_sender, block::height, context::msg_amount};

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
        require(deadline > height().as_u64(), ValidationError::DeadlineMustBeAfterToday);
        require(0 < goal, ValidationError::GoalMustBeBiggerThanZero);

        let creator: Identity = msg_sender().unwrap();

        let id: u64 = storage.campaign_count.read();
        let campaign: Campaign = Campaign::new(id, metadata, creator, goal, deadline);

        storage.campaigns.insert(id, campaign);
        storage.campaign_count.write(id + 1);
    }

    #[payable]
    #[storage(read, write)]
    fn donate(campaign_id: u64) {

        // require(amount >= item.price, InvalidError::NotEnoughTokens(amount));

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

/// Tests the successful creation of a crowdfunding campaign.
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
    let goal: u64 = height().as_u64() + 10;
    let deadline: u64 = 100;

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
