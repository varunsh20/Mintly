const {expect} = require("chai");
const {ethers} = require("hardhat");

//Function to convert ether to wei.
const fromEthertoWei = (num) => ethers.utils.parseEther(num.toString())
//Function to convert wei to ether.
const toEtherfromWei = (num) => ethers.utils.formatEther(num)

describe("Tests for mintly contract",()=>{
    let mintly;
    let owner,addr1,addr2,addr3,addr4,add5;

    beforeEach(async()=>{
        mintly = await ethers.getContractFactory("Mintly");
        [owner,addr1,addr2,addr3,addr4,addr5] = await ethers.getSigners();
        deployMintly = await mintly.deploy();
        await deployMintly.deployed();
    });

    //Tests related to token creation.
    describe("Checks for token creation",()=>{
        //This test checks whether the new token created has correct details or not.
        it("Should check for newly created tokens and their details",async ()=>{
            let amount = 2;
            await deployMintly.createToken("",3,fromEthertoWei(amount),"music");
            const nft = await deployMintly.idToNft(1);

            //Checking all the details of the token.
            expect(nft.creator.toString()).to.equal(owner.address);
            expect(nft.totalSupply.toNumber()).to.equal(3);
            expect(nft.price).to.equal(fromEthertoWei(2));
        })

        //addr1 tries to create a token with 0 selling price. 
        it("Should fail if a token is listed with 0 price",async()=>{
            await expect(deployMintly.connect(addr1).createToken("",2,0,"art")).
            to.be.revertedWith("Specify some amount for the token.");
        })

    })

    //Tests related to token purchase.
    describe("Checks for purchasing the tokens",()=>{
        const amount = 0.1;
        //addr1 creates a token
        beforeEach(async()=>{
            await deployMintly.connect(addr1).createToken("",2,fromEthertoWei(amount),"art");
        });

        //Checks whether the token is sold successfully.
        it("Should update the onwer of the token to the address that calls the buyNft function",async()=>{
            const amount = await deployMintly.getTotalPrice(1);

            //addr2 makes the purchase.
            await deployMintly.connect(addr2).buyNft(1,{value:amount});
            const nft = await deployMintly.idToNft(1);

            //The creator of the token is addr1 and after purchasing the token it's owner should be addr2.
            expect(nft.creator.toString()).to.equal(addr1.address);
            expect(nft.owner.toString()).to.equal(addr2.address);
        })

        //Checks for the errors while purchasing tokens.
        it("Should fail for all invalid token ids, sold tokens and when not enough ether is paid",async()=>{
            const amount = await deployMintly.getTotalPrice(1);
 
            //addr2 tries to purchase token of Id 2 that doesn't exists.
            await expect(deployMintly.connect(addr2).buyNft(2,{value:amount})).to.be.revertedWith("Token Doesn't exist.");
            //addr2 tries to purchase token of Id 0 that doesn't exists.
            await expect(deployMintly.connect(addr2).buyNft(0,{value:amount})).to.be.revertedWith("Token Doesn't exist.");
            //addr2 tries to purchase token with less than required amount.
            await expect(deployMintly.connect(addr2).buyNft(1,{value:fromEthertoWei(0.01)})).to.be.revertedWith("Not Enough Balance.");
            //addr2 purchases all tokens of Id 2.
            await deployMintly.connect(addr2).buyNft(1,{value:amount});
            await deployMintly.connect(addr2).buyNft(1,{value:amount});
            //addr3 tries to purchase tokens of Id 2 that is sold out.
            await expect(deployMintly.connect(addr3).buyNft(1,{value:amount})).to.be.revertedWith("Out of Stock.");
            
        })
    })

    //Tests related to unsold tokens and user inventory.
    describe("Checks unsold tokens,tokens created and listed by an address",()=>{

        //Creates 5 tokens by different addresses before running each test.
        beforeEach(async()=>{
            await deployMintly.createToken("",3,fromEthertoWei(0.2),"music");
            await deployMintly.connect(addr1).createToken("",4,fromEthertoWei(0.3),"art");
            await deployMintly.connect(addr2).createToken("",1,fromEthertoWei(0.4),"course");
            await deployMintly.connect(addr3).createToken("",2,fromEthertoWei(0.1),"ticket");
            await deployMintly.connect(addr1).createToken("",5,fromEthertoWei(0.22),"art");
        });

        //This test returns the correct length of unsold token's array.
        it("Should return the correct length of the array that contains the unsold tokens",async()=>{ 

            await deployMintly.connect(addr4).buyNft(3,{value:fromEthertoWei(0.4)});
            const unsold = await deployMintly.unsoldItems();
            expect(unsold.length).to.equal(4);
        })

        //This test returns the correct length of token's array created by an address.
        it("Should return the correct length of the token's array created by an address",async()=>{
            const myCreation = await deployMintly.connect(addr1).myListings();
            expect(myCreation.length).to.equal(2);
        })

        //This test returns the correct length of token's array owned by an address.
        it("Should return the correct length of the token's array owned by an address",async()=>{
            
            //addr4 makes 3 purchases.
            await deployMintly.connect(addr4).buyNft(1,{value:fromEthertoWei(0.2)});
            await deployMintly.connect(addr4).buyNft(2,{value:fromEthertoWei(0.3)});
            await deployMintly.connect(addr4).buyNft(4,{value:fromEthertoWei(0.1)});

            const myCollection = await deployMintly.connect(addr4).myPurchase();
            expect(myCollection.length).to.equal(3);
        })

    })  

})
