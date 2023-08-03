import SideBar from "./SideBar";
import "./InventoryStyle.css";
import mat from "./imgs/mat.png";
import { useState,useEffect } from "react";
import {ethers} from "ethers";
import Mintly from './artifacts/contracts/Mintly.sol/Mintly.json';
import {TailSpin} from 'react-loader-spinner';
import axios from "axios";
import {Link} from "react-router-dom";
import {saveAs} from "file-saver";

export default function Inventory(){

  const [loading,setLoading] = useState(true);
  const [Contents,setContents] = useState([]);

  //Function that allows users to download their purchased content
  const downloadHandle = (_fileName, _fileURL) => {
    const name = _fileName;
    const URL = _fileURL;
    saveAs(URL, name);
  }

  useEffect(()=>{

    //This function fetches the list of tokens that are owned by an address.
    async function getStats(){
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const addr = ethers.utils.getAddress(accounts[0])
      const provider = new ethers.providers.JsonRpcProvider(
        process.env.REACT_APP_RPC_URL
    )
    const contract = new ethers.Contract(
        process.env.REACT_APP_ADDRESS,
        Mintly.abi,
        provider
    )

    //It returns a list of tokens.
    const mylists = await contract.connect(addr).myPurchase();
    //Fetches all the details of a token.
    const Alldata = 
      await Promise.all(mylists.map(async (e)=>{
      const t_uri = await contract.uri(e.tokenId.toString());
      const turi = t_uri.split("/");
      const uri = `https://lens.infura-ipfs.io/ipfs/${turi[4]}/${turi[5]}`;
      const meta = await axios.get(uri);
        return{
            id:e.tokenId.toNumber(),
            supplyleft:e.supplyLeft.toNumber(),
            price:ethers.utils.formatEther(e.price),
            category:e.category,
            content: `https://lens.infura-ipfs.io/ipfs/${meta.data.contentURI.split("/")[4]}/${meta.data.contentURI.split("/")[5]}`,
            cover:  `https://lens.infura-ipfs.io/ipfs/${meta.data.coverImageURI.split("/")[4]}/${meta.data.coverImageURI.split("/")[5]}`,
            name:meta.data.name
        }
      })
    );
    setContents(Alldata);
    setLoading(false);
  }
  getStats();
  },[])
    return(
        <>
        <SideBar/>
        <div className="container">
          <div className="content">
            <div className="heading">
              <h1>Tokens Owned By You.</h1>
            </div>
            {loading? <div className="spinner">
                <TailSpin height={150}></TailSpin>
            </div>:
            <div>
              {Contents.length=="0"?
              <div className="notfound">
                <h1>OOPS, Seems Like You Haven't Purchased Any Tokens Yet.Visit <Link to='/home'>Home</Link>
                and purchase some tokens.</h1>
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
                    <img src={mat} />
                  </div>
                  <div className="amount-div">
                    <p>{e.price} MATIC</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="dbtn">
            <button className="download" onClick={()=>{downloadHandle(e.name,e.content)}}>
                Download
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