// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract CrowdFunding {
     enum State {Ongoing, Failed, Succeeded, PaidOut}
    
    struct CrowdFundings {
        string name;
        uint256 targetAmount;
        uint256 fundingDeadline;
        address payable beneficiary;
        State state;
        
        mapping(address => uint256) amounts;
        bool collected;
        uint256 totalCollected;
        CrowdFundings[] oldCFs;
    }

    mapping(address => CrowdFundings) public allCF;    // allCrowdFundings
    mapping(address => CrowdFundings[]) public allOldCF;

    modifier inState(State expectedState, address add) {
        require(allCF[add].state == expectedState, "Invalid State");
        _;
    }
    
    // constructor() public {}
    
    function newCF(
        string memory contractName,
        uint256 targetAmountEth,
        uint256 durationInMin) 
        public {
        require(allCF[msg.sender].targetAmount <= 0, "One Program Already Exists!");
        allCF[msg.sender].name = contractName;
        allCF[msg.sender].targetAmount = convertToWei(targetAmountEth);
        allCF[msg.sender].fundingDeadline = currentTime() + (durationInMin * 1 minutes);
        allCF[msg.sender].beneficiary = msg.sender;
        allCF[msg.sender].state = State.Ongoing;
    }

    function contribute(address add) public payable inState(State.Ongoing, add) {
        require(beforeDeadLine(add), "No contributions after deadline");
        allCF[add].amounts[msg.sender] += msg.value;
        allCF[add].totalCollected += msg.value;
        if (allCF[add].totalCollected >= allCF[add].targetAmount) {
            allCF[add].collected = true;
        }
    }

    function finishedCrowdFunding(address add) public inState(State.Ongoing, add) {
        require(!beforeDeadLine(add), "Cannot finish campaign before deadline");
        allCF[add].state = State.Succeeded;
    }

    function collect() public inState(State.Succeeded, msg.sender) {
        if (allCF[msg.sender].beneficiary.send(allCF[msg.sender].totalCollected)) {
            allCF[msg.sender].state = State.PaidOut;
            allOldCF[msg.sender].push(allCF[msg.sender]);
            delete allCF[msg.sender];
        } else {
            allCF[msg.sender].state = State.Failed;
        }
    }

    function withdraw(address add) public {
        require(allCF[add].amounts[msg.sender] > 0, "Nothing was Contributed");
        require(beforeDeadLine(add), "Campaign is over!");
        uint256 contributed = allCF[add].amounts[msg.sender];
        allCF[add].amounts[msg.sender] = 0;
        if (!msg.sender.send(contributed)) {
            allCF[add].amounts[msg.sender] = contributed;
        } else {
            allCF[add].totalCollected -= contributed;
        }
    }

    function beforeDeadLine(address add) public view returns (bool) {
        return currentTime() < allCF[add].fundingDeadline;
    }
    
    function totalFundRaised(address add) public view returns (uint256) {
        return allCF[add].totalCollected;
    }
    
    function getTargetAmount(address add) public view returns (uint256) {
        return allCF[add].targetAmount;
    }
    
    
    function getState(address add) public view returns(State) {
        return allCF[add].state;
    }

    function currentTime() internal view returns (uint256) {
        return block.timestamp;
    }

    function convertToWei(uint256 sumInEth) internal pure returns (uint256) {
        return sumInEth * 1 finney;
    }
}
