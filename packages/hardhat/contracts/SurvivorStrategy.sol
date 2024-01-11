// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity 0.8.19;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {IAllo} from "../node_modules/allo-v2/contracts/core/interfaces/IAllo.sol";
import {BaseStrategy} from "./BaseStrategy.sol";
import {Metadata} from "../node_modules/allo-v2/contracts/core/libraries/Metadata.sol";
import {EnumerableSet} from "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
// import "forge-std/console.sol";

// ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣾⣿⣷⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⣿⣿⣷⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣗⠀⠀⠀⢸⣿⣿⣿⡯⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣿⣿⣿⣿⣷⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⣿⣿⣿⣿⣿⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣗⠀⠀⠀⢸⣿⣿⣿⡯⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣸⣿⣿⣿⢿⣿⣿⣿⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣗⠀⠀⠀⢸⣿⣿⣿⡯⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣿⣿⣿⣿⣿⣿⣿⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣰⣿⣿⣿⡟⠘⣿⣿⣿⣷⡀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣗⠀⠀⠀⢸⣿⣿⣿⡯⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⠀⠀⠀⣀⣴⣾⣿⣿⣿⣿⣾⠻⣿⣿⣿⣿⣿⣿⣿⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣿⣿⣿⡿⠀⠀⠸⣿⣿⣿⣧⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣗⠀⠀⠀⢸⣿⣿⣿⡯⠀⠀⠀⠀⠀⠀⢀⣠⣴⣴⣶⣶⣶⣦⣦⣀⡀⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⠀⠀⣴⣿⣿⣿⣿⣿⣿⡿⠃⠀⠙⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣿⣿⣿⣿⠁⠀⠀⠀⢻⣿⣿⣿⣧⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣗⠀⠀⠀⢸⣿⣿⣿⡯⠀⠀⠀⠀⣠⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⡀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⢀⣾⣿⣿⣿⣿⣿⣿⡿⠁⠀⠀⠀⠘⣿⣿⣿⣿⣿⡿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣾⣿⣿⣿⠃⠀⠀⠀⠀⠈⢿⣿⣿⣿⣆⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣗⠀⠀⠀⢸⣿⣿⣿⡯⠀⠀⠀⣰⣿⣿⣿⡿⠋⠁⠀⠀⠈⠘⠹⣿⣿⣿⣿⣆⠀⠀⠀
// ⠀⠀⠀⠀⢀⣾⣿⣿⣿⣿⣿⣿⡿⠀⠀⠀⠀⠀⠀⠈⢿⣿⣿⣿⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣾⣿⣿⣿⠏⠀⠀⠀⠀⠀⠀⠘⣿⣿⣿⣿⡄⠀⠀⠀⠀⠀⢸⣿⣿⣿⣗⠀⠀⠀⢸⣿⣿⣿⡯⠀⠀⢰⣿⣿⣿⣿⠁⠀⠀⠀⠀⠀⠀⠀⠘⣿⣿⣿⣿⡀⠀⠀
// ⠀⠀⠀⢠⣿⣿⣿⣿⣿⣿⣿⣟⠀⡀⢀⠀⡀⢀⠀⡀⢈⢿⡟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡄⠀⠀⠀⠀⢸⣿⣿⣿⣗⠀⠀⠀⢸⣿⣿⣿⡯⠀⠀⢸⣿⣿⣿⣗⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⡇⠀⠀
// ⠀⠀⣠⣿⣿⣿⣿⣿⣿⡿⠋⢻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣶⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣸⣿⣿⣿⡿⢿⠿⠿⠿⠿⠿⠿⠿⠿⠿⢿⣿⣿⣿⣷⡀⠀⠀⠀⢸⣿⣿⣿⣗⠀⠀⠀⢸⣿⣿⣿⡯⠀⠀⠸⣿⣿⣿⣷⡀⠀⠀⠀⠀⠀⠀⠀⢠⣿⣿⣿⣿⠂⠀⠀
// ⠀⠀⠙⠛⠿⠻⠻⠛⠉⠀⠀⠈⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣰⣿⣿⣿⣿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢿⣿⣿⣿⣧⠀⠀⠀⢸⣿⣿⣿⣗⠀⠀⠀⢸⣿⣿⣿⡯⠀⠀⠀⢻⣿⣿⣿⣷⣀⢀⠀⠀⠀⡀⣰⣾⣿⣿⣿⠏⠀⠀⠀
// ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠛⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⣿⣿⣿⣿⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣿⣿⣿⣿⣧⠀⠀⢸⣿⣿⣿⣗⠀⠀⠀⢸⣿⣿⣿⡯⠀⠀⠀⠀⠹⢿⣿⣿⣿⣿⣾⣾⣷⣿⣿⣿⣿⡿⠋⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⠙⠋⠛⠙⠋⠛⠙⠋⠛⠙⠋⠃⠀⠀⠀⠀⠀⠀⠀⠀⠠⠿⠻⠟⠿⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⠟⠿⠟⠿⠆⠀⠸⠿⠿⠟⠯⠀⠀⠀⠸⠿⠿⠿⠏⠀⠀⠀⠀⠀⠈⠉⠻⠻⡿⣿⢿⡿⡿⠿⠛⠁⠀⠀⠀⠀⠀⠀
//                    allo.gitcoin.co

/// @title Proportional Payout Strategy
/// @notice This strategy allows the allocator to allocate votes to recipients
/// @author allo-team
contract SurvivorStrategy is BaseStrategy {
    using EnumerableSet for EnumerableSet.AddressSet;

    /// =====================
    /// ======= Events ======
    /// =====================

    event AllocationTimeSet(uint256 startTime, uint256 endTime);
    event Removed(address recipientId, uint256 votes);

    /// =====================
    /// ======= Errors ======
    /// =====================

    error MAX_REACHED();

    /// ======================
    /// ====== Modifier ======
    /// ======================

    /// @notice Modifier to check if the allocation is active
    /// @dev Reverts if the allocation is not active
    modifier onlyActiveAllocation() {
        _checkOnlyActiveAllocation();
        _;
    }

    /// @notice Modifier to check if the allocation has ended
    /// @dev Reverts if the allocation has not ended
    modifier onlyAfterAllocation() {
        _checkOnlyAfterAllocation();
        _;
    }

    /// ======================
    /// ======= Storage ======
    /// ======================

    struct Recipient {
        address recipientAddress;
        Metadata metadata;
        Status recipientStatus;
        /// @notice The total number of votes received across all rounds
        uint256 totalVotesReceived;
        /// @notice The total amount earned across all rounds
        uint256 earned;
    }

    /// @notice The data used to initialize the strategy
    struct InitializeData {
        /// @notice The address of the NFT to give allocators
        address nft;
        /// @notice The maximum approved recipients
        uint256 maxRecipientsAllowed;
        /// @notice The start time of the first allocation round
        uint64 roundStartTime;
        /// @notice The duration of each allocation round
        uint64 roundDuration;
        /// @notice The per round reward amount
        uint256 roundReward;
    }

    /// @notice recipientId => Recipient
    mapping(address => Recipient) public recipients;
    /// @notice List of active recipients
    EnumerableSet.AddressSet private activeRecipients;
    /// @notice List of inactive recipients
    EnumerableSet.AddressSet private inactiveRecipients;
    /// @notice nftId => roundNumber => allocations made
    mapping(uint256 => mapping(uint256 => uint256)) public allocationsMade;

    /// @notice The NFT to give allocators
    ERC721 public nft;

    /// @notice The maximum approved recipients
    uint256 public maxRecipientsAllowed;

    /// @notice The total number of recipients
    uint256 public recipientsCounter;

    /// @notice The total number of votes cast by allocators
    uint256 public totalAllocations;

    /// @notice The reward for the round
    uint256 public roundReward;

    /// @notice The start time of the first allocation round
    uint64 public roundStartTime;

    /// @notice The duration of each allocation round
    uint64 public roundDuration;

    /// @notice The current round number (0 == first round)
    uint64 public roundNumber;

    // ===================
    // === Constructor ===
    // ===================

    constructor(address _allo, string memory _name) BaseStrategy(_allo, _name) {}

    /// ===============================
    /// ========= Initialize ==========
    /// ===============================

    function initialize(uint256 _poolId, bytes memory _data) external override onlyAllo {
        InitializeData memory initializeData = abi.decode(_data, (InitializeData));
        __SurvivorStrategy_init(_poolId, initializeData);
        emit Initialized(_poolId, _data);
    }

    function __SurvivorStrategy_init(uint256 _poolId, InitializeData memory _initializeData) internal {
        __BaseStrategy_init(_poolId);

        nft = ERC721(_initializeData.nft);
        maxRecipientsAllowed = _initializeData.maxRecipientsAllowed;

        _setupRound(_initializeData.roundStartTime, _initializeData.roundDuration, _initializeData.roundReward);
        _setPoolActive(true);
    }

    /// ==================
    /// ==== Views =======
    /// ==================

    /// @notice Get the allocators votes for a round
    /// @param _nftId The nft id
    /// @param _roundNumber The round number
    /// @return The number of votes
    function getAllocationsMade(uint256 _nftId, uint256 _roundNumber) external view returns (uint256) {
        return allocationsMade[_nftId][_roundNumber];
    }

    /// @notice Get the total number of active recipients
    /// @return The total number of recipients
    function getActiveRecipientCount() external view returns (uint256) {
        return activeRecipients.length();
    }

    /// @notice Get the total number of inactive recipients
    /// @return The total number of recipients
    function getInactiveRecipientCount() external view returns (uint256) {
        return inactiveRecipients.length();
    }

    /// @notice Get the recipient by their index in the active recipients list
    /// @param _index The index of the recipient
    function getActiveRecipient(uint256 _index) external view returns (Recipient memory) {
        return _getRecipient(activeRecipients.at(_index));
    }

    function getInactiveRecipient(uint256 _index) external view returns (Recipient memory) {
        return _getRecipient(inactiveRecipients.at(_index));
    }

    /// @notice Get the recipient
    /// @param _recipientId Id of the recipient
    function getRecipient(address _recipientId) external view returns (Recipient memory) {
        return _getRecipient(_recipientId);
    }

    /// @notice Checks if msg.sender is eligible for RFP allocation
    /// @param _recipientId Id of the recipient
    function _getRecipientStatus(address _recipientId) internal view override returns (Status) {
        return _getRecipient(_recipientId).recipientStatus;
    }

    // ==================
    // ==== External ====
    // ==================

    /// @notice Remove the recipient with the lowest number of votes after a round has ended
    function _removeRecipient() internal {
        uint256 recipientCount = activeRecipients.length();
        require(recipientCount > 0, "NO_RECIPIENT_TO_REMOVE");

        // Find the recipient with the lowest votes
        address recipientIdWithLowestVotes;
        uint256 lowestVotes = type(uint256).max;

        for (uint256 i = 0; i < recipientCount;) {
            address currentRecipientId = activeRecipients.at(i);
            Recipient memory currentRecipient = _getRecipient(currentRecipientId);
            if (currentRecipient.totalVotesReceived < lowestVotes) {
                lowestVotes = currentRecipient.totalVotesReceived;
                recipientIdWithLowestVotes = currentRecipientId;
            }
            
            unchecked {
                i++;
            }
        }

        require(recipientIdWithLowestVotes != address(0), "NO_RECIPIENT_TO_REMOVE");

        // Remove the recipient, mark them rejected and decrement the counter
        Recipient storage recipient = recipients[recipientIdWithLowestVotes];
        activeRecipients.remove(recipientIdWithLowestVotes);
        inactiveRecipients.add(recipientIdWithLowestVotes);
        recipient.recipientStatus = Status.Rejected;
        recipientsCounter--;

        // Deduct any of their allocations for the total
        totalAllocations -= recipient.totalVotesReceived;

        emit Removed(recipientIdWithLowestVotes, recipient.totalVotesReceived);
    }

    // ==================
    // ==== Internal ====
    // ==================

    /// @notice Checks if the allocation is active
    /// @dev Reverts if the allocation is not active
    function _checkOnlyActiveAllocation() internal view {
        // if (roundStartTime > block.timestamp || block.timestamp > roundStartTime + roundDuration) {
        //     revert ALLOCATION_NOT_ACTIVE();
        // }
    }

    /// @notice Checks if the allocation has ended
    /// @dev Reverts if the allocation has not ended
    function _checkOnlyAfterAllocation() internal view {
        if (block.timestamp <= roundStartTime + roundDuration) {
            revert ALLOCATION_NOT_ENDED();
        }
    }

    /// @notice Checks if the allocator is valid
    /// @param _allocator The allocator address
    /// @return true if the allocator is valid
    function _isValidAllocator(address _allocator) internal view override returns (bool) {
        return nft.balanceOf(_allocator) > 0;
    }

    /// @notice Allocate votes to a recipient
    /// @param _data The data
    /// @param _sender The sender of the transaction
    /// @dev Only the NFT holder can call this function
    function _allocate(bytes memory _data, address _sender) internal override onlyActiveAllocation {
        (address recipientId, uint256 nftId) = abi.decode(_data, (address, uint256));

        // If the allocator has already allocated their votes or is not the owner of the NFT
        if (
            activeRecipients.length() > 1
                && (allocationsMade[nftId][roundNumber] >= activeRecipients.length() - 1 || nft.ownerOf(nftId) != _sender)
        ) {
            revert UNAUTHORIZED();
        }

        allocationsMade[nftId][roundNumber]++;

        Recipient storage recipient = recipients[recipientId];

        if (recipient.recipientStatus != Status.Accepted) {
            revert RECIPIENT_ERROR(recipientId);
        }

        recipient.totalVotesReceived++;
        totalAllocations++;

        emit Allocated(recipientId, 1, address(0), _sender);
    }

    /// @notice Distribute the tokens to the recipients
    /// @param _sender The sender of the transaction
    function _distribute(address[] memory, bytes memory, address _sender) internal override onlyAfterAllocation {
        // Remove the recipient with the lowest number of votes after a round has ended
        _removeRecipient();

        uint256 payoutLength = activeRecipients.length();
        for (uint256 i; i < payoutLength;) {
            address recipientId = activeRecipients.at(i);
            Recipient storage recipient = recipients[recipientId];

            PayoutSummary memory payout = _getPayout(recipientId, "");
            uint256 amount = payout.amount;
 
            if (amount == 0) {
                revert RECIPIENT_ERROR(recipientId);
            }

            IAllo.Pool memory pool = allo.getPool(poolId);
            _transferAmount(pool.token, recipient.recipientAddress, amount);
            recipient.earned += amount;

            emit Distributed(recipientId, recipient.recipientAddress, amount, _sender);
            unchecked {
                i++;
            }
        }

        // Increase the round number
        roundNumber++;
    }

    /// @notice Get the payout for a single recipient
    /// @param _recipientId The recipient id
    /// @return The payout as a PayoutSummary struct
    function _getPayout(address _recipientId, bytes memory) internal view override returns (PayoutSummary memory) {
        Recipient storage recipient = recipients[_recipientId];

        uint256 totalVotesReceived = recipient.totalVotesReceived;
        uint256 amount = totalAllocations > 0 ? poolAmount * totalVotesReceived / totalAllocations : 0;

        return PayoutSummary(recipient.recipientAddress, amount);
    }

    /// @notice Submit application to pool
    /// @param _data The data to be decoded: address recipientId, address recipientAddress, Status status, Metadata memory metadata
    /// @param _sender The sender of the transaction
    function _registerRecipient(bytes memory _data, address _sender)
        internal
        override
        onlyPoolManager(_sender)
        returns (address)
    {
        (address recipientId, address recipientAddress, Status status, Metadata memory metadata) =
            abi.decode(_data, (address, address, Status, Metadata));

        // validate decoded id and address
        if (recipientId == address(0) || recipientAddress == address(0)) {
            revert RECIPIENT_ERROR(recipientId);
        }

        Recipient storage recipient = recipients[recipientId];

        if (recipient.recipientStatus != Status.Accepted && status == Status.Accepted) {
            // when a recipient is accepted, increment the counter
            recipientsCounter++;
            // add the recipient to the active recipients list
            activeRecipients.add(recipientId);
        } else if (recipient.recipientStatus == Status.Accepted && status == Status.Rejected) {
            // when a recipient is rejected, increment the counter
            recipientsCounter--;
            // remove the recipient to the active recipients list
            activeRecipients.remove(recipientId);
        } else {
            revert RECIPIENT_ERROR(recipientId);
        }

        if (recipientsCounter > maxRecipientsAllowed) {
            revert MAX_REACHED();
        }

        // update the recipients data
        recipient.recipientAddress = recipientAddress;
        recipient.metadata = metadata;
        recipient.recipientStatus = status;

        emit Registered(recipientId, _data, _sender);

        return recipientId;
    }

    /// @notice Set the round start time and the duration 
    /// @param _roundStartTime The round start timestamp
    /// @param _roundDuration The duration of the round
    /// @param _roundReward The reward for the round
    function _setupRound(uint64 _roundStartTime, uint64 _roundDuration, uint256 _roundReward) internal {
        if (_roundStartTime < block.timestamp || _roundDuration == 0 || _roundReward == 0) {
            revert INVALID();
        }

        roundStartTime = _roundStartTime;
        roundDuration = _roundDuration;
        roundReward = _roundReward;
    }

    /// @notice Get the recipient
    /// @param _recipientId Id of the recipient
    function _getRecipient(address _recipientId) internal view returns (Recipient memory recipient) {
        recipient = recipients[_recipientId];
    }

    /// @notice Receive function
    receive() external payable {}
}
