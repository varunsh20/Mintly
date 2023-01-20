const {ethers} = require("hardhat");

const main = async()=>{
  const Contract = await ethers.getContractFactory("Mintly");
  const deployedContract = await Contract.deploy();
  await deployedContract.deployed();

  console.log("Contract Address: ",deployedContract.address);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });

