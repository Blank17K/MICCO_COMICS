import React from "react";
import {Navigate } from 'react-router-dom';
import ReactDOM from "react-dom/client";
import '../styling/textStyle.css';
import '../styling/post.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class Post extends React.Component {
    constructor(props){
        super(props);
        this.data = props.data;
    }
    
    render(){
        const album = this.data.isAlbum?"":"album";
        return(
            <div className={`col-2 ms-2 card ${album}`} style={{ width: '18rem' }}>
            <img src="..." className="card-img-top" alt="..."/>
            <div className="card-body">
                <h5 className="card-title">{this.data.title}</h5>
                <p className="card-text">{this.data.content}</p>
            </div>
            </div>
        );
    }
}