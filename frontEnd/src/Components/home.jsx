import React from "react";
import { Link } from 'react-router-dom';
import '../styling/textStyle.css';
import '../styling/home.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Post from "./post.jsx";

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            loading: true,
            error: "",
            searchTerm: ""
        };
    }

    componentDidMount() {
        this.fetchAllPosts();
    }

    fetchAllPosts = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/posts');
            const data = await res.json();

            if (!res.ok) {
                this.setState({ error: data.message || "Failed to load posts", loading: false });
                return;
            }

            this.setState({ posts: data, loading: false });
        } catch (err) {
            this.setState({ error: "Could not reach server", loading: false });
        }
    };

    handleSearchChange = (e) => {
        this.setState({ searchTerm: e.target.value });
    };

    getFilteredPosts = () => {
        const { posts, searchTerm } = this.state;
        if (!searchTerm.trim()) return posts;

        const term = searchTerm.toLowerCase();
        return posts.filter(p =>
            p.post_title.toLowerCase().includes(term) ||
            p.post_description.toLowerCase().includes(term)
        );
    };

    displayPhotos() {
        const posts = this.getFilteredPosts();

        if (posts.length === 0) {
            return <p className="text-center emptyMsg">No posts yet.</p>;
        }

        return posts.map((post) => {
            const mappedPost = {
                id: post.post_id,
                title: post.post_title,
                content: post.post_description,
                isAlbum: post.imgPath === '',
                likes: post.likes,
                comments: post.comments.length
            };

            return (
                <div key={post._id} className={`card ${mappedPost.isAlbum ? 'album' : ''} postCards`}>
                    <Link to={`/posts/${post.post_id}`}>
                        <Post data={mappedPost} />
                    </Link>
                </div>
            );
        });
    }

    render() {
        const { loading, error } = this.state;

        return (
            <div className="homeSection">
                <div className="section searchBar">
                    <input
                        type="text"
                        className="searchInput"
                        placeholder="Search"
                        value={this.state.searchTerm}
                        onChange={this.handleSearchChange}
                    />
                    <button className="btn_act">Search</button>
                </div>

                {loading && <p className="text-center">Loading posts...</p>}
                {error && <p className="text-center text-danger">{error}</p>}

                <div className="postings">
                    {!loading && !error && this.displayPhotos()}
                </div>
            </div>
        );
    }
}