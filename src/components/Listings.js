import SideBar from "./SideBar";
import "./ListingsStyle.css"
import elogo from "./imgs/eth.png";
import { useState,useEffect } from "react";
import {ethers} from "ethers";
import Mintly from './artifacts/contracts/Mintly.sol/Mintly.json';
import {TailSpin} from 'react-loader-spinner';
import {Link} from "react-router-dom";
import axios from "axios";

export default function Listings(){
  const [loading,setLoading] = useState(true);
  const [Contents,setContents] = useState([]);

  useEffect(()=>{
    //This function fetches the list of tokens that are created by an address.
    async function getStats(){
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const addr = ethers.utils.getAddress(accounts[0])
      const provider = new ethers.providers.JsonRpcProvider(
        process.env.REACT_APP_RPC_URL
    )
    const contract = new ethers.Contract(
        process.env.REACT_APP_ELECTION_ADDRESS,
        Mintly.abi,
        provider
    )

    //It returns a list of tokens.
    const mylists = await contract.connect(addr).myListings();
    //Fetches all the details of a token.
    const Alldata = 
      await Promise.all(mylists.map(async (e)=>{
      const t_uri = await contract.uri(e.tokenId.toString());
      const meta = await axios.get(t_uri);
        return{
            id:e.tokenId.toNumber(),
            supplyleft:e.supplyLeft.toNumber(),
            price:ethers.utils.formatEther(e.price),
            category:e.category,
            cover: meta.data.coverImageURI,
            name:meta.data.name
        };
      })
    );
    setContents(Alldata);
    setLoading(false);
  }
  getStats();
  console.log(Contents);
  },[])

    return(
        <>
        <SideBar/>
        <div className="container">
            <div className="content">
                <div className="heading">
                    <h1>Take A Look At Your Creations.</h1>
                </div>
            {loading? <div className="spinner">
                <TailSpin height={150}></TailSpin>
            </div>:
            <div>
              {Contents.length=="0"?
              <div className="notfound">
                <h1>Seems like you haven't created any tokens yet. Visit <Link to='/dashboard'>Dashboard </Link>
                and create your own ERC-1155 tokens.</h1>
                </div>
                :     
              
              <div className="ycards">
                {Contents.map((e)=>{
                return(
              <div className="cont">
            <div className="bgImage">
                <img className="coverImg" src={e.cover} alt={e.name}/>
            </div>
          <div className="detail">
            <div className="title-div">
              <p>#{e.id} {e.name}</p>
            </div>
            <div  className="middle">
              <div className="left">
                <p className="price-text">Price</p>
                <div className="eth">
                  <div className="logo-div">
                    <img src={elogo} alt="logo"/>
                  </div>
                  <div className="amount-div">
                    <p>{e.price} ETH</p>
                  </div>
                </div>
              </div>
              <div className="right">
                <p className="remaining-text">Remaining</p>
                <div className="token-status">
                  {e.supplyleft}
                </div>
              </div>
            </div>
            <div className="lbtn">
            <button className="lcat">
                {e.category}
            </button>
          </div>
          </div>
          </div>
          );
        })
      }
      </div>
    }
    </div>
    }
    </div>
    </div>
    </>
    );
}