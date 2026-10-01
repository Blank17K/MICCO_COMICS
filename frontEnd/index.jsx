import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Header from "./src/Components/header.jsx";
import Nav from "./src/Components/nav.jsx";
import Splash from "./src/Components/splash.jsx";
import Home from "./src/Components/home.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import PostViewer from "./src/Components/postViewer.jsx";
import Profile from "./src/Components/profile.jsx";
function APP(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Splash />} />

                {/* Needs Validation*/}
                <Route path="/home" element={
                    <div className="row elementBox">
                        <Header />
                        <Nav />
                        <Home />
                    </div>
                } />

                <Route path="posts/:id" element={
                    <div className="row eleentBox"> 
                        <Header/>
                        <Nav/>
                        <PostViewer/>
                    </div>
                }
                />
                <Route path="profile" element={
                    <div className="row eleentBox"> 
                        <Header/>
                        <Nav/>
                        <Profile/>
                    </div>
                }    
                />
            </Routes>
        </BrowserRouter>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<APP />);