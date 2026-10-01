import { useParams } from "react-router-dom";
import imgHolder from "./imgs/placeholder.svg"
import '../styling/postViewer.css'
function PostViewer(){
    const id = useParams();

    return(
        <div className="col section">
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
                    <div className="">

                    </div>
                </div>
            </div>
        </div>
    )
}

export default PostViewer;