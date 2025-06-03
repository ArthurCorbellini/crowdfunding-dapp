# Crowdfunding Smart Contract Specification

The `Crowdfunding` smart contract includes the creation, funding, and management of crowdfunding campaigns. Each campaign has a goal, a deadline, and tracks donations from multiple users. It supports the following core features:
- Campaign creation
- User donations
- Creator withdrawals (on success)
- Donor refunds (on failure)
- Campaign querying

## ABI Specification

### `create_campaign`

Creates a new crowdfunding campaign.

#### Parameters
- `metadata: str[20]`  
  A short descriptor for the campaign (max 20 characters).
- `goal: u64`  
  Funding target; must be greater than 0.
- `deadline: u64`  
  Block height by which the campaign must be funded. Must be greater than the current block height.

#### Behavior
- Only proceeds if `goal > 0` and `deadline > current_block_height`.
- Stores campaign with a unique ID.

#### Storage
- **Reads/Writes**: Campaign list, campaign counter

---

### `donate`

Allows a user to contribute funds to an existing campaign.

#### Parameters
- `campaign_id: u64`  
  ID of the campaign to donate to.

#### Payable
- Requires a non-zero amount of the base asset to be sent.

#### Behavior
- Validates campaign is open and accepting donations.
- Adds sent amount to campaign's total funds.
- Records donor's contribution.

#### Storage
- **Reads/Writes**: Campaign data, donor records

---

### `withdraw_donations`

Enables the campaign creator to withdraw funds if the campaign has succeeded.

#### Parameters
- `campaign_id: u64`  
  ID of the campaign.

#### Behavior
- Only callable by the campaign's creator.
- Only allowed if:
  - The campaign met its goal.
  - The deadline has passed.
  - The campaign has not been closed.
- Transfers collected funds to the creator.
- Marks the campaign as closed.

#### Storage
- **Reads/Writes**: Campaign data, creator balance

---

### `refund`

Allows a donor to retrieve their funds from an unsuccessful campaign.

#### Parameters
- `campaign_id: u64`  
  ID of the campaign.

#### Behavior
- Only callable by a user who has donated to the campaign.
- Refund only allowed if:
  - The campaign is still open.
  - The deadline has passed.
  - The goal was **not** reached.
  - The user has a non-zero donation recorded.
- Transfers user's donation back.
- Removes donor’s record from the campaign.

#### Storage
- **Reads/Writes**: Campaign data, donor records

---

### `get_campaign`

Retrieves campaign details by ID.

#### Parameters
- `campaign_id: u64`

#### Returns
- `Option<Campaign>`  
  The campaign details if it exists, or `None`.

#### Storage
- **Reads**: Campaign data

---

### `get_campaign_count`

Returns the number of campaigns created so far.

#### Returns
- `u64`: Total number of campaigns (useful for generating new IDs).

#### Storage
- **Reads**: Campaign counter

---

### `get_refund_value`

Returns the amount eligible for refund by the caller in a specific campaign.

#### Parameters
- `campaign_id: u64`

#### Returns
- `u64`: The amount donated by the caller to the specified campaign.

#### Storage
- **Reads**: Donor records

---

### Notes
- Campaigns are uniquely identified by an incrementing `u64` ID.
- The base asset is used for donations and refunds.
- The system ensures fairness through strict eligibility checks for refunds and withdrawals.