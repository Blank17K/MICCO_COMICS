import {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import Ppic from './imgs/PP.svg'
import '../styling/community.css'

export default function Community() {
    const [friends, setFriends] = useState([]);
    const navigate = useNavigate();

    const [messages, setMessages] = useState([]);

    const fetchFiendsList = async ()=>{
        
    }
    const displayFriends = (friends)=>{
        return friends.map((friend, index) => (
            <div key={index} className="friendItem" onClick={() => navigate(`/profile/${friend._id}`)}>
                <img src={friend.profilePic || Ppic} alt="Profile" className="friendProfilePic" />
                <p>{friend.userName}</p>
            </div>
        ));
    }
  return (
    <div className="community">
        <aside className="section friendsPane">
            <h2>Friends</h2>
            <hr/>
            <div className="friendList">
                {displayFriends(friends)}
            </div>
        </aside>
        <div className="section messagesSection">
            <div className="messageHeader">
                <img src={Ppic} alt="Profile" className="friendProfilePic" />
                <h3>{"Unknown User"}</h3>
            </div>
            <div className="messageBody">

            </div>
            <div className="messageInput">
                <input type="text" placeholder="Type a message..." />
                <button className="btn_act">Send</button>
            </div>
        </div>
    </div>
  );
}
