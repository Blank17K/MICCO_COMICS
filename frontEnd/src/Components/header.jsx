import React from "react";
import {Navigate } from 'react-router-dom';
import ReactDOM from "react-dom/client";
import headerBar from './imgs/header.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styling/header.css';

export default class Header extends React.Component {
    constructor(props){
        super(props);
         this.state = {
            redirect: false
        };
    }
    navigateToHome = (str) => {
        this.setState({ redirect: true });
        return <Navigate to={`${str}`} replace={true} />;
    }

    render(){
        if (this.state.redirect) {
            return <Navigate to="/" replace={true} />;
        }
        return(
            <div className="row mb-2 header section">
                {/*<img src={headerBar} alt="header" className="background"/>*/}
                <h1 className="title col-10">MICCO</h1>
                <button className="btn_act col-2" onClick={()=>{
                    this.navigateToHome("/");
                }}>
                    Logout
                </button>
            </div>
        );
    }
}