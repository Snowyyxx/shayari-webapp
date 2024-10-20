// CommentList.js

import React, { useEffect, useState } from 'react';
import SingleComment from './Comment';

function CommentList({ shayariId }) {
    const [comments, setComments] = useState([]);

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/comments/?shayari=${shayariId}`)
            .then((response) => response.json())
            .then((data) => {
                setComments(data);
            })
            .catch((error) => console.error('Error fetching comments:', error));
    }, [shayariId]);

    return (
        <div className="comment-list">
            {comments.length > 0 ? (
                comments.map((elem) => <SingleComment key={elem.id} elem={elem} />)
            ) : (
                <p>No comments yet.</p>
            )}
        </div>
    );
}

export default CommentList;
