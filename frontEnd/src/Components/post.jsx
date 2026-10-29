import React from "react";
import {Navigate } from 'react-router-dom';
import ReactDOM from "react-dom/client";
import '../styling/textStyle.css';
import '../styling/post.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import placeholder from './imgs/placeholder.svg';
import { mediaUrl } from '../api.js';

export default class Post extends React.Component {
    constructor(props){
        super(props);
    }
    
    render(){
        const data = this.props.data;
        const imagePath = data.imgPaths?.[0] || data.imgPath;
        //const album = data.isAlbum?"":"album";
        return(
            <>
                {data.isAlbum == true?<><div className="album_1"></div><div className="album_2"></div></>:""}
                <img src={imagePath ? mediaUrl(imagePath) : placeholder} className="card-img-top" alt={data.title}/>
                <div className="card-body">
                    <h5 className="card-title">{data.title}</h5>
                    <p className="card-text">{data.content}</p>
                </div>
                <div className="card-footer postFooter">
                    <span className="likeWrap"><i className="lni lni-heart likes"></i><span className="likeP">{data.likes}</span></span>
                    <i className="lni lni-megaphone-1 report"></i>
                </div>
            </>
        );
    }
}