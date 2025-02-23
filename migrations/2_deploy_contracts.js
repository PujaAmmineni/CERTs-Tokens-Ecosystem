const CERTsToken = artifacts.require("CERTsToken");
const Certificate = artifacts.require("Certificate");
const StakingGovernance = artifacts.require("StakingGovernance");

module.exports = async function (deployer, network, accounts) {
  // Deploy CERTsToken with an initial supply of 1,000,000 tokens
  await deployer.deploy(CERTsToken, web3.utils.toWei("1000000", "ether"));
  const tokenInstance = await CERTsToken.deployed();

  // Deploy Certificate contract
  await deployer.deploy(Certificate);

  // Deploy StakingGovernance contract, passing the CERTsToken address
  await deployer.deploy(StakingGovernance, tokenInstance.address);
};
