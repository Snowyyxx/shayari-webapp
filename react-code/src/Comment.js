// Comment.js

import React from 'react';

function SingleComment({ elem }) {
    return (
        <div className="single-comment">
            <p>
                <strong>{elem.user}:</strong> {elem.content}
            </p>
        </div>
    );
}

export default SingleComment;
