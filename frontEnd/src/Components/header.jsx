import React from "react";
import ReactDOM from "react-dom/client";
import 'bootstrap/dist/css/bootstrap.min.css';

export default class Header extends React.Component {

    render(){
        return(
            <div className="row">
                <h1 className="col-10">MICCO</h1>
                <button className="btn col-2">Logout</button>
            </div>
        );
    }
}