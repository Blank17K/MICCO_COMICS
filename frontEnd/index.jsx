import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Header from "./src/Components/header.jsx";
import Nav from "./src/Components/nav.jsx";
import Splash from "./src/Components/splash.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';
function APP(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Splash />} />

                {/* Needs Validation*/}
                <Route path="/Home" element={
                    <div className="row">
                        <Header />
                        <Nav />
                    </div>
                } />
            </Routes>
        </BrowserRouter>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<APP />);