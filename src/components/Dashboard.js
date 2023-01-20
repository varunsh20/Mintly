import "./DashboardStyle.css";
import SideBar from "./SideBar";
import { useState } from "react";
import {ethers} from "ethers";
import Mintly from './artifacts/contracts/Mintly.sol/Mintly.json';
import { toast, ToastContainer } from 'react-toastify';
import { Web3Storage, File } from 'web3.storage/dist/bundle.esm.min.js';

export default function Dashboard(){
    const [formInput, setFormInput] = useState({
      name:"",
      price:"",
      category:"",
      supply:"",
      coverImageURI:null,
      contentURI:null
    });

    //Functions for handling slider.
    const animationClickHandle = () => {
      setFormInput({
        ...formInput,
        category: 'Animation'
      })
    }
  
    const musicClickHandle = () => {
      setFormInput({
        ...formInput,
        category: 'Music'
      })
    }
  
    const ebooksClickHandle = () => {
      setFormInput({
        ...formInput,
        category: 'Ebooks'
      })
    }
  
    const podcastClickHandle = () => {
      setFormInput({
        ...formInput,
        category: 'Podcast'
      })
    }
  
    const educationClickHandle = () => {
      setFormInput({
        ...formInput,
        category: 'Education'
      })
    }
  
    const moviesClickHandle = () => {
      setFormInput({
        ...formInput,
        category: 'Movies'
      })
    }
  
    const artsClickHandle = () => {
      setFormInput({
        ...formInput,
        category: 'Art'
      })
    }
  
    const articlesClickHandle = () => {
      setFormInput({
        ...formInput,
        category: 'Articles'
      })
    }

    const postersClickHandle = () => {
      setFormInput({
        ...formInput,
        category: 'Posters'
      })
    }

    const ticketsClickHandle = () => {
      setFormInput({
        ...formInput,
        category: 'Tickets'
      })
    }
  
  
    //Uploading data to IPFS using Web3Storage.
  

    //It returns our access token.
    function getAccessToken () {
      return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEY5MmZFMzkxQTExOTdGMzFDNWE0RjMxNzcxMDU5NzI3QmZBMzhmNzAiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NzM5NTYwNTY0NTAsIm5hbWUiOiJNaW50bHkgZm9yIEVSQzExNTUgVG9rZW5zIn0.HZjs_rOAhkimQKRbgf28CudSshv4qbipCIGr9Zn2StQ"
    }
  
    //This function create a new web3storage client.
    function makeStorageClient () {
      return new Web3Storage({ token: getAccessToken() })
    }
  
    //This function uploads the cover image to ipfs and updates the state of cover image field with its uri.
    const coverHandle = async () => {
      const fileInput = document.getElementById('cover');
      const filePath = fileInput.files[0].name;
      const coverCID = await uploadToIPFS(fileInput.files,0);
  
      setFormInput({
        ...formInput,
        coverImageURI: `https://ipfs.io/ipfs/${coverCID}/${filePath}`
      })
    }
  
    //This function uploads the content to ipfs and updates the state of content field with its uri.
    const contentHandle = async () => {
      const fileInput = document.getElementById('content');
      const filePath = fileInput.files[0].name;
      const contentCID = await uploadToIPFS(fileInput.files,1);
  
      setFormInput({
        ...formInput,
        contentURI: `https://ipfs.io/ipfs/${contentCID}/${filePath}`
      })
    }
  
    const uploadToIPFS = async (files, flag) => {
      const client = makeStorageClient()
      const cid = await client.put(files)

      // Fires toast when cover image or content is uploaded to ipfs.
      if(flag==0 || flag==1){
        toast.success("File Uploaded Successfully.", {
          position: toast.POSITION.TOP_CENTER
        });
      }
  
      return cid
    }
  
    //This function uploads the metadata of our files and returns it's url.
    const metadata = async () => {
      const {name, price, coverImageURI, contentURI} = formInput;
      if (!name || !price || !coverImageURI || !contentURI) return;
      const data = JSON.stringify({ name, coverImageURI, contentURI });
      const files = [
        new File([data], 'data.json')
      ]
      const metaCID = await uploadToIPFS(files);
      return `https://ipfs.io/ipfs/${metaCID}/data.json`
    }


    //This function calls the mint function from smart contract and creates new tokens.
    const publishToken = async(e)=>{

      const providers = new ethers.providers.Web3Provider(window.ethereum);
      const signer = providers.getSigner();

      const tokenUri = await metadata();
      
    const contract = new ethers.Contract(
      process.env.REACT_APP_ELECTION_ADDRESS,
      Mintly.abi,
      signer
    )

  //If any input field is empty then a warning toast is fired.
  if(formInput.name === "") {
    toast.warn("Name Field Is Empty", {
      position: toast.POSITION.TOP_CENTER
    });
  } 
  else if(formInput.price === "" ) {
      toast.warn("Price Field Is Empty", {
        position: toast.POSITION.TOP_CENTER
      });
  } 
  else if(formInput.category === "") {
      toast.warn("Category Field Is Empty", {
        position: toast.POSITION.TOP_CENTER
      });
  } 
  else if(formInput.supply === "") {
      toast.warn("Supply Field Is Empty", {
        position: toast.POSITION.TOP_CENTER
      });
  } 
  
  else{
    //Creates new tokens.
    const price = ethers.utils.parseEther(formInput.price);
    const tokenData = await contract.createToken(tokenUri,formInput.supply,price,formInput.category);
    await tokenData.wait()
    .then( () => {
      toast.success("Token Minted Successfully.", {
      position: toast.POSITION.TOP_CENTER
      });
    }).catch( () => {
      toast.error("Failed to mint token.", {
        position: toast.POSITION.TOP_CENTER
      });
    })
  }
  }
    return(
        <>
        <SideBar/>
        <div className="container">
            <div className="main">
              <div className="hd">
                <h2>Welcome to mintly, Publish Your product and get a digital proof of ownership over your content.</h2>
                </div>
                <div className="publishform">
                <div className="name-div">
                    <p>Name</p>
                <input name="name" onChange={
                    (prop) => setFormInput({
                        ...formInput,
                        name: prop.target.value
                    })
                    } placeholder="Name of the product" required/>
                </div>
                <div className="type-div">
                    <p>Type</p>
                <div className="category-container1">
                  <div className="typecard1"
                    onClick={animationClickHandle}>
                    <div className="text-div">
                      <p>Animation</p>
                    </div>
                  </div>
                    <div className="typecard"
                    onClick={artsClickHandle}>
                    <div className="text-div1">
                      <p>Arts & Drawing</p>
                    </div>
                    </div>
                    <div className="typecard"
                    onClick={articlesClickHandle}>
                    <div className="text-div">
                      <p>Articles</p>
                    </div>
                  </div>
                  <div className="typecard"
                    onClick={ebooksClickHandle}>
                    <div className="text-div">
                      <p>Ebooks</p>
                    </div>
                  </div>
                  <div className="typecard"
                  onClick={educationClickHandle}>
                    <div className="text-div">
                      <p>Education</p>
                      </div>
                  </div>
                </div>
                <div className="category-container2">
                  <div className="typecard2"
                  onClick={moviesClickHandle}>
                    <div className="text-div">
                    <p>Movies</p>
                    </div>
                  </div>
                    <div className="typecard"
                    onClick={musicClickHandle}>
                    <div className="text-div">
                      <p>Music</p>
                      </div>
                    </div>
                    <div className="typecard"
                    onClick={podcastClickHandle}>
                    <div className="text-div">
                      <p>Podcasts</p>
                      </div>
                  </div>
                  <div className="typecard"
                  onClick={postersClickHandle}>
                    <div className="text-div">
                      <p>Posters</p>
                      </div>
                  </div>
                  <div className="typecard"
                  onClick={ticketsClickHandle}>
                    <div className="text-div">
                      <p>Tickets</p>
                    </div>
                  </div>
                </div>
              </div>
            <div className="price-copy-div">
              <div className="price-div">
                <p>Price</p>
                <input name="price" onChange={
                    (prop) => setFormInput({
                      ...formInput,
                      price: prop.target.value
                    })
                  } placeholder="1 ETH" required/>
              </div>
              <div className="copies-div">
                <p>Copies</p>
                <input name="copies" onChange={
                    (prop) => setFormInput({
                      ...formInput,
                      supply: prop.target.value
                    })
                  } placeholder="1" required/>
              </div>
            </div>
            <div className="Upload">
            <div className="cover-div">
                <p>Cover Image</p>
                <div className="dotted-div">
                  <div className="top">
                    <input className="uploadCover" type="file" id="cover" onChange={coverHandle}/>
                  </div>
                </div>
              </div>
              <div className="content-div">
                <p>Content</p>
                <div className="dotted-div">
                  <div className="top">
                    <input className="uploadContent" type="file" id="content" onChange={contentHandle}/>
                  </div>
                </div>
              </div>
            </div>
            <div className="mbtn">
              <button className="mint" onClick={publishToken}>Mint</button>
            </div>
        </div>
        </div>
        </div>
        </>
    );
}