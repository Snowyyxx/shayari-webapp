// Shayari.js

import React from 'react';
import { useNavigate } from 'react-router-dom';

function Shayari(props) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/shayari/${props.id}`);
    };

    return (
        <div className="shayari-card" onClick={handleClick}>
            <h2>{props.title}</h2>
            <h4>{props.author}</h4>
            {props.tags && (
                <div className="tags">
                    {props.tags.map((tag) => (
                        <span key={tag.id} className="tag">
                            {tag.name}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Shayari;
