import React from "react";
import ReactDOM from "react-dom/client";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styling/textStyle.css';
import '../styling/splash.css';


export default class Splash extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div className="spots row justify-content-center align-items-center">
                <div className="splash align-self-center">
                    <h1 className="title mainH ">MICCO</h1>
                    <div className="actBox">Where all your favourites are</div>
                </div>
            </div>
        );
    }

}