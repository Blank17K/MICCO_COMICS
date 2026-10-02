import React from "react";
import {Navigate } from 'react-router-dom';
import ReactDOM from "react-dom/client";
import headerBar from './imgs/header.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styling/header.css';
import AddPost from "./addpost";

export default class Header extends React.Component {
    constructor(props){
        super(props);
         this.state = {
            redirect: false,
            showAddPost:false
        };
        this.closeAddPost = this.closeAddPost.bind(this);
    }
    navigateToHome = (str) => {
        this.setState({ redirect: true });
        return <Navigate to={`${str}`} replace={true} />;
    }
    closeAddPost = ()=>{
        this.setState(prev=>({showAddPost: !prev.showAddPost}))
    }
    render(){
        if (this.state.redirect) {
            return <Navigate to="/" replace={true} />;
        }
        return(
            <div className="row mb-2 header section">
                {/*<img src={headerBar} alt="header" className="background"/>*/}
                <h1 className="title col-9">MICCO</h1>
                <button className="btn_act col" onClick={()=>{
                    this.navigateToHome("/");
                }}>
                    Logout
                </button>
                <button className="col ms-3 btn_act" onClick={()=>{this.setState(prev=>({showAddPost: !prev.showAddPost}))}}>Create Post</button>
                {this.state.showAddPost==true?<AddPost closeP={this.closeAddPost}/>:''}
            </div>
        );
    }
}