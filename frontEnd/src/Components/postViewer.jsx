import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import imgHolder from "./imgs/placeholder.svg";
import '../styling/postViewer.css';
import { API_BASE, mediaUrl, readResponse } from '../api.js';

function PostViewer() {
    const { id } = useParams();

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [friendRequestMessage, setFriendRequestMessage] = useState("");
    const [commentText, setCommentText] = useState("");
    const [activeImage, setActiveImage] = useState(0);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await fetch(`${API_BASE}/posts/${id}`);
                const data = await readResponse(res);

                setPost(data);
                setActiveImage(0);
                setLoading(false);
            } catch (err) {
                setError("Could not reach server");
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    const addComment = async () => {
        const text = commentText.trim();
        if (!text) return;

        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            setError("Please log in to comment");
            return;
        }

        try {
            const res = await fetch(`${API_BASE}/posts/${id}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: user.username, commet: text })
            });
            const data = await readResponse(res);
            setPost(prev => ({ ...prev, comments: data.comments }));
            setCommentText("");
        } catch (err) {
            setError(err.message || "Could not save comment");
        }
    };

    const toggleLike = async () => {
        const user = JSON.parse(localStorage.getItem('user'));
        const userId = user?._id || user?.id;
        if (!userId) {
            setError("Please log in to like a post");
            return;
        }

        try {
            const res = await fetch(`${API_BASE}/posts/${id}/like`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId })
            });
            const data = await readResponse(res);
            setPost(prev => ({ ...prev, likes: data.likes }));
        } catch (err) {
            setError(err.message || "Could not update like");
        }
    };

    const reportPost = async () => {
        try {
            const res = await fetch(`${API_BASE}/posts/${id}/report`, { method: 'POST' });
            await readResponse(res);
        } catch (err) {
            setError(err.message || "Could not report post");
        }
    };

    const askToBeFriend = async () => {
        const user = JSON.parse(localStorage.getItem('user'));
        const userId = user?._id || user?.id;
        if (!userId) {
            setFriendRequestMessage("Please log in to send a friend request");
            return;
        }

        try {
            const res = await fetch(`${API_BASE}/posts/${id}/friend-request`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId })
            });
            const data = await readResponse(res);
            setFriendRequestMessage(data.message);
        } catch (err) {
            setFriendRequestMessage(err.message || "Could not send friend request");
        }
    };

    if (loading) return <p className="text-center">Loading post...</p>;
    if (error) return <p className="text-center text-danger">{error}</p>;
    if (!post) return null;
    const imagePaths = post.imgPaths?.length
        ? post.imgPaths
        : (post.imgPath ? [post.imgPath] : []);
    const currentImage = imagePaths[activeImage] || null;

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
                        src={currentImage ? mediaUrl(currentImage) : imgHolder}
                        alt={post.post_title}
                    />
                    {imagePaths.length > 1 && (
                        <div className="d-flex justify-content-between align-items-center mt-2">
                            <button
                                type="button"
                                className="btn_act"
                                onClick={() => setActiveImage((activeImage - 1 + imagePaths.length) % imagePaths.length)}
                            >
                                Previous
                            </button>
                            <span>{activeImage + 1} / {imagePaths.length}</span>
                            <button
                                type="button"
                                className="btn_act"
                                onClick={() => setActiveImage((activeImage + 1) % imagePaths.length)}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>

                <div className="imgInfo">
                    <h3 className="title">{post.post_title}</h3>
                    <p className="ImgDescrip">{post.post_description}</p>

                    <p className="likeComments">
                        <span className="lik" onClick={toggleLike}><i className="lni lni-heart"></i> {post.likes}</span>
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
                    className="icon_btn AskToBeFriend"
                    style={{ cursor: "pointer" }}
                    onClick={askToBeFriend}
                >
                    <i class="lni lni-user-multiple-4"></i>
                </div>
                <div className="icon_btn report" onClick={reportPost}>
                    <i className="lni lni-megaphone-1"></i>
                </div>
            </div>
            {friendRequestMessage && <p className="text-center">{friendRequestMessage}</p>}
        </div>
    );
}

export default PostViewer;
