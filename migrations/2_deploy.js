const Token = artifacts.require("Token");
const dBank = artifacts.require("dBank");

module.exports = async function(deployer) {
	//deploy Token

	await deployer.deploy(Token)

	//assign token into variable to get it's address

	const tokenDeployed = await Token.deployed();
	
	//pass token address for dBank contract(for future minting)

	await deployer.deploy(dBank, tokenDeployed.address);

	//assign dBank contract into variable to get it's address

	const dBankDeployed = await dBank.deployed();

	//change token's owner/minter from deployer to dBank
	await tokenDeployed.passMinterRole(dBankDeployed.address);
};