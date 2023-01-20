import "./AboutStyle.css";
import erc from "./imgs/ERC1155.jpg";

export default function About(){
    return(
        <>
        <div className="page">
            <div className="abt">
                <div className="about">
                    <h1>ABOUT US</h1>
                </div>
            <div class="square">
                <div className="aimg">
                    <img className="tkn" src={erc} alt="ERC-1155"/>
                </div>
            <div className="atxt">          
                <p>
                An ERC-1155 is a token standard that enables the efficient transfer of fungible and non-fungible tokens in a single transaction.
                It is a multi-token standard that provides a standard interface for smart contracts managing multiple types of tokens. Mintly is a NFT Marketplace 
                based on Ethereum Blockchain that allows users to convert their digital content like art, music, videos, podcasts etc into Non Fungible Tokens(NFT's)
                using ERC-1155 standard. It provides every item a unique identity and metadata that sets them apart from one another. Though NFT's are unique but
                ERC-1155 token standard provides the functionality of creating multiple copies of the same item. Since every transaction is recorded on blockchain, so this 
                provides the creators with a digital proof of ownership over their content. Also users can buy other artist's content as well at a reasonable price which ensures
                that the creators are getting rewarded for their work with no middlemen cutting their sales. 
                </p>
            </div>
         </div>
         </div>
         </div>
    </>
    );
}