import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import SingleComment from './Comment';

function CommentSection({ shayariId }) {
    const [content, setContent] = useState('');
    const [comments, setComments] = useState([]);  // Move comments state here
    const { authTokens } = useContext(AuthContext);

    // Fetch comments for the current Shayari when the component mounts or when shayariId changes
    useEffect(() => {
        fetchComments();
    }, [shayariId]);

    // Function to fetch comments
    const fetchComments = () => {
        fetch(`http://127.0.0.1:8000/comments/?shayari=${shayariId}`)
            .then((response) => response.json())
            .then((data) => {
                setComments(data);
            })
            .catch((error) => console.error('Error fetching comments:', error));
    };

    // Handle form submission for adding a comment
    const handleSubmit = (e) => {
        e.preventDefault();
        const newComment = { content, shayari: shayariId };

        fetch('http://127.0.0.1:8000/comments/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authTokens?.access}`,
            },
            body: JSON.stringify(newComment),
        })
            .then(async (response) => {
                if (response.ok) {
                    setContent('');  // Clear the input field
                    fetchComments();  // Refresh the comments after successful submission
                }
            })
            .catch((error) => console.error('Error posting comment:', error));
    };

    return (
        <div className="comment-section">
            <h3>Comments</h3>
            {authTokens ? (
                <form onSubmit={handleSubmit} className="add-comment-form">
                    <input
                        placeholder="Add a comment..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />
                    <button type="submit">Post Comment</button>
                </form>
            ) : (
                <p>Please log in to add a comment.</p>
            )}

            {/* Render the list of comments */}
            <div className="comment-list">
                {comments.length > 0 ? (
                    comments.map((elem) => <SingleComment key={elem.id} elem={elem} />)
                ) : (
                    <p>No comments yet.</p>
                )}
            </div>
        </div>
    );
}

export default CommentSection;
