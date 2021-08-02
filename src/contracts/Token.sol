// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
  //add minter variable
  address public minter;

  //add minter changed event
  event MinterChanged(address indexed from, address indexed to);

  constructor() public payable ERC20("JFDESOUSA", "JFDS") {
    //asign initial minter
    minter = msg.sender;
  }

  //Add pass minter role function
  function passMinterRole(address _dBank) public returns (bool success) {
    minter = _dBank;
    emit MinterChanged(minter, _dBank);
    return true;
  }

  function mint(address account, uint256 amount) public {
    //check if msg.sender have minter role
    require(msg.sender == minter, 'You dont have minter Role.');
		_mint(account, amount);
	}

}