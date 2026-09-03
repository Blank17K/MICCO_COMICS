import ReactDOM from "react-dom/client";
import Header from "./src/Components/header.jsx";
import Splash from "./src/Components/splash.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';
function APP(){
    return(
        <div>
            <Splash/>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<APP />);