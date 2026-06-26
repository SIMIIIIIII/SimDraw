import { useState, useEffect, useCallback } from 'react';
import { API_URL } from '../../config';
import type { IComment } from '../../types/comment';
import type { ApiResponse } from '../../types/api';
import { useAuth } from '../../context/AuthContext';
import './Comments.css';

interface CommentsProps {
    drawingId: string;
    isPublic: boolean;
}

const Comments = ({ drawingId, isPublic }: CommentsProps) => {
    const [comments, setComments] = useState<IComment[]>([]);
    const [commentText, setCommentText] = useState('');
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user } = useAuth();

    const fetchComments = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/drawing/${drawingId}`, {
                credentials: 'include'
            });
            const data: ApiResponse<{ comments?: IComment[] }> = await response.json();
            
            if (data.success && data.data) {
                setComments(Array.isArray(data.data.comments) ? data.data.comments : []);
            }
        } catch (error) {
            console.error('Erreur lors du chargement des commentaires:', error);
        }
    }, [drawingId]);

    useEffect(() => {
        if (isPublic) {
            fetchComments();
        }
    }, [drawingId, isPublic, fetchComments]);

    const handleCommentClick = (comment: IComment, commentId: string) => {
        if (comment.hasPosted) {
            setEditingCommentId(commentId);
            setCommentText(comment.comment);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!commentText.trim()) {
            alert('Veuillez saisir un commentaire');
            return;
        }

        if (!user) {
            alert('Vous devez être connecté pour commenter');
            return;
        }

        setIsSubmitting(true);

        try {
            const route = editingCommentId 
                ? `${API_URL}/comment/${editingCommentId}`
                : `${API_URL}/comment`;

            const response = await fetch(route, {
                method: editingCommentId ? 'PUT' : 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    comment: commentText,
                    drawingId: drawingId
                })
            });

            const data: ApiResponse<unknown> = await response.json();

            if (data.success) {
                resetForm();
                fetchComments();
            } else {
                alert(data.error || 'Erreur lors de la soumission');
            }
        } catch {
            alert('Erreur réseau lors de la soumission');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!editingCommentId) return;

        if (!confirm('Voulez-vous vraiment supprimer ce commentaire ?')) {
            resetForm();
            return;
        }

        try {
            const response = await fetch(`${API_URL}/comment/${editingCommentId}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            const data: ApiResponse<unknown> = await response.json();

            if (data.success) {
                resetForm();
                fetchComments();
            } else {
                alert(data.error || 'Erreur lors de la suppression');
            }
        } catch {
            alert('Erreur réseau lors de la suppression');
        }
    };

    const resetForm = () => {
        setCommentText('');
        setEditingCommentId(null);
    };

    if (!isPublic) {
        return null;
    }

    return (
        <div className="comments-container small-box">
            <h2>Poster un commentaire:</h2>
            <form onSubmit={handleSubmit}>
                <textarea
                    placeholder="Écrivez votre commentaire ici"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    disabled={isSubmitting}
                />
                <br />
                <button 
                    type="submit" 
                    disabled={isSubmitting}
                >
                    {editingCommentId ? 'Modifier' : 'Poster'}
                </button>
                {editingCommentId && (
                    <button 
                        type="button" 
                        onClick={handleDelete}
                        disabled={isSubmitting}
                    >
                        Supprimer
                    </button>
                )}
                {editingCommentId && (
                    <button 
                        type="button" 
                        onClick={resetForm}
                        disabled={isSubmitting}
                    >
                        Annuler
                    </button>
                )}
            </form>

            <br />

            <h2>Commentaires:</h2>
            
            <div className="scrollable-element">
                {comments.length > 0 ? (
                    comments.map((comment, index) => (
                        <div key={index} className="small-box comment-item">
                            <table>
                                <tbody>
                                    <tr>
                                        <td>
                                            <a href={`/by/author/${comment.author.authorId}`}>
                                                <span className="emoji">{comment.author.emoji}</span>
                                            </a>
                                        </td>
                                        <td>
                                            <a href={`/by/author/${comment.author.authorId}`}>
                                                <h4>{comment.author.username}</h4>
                                            </a>
                                            <label
                                                className={comment.hasPosted ? 'editable-comment' : ''}
                                                onClick={() => comment.hasPosted && handleCommentClick(comment, String(comment._id))}
                                            >
                                                {comment.comment}
                                            </label>
                                            &ensp;
                                            {(user && comment.hasPosted) || (user && user.admin) ? (
                                                <a 
                                                    href="#" 
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setEditingCommentId(String(comment._id));
                                                        handleDelete();
                                                    }}
                                                >
                                                    🚮
                                                </a>
                                            ) : null}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    ))
                ) : (
                    <p>Aucun commentaire pour le moment.</p>
                )}
            </div>
        </div>
    );
};

export default Comments;
