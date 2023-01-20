import avtr from "./imgs/avtr.jpg";
import { useState,useEffect} from "react";
import {ethers} from 'ethers';
import {Link} from "react-router-dom";
import "./SideBarStyle.css";

export default function SideBar(){

    const [account,setAccount] = useState("");

    //Connecting to wallet
    const connectHandler = async () => {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const c_account = ethers.utils.getAddress(accounts[0])
        setAccount(c_account);
    }

    useEffect(() => {
        connectHandler();
      }, [])

    return(
        <>
        <div className="container">
            <div className="sidebar">
                <div className="profile">
                    <div className="avatar">
                        <img src = {avtr} alt="logo"></img>
                    </div>
                    <div className="addr">
                        {account.slice(0, 20) + '...' + account.slice(38, 42)}
                    </div>
                    <Link className="product" to ="/dashboard">
                    <i className="fa-solid fa-table-columns"></i>Create a Product
                    </Link>
                    <Link className="product" to = "/listings">
                    <i className="fa-solid fa-warehouse"></i>My Listings
                    </Link>
                    <Link className="product" to ="/inventory">
                        <i class="fa-solid fa-database"></i>My Inventory
                    </Link>
                    
 
                </div>
            </div>
        </div>
    </>
    );
}