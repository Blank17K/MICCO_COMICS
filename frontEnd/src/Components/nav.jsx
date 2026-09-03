import React from "react";
import {Navigate } from 'react-router-dom';
import ReactDOM from "react-dom/client";
import '../styling/textStyle.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class Nav extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            activeH: "active",
            activeC: "",
            activeP: "",
        }
    }
    navigateToHome = (str) => {
        return <Navigate to={`${str}`} replace={true} />;
    }

    render(){
        return(
            <div className="col-3  section row justify-content-center align-items-center">
                <div className="row justify-content-center align-items-center">
                    <button className={`btn_act  ${this.state.activeH} mt-3 mb-2`} onClick={()=>{
                        this.setState({activeH:"active",activeC:"",activeP:""})
                    }}>Home</button>
                </div>
                <div className="row justify-content-center align-items-center">
                    <button className={`btn_act  ${this.state.activeC} mb-2`} onClick={()=>{
                        this.setState({activeH:"",activeC:"active",activeP:""})
                    }}>Community</button>
                </div>
                <div className="row justify-content-center align-items-center">
                    <button className={`btn_act  ${this.state.activeP} mb-2`} onClick={()=>{
                        this.setState({activeH:"",activeC:"",activeP:"active"})
                    }}>Profile</button>
                </div>
                
            </div>
        );
    }
}