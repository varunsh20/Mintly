const contabi = require("./contracts/artifacts/contracts/Mintly.sol/Mintly.json");
const { ethers } = require("ethers");
const axios = require("axios");
const main = async()=>{
    console.log(1);
    const add = "0x62980c22d2ee90E11768F57450EdB329535546EA"
    const provider = new ethers.providers.JsonRpcProvider(
        "https://eth-goerli.g.alchemy.com/v2/xHSqNanwRn6b_xg9IABWX8z6w7mcvu89" 
    )
    const contract = new ethers.Contract(
        "0x7A787b20D376Ee2a43f350eAb9e70A5293C8B28b",
        contabi.abi,
        provider
    )

    const animations = contract.filters.NftCreated(
        null,null,null,null,null,null,"Movies"
    )
    const an = await contract.queryFilter(animations);
    console.log(an);
}

main();