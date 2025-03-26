// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    struct Candidate {
        string name;
        uint256 voteCount;
    }

    //array in which the candidates would be 
    Candidate[] public candidates;
    address public owner;
    mapping(address => bool) public voters;
    mapping(address => uint256) public voterChoices;

    uint256 public votingStart;
    uint256 public votingEnd;
    bool public votingReset;

    event VoteCast(address indexed voter, uint256 candidateIndex);
    event VotingTimeReset(uint256 newEndTime);
    event VotingTimeExtended(uint256 newEndTime);
    event CandidateAdded(string name);

    constructor(string[] memory _candidateNames, uint256 _durationInMinutes) {
        for (uint256 i = 0; i < _candidateNames.length; i++) {
            candidates.push(
                Candidate({name: _candidateNames[i], voteCount: 0})
            );
        }
        owner = msg.sender;
        votingStart = block.timestamp;
        votingEnd = block.timestamp + (_durationInMinutes * 1 minutes);
        votingReset = false;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    function addCandidate(string memory _name) public onlyOwner {
        candidates.push(Candidate({name: _name, voteCount: 0}));
        emit CandidateAdded(_name);
    }

    function vote(uint256 _candidateIndex) public {
        require(getVotingStatus(), "Voting is not currently active");
        require(!voters[msg.sender], "You have already voted");
        require(
            _candidateIndex < candidates.length,
            "Invalid candidate index"
        );

        candidates[_candidateIndex].voteCount++;
        voters[msg.sender] = true;
        voterChoices[msg.sender] = _candidateIndex;
        
        emit VoteCast(msg.sender, _candidateIndex);
    }

    function getAllVotesOfCandiates() public view returns (Candidate[] memory) {
        return candidates;
    }

    function getVotingStatus() public view returns (bool) {
        return (block.timestamp >= votingStart && block.timestamp < votingEnd);
    }

    function getRemainingTime() public view returns (uint256) {
        if (block.timestamp < votingStart) {
            return 0;
        }
        if (block.timestamp >= votingEnd) {
            return 0;
        }
        return votingEnd - block.timestamp;
    }

    function resetVotingTime(uint256 _newDurationInMinutes) public onlyOwner {
        // Allow resetting even if voting is still active
        votingStart = block.timestamp;
        votingEnd = block.timestamp + (_newDurationInMinutes * 1 minutes);
        votingReset = true;
        
        // Clear all votes
        for (uint i = 0; i < candidates.length; i++) {
            candidates[i].voteCount = 0;
        }
        
        emit VotingTimeReset(votingEnd);
    }
    
    function extendVotingTime(uint256 _additionalMinutes) public onlyOwner {
        require(getVotingStatus(), "Voting is not currently active");
        votingEnd = votingEnd + (_additionalMinutes * 1 minutes);
        emit VotingTimeExtended(votingEnd);
    }
    
    function getCandidateCount() public view returns (uint256) {
        return candidates.length;
    }
    
    function getUserVote(address _voter) public view returns (uint256, string memory) {
        require(voters[_voter], "This address has not voted");
        uint256 candidateIndex = voterChoices[_voter];
        return (candidateIndex, candidates[candidateIndex].name);
    }
}