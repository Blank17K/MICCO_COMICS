import Ppic from './imgs/PP.svg'
import '../styling/profile.css'
import Post from './post'

const comicPosts = [
    {
        id: 1,
        title: "The Invisible Man's Wardrobe Malfunction",
        content: "For the third time this week, Gary the Invisible Man accidentally walked into work wearing nothing but a strategically placed post-it note. His boss was not amused, but the office security cameras caught a very suspicious floating sticky note.",
        isAlbum: true,
        likes: 10,
        comments: 30
    },
    {
        id: 2,
        title: "The Supermarket Sushi Gamble",
        content: "Dave decided to play 'Russian Roulette' with the 4 PM discounted sushi tray. He knew the tuna was a little gray, but the price was right. The battle between his wallet and his digestive system has officially begun.",
        isAlbum: false,
        likes: 5,
        comments: 6
    },
    {
        id: 3,
        title: "AI's First Day Writing Jokes",
        content: "I asked the AI to generate a knock-knock joke. It responded, 'Knock knock.' I said, 'Who's there?' It replied, 'An error occurred. Please try again.' I think it has a bright future in IT support.",
        isAlbum: true,
        likes: 3,
        comments: 1
    }
]
export default function Profile(){
    
    return(
        <div className="col">
            <div className="row profileHeader">
                <div className="col-3">
                    <img alt="profile_picture" src={Ppic} className="profilePic"/>
                    <h2>User Name:</h2>
                </div>
                <div className="section col bioUser">
                    <p className="bio"></p>
                    <span className='editP'><i class="lni lni-pen-to-square"></i></span>
                </div>
            </div>
            <div className='row'>
                <div className='col-3 section'>
                    <h4>Friend Request:</h4>
                    <div className='friendReq'></div>
                </div>
                <div className='col'>
                    <h3>Personal Collection</h3>
                    <div className='courcell row'>
                        <Post data={comicPosts[0]}/>
                        <Post data={comicPosts[1]}/>
                        <Post data={comicPosts[2]}/>
                    </div>
                    <h3>Active Friends</h3>
                    <div className='row'>
                    <img alt="profile_picture" src={Ppic} className="profilePic col"/>
                    <img alt="profile_picture" src={Ppic} className="profilePic col"/>
                    <img alt="profile_picture" src={Ppic} className="profilePic col"/>
                    <img alt="profile_picture" src={Ppic} className="profilePic col"/>
                        
                    </div>
                </div>
            </div>

        </div>
    )
}