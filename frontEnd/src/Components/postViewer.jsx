import { useParams } from "react-router-dom";
import imgHolder from "./imgs/placeholder.svg"
import '../styling/postViewer.css'
function PostViewer(){
    const id = useParams();

    return(
        <div className="col section postViwer">
            <div className="input-group mb-3">
                <input type="text" className="form-control" placeholder="Search" aria-label="Recipient’s username" aria-describedby="basic-addon2" />
                <span className="input-group-text" id="basic-addon2"><i className="lni lni-search-2"></i></span>
            </div>
            <div className="row ">
                <div className="imgCapcell col-5 ms-5">
                    <img className="imgCap" src={"imgHolder"} alt="couresoul"/>
                </div>
                <div className="imgInfo col">
                    <p className="ImgDescrip">For the third time this week, Gary the Invisible Man accidentally walked into work wearing nothing but a strategically placed post-it note. His boss was not amused, but the office security cameras caught a very suspicious floating sticky note.</p>
                    <p className="likeComments"><span className="lik"><i class="lni lni-heart"></i>7</span><span className="com"><i class="lni lni-comment-1"></i>6</span></p>
                    <div className="commentBox">
                        <div className="comments">

                        </div>
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" placeholder="Search" aria-label="Recipient’s username" aria-describedby="basic-addon2" />
                            <span className="input-group-text" id="basic-addon2"><i class="lni lni-location-arrow-right"></i></span>
                        </div>
                    </div>
                </div>
                <div className="row postFoot mt-3">
                    <div className="icon_btn col ms-5"><i class="lni lni-arrow-left"></i></div>
                    <div className="icon_btn col reoprt"><i class="lni lni-megaphone-1"></i></div>
                </div>
            </div>
        </div>
    )
}

export default PostViewer;