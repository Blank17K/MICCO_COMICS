import { useState, useEffect, useRef } from "react";
import Ppic from './imgs/PP.svg'
import '../styling/community.css'
import { io } from 'socket.io-client'
import { API_BASE, mediaUrl, readResponse } from '../api.js'

export default function Community() {
    const [user] = useState(() => {
        const stored = localStorage.getItem('user')
        return stored ? JSON.parse(stored) : null
    })
    const [friends, setFriends] = useState([]);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState('');
    const [error, setError] = useState('');
    const socketRef = useRef(null);

    const userId = user?._id || user?.id

    useEffect(() => {
        if (!userId) return

        const fetchFriends = async () => {
            try {
                const res = await fetch(`${API_BASE}/users/${userId}/friends`)
                const data = await readResponse(res)
                setFriends(data.friends || [])
                setError('')
            } catch (err) {
                setError(err.message || 'Could not load friends')
            }
        }

        fetchFriends()
    }, [userId])

    useEffect(() => {
        if (!userId) return

        const socket = io()
        socketRef.current = socket
        socket.emit('join-user', userId)
        socket.on('online-users', setOnlineUsers)
        socket.on('private-message', message => {
            setMessages(current => [...current, message])
        })
        socket.on('message-error', data => {
            setError(data.message || 'Message could not be sent')
        })

        return () => {
            socket.disconnect()
            socketRef.current = null
        }
    }, [userId])

    const selectFriend = (friend) => {
        setSelectedFriend(friend)
        setMessages([])
        setMessageText('')
        setError('')
    }

    const sendMessage = () => {
        const text = messageText.trim()
        if (!selectedFriend || !text) return

        const friendId = selectedFriend._id
        if (!onlineUsers.includes(friendId)) {
            setError('Your friend is offline')
            return
        }

        socketRef.current.emit('private-message', {
            to: friendId,
            from: userId,
            message: text
        })
        setMessages(current => [...current, {
            from: userId,
            message: text,
            sentAt: new Date().toISOString()
        }])
        setMessageText('')
        setError('')
    }

    return (
        <div className="community">
            <aside className="section friendsPane">
                <h2>Friends</h2>
                <hr/>
                <div className="friendList">
                    {friends.map(friend => {
                        const isOnline = onlineUsers.includes(friend._id)
                        return (
                            <div
                                key={friend._id}
                                className="friendItem"
                                onClick={() => selectFriend(friend)}
                            >
                                <img
                                    src={mediaUrl(friend.profilePic) || Ppic}
                                    alt="Profile"
                                    className="friendProfilePic"
                                />
                                <p>{friend.username} ({isOnline ? 'Online' : 'Offline'})</p>
                            </div>
                        )
                    })}
                    {!friends.length && <p>No friends yet.</p>}
                </div>
            </aside>
            <div className="section messagesSection">
                <div className="messageHeader">
                    <img
                        src={mediaUrl(selectedFriend?.profilePic) || Ppic}
                        alt="Profile"
                        className="friendProfilePic"
                    />
                    <h3>{selectedFriend?.username || "Select a friend"}</h3>
                </div>
                <div className="messageBody">
                    {selectedFriend && !onlineUsers.includes(selectedFriend._id) && (
                        <p>Your friend is offline. They must be online to chat.</p>
                    )}
                    {messages
                        .filter(message => !selectedFriend || message.from === selectedFriend._id || message.from === userId)
                        .map((message, index) => (
                            <p key={`${message.sentAt}-${index}`}>
                                <strong>{message.from === userId ? 'You' : selectedFriend?.username}:</strong> {message.message}
                            </p>
                        ))}
                </div>
                <div className="messageInput">
                    <input
                        type="text"
                        placeholder="Type a message..."
                        value={messageText}
                        disabled={!selectedFriend || !onlineUsers.includes(selectedFriend._id)}
                        onChange={(event) => setMessageText(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') sendMessage()
                        }}
                    />
                    <button
                        className="btn_act"
                        disabled={!selectedFriend || !onlineUsers.includes(selectedFriend._id)}
                        onClick={sendMessage}
                    >
                        Send
                    </button>
                </div>
                {error && <p className="text-danger">{error}</p>}
            </div>
        </div>
    );
}
