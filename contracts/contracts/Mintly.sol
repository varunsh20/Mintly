//SPDX-License-Identifier: MIT
pragma solidity 0.8.17;
//Importing all required libraries and contracts.

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";

contract Mintly is ERC1155URIStorage,ERC1155Holder{

    //Defining the owner,
    address payable owner;

    //Using Counters library for keeping a count on TokenId.
    using Counters for Counters.Counter;
    Counters.Counter private tokenId;

    //Declaring an event which is emitted when a new token is created.
    event NftCreated(
        uint256 indexed tokenId,
        address owner,
        address creator,
        uint256 supply,
        uint256 supplyLeft,
        uint256 price,
        string indexed category
    );

    //Declaring an event which is emitted when a token is purchased.
    event NftPurchased(
        uint256 indexed tokenId,
        address owner,
        address creator,
        uint256 supplyLeft,
        uint256 price,
        string indexed category
    );

    //Defining the structure of the token.
    struct nft{
        uint256 tokenId;
        address payable owner;
        address payable creator;
        uint256 totalSupply;
        uint256 supplyLeft;
        uint256 price;
        string category;
    }

    //Mapping having key as tokenId and value is the token details of that Id.
    mapping(uint256=>nft) public idToNft;

    constructor() ERC1155(""){
        owner = payable(msg.sender);
    }
    
    //Required function to override to specify which interfaces this contract supports.
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC1155, ERC1155Receiver) returns (bool){
        return super.supportsInterface(interfaceId);
    }

    //Function to create a new token.
    function createToken(string memory _tokenUri,uint256 _supply,uint256 _price,string memory _category) public payable{
        
        require(_price>0,"Specify some amount for the token.");
        tokenId.increment();
        uint256 currentId = tokenId.current();
        _mint(msg.sender,currentId,_supply,"");
        _setURI(currentId,_tokenUri);

        idToNft[currentId] = nft(currentId,payable(address(this)),payable(msg.sender),_supply,_supply,_price,_category);
        
        //This function transfers the tokens from address "from" to address "to".
        _safeTransferFrom(msg.sender, address(this), currentId, _supply, "");

        //Emits the event.
        emit NftCreated(currentId,address(this),msg.sender,_supply,_supply,_price,_category);
    }
    
    //Function to get the total price of a token
    function getTotalPrice(uint256 _TokenId) view public returns(uint256){
        return(idToNft[_TokenId].price);
    }
    //Function to buy the token.
    function buyNft(uint256 _tokenId) public payable{

        uint256 price = getTotalPrice(_tokenId);
        uint256 fees = (price*2)/100; // 2% of the Price
        uint256 creatorProfit = price-fees; 

        require(_tokenId>0 && _tokenId<=tokenId.current(),"Token Doesn't exist.");
        require(msg.value==price,"Not Enough Balance.");
        require(idToNft[_tokenId].supplyLeft>= 1 ,"Out of Stock.");

        idToNft[_tokenId].owner = payable(msg.sender);
        idToNft[_tokenId].supplyLeft--;

        //This function transfers the tokens from address "from" to address "to".
        _safeTransferFrom(address(this),msg.sender,_tokenId,1,"");

        //Transfers fees to the owner.
        payable(owner).transfer(fees);

        //Transfers price-fees amount to the creator.
        payable(idToNft[_tokenId].creator).transfer(creatorProfit);

        //Emits an event when a token is purchased.
        emit NftPurchased(_tokenId,msg.sender,idToNft[_tokenId].creator,idToNft[_tokenId].supplyLeft,idToNft[_tokenId].price
        ,idToNft[_tokenId].category);
    }

    //Function to return list of tokens that are still in supply.
    function unsoldItems() external view returns(nft[] memory){
        uint counter;
        uint length;

        for(uint i=1;i<=tokenId.current();i++){
            if(idToNft[i].supplyLeft!=0){
                length++;
            }
        }
        nft[] memory unsoldNfts = new nft[](length);
        for(uint i=1;i<=tokenId.current();i++){
            if(idToNft[i].supplyLeft!=0){
                unsoldNfts[counter] = idToNft[i];
                counter++;
            }
        }
        return unsoldNfts;
    }

    //Function to return tokens owned by an address.
    function myPurchase() external view returns(nft[] memory){
        uint counter;
        uint length;

        for(uint i=1;i<=tokenId.current();i++){
            if(idToNft[i].owner==msg.sender){
                length++;
            }
        }
        nft[] memory myDeals = new nft[](length);
        for(uint i=1;i<=tokenId.current();i++){
            if(idToNft[i].owner==msg.sender){
                myDeals[counter] = idToNft[i];
                counter++;
            }
        }
        return myDeals;
    }

    //Function to return list of tokens created by an address.
    function myListings() external view returns(nft[] memory){
        uint counter;
        uint length;

        for(uint i=1;i<=tokenId.current();i++){
            if(idToNft[i].creator==msg.sender){
                length++;
            }
        }
        nft[] memory myNfts = new nft[](length);
        for(uint i=1;i<=tokenId.current();i++){
            if(idToNft[i].creator==msg.sender){
                myNfts[counter] = idToNft[i];
                counter++;
            }
        }
        return myNfts;
    }
}
