import Navbar from "./components/Navbar.js";
import About from "./components/About";
import Dashboard from "./components/Dashboard";
import Home from "./components/Home";
import Inventory from "./components/Inventory";
import Listings from "./components/Listings";
import {Routes,Route,BrowserRouter} from "react-router-dom";

function App(){

  return(
    <>
    <BrowserRouter>
    <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/home" element={<Home/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/about" element={<About/>} />
        <Route path="/inventory" element={<Inventory/>}/>
        <Route path="/listings" element={<Listings/>}/>
      </Routes>
    </BrowserRouter>
    </>
  );
}


export default App;