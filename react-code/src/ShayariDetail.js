// ShayariDetail.js

import React, { useEffect, useState, useContext } from 'react';
import CommentSection from './CommentSection';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from './AuthContext';

function ShayariDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [shayari, setShayari] = useState(null);
    const { authTokens } = useContext(AuthContext);

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/shayaris/${id}/`)
            .then((response) => response.json())
            .then((data) => {
                setShayari(data);
            })
            .catch((error) => console.error('Error:', error));
    }, [id]);

    if (!shayari) {
        return <div>Loading...</div>;
    }

    const handleLike = () => {
        if (!authTokens) {
            alert('Please log in to like shayari.');
            return;
        }
        fetch(`http://127.0.0.1:8000/shayari/${id}/like/`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${authTokens.access}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.message) {
                    setShayari((prevShayari) => ({
                        ...prevShayari,
                        like_count: prevShayari.like_count + 1,
                    }));
                } else {
                    alert(data.error);
                }
            })
            .catch((error) => console.error('Error:', error));
    };

    const handleDislike = () => {
        if (!authTokens) {
            alert('Please log in to dislike shayari.');
            return;
        }
        fetch(`http://127.0.0.1:8000/shayari/${id}/dislike/`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${authTokens.access}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.message) {
                    setShayari((prevShayari) => ({
                        ...prevShayari,
                        dislike_count: prevShayari.dislike_count + 1,
                    }));
                } else {
                    alert(data.error);
                }
            })
            .catch((error) => console.error('Error:', error));
    };

    return (
        <div className="shayari-detail">
            <button className="back-button" onClick={() => navigate(-1)}>
                <FontAwesomeIcon icon={faArrowLeft} /> Back
            </button>
            <div className="shayari-card">
                <h2>{shayari.title}</h2>
                <h4>{shayari.author}</h4>
                {shayari.tags && (
                    <div className="tags">
                        {shayari.tags.map((tag) => (
                            <span key={tag.id} className="tag">
                                {tag.name}
                            </span>
                        ))}
                    </div>
                )}
                <p>“{shayari.content}”</p>
                <div className="shayari-actions">
                    <button onClick={handleLike} disabled={!authTokens}>
                        <FontAwesomeIcon icon={faThumbsUp} />
                        <span>{shayari.like_count}</span>
                    </button>
                    <button onClick={handleDislike} disabled={!authTokens}>
                        <FontAwesomeIcon icon={faThumbsDown} />
                        <span>{shayari.dislike_count}</span>
                    </button>
                </div>
            </div>
            <CommentSection shayariId={shayari.id} />
        </div>
    );
}

export default ShayariDetail;
