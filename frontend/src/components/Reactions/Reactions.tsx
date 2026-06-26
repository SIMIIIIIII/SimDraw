import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaThumbsUp, FaDownload, FaComment } from 'react-icons/fa';
import type { IDrawing } from '../../types/drawing';
import type { ApiResponse } from '../../types/api';
import { API_URL } from '../../config';

interface IReactionsProps {
    drawing: IDrawing,
    index: number
}

const Reactions = ({ drawing, index } : IReactionsProps) => {
    const [likes, setLikes] = useState<number>(drawing.likes);
    
    const onLike = () => {
        fetch(`${API_URL}/drawing/like/${drawing._id}`, {
            credentials: 'include',
            method:'PUT',
        })
        .then((response) => {
            return response.json();
        })
        .then((data : ApiResponse<number>) => {
            if (data.success) setLikes(likes + data!.data!);
            else alert(data.error);
        })
        .catch((error) => console.error('Error liking drawing:', error));
    };

    const onDownload = () => {
        const canvas = document.getElementById(`drawingCanvas-${index}`);
        if (!canvas) {
            console.error('Canvas not found');
            return;
        }

        const drawingTitle = drawing.title || 'drawing';

        // Créer un canvas temporaire avec fond blanc
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext('2d');

        // Remplir le fond avec la couleur blanche
        tempCtx!.fillStyle = '#ffffff';
        tempCtx!.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

        // Copier le dessin original par-dessus
        tempCtx!.drawImage(canvas, 0, 0);

        // Télécharger l'image
        const dataURL = tempCanvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = `${drawingTitle}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <>
            <a onClick={onLike}>
                <FaThumbsUp /> {likes}
            </a>{' '}
            <Link to={`/drawing/${drawing._id}`}>
                <FaComment />{' '}
            </Link>{' '}
            <a onClick={onDownload}>
                <FaDownload />{' '}
            </a>
        </>
    );
};

export default Reactions;
