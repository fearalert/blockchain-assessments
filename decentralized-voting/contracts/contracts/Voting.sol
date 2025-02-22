// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

contract Voting {
    // List of candidates (as bytes32 values)
    bytes32[] public candidateList;
    // Mapping to store vote counts for each candidate
    mapping(bytes32 => uint256) public votesReceived;

    // Constructor accepts an array of candidate names in bytes32 format
    constructor(bytes32[] memory candidateNames) {
        candidateList = candidateNames;
    }

    // Vote for a candidate (must exist)
    function voteForCandidate(bytes32 candidate) public {
        require(candidateExists(candidate), "Candidate does not exist");
        votesReceived[candidate] += 1;
    }

    // Get total votes for a candidate
    function totalVotesFor(bytes32 candidate) public view returns (uint256) {
        require(candidateExists(candidate), "Candidate does not exist");
        return votesReceived[candidate];
    }

    // Check if a candidate exists
    function candidateExists(bytes32 candidate) public view returns (bool) {
        for (uint256 i = 0; i < candidateList.length; i++) {
            if (candidateList[i] == candidate) {
                return true;
            }
        }
        return false;
    }

    // Helper: Get the total number of candidates
    function getCandidateCount() public view returns (uint256) {
        return candidateList.length;
    }
}
