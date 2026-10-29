import React, { useState } from 'react';
import '../styling/addPost.css';

export default function AddPost(props) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        const t = title.trim();
        const d = description.trim();

        if (!t || !d) {
            setError('Please fill in both title and description.');
            return;
        }

        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.email) {
            setError('You must be logged in to post.');
            return;
        }

        setError('');
        setLoading(true);

        try {
            const res = await fetch('http://localhost:5000/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: user.email,
                    post_title: t,
                    post_description: d
                })
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || 'Failed to create post');
                setLoading(false);
                return;
            }

            setLoading(false);
            setTitle('');
            setDescription('');
            if (props.closeP) props.closeP();
            if (props.onPosted) props.onPosted(data.post);
        } catch (err) {
            setError('Could not reach server');
            setLoading(false);
        }
    };

    return (
        <div className="backDrop row justify-content-center align-items-center">
            <div className="closeInteraction" onClick={props.closeP}>X</div>
            <div className="formBox">
                <h1 className="title">Add Post</h1>

                {error && <p className="text-danger">{error}</p>}

                <div className="mb-3">
                    <input
                        type="text"
                        className=""
                        id="floatingInput"
                        placeholder="Title of Post"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                <div className="">
                    <textarea
                        className=""
                        placeholder="Write your description here"
                        id="floatingTextarea"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                </div>

                <div className="input-group mb-3">
                    <input type="file" className="form-control" id="inputGroupFile02" />
                    <label className="input-group-text" htmlFor="inputGroupFile02">Upload</label>
                </div>

                <button
                    className="btn_act"
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? '...' : 'UPLOAD'}
                </button>
            </div>
        </div>
    );
}