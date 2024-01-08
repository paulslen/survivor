# Integrators Guide
This documents how to interface with the Survivor Strategy. It's written to help frontend developers build user interfaces for the strategy.


## Actors
There are several actors in this strategy:
* Pool Manager
    * Deploys the NFT used to approve allocators
    * Deploys the pool using the Survivor Strategy
    * Mints NFTs to allocators to allow them to vote
* Allocator
    * Receives an NFT from the pool manager
    * Votes on recipients each round
* Recipient
    * Recieves funds from the pool manager
    * Submits proofs of work on chain


## User Flows

### Pool Manager

#### Deploying the pool
Example code below is written in Solidity and will have to be adapted for use in the frontend.

Prerequesites:
* Deploy a mintable NFT contract owned by the pool manager
* Deploy the Survivor Strategy contract

Steps:
1. Execute `createPoolWithCustomStrategy` on the Allo Protocol contract:
```solidity
poolId = allo().createPoolWithCustomStrategy(
    poolProfile_id(),
    address(survivorStrategyAddress),
    abi.encode(nftAddress, 2, startTime, duration, roundReward),
    NATIVE,
    0,
    poolMetadata,
    pool_managers()
);
```
* `survivorStrategyAddress` is the address of the deployed `SurvivorStrategy.sol`
* `nftAddress` is the address of the NFT contract
* `startTime` is the unix timestamp of the start of the first round
* `duration` is the duration of each round in seconds
* `roundReward` is the amount of funds to be distributed each round

This will create a pool with a poolId. You will need the poolId for calls later.

#### Fund the pool
The `fundPool` method on the Allo Protocol contract requires a `msg.value` equal to the amount of ETH to deposit. Example below is depositing 10 ETH:
```
allo().fundPool{value: 1e19}(poolId, 1e19);
```

#### Adding allocators
Allocators are added by minting them the NFT used in the pool deployment. Code example is ommitted here since examples of minting NFTs are widely available.

#### Register recipients
```
Metadata memory metadata = Metadata({protocol: 1, pointer: "IPFS_HASH"});
bytes memory data = abi.encode(recipientAddress, recipientAddress, IStrategy.Status.Accepted, metadata);

recipientId = allo().registerRecipient(poolId, data);
```
* `metadata` allows us to associate an IPFS hash with each recipient
* `IStrategy.Status.Accepted` is the status of the recipient (integer value 2)

#### Distribute funds
Distribution is a contract integration on the strategy contract. Call the `distribute` method on the strategy contract to distribute funds to recipients:
```
strategy.distribute(recipientIds, "", pool_admin());
```
recipeientIds is ignored in this strategy, but is required argument as part of the interface, this value can be anything includeing `[]`

### Allocator
Allocators must call `allocate` for each of the recipients. They will be able to allocate to `numRecipients - 1` before the call to allocate will revert. 
```
allo().allocate(poolId, abi.encode(recipientId, nftId));
```
`recipientId` is the address of the recipient they want to vote for
`nftId` is the id of the NFT they received from the pool manager, the nftID must be owned by the caller of `allocate`

### Recipients
Recipients don't interact with the protocol directly. They will receive funds from the pool manager after each round. They also need to provide an IPFS hash for their metadata at time of registration. Here is how you view the metadata for a recipient:
```
strategy.getRecipient(recipientAddress);
```
Which returns a struct:
```
struct Recipient {
    address recipientAddress;
    Metadata metadata;
    Status recipientStatus;
    /// @notice The total number of votes received across all rounds
    uint256 totalVotesReceived;
    /// @notice The total amount earned across all rounds
    uint256 earned;
}
```
`metadata` can be parse to get the IPFS hash for the recipient's metadata.
`recipientStatus` is going to be either 2 for accepted or 3 for rejected.
`totalVotesReceived` is the total number of votes received across all rounds.
`earned` is the total amount earned across all rounds.
