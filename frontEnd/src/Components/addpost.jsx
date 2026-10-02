import '../styling/addPost.css';

export default function AddPost(props) {

    return(
        <div className="backDrop row justify-content-center align-items-center">
            <div className={`closeInteraction`} onClick={props.closeP}>X</div>
            <center className='formBox'>
                <h1 className="title">Add Post</h1>
                <div className="mb-3">
                    <input type="text" className="" id="floatingInput" placeholder="Title of Post"/>
                </div>
                <div className="">
                    <textarea className="" placeholder="Leave a comment here" id="floatingTextarea"></textarea>
                </div>
                <div className="input-group mb-3">
                    <input type="file" className="form-control" id="inputGroupFile02"/>
                    <label className="input-group-text" for="inputGroupFile02">Upload</label>
                </div>
            </center>
            
        </div>
    )
}