import "./NavbarStyle.css";
import {Link} from "react-router-dom";
import { useState,useEffect} from "react";
import {ethers} from 'ethers';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Navbar(){

    const [state,setState] = useState(false);
    const [account,setAccount] = useState("");
    const [isConnected,setConnected] = useState(false);

    //This allows users to connect to their metamask wallet in case the page is refreshed.
    useEffect(()=>{
        connectHandler();
    },[window.ethereum])

    //Function for handling the state of navbar.
    const handleClick = ()=>{
        setState(!state);
    }

    //This function is called if metamask is not installed in a user's browser.
    const dashboardHandle = () => {
        toast.info("Please Connect Your Wallet.", {
          position: toast.POSITION.TOP_CENTER
        });
      }

    //Function for connecting metamask wallet.
    const connectHandler = async () => {
        if(window.ethereum){
        await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x13882' }], // chainId must be in hexadecimal numbers
              });
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts'});
        const c_account = ethers.utils.getAddress(accounts[0])
        setAccount(c_account);
        setConnected(true);
        }
        else{
            toast.warn("Please install MetaMask.")
        }
    }
    function reloadPage() {
        window.location.reload(true);
      }
      // Checks for account changes
      
      if (window.ethereum) {
        window.ethereum.on('accountsChanged', reloadPage);
      }

    return(
        <>
        <div className="nav-bar">
            <div className="nav-logo">
                <h1>mintly</h1>
            </div>
            
            <div className="menu-icons"> 
                <i onClick={handleClick} className={state ? "fas fa-times"
                :"fas fa-bars"}>
                </i>
            </div>

            <ul className={state? "nav-menu active"
            :"nav-menu"}>       
                <li>
                    <Link className="nav-link" to='/home'>
                    <i className="fa-solid fa-house-user"></i>HOME</Link>
                </li>
                <li>
                    {isConnected?(
                    <Link className="nav-link" to='/dashboard'>
                    <i className="fa-solid fa-table-columns"></i>DASHBOARD</Link>):
                    (<p onClick={dashboardHandle}><i className="fa-solid fa-table-columns"></i>DASHBOARD</p>)
                    }
                </li>
                <li>
                    <Link className="nav-link" to='/about'>
                    <i className="fa-solid fa-circle-info"></i>ABOUT US</Link>
                </li>
            {account?(
            <div className="wbtn">
                <button className="btn">
                {account.slice(0, 6) + '...' + account.slice(38, 42)}
                </button>
            </div>):(
                <div className="wbtn">
                <button className="btn"
                onClick={connectHandler}>
                    Connect Wallet
                </button>
                </div>
            )}
            </ul>
        </div>
        </>
    );
}
