import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Ppic from './imgs/PP.svg'
import '../styling/profile.css'
import Post from './post'

const comicPosts = [
    { id: 1, title: "The Invisible Man's Wardrobe Malfunction", content: "...", isAlbum: true,  likes: 10, comments: 30 },
    { id: 2, title: "The Supermarket Sushi Gamble",              content: "...", isAlbum: false, likes: 5,  comments: 6  },
    { id: 3, title: "AI's First Day Writing Jokes",              content: "...", isAlbum: true,  likes: 3,  comments: 1  }
]

export default function Profile() {
    // ---- edit-profile state (mirrors Splash's editProfile state) ----
    const [editOpen, setEditOpen]       = useState(false)         // like `closeEdit: ""`
    const [editError, setEditError]     = useState("")
    const [editSuccess, setEditSuccess] = useState("")
    const [editLoading, setEditLoading] = useState(false)

    // ---- refs (mirrors this.editUsername, this.editBio, ...) ----
    const editUsername   = useRef(null)
    const editBio        = useRef(null)
    const editProfilePic = useRef(null)
    const editPassword   = useRef(null)

    // ---- cached user from localStorage (set by Splash login/register) ----
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem('user')
        return stored ? JSON.parse(stored) : null
    })

    // populate refs once the modal opens
    useEffect(() => {
        if (!editOpen || !user) return
        if (editUsername.current)   editUsername.current.value   = user.username   || ""
        if (editBio.current)        editBio.current.value        = user.bio        || ""
        if (editProfilePic.current) editProfilePic.current.value = user.profilePic || ""
        if (editPassword.current)   editPassword.current.value   = ""
    }, [editOpen, user])

    const clearEditFields = () => {
        if (editUsername.current)   editUsername.current.value   = ""
        if (editBio.current)        editBio.current.value        = ""
        if (editProfilePic.current) editProfilePic.current.value = ""
        if (editPassword.current)   editPassword.current.value   = ""
    }

    const closeEdit = () => {
        setEditError("")
        setEditSuccess("")
        setEditOpen(false)
        clearEditFields()
    }

    // ---- same shape as handleLogin / handleRegister ----
    const handleEditProfile = async () => {
        if (!user) {
            setEditError("You must be logged in.")
            return
        }
        const userId = user._id || user.id
        if (!userId) {
            setEditError("Missing user id.")
            return
        }

        const username   = editUsername.current?.value.trim()   || ""
        const bio        = editBio.current?.value.trim()        || ""
        const profilePic = editProfilePic.current?.value.trim() || ""
        const password   = editPassword.current?.value.trim()   || ""

        if (!username && !bio && !profilePic && !password) {
            setEditError("Please fill in at least one field.")
            return
        }

        setEditError("")
        setEditSuccess("")
        setEditLoading(true)

        const payload = {}
        if (username)   payload.username   = username
        if (bio)        payload.bio        = bio
        if (profilePic) payload.profilePic = profilePic
        if (password)   payload.password   = password

        try {
            const res = await fetch(`http://localhost:5000/api/users/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
            const data = await res.json()

            if (!res.ok) {
                setEditError(data.message || "Update failed")
                setEditLoading(false)
                return
            }

            // update cached user so the rest of the app sees the new data
            localStorage.setItem('user', JSON.stringify(data.user))
            setUser(data.user)

            setEditSuccess(data.message || "Profile updated")
            setEditLoading(false)
            closeEdit()
        } catch (err) {
            setEditError("Could not reach server")
            setEditLoading(false)
        }
    }

    // ---- same structure as Splash's editProfile() ----
    const renderEditModal = () => {
        return (
            <div className="formBox">
                <h1 className="title">EDIT PROFILE</h1>
                <div className="formFields">
                    {editError   !== "" && <p className="text-danger">{editError}</p>}
                    {editSuccess !== "" && <p className="text-success">{editSuccess}</p>}

                    <input type="text"     placeholder="New Username (optional)"     className="mb-3" ref={editUsername} />
                    <input type="text"     placeholder="Bio (optional)"              className="mb-3" ref={editBio} />
                    <input type="text"     placeholder="Profile Pic URL (optional)"  className="mb-3" ref={editProfilePic} />
                    <input type="password" placeholder="New Password (optional)"     className="mb-3" ref={editPassword} />

                    <button className="btn_act mb-3 userAct" onClick={handleEditProfile} disabled={editLoading}>
                        {editLoading ? "..." : "SAVE"}
                    </button>
                    <p className="pharagraph link_chk" onClick={closeEdit}>Cancel</p>
                </div>
            </div>
        )
    }

    // ---- same structure as Splash's backDropEdit() ----
    const backDropEdit = () => {
        if (!editOpen) return null
        return (
            <div className="backDrop">
                <div className="closeInteraction" onClick={closeEdit}>X</div>
                {renderEditModal()}
            </div>
        )
    }

    return (
        <div className="profileSection">
            {backDropEdit()}

            <div className="profileHeader">
                <div className="profileId">
                    <img
                        alt="profile_picture"
                        src={user?.profilePic || Ppic}
                        className="profilePic"
                    />
                    <h2>User Name: {user?.username || "Guest"}</h2>
                </div>
                <div className="section bioUser">
                    <p className="bio">{user?.bio || ""}</p>
                    <span className='editP' onClick={() => setEditOpen(true)}>
                        <i className="lni lni-pen-to-square"></i>
                    </span>
                </div>
            </div>

            <div className='profileBody'>
                <div className='section friendReqBox'>
                    <h4>Friend Request:</h4>
                    <div className='friendReq'></div>
                </div>
                <div className='personalSummary'>
                    <h3 className='section'>Personal Collection</h3>
                    <div className='courcell'>
                        <div className={`card ${comicPosts[1].isAlbum ? 'album' : ''} postCards`}><Link to={`/posts/${comicPosts[1].id}`}><Post data={comicPosts[1]}/></Link></div>
                        <div className={`card ${comicPosts[2].isAlbum ? 'album' : ''} postCards`}><Link to={`/posts/${comicPosts[2].id}`}><Post data={comicPosts[2]}/></Link></div>
                        <div className={`card ${comicPosts[0].isAlbum ? 'album' : ''} postCards`}><Link to={`/posts/${comicPosts[0].id}`}><Post data={comicPosts[0]}/></Link></div>
                    </div>
                    <h3 className='section mt-4'>Active Friends</h3>
                    <div className='activeFriends'>
                        <img alt="profile_picture" src={Ppic} className="profilePic small"/>
                        <img alt="profile_picture" src={Ppic} className="profilePic small"/>
                        <img alt="profile_picture" src={Ppic} className="profilePic small"/>
                        <img alt="profile_picture" src={Ppic} className="profilePic small"/>
                    </div>
                </div>
            </div>
        </div>
    )
}
