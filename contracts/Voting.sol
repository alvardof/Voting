// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.4.22 <0.9.0;


contract Voting{

    uint256 public timestamp;
    uint32  public number_candidates;
    address public owner;
    
    mapping(address => voter) public voters;

    struct voter {
        bool quota;
        bool flag;
    }
    mapping(address => candidate) private candidates;

    struct candidate {
        uint256 number_votes;
        bool flag;
    }

    constructor() payable public{

        owner = msg.sender;
        timestamp = block.timestamp;
        number_candidates = 0; 

    }




    //Validation of user/voter registration 
    modifier validateUserRegistration{
        require(!voters[msg.sender].flag, "Previously registered user");
        _;
    }

    //User/voter registration event
    event eventRegisterUser(address _user);

    //User registration function
    function registerUser()payable public validateUserRegistration{  

        voters[msg.sender].quota = true;
        voters[msg.sender].flag = true;
        emit eventRegisterUser(msg.sender);

    }




    //Validate that only the owner can access the function
    modifier onlyOwner{
        require(msg.sender == owner, "Caller is not owner");
        _;
    }

    //Candidate nomination validations
    modifier validateNominationCantidate(address _candidate){
        require(voters[_candidate].flag, "Candidate not previously registered as a voter/user");
        require(!candidates[_candidate].flag, "Candidate already nominated");
        require(number_candidates < 5,"Finished the 5 available nominations");
        _;
    }

    //Candidate registration event
    event eventNominationCantidate(address _candidate);

    //Candidate nomination function 
    function nominationCantidate(address _candidate)public onlyOwner  validateNominationCantidate(_candidate){ 
        
        candidates[_candidate].number_votes = 0;
        candidates[_candidate].flag = true;
        number_candidates += 1;
        emit eventNominationCantidate(_candidate);
    
    }




    //Vote validations
    modifier validateVoto(address _candidate){
        require(voters[msg.sender].flag, "voter not previously registered");
        require(voters[msg.sender].quota, "User previously voted");
        require(candidates[_candidate].flag, "Candidate not previously registered");
        require(_candidate != msg.sender, "cannot self-vote");
        require(block.timestamp - timestamp < 7 days, "one week to vote has expired");
        _;
    }

    //Voting event
    event eventVote(address _candidate , uint256 votosAcumulados);
    
    //Voting function
    function vote(address _candidate)payable public validateVoto(_candidate){

        candidates[_candidate].number_votes += 1;
        voters[msg.sender].quota = false;
        emit eventVote(_candidate, candidates[_candidate].number_votes);

    }

}
