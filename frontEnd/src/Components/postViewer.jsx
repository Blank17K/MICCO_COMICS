import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import imgHolder from "./imgs/placeholder.svg";
import '../styling/postViewer.css';

function PostViewer() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [commentText, setCommentText] = useState("");

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/posts/${id}`);
                const data = await res.json();

                if (!res.ok) {
                    setError(data.message || "Failed to load post");
                    setLoading(false);
                    return;
                }

                setPost(data);
                setLoading(false);
            } catch (err) {
                setError("Could not reach server");
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    const addComment = () => {
        const text = commentText.trim();
        if (!text) return;

        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            setError("Please log in to comment");
            return;
        }

        const newComment = { username: user.username, commet: text };

        setPost(prev => ({
            ...prev,
            comments: [...prev.comments, newComment]
        }));

        setCommentText("");
    };

    if (loading) return <p className="text-center">Loading post...</p>;
    if (error) return <p className="text-center text-danger">{error}</p>;
    if (!post) return null;

    return (
        <div className="section postViewer">
            <div className="input-group viewerSearch">
                <input type="text" className="form-control" placeholder="Search" />
                <span className="input-group-text"><i className="lni lni-search-2"></i></span>
            </div>

            <div className="viewerGrid">
                <div className="imgCapcell">
                    <img
                        className="imgCap"
                        src={post.imgPath ? post.imgPath : imgHolder}
                        alt={post.post_title}
                    />
                </div>

                <div className="imgInfo">
                    <h3 className="title">{post.post_title}</h3>
                    <p className="ImgDescrip">{post.post_description}</p>

                    <p className="likeComments">
                        <span className="lik"><i className="lni lni-heart"></i> {post.likes}</span>
                        <span className="com"><i className="lni lni-comment-1"></i> {post.comments.length}</span>
                    </p>

                    <div className="commentBox">
                        <div className="comments">
                            {post.comments.map((c, i) => (
                                <div key={i} className="comment">
                                    <strong>{c.username}</strong>: {c.commet}
                                </div>
                            ))}
                        </div>

                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Add a comment"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                            />
                            <span
                                className="input-group-text"
                                style={{ cursor: "pointer" }}
                                onClick={addComment}
                            >
                                <i className="lni lni-location-arrow-right"></i>
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="postFoot">
                <div
                    className="icon_btn"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(-1)}
                >
                    <i className="lni lni-arrow-left"></i>
                </div>
                <div className="icon_btn reoprt">
                    <i className="lni lni-megaphone-1"></i>
                </div>
            </div>
        </div>
    );
}

export default PostViewer;