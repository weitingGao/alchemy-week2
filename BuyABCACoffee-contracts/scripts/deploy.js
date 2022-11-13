// scripts/deploy.js

const hre = require("hardhat");

async function main() {
  // We get the contract to deploy.
  const BuyABCACoffee = await hre.ethers.getContractFactory("BuyABCACoffee");
  const buyABCACoffee = await BuyABCACoffee.deploy();

  await buyABCACoffee.deployed();

  console.log("BuyABCACoffee deployed to:", buyABCACoffee.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });