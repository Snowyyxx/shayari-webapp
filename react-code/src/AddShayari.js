// AddShayari.js

import React, { useState, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';

function AddShayari() {
    const { authTokens } = useContext(AuthContext);
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const tagsArray = tags
            .split(',')
            .map((tag) => tag.trim())
            .filter((tag) => tag);
        const shayariData = {
            title,
            author,
            content,
            tags: tagsArray.map((tag) => ({ name: tag })),
        };
        fetch('http://127.0.0.1:8000/shayaris/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authTokens?.access}`,
            },
            body: JSON.stringify(shayariData),
        })
            .then((response) => {
                console.log(response);
                if (response.ok) {
                    setMessage('Shayari added successfully!');
                    setTitle('');
                    setAuthor('');
                    setContent('');
                    setTags('');
                    navigate('/');
                } else {

                    setMessage('Failed to add Shayari.'+response);
                }
            })
            .catch((error) => console.error('Error:', error));
    };

    return (
        <div className="add-shayari-card">
            <form onSubmit={handleSubmit} className="add-shayari-form">
                <h2 className="form-title">Add New Shayari</h2>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title"
                    required
                />
                <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Author"
                    required
                />
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Content"
                    required
                ></textarea>
                <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="Tags (comma separated)"
                />
                <button type="submit">Submit</button>
                {message && <p>{message}</p>}
            </form>
        </div>
    );
}

export default AddShayari;
