import {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import Ppic from './imgs/PP.svg'

export default function Community() {
    const [friends, setFriends] = useState([]);
    const navigate = useNavigate();

    const [messages, setMessages] = useState([]);

    const fetchFiendsList = async ()=>{
        
    }
    const displayFriends = (friends)=>{
        return friends.map((friend, index) => (
            <div key={index} className="friendItem row" onClick={() => navigate(`/profile/${friend._id}`)}>
                <img src={friend.profilePic || Ppic} alt="Profile" className="col-3 friendProfilePic" />
                <p className="col">{friend.userName}</p>
            </div>
        ));
    }
  return (
    <div className="community row col">
        <div className="col-3">
            <h2>Friends</h2>
            <hr/>
            <div className="friendList">
                {displayFriends(friends)}
            </div>
        </div>
        <div className="col messagesSection">
            <div className="row messageHeader justify-content-center align-items-center">
                <img src={Ppic} alt="Profile" className="col-3 friendProfilePic" />
                <h3 className="col">{"Unknown User"}</h3>
            </div>
            <div className="row messageBody">

            </div>
            <div className="row messageInput">
                <input type="text" placeholder="Type a message..." className="col-10" />
                <button className="col-2">Send</button>
            </div>
        </div>
    </div>
  );
}
