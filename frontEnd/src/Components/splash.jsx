import React from "react";
import ReactDOM from "react-dom/client";
import {Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styling/textStyle.css';
import '../styling/splash.css';


export default class Splash extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loginActive: false,
            close:"closeMenu",
            errorMessage:"",
            closeReg:"",
            validatedLog: false
        }
        this.userName = React.createRef();
        this.password = React.createRef();
        this.email = React.createRef();
    }
    clearFields = ()=>{
        this.userName.current.value = "";
        this.password.current.value = "";
    }
    validateUser = ()=>{
        const username = this.userName.current.value;
        const password = this.password.current.value;
        const email = this.email.current ? this.email.current.value : null;

        const uN = username.trim();
        const pW = password.trim();
        const eM = email ? email.trim() : null;
        if(!uN || !pW || (this.state.loginActive === false && !eM)) {
            this.setState({errorMessage: "Please fill in all required fields."});
            return;
        }
        this.setState({errorMessage: ""});
        console.log("Username:", username);
        console.log("Password:", password);
        console.log("Email:", email);
        this.setState({validatedLog:true});
    }
    login(){
        return(
            <div className={`formBox`}>
                {this.state.validatedLog == true? <Navigate to={"/home"} replace={true}/>:""}
                <h1 className="title">LOGIN</h1>
                <div className="row justify-content-center align-items-center">
                    {this.state.errorMessage == ""? "":<p className="text-danger">{this.state.errorMessage}</p>}
                    <input type="text" placeholder="Username" className="mb-3" ref={this.userName} />
                    <input type="password" placeholder="Password" className="mb-3" ref={this.password} />
                    <button className="btn_act mb-3 userAct" onClick={this.validateUser}>LOGIN</button>
                    <p className="pharagraph link_chk" onClick={()=>{this.setState({loginActive:false, errorMessage: ""}); this.clearFields();}}>Create Account</p>
                </div>
            </div>
        )
    }
    register(){
        return(
            <div className={`formBox `}>
                <h1 className="title">REGISTER</h1>
                <div className="row justify-content-center align-items-center">
                    {this.state.errorMessage == ""? "":<p className="text-danger">{this.state.errorMessage}</p>}
                    <input type="text" placeholder="Username" className="mb-3" ref={this.userName} />
                    <input type="password" placeholder="Password:" className="mb-3" ref={this.password} />
                    <input type="email" placeholder="Email:" className="mb-3" ref={this.email} />
                    <button className="btn_act mb-3 userAct" onClick={ this.validateUser}>REGISTER</button>
                    <p className="pharagraph link_chk" onClick={()=>{this.setState({loginActive:true, errorMessage: ""}); this.clearFields();}}>Already have an account? LOGIN</p>
                </div>
            </div>
        )
    }
    backDrop(){
        return(
            <div className={`backDrop row justify-content-center align-items-center ${this.state.close}`}>
                <div className={`closeInteraction`} onClick={() => this.setState({close:"closeMenu"})}>X</div>
                {this.state.loginActive ? this.login() : this.register()}
            </div>
        )
    }
    render(){
        return(
            <div className="spots row justify-content-center align-items-center">
                {this.backDrop()}
                <div className="signUp_In">
                    <button className="btn_act" onClick={() => {this.setState({loginActive: true, close:""}); }}>LOGIN</button>
                    <button className="btn_act ms-3" onClick={() => {this.setState({loginActive: false, close:""}); }}>REGISTER</button>
                </div>
                <div className="splash align-self-center">
                    <h1 className="title mainH ">MICCO</h1>
                    <div className="actBox">Where all your favourites are</div>
                </div>
            </div>
        );
    }

}