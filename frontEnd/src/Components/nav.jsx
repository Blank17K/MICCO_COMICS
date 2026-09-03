import React from "react";
import ReactDOM from "react-dom/client";
import '../styling/textStyle.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class Nav extends React.Component {

    render(){
        return(
            <div className="col-4">
                <h1 className="title col-10">MICCO</h1>
                <button className="btn_act col-2">Logout</button>
            </div>
        );
    }
}