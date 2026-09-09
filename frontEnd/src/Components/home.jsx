import React from "react";
import {Navigate } from 'react-router-dom';
import ReactDOM from "react-dom/client";
import '../styling/textStyle.css';
import '../styling/home.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Post from "./post.jsx";
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
    },
    {
        id: 4,
        title: "The Time-Traveling Historian's Oops",
        content: "Professor Chronos went back to see the signing of the Declaration of Independence. He sneezed, and accidentally caused the ink to blot out the word 'Liberty.' He spent the rest of the afternoon trying to explain to the Founding Fathers that they meant 'Liberty' and not 'Soggy Waffles.'",
        isAlbum: false,
        likes: 7,
        comments: 6
    },
    {
        id: 5,
        title: "The Cat's Strategy Meeting",
        content: "The neighborhood cats gathered at 3 AM to discuss the global conspiracy of the 'Red Dot.' Mittens presented a compelling theory that it was controlled by the humans to distract them from the lack of tuna. They decided the next move was to knock a glass off the counter in protest.",
        isAlbum: true,
        likes: 4,
        comments: 8
    },
    {
        id: 6,
        title: "Parallel Parking in a Spaceport",
        content: "Captain Zorp had to park his 500-foot interstellar freighter between two much smaller shuttles. He spent 45 minutes nudging it back and forth, bumping four satellites and a moon, before finally giving up and just landing on the roof.",
        isAlbum: false,
        likes: 10,
        comments: 20
    },
    {
        id: 7,
        title: "The Vending Machine's Revenge",
        content: "After years of being kicked and shaken, the office vending machine gained sentience. It now only releases the bag of chips if you perform a small, awkward dance. The CEO is currently stuck doing the 'Macarena' for a bag of Cool Ranch Doritos.",
        isAlbum: false,
        likes: 9,
        comments: 4
    },
    {
        id: 8,
        title: "The Knight and the Dragon's Therapy Session",
        content: "Sir Reginald showed up to slay the dragon, but found it crying about its hoarding problem. 'It's not gold,' the dragon sobbed, 'it's just a bunch of shiny things I bought online!' They cancelled the battle and decided to see a couples counselor instead.",
        isAlbum: true,
        likes: 7,
        comments: 12
    },
    {
        id: 9,
        title: "The Emoji Movie: Directors Cut",
        content: "In the extended version, the '100%' emoji is actually a sentient loan calculator that keeps following the 'Money Bag' emoji around, yelling about interest rates. The 'Poop' emoji is the only one who finds this funny.",
        isAlbum: false,
        likes: 8,
        comments: 10
    },
    {
        id: 10,
        title: "The Last Slice of Pizza",
        content: "It sat in the fridge, radiating a golden aura. Three roommates stared at it. It was the perfect slice. They drew straws, and the loser had to admit they were the one who ate all the breadsticks. The pizza remained uneaten, a monument to their collective cowardice.",
        isAlbum: true,
        likes: 11,
        comments: 6
    }
];

export default class Home extends React.Component {
    constructor(props){
        super(props);
        
    }
    navigateToHome = (str) => {
        return <Navigate to={`${str}`} replace={true} />;
    }
    displayPhotos() {
        return comicPosts.map((post) => {
            return <Post data={post} key={post.id} />;
        });
    }

    render() {
        return(
            <div className="col homeSection">
                <div className="section row searchBar">
                    <input type="text" className="col" placeholder="Search"/>
                    <button className="btn_act col-2 ms-3">Search</button>
                </div>
                <div className="row row-cols-4 postings justify-content-center">
                    {this.displayPhotos()}
                </div>
            </div>
        );
    }
}

