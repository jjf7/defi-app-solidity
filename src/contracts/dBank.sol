// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "./Token.sol";

contract dBank {

  // Token contract to variable
  Token private token;

  // mappings
  mapping(address => uint) etherBalanceOf;
  mapping(address => uint) depositStart;
  mapping(address => bool) isDeposited;

  // events
  event Deposit(address indexed user, uint etherAmount, uint timeStart);
  event Withdraw(address indexed user, uint etherAmount, uint withdrawTime , uint interest );

  //constructor argument deployed Token contract
  constructor(Token _token) public {
    //assign token deployed contract to variable
    token = _token;
  }

  function deposit() payable public {
    //check if msg.sender didn't already deposited funds
    require(isDeposited[msg.sender] == false, '1 Deposit at the time');
    //check if msg.value is >= than 0.01 ETH
    require(msg.value >= 1e16);

    //increase msg.sender ether deposit balance
    etherBalanceOf[msg.sender] += msg.value;
    depositStart[msg.sender] += block.timestamp;
    isDeposited[msg.sender] = true;
   
    //emit Deposit event
    emit Deposit(msg.sender, msg.value, block.timestamp);
    
  }

  function withdraw() public {
    //check if msg.sender deposit status is true
    require(isDeposited[msg.sender] == true, 'You have to deposit first!!');
    //assign msg.sender ether deposit balance to variable for event
    uint balance = etherBalanceOf[msg.sender];

    //check user's hodl time
    uint depositTime = block.timestamp - depositStart[msg.sender];
    
    //calc interest per second
    uint interestPerSecond = 31668017 * (balance / 1e16);
    //calc accrued interest
    uint interest = interestPerSecond * depositTime;

    //send eth to user
    msg.sender.transfer(balance);

    //send interest in tokens to user
    token.mint(msg.sender, interest);

    //reset depositer data
    etherBalanceOf[msg.sender] = 0;
    isDeposited[msg.sender] = false;
    depositStart[msg.sender] = 0;

    //emit event
    emit Withdraw(msg.sender, balance, block.timestamp, interest);
  }
  
}