import React from "react";
import {Navigate } from 'react-router-dom';
import ReactDOM from "react-dom/client";
import '../styling/textStyle.css';
import '../styling/post.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import placeholder from './imgs/placeholder.svg';
export default class Post extends React.Component {
    constructor(props){
        super(props);
        this.data = props.data;
    }
    
    render(){
        const album = this.data.isAlbum?"":"album";
        return(
            <div className={`col card ${album} postCards`}>
            {this.data.isAlbum == true?<><div className="album_1"></div><div className="album_2"></div></>:""}
            <img src={placeholder} className="card-img-top" alt="..."/>
            <div className="card-body">
                <h5 className="card-title">{this.data.title}</h5>
                <p className="card-text">{this.data.content}</p>
            </div>
            <div class="card-footer text-muted row justify-content-end">
                <div className="col row align-self-center"><i className=" col-2 lni lni-heart likes"></i> <p className="col-8 likeP">{this.data.likes}</p></div>
                <div className="col row align-self-center "><i className=" col lni lni-megaphone-1 report"></i></div>
            </div>
            </div>
        );
    }
}