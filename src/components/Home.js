import "./HomeStyle.css"
import p from "./imgs/p.jpg";
import { useState,useEffect} from "react";
import {Link,Element,Events,animateScroll as scroll,scroller} from "react-scroll";
import mat from "./imgs/mat.png";
import {ethers} from "ethers";
import Mintly from './artifacts/contracts/Mintly.sol/Mintly.json';
import {TailSpin} from 'react-loader-spinner';
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MediaRenderer } from "@thirdweb-dev/react";

export default function Home(){
    const[state,setState] = useState(false);
    const [loading,setLoading] = useState(true);
    const [Contents,setContents] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [animationNft,setAnimation] = useState([]);
    const [artsNft,setArts] = useState([]);
    const [articlesNft,setArticles] = useState([]);
    const [ebooksNft,setEbooks] = useState([]);
    const [educationNft,setEducation] = useState([]);
    const [moviesNft,setMovies] = useState([]);
    const [musicNft,setMusic] = useState([]);
    const [podcastNft,setPodcast] = useState([]);
    const [postersNft,setPoster] = useState([]);
    const [ticketsNft,setTickets] = useState([]);

    //It is used for loading the data whenever the page is refreshed.
    useEffect(() => {
      getStats();
    }, [loaded])

    //Function for handling the state of menubar.
    const handleClick = ()=>{
        setState(!state);
    }

    //Functions for handling slider.
    const allClickHandle = () => {
      scroll.scrollToTop({
        duration: 800,
        delay: 100,
        smooth: true
      });
    }
  
    const musicClickHandle = () => {
      scroller.scrollTo('music', {
        duration: 600,
        delay: 100,
        smooth: true,
      });
    }
  
    const animationClickHandle = () => {
      scroller.scrollTo('animation', {
        duration: 600,
        delay: 100,
        smooth: true
      });
    }
  
    const ebooksClickHandle = () => {
      scroller.scrollTo('ebooks', {
        duration: 600,
        delay: 100,
        smooth: true
      });
    }
  
    const artsClickHandle = () => {
      scroller.scrollTo('arts', {
        duration: 600,
        delay: 100,
        smooth: true
      });
    }
  
    const podcastClickHandle = () => {
      scroller.scrollTo('podcast', {
        duration: 600,
        delay: 100,
        smooth: true
      });
    }
  
    const articlesClickHandle = () => {
      scroller.scrollTo('articles', {
        duration: 600,
        delay: 100,
        smooth: true
      });
    }
  
    const moviesClickHandle = () => {
      scroller.scrollTo('films', {
        duration: 600,
        delay: 100,
        smooth: true
      });
    }
  
    const educationClickHandle = () => {
      scroller.scrollTo('education', {
        duration: 600,
        delay: 100,
        smooth: true
      });
    }

    const posterClickHandle = () => {
      scroller.scrollTo('posters', {
        duration: 600,
        delay: 100,
        smooth: true
      });
    }

    const ticketClickHandle = () => {
      scroller.scrollTo('ticket', {
        duration: 600,
        delay: 100,
        smooth: true
      });
  }


  //This function fetches the list of tokens that are still in supply.
    async function getStats(){

      const provider = new ethers.providers.JsonRpcProvider(
        process.env.REACT_APP_RPC_URL 
      )
    const r_contract = new ethers.Contract(
      process.env.REACT_APP_ADDRESS,
        Mintly.abi,
        provider
      )

    //It returns a list of tokens.
    const unsoldLists = await r_contract.unsoldItems();
    //Fetches all the details of a token.
    const Alldata = 
      await Promise.all(unsoldLists.map(async (e)=>{
      const t_uri = await r_contract.uri(e.tokenId.toString());
      const turi = t_uri.split("/");
      const uri = `https://ipfs.io/ipfs/${turi[2]}/${turi[3]}`;
      const meta = await axios.get(uri);
        return{
            id:e.tokenId.toNumber(),
            supplyleft:e.supplyLeft.toNumber(),
            price:ethers.utils.formatEther(e.price),
            category:e.category,
            cover: meta.data.coverImageURI,
            content: meta.data.contentURI,
            name:meta.data.name
        };
      })
    );
    setContents(Alldata);
    setLoading(false);
    filterItems();
  }

  //This function is used for filtering the NFT's based on their category.
  function filterItems(){
    Contents.map((e)=>{
      if(e.category==="Animation"){
        setAnimation(oldArray=>[...oldArray,e])
      }
      if(e.category==="Art"){
        setArts(oldArray=>[...oldArray,e])
      }
      if(e.category==="Articles"){
        setArticles(oldArray=>[...oldArray,e])
      }
      if(e.category==="Ebooks"){
        setEbooks(oldArray=>[...oldArray,e])
      }
      if(e.category==="Education"){
        setEducation(oldArray=>[...oldArray,e])
      }
      if(e.category==="Movies"){
        setMovies(oldArray=>[...oldArray,e])
      }
      if(e.category==="Music"){
        setMusic(oldArray=>[...oldArray,e])
      }
      if(e.category==="Podcast"){
        setPodcast(oldArray=>[...oldArray,e])
      }
      if(e.category==="Posters"){
        setPoster(oldArray=>[...oldArray,e])
      }
      if(e.category==="Tickets"){
        setTickets(oldArray=>[...oldArray,e])
      }
    })
    setLoaded(true);
  }

  //Function for purchasing a token.
  const buyToken = async(tokenId)=>{
    if(window.ethereum){
    const providers = new ethers.providers.Web3Provider(window.ethereum);
    const signer = providers.getSigner(); 

    const w_contract = new ethers.Contract(
      process.env.REACT_APP_ADDRESS,
      Mintly.abi,
      signer
    )
    const amount = await w_contract.getTotalPrice(tokenId);
    //const price = ethers.utils.parseEther(amount.toString());
    const transaction = await w_contract.buyNft(tokenId, {
        value: amount.toString(),
    });

    //Toast is fired based on the status of transaction.
    await transaction.wait()
    .then( () => {
      toast.success("Token Purchased Successfully.", {
      position: toast.POSITION.TOP_CENTER
      });
    }).catch( () => {
      toast.error("Transaction Failed.", {
        position: toast.POSITION.TOP_CENTER
      });
    })
    window.location.reload(true);
    }
    else{
      toast.warn("Please Install MetaMask.")
    }
  }

    return(
        <>
        <div className="home">
            <div className="category">
            <div className="menu-icon"> 
                <i onClick={handleClick} className={state ? "fas fa-times"
                :"fas fa-bars"}>
                </i>
            </div>
                <ul className={state? "c_menu active":
               "c_menu"}>
                    <li >
                      <Link>
                        <button className="t_btn" onClick={allClickHandle}>All</button>
                      </Link>
                    </li>
                    <li>
                    <Link>
                      <button className="t_btn" onClick={animationClickHandle}>Animations</button>
                    </Link>
                    </li>
                    <li>
                    <Link>
                      <button className="t_btn" onClick={articlesClickHandle}>Articles</button>
                    </Link>
                    </li>
                    <li>
                    <Link>
                      <button className="t_btn" onClick={artsClickHandle}>Arts & Drawings</button>
                    </Link>
                    </li>
                    <li>
                    <Link>
                      <button className="t_btn" onClick={ebooksClickHandle}>Ebooks</button>
                    </Link>
                    </li>
                    <li>
                    <Link>
                      <button className="t_btn" onClick={educationClickHandle}>Education</button>
                      </Link>
                    </li>
                    <li>
                      <Link>
                      <button className="t_btn" onClick={moviesClickHandle}>Movies</button>
                      </Link>
                    </li>
                    <li>
                    <Link>
                      <button className="t_btn" onClick={musicClickHandle}>Music</button>
                    </Link>
                    </li>
                    <li>
                    <Link>
                      <button className="t_btn" onClick={podcastClickHandle}>Podcasts</button>
                    </Link>
                    </li>
                    <li>
                    <Link>
                      <button className="t_btn" onClick={posterClickHandle}>Posters</button>
                    </Link>
                    </li>
                    <li>
                    <Link>
                      <button className="t_btn" onClick={ticketClickHandle}>Tickets</button>
                    </Link>
                    </li>
                </ul>
            </div>
        <div class="row">
            <div class="column1">
                    <h1>Explore, Buy or Sell Your Products as NFT's.</h1>
            </div>
            <div class="column2">
                <img src={p} alt="img" width="1000px"></img>
            </div>
        </div>
        </div>
        <div className="Content">
            <Element name="animation" className="animation-section">
              <div className="insideContainer">
                <div className="txt">
                  <h1>Animations</h1>
                  <h3>Sell your animated content as NFT's.</h3>
                </div>
                {loading? <div className="spinner">
                  <TailSpin height={150}></TailSpin>
                </div>:
                <div>
                  {animationNft.length=="0"?
                  <div className="notfound">
                    <h2>No Items Found.</h2>
                  </div>
                  :     
                <div className="bcards">
                  {animationNft.map((e)=>{
                  return(

                <div className="conts">
                  <div className="ybgImage">
                    <MediaRenderer className="ycoverImg" src={e.cover} alt={e.name}/>
                  </div>
                <div className="details">
                  <div className="btitle-div">
                    <p>#{e.id} {e.name}</p>
                  </div>
                  <div  className="bmiddle">
                    <div className="bleft">
                      <p className="bprice-text">Price</p>
                      <div className="beth">
                        <div className="blogo-div">
                          <img src={mat} alt="logo"/>
                        </div>
                        <div className="bamount-div">
                          <p>{e.price} MATIC</p>
                        </div>
                      </div>
                     </div>
                    <div className="bright">
                      <p className="bremaining-text">Remaining</p>
                      <div className="btoken-status">
                        {e.supplyleft}
                      </div>
                    </div>
                  </div>
                  <div className="bbtn">
                    <button className="buy" onClick={()=>buyToken(e.id)}>
                    Buy Now
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
        </Element>

            <Element name="articles" className="article-section">
              <div className="insideContainer">
              <div className="txt1">
                  <h1>Articles</h1>
                  <h3>Convert your articles into NFT's and get a digital proof of ownership.</h3>
                </div>
              {loading? <div className="spinner">
                  <TailSpin height={150}></TailSpin>
                </div>:
                <div>
                  {articlesNft.length=="0"?
                  <div className="notfound">
                    <h2>No Items Found.</h2>
                  </div>
                  :     
                <div className="bcards">
                  {articlesNft.map((e)=>{
                  return(

                <div className="conts">
                  <div className="ybgImage">
                    <MediaRenderer className="ycoverImg" src={e.cover} alt={e.name}/>
                  </div>
                <div className="details">
                  <div className="btitle-div">
                    <p>#{e.id} {e.name}</p>
                  </div>
                  <div  className="bmiddle">
                    <div className="bleft">
                      <p className="bprice-text">Price</p>
                      <div className="beth">
                        <div className="blogo-div">
                          <img src={mat} />
                        </div>
                        <div className="bamount-div">
                          <p>{e.price} MATIC</p>
                        </div>
                      </div>
                     </div>
                    <div className="bright">
                      <p className="bremaining-text">Remaining</p>
                      <div className="btoken-status">
                        {e.supplyleft}
                      </div>
                    </div>
                  </div>
                  <div className="bbtn">
                    <button className="buy" onClick={()=>buyToken(e.id)}>
                    Buy Now
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
        </Element>

            <Element name="arts" className="art-section">
              <div className="insideContainer">
              <div className="txt2">
                  <h1>Arts & Drawing</h1>
                  <h3>Showcase your skills and creativity in the form of NFT's.</h3>
              </div>
              {loading? <div className="spinner">
                  <TailSpin height={150}></TailSpin>
                </div>:
                <div>
                  {artsNft.length=="0"?
                  <div className="notfound">
                    <h2>No Items Found.</h2>
                  </div>
                  :     
                <div className="bcards">
                  {artsNft.map((e)=>{
                  return(

                <div className="conts">
                  <div className="ybgImage">
                    <MediaRenderer className="ycoverImg" src={e.cover} alt={e.name}/>
                  </div>
                <div className="details">
                  <div className="btitle-div">
                    <p>#{e.id} {e.name}</p>
                  </div>
                  <div  className="bmiddle">
                    <div className="bleft">
                      <p className="bprice-text">Price</p>
                      <div className="beth">
                        <div className="blogo-div">
                          <MediaRenderer src={mat} />
                        </div>
                        <div className="bamount-div">
                          <p>{e.price} MATIC</p>
                        </div>
                      </div>
                     </div>
                    <div className="bright">
                      <p className="bremaining-text">Remaining</p>
                      <div className="btoken-status">
                        {e.supplyleft}
                      </div>
                    </div>
                  </div>
                  <div className="bbtn">
                    <button className="buy" onClick={()=>buyToken(e.id)}>
                    Buy Now
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
        </Element>

            <Element name="ebooks" className="ebooks-section">
              <div className="insideContainer">
              <div className="txt3">
                  <h1>EBooks</h1>
                  <h3>Share your knowledge, ideas and beliefs with NFT based EBooks.</h3>
                </div>
              {loading? <div className="spinner">
                  <TailSpin height={150}></TailSpin>
                </div>:
                <div>
                  {ebooksNft.length=="0"?
                  <div className="notfound">
                    <h2>No Items Found.</h2>
                  </div>
                  :     
                <div className="bcards">
                  {ebooksNft.map((e)=>{
                  return(

                <div className="conts">
                  <div className="ybgImage">
                    <MediaRenderer className="ycoverImg" src={e.cover} alt={e.name}/>
                  </div>
                <div className="details">
                  <div className="btitle-div">
                    <p>#{e.id} {e.name}</p>
                  </div>
                  <div  className="bmiddle">
                    <div className="bleft">
                      <p className="bprice-text">Price</p>
                      <div className="beth">
                        <div className="blogo-div">
                          <img src={mat} />
                        </div>
                        <div className="bamount-div">
                          <p>{e.price} MATIC</p>
                        </div>
                      </div>
                     </div>
                    <div className="bright">
                      <p className="bremaining-text">Remaining</p>
                      <div className="btoken-status">
                        {e.supplyleft}
                      </div>
                    </div>
                  </div>
                  <div className="bbtn">
                    <button className="buy" onClick={()=>buyToken(e.id)}>
                    Buy Now
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
        </Element>

            <Element name="education" className="education-section">
              <div className="insideContainer">
              <div className="txt4">
                  <h1>Education</h1>
                  <h3>Explore, Buy or Sell your quality educational content with a digital proof.</h3>
                </div>
              {loading? <div className="spinner">
                  <TailSpin height={150}></TailSpin>
                </div>:
                <div>
                  {educationNft.length=="0"?
                  <div className="notfound">
                    <h2>No Items Found.</h2>
                  </div>
                  :     
                <div className="bcards">
                  {educationNft.map((e)=>{
                  return(

                <div className="conts">
                  <div className="ybgImage">
                    <MediaRenderer className="ycoverImg" src={e.cover} alt={e.name}/>
                  </div>
                <div className="details">
                  <div className="btitle-div">
                    <p>#{e.id} {e.name}</p>
                  </div>
                  <div  className="bmiddle">
                    <div className="bleft">
                      <p className="bprice-text">Price</p>
                      <div className="beth">
                        <div className="blogo-div">
                          <img src={mat} />
                        </div>
                        <div className="bamount-div">
                          <p>{e.price} MATIC</p>
                        </div>
                      </div>
                     </div>
                    <div className="bright">
                      <p className="bremaining-text">Remaining</p>
                      <div className="btoken-status">
                        {e.supplyleft}
                      </div>
                    </div>
                  </div>
                  <div className="bbtn">
                    <button className="buy" onClick={()=>buyToken(e.id)}>
                    Buy Now
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
        </Element>

            <Element name= "films" className="films-section">
              <div className="insideContainer">
              <div className="txt5">
                  <h1>Movies</h1>
                  <h3>Sell your movies as NFT's.</h3>
                </div>
              {loading? <div className="spinner">
                  <TailSpin height={150}></TailSpin>
                </div>:
                <div>
                  {moviesNft.length=="0"?
                  <div className="notfound">
                    <h2>No Items Found.</h2>
                  </div>
                  :     
                <div className="bcards">
                  {moviesNft.map((e)=>{
                  return(

                <div className="conts">
                  <div className="ybgImage">
                    <img className="ycoverImg" src={e.cover} alt={e.name}/>
                  </div>
                <div className="details">
                  <div className="btitle-div">
                    <p>#{e.id} {e.name}</p>
                  </div>
                  <div  className="bmiddle">
                    <div className="bleft">
                      <p className="bprice-text">Price</p>
                      <div className="beth">
                        <div className="blogo-div">
                          <img src={mat} />
                        </div>
                        <div className="bamount-div">
                          <p>{e.price} MATIC</p>
                        </div>
                      </div>
                     </div>
                    <div className="bright">
                      <p className="bremaining-text">Remaining</p>
                      <div className="btoken-status">
                        {e.supplyleft}
                      </div>
                    </div>
                  </div>
                  <div className="bbtn">
                    <button className="buy" onClick={()=>buyToken(e.id)}>
                    Buy Now
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
        </Element>

            <Element name="music" className="music-section">
              <div className="insideContainer">
              <div className="txt6">
                  <h1>Music</h1>
                  <h3>No middle man cutting your sales. Create, Buy, Sell and Earn with your music NFTs.</h3>
                </div>
              {loading? <div className="spinner">
                  <TailSpin height={150}></TailSpin>
                </div>:
                <div>
                  {musicNft.length=="0"?
                  <div className="notfound">
                    <h2>No Items Found.</h2>
                  </div>
                  :     
                <div className="bcards">
                  {musicNft.map((e)=>{
                  return(

                <div className="conts">
                  <div className="ybgImage">
                    <MediaRenderer className="ycoverImg" src={e.cover} alt={e.name}/>
                  </div>
                <div className="details">
                  <div className="btitle-div">
                    <p>#{e.id} {e.name}</p>
                  </div>
                  <div  className="bmiddle">
                    <div className="bleft">
                      <p className="bprice-text">Price</p>
                      <div className="beth">
                        <div className="blogo-div">
                          <img src={mat} />
                        </div>
                        <div className="bamount-div">
                          <p>{e.price} MATIC</p>
                        </div>
                      </div>
                     </div>
                    <div className="bright">
                      <p className="bremaining-text">Remaining</p>
                      <div className="btoken-status">
                        {e.supplyleft}
                      </div>
                    </div>
                  </div>
                  <div className="bbtn">
                    <button className="buy" onClick={()=>buyToken(e.id)}>
                    Buy Now
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
        </Element>

            <Element name="podcast" className="podcast-section">
              <div className="insideContainer">
              <div className="txt7">
                  <h1>Podcasts</h1>
                  <h3>Convert your podcasts into NFT's and earn at a better rate.</h3>
                </div>
              {loading? <div className="spinner">
                  <TailSpin height={150}></TailSpin>
                </div>:
                <div>
                  {podcastNft.length=="0"?
                  <div className="notfound">
                    <h2>No Items Found.</h2>
                  </div>
                  :     
                <div className="bcards">
                  {podcastNft.map((e)=>{
                  return(

                <div className="conts">
                  <div className="ybgImage">
                    <MediaRenderer className="ycoverImg" src={e.cover} alt={e.name}/>
                  </div>
                <div className="details">
                  <div className="btitle-div">
                    <p>#{e.id} {e.name}</p>
                  </div>
                  <div  className="bmiddle">
                    <div className="bleft">
                      <p className="bprice-text">Price</p>
                      <div className="beth">
                        <div className="blogo-div">
                          <img src={mat} alt="logo"/>
                        </div>
                        <div className="bamount-div">
                          <p>{e.price} MATIC</p>
                        </div>
                      </div>
                     </div>
                    <div className="bright">
                      <p className="bremaining-text">Remaining</p>
                      <div className="btoken-status">
                        {e.supplyleft}
                      </div>
                    </div>
                  </div>
                  <div className="bbtn">
                    <button className="buy" onClick={()=>buyToken(e.id)}>
                    Buy Now
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
        </Element>

            <Element name="posters" className="posters-section">
              <div className="insideContainer">
              <div className="txt8">
                  <h1>Posters</h1>
                  <h3>Get your posters ready as NFT's within minutes.</h3>
                </div>
              {loading? <div className="spinner">
                  <TailSpin height={150}></TailSpin>
                </div>:
                <div>
                  {postersNft.length=="0"?
                  <div className="notfound">
                    <h2>No Items Found.</h2>
                  </div>
                  :     
                <div className="bcards">
                  {postersNft.map((e)=>{
                  return(

                <div className="conts">
                  <div className="ybgImage">
                    <MediaRenderer className="ycoverImg" src={e.cover} alt={e.name}/>
                  </div>
                <div className="details">
                  <div className="btitle-div">
                    <p>#{e.id} {e.name}</p>
                  </div>
                  <div  className="bmiddle">
                    <div className="bleft">
                      <p className="bprice-text">Price</p>
                      <div className="beth">
                        <div className="blogo-div">
                          <img src={mat} alt="logo"/>
                        </div>
                        <div className="bamount-div">
                          <p>{e.price} MATIC</p>
                        </div>
                      </div>
                     </div>
                    <div className="bright">
                      <p className="bremaining-text">Remaining</p>
                      <div className="btoken-status">
                        {e.supplyleft}
                      </div>
                    </div>
                  </div>
                  <div className="bbtn">
                    <button className="buy" onClick={()=>buyToken(e.id)}>
                    Buy Now
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
        </Element>

            <Element name="ticket" className="ticket-section">
              <div className="insideContainer">
              <div className="txt9">
                  <h1>Tickets</h1>
                  <h3>Convert any kind of tickets into NFT's.</h3>
                </div>
              {loading? <div className="spinner">
                  <TailSpin height={150}></TailSpin>
                </div>:
                <div>
                  {ticketsNft.length=="0"?
                  <div className="notfound">
                    <h2>No Items Found.</h2>
                  </div>
                  :     
                <div className="bcards">
                  {ticketsNft.map((e)=>{
                  return(

                <div className="conts">
                  <div className="ybgImage">
                    <img className="ycoverImg" src={e.cover} alt={e.name}/>
                  </div>
                <div className="details">
                  <div className="btitle-div">
                    <p>#{e.id} {e.name}</p>
                  </div>
                  <div  className="bmiddle">
                    <div className="bleft">
                      <p className="bprice-text">Price</p>
                      <div className="beth">
                        <div className="blogo-div">
                          <img src={mat} alt="eth"/>
                        </div>
                        <div className="bamount-div">
                          <p>{e.price} MATIC</p>
                        </div>
                      </div>
                     </div>
                    <div className="bright">
                      <p className="bremaining-text">Remaining</p>
                      <div className="btoken-status">
                        {e.supplyleft}
                      </div>
                    </div>
                  </div>
                  <div className="bbtn">
                    <button className="buy" onClick={()=>buyToken(e.id)}>
                    Buy Now
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
        </Element>
      </div>
        </>
    );
}