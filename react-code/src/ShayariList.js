// ShayariList.js

import React, { useEffect, useState, useContext } from 'react';
import Shayari from './Shayari';
import { AuthContext } from './AuthContext';

function ShayariList({ searchTerm }) {
    const [shayari, setShayari] = useState([]);
    const [tags, setTags] = useState([]);
    const [selectedTag, setSelectedTag] = useState('');
    const { authTokens } = useContext(AuthContext);

    useEffect(() => {
        fetch('http://127.0.0.1:8000/shayaris/')
            .then((response) => response.json())
            .then((data) => {
                setShayari(data);
            })
            .catch((error) => console.error('Error:', error));
    }, []);

    useEffect(() => {
        fetch('http://127.0.0.1:8000/tags/')
            .then((response) => response.json())
            .then((data) => setTags(data))
            .catch((error) => console.error('Error fetching tags:', error));
    }, []);

    const handleLike = (id) => {
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
                    setShayari((prevShayaris) =>
                        prevShayaris.map((shayari) =>
                            shayari.id === id ? { ...shayari, like_count: shayari.like_count + 1 } : shayari
                        )
                    );
                } else {
                    alert(data.error);
                }
            })
            .catch((error) => console.error('Error:', error));
    };

    const handleDislike = (id) => {
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
                    setShayari((prevShayaris) =>
                        prevShayaris.map((shayari) =>
                            shayari.id === id ? { ...shayari, dislike_count: shayari.dislike_count + 1 } : shayari
                        )
                    );
                } else {
                    alert(data.error);
                }
            })
            .catch((error) => console.error('Error:', error));
    };

    const filteredShayaris = shayari.filter((elem) => {
        const term = searchTerm.toLowerCase();
        const matchesSearch =
            elem.title.toLowerCase().includes(term) ||
            elem.author.toLowerCase().includes(term) ||
            elem.content.toLowerCase().includes(term);

        const matchesTag = selectedTag ? elem.tags.some((tag) => tag.name === selectedTag) : true;

        return matchesSearch && matchesTag;
    });

    return (
        <div>
            <div className="tag-filter">
                <select value={selectedTag} onChange={(e) => setSelectedTag(e.target.value)}>
                    <option value="">All Tags</option>
                    {tags.map((tag) => (
                        <option key={tag.id} value={tag.name}>
                            {tag.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="shayari-list">
                {filteredShayaris.map((elem) => (
                    <Shayari
                        key={elem.id}
                        id={elem.id}
                        title={elem.title}
                        author={elem.author}
                        content={elem.content}
                        likes={elem.like_count}
                        dislikes={elem.dislike_count}
                        tags={elem.tags}
                        onLike={() => handleLike(elem.id)}
                        onDislike={() => handleDislike(elem.id)}
                    />
                ))}
            </div>
        </div>
    );
}

export default ShayariList;
