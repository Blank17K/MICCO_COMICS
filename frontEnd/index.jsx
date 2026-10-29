import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Splash from "./src/Components/splash.jsx";
import Home from "./src/Components/home.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import PostViewer from "./src/Components/postViewer.jsx";
import Profile from "./src/Components/profile.jsx";
import Community from "./src/Components/community.jsx";
import AppLayout from "./src/Components/layout.jsx";

function APP(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Splash />} />

                {/* Needs Validation */}
                <Route element={<AppLayout />}>
                    <Route path="/home" element={<Home />} />
                    <Route path="/posts/:id" element={<PostViewer />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/community" element={<Community />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<APP />);
