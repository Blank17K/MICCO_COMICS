import React, { useState } from 'react';
import '../styling/addPost.css';
import { API_BASE, readResponse } from '../api.js';

export default function AddPost(props) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState([]);

    const handleSubmit = async () => {
        const t = title.trim();
        const d = description.trim();

        if (!t || !d) {
            setError('Please fill in both title and description.');
            return;
        }
        if (!images.length) {
            setError('Please upload at least one image.');
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
            const formData = new FormData();
            formData.append('email', user.email);
            formData.append('post_title', t);
            formData.append('post_description', d);
            images.forEach(image => formData.append('images', image));

            const res = await fetch(`${API_BASE}/posts`, {
                method: 'POST',
                body: formData
            });
            const data = await readResponse(res);

            setLoading(false);
            setTitle('');
            setDescription('');
            setImages([]);
            if (props.closeP) props.closeP();
            if (props.onPosted) props.onPosted(data.post);
        } catch (err) {
            setError(err.message || 'Could not reach server');
            setLoading(false);
        }
    };

    return (
        <div className="backDrop">
            <div className="closeInteraction" onClick={props.closeP}>X</div>
            <div className="formBox">
                <h1 className="title">Add Post</h1>

                <div className="formFields">
                    {error && <p className="text-danger">{error}</p>}

                    <input
                        type="text"
                        id="floatingInput"
                        placeholder="Title of Post"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    <textarea
                        placeholder="Write your description here"
                        id="floatingTextarea"
                        rows={5}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>

                    <div className="input-group">
                        <input
                            type="file"
                            className="form-control"
                            id="inputGroupFile02"
                            accept="image/*"
                            multiple
                            required
                            onChange={(e) => setImages(Array.from(e.target.files || []))}
                        />
                        <label className="input-group-text" htmlFor="inputGroupFile02">Upload</label>
                    </div>

                    <button
                        className="btn_act userAct"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? '...' : 'UPLOAD'}
                    </button>
                </div>
            </div>
        </div>
    );
}
