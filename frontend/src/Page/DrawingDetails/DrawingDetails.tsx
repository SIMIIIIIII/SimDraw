import { useState, useEffect } from 'react';
import { type IDrawing } from '../../types/drawing';
import { DrawingsInfo } from '../../components/DrawingInfo/DrawingInfo';
import DrawingHistorique from '../../components/DrawingHistoric/DrawingHistorique';
import Comments from '../../components/Comments/Comments';
import { API_URL } from '../../config';
import { useNavigate, useParams } from 'react-router-dom';
import type { ApiResponse } from '../../types/api';
import ModifyDrawing from '../../components/ModifyDrawing/ModifyDrawing';
import './DrawingDetails.css';

const DrawingsDetail = () => {
    const [drawing, setDrawing] = useState<IDrawing | null>(null);
    const [onModify, setOnModify] = useState<boolean>(false);
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();


    useEffect(() => {
        if (!id) {
            alert('L\'ID du dessin non trouvé');
            navigate('/');
            return
        }

        fetch(`${API_URL}/drawing/${id}`, {
            credentials: 'include'
        })
        .then(async(response) => {
            return await response.json();
        })
        .then((data : ApiResponse<IDrawing>) => {
            if (data.success && data.data) {
                const payload = data.data as IDrawing | { drawing: IDrawing };
                const resolvedDrawing = 'drawing' in payload ? payload.drawing : payload;
                setDrawing(resolvedDrawing);
            }
            else {
                alert(data.error);
                navigate('/');
            }
        })
        .catch((error) => {
            alert(error);
            navigate('/')
        })
    }, [id, navigate])

    const onDelete = () => {
        if (confirm('Êtes-vous sur de vouloir suprimer?')){
            fetch(`${API_URL}/drawing/${id}`, {
                credentials: 'include',
                method: 'DELETE'
            })
            .then(async(response) => {
                return await response.json();
            })
            .then((data : ApiResponse<IDrawing>) => {
                if (data.success) alert(data.message);
                else alert(data.error);
            })
            .catch((error) => {
                alert(error);
            })
            .finally(() => navigate('/'))
        }

    }

    if (!drawing) {
        return <div>Chargement...</div>;
    }

    return (
        <section className="drawing-detail-section">
            <div className="drawing-detail-container">
                <div className="drawing-main">
                    {onModify ?
                        <ModifyDrawing
                            drawing={drawing!}
                            setOnModify={setOnModify}
                            setDrawing={setDrawing}
                        />
                        :
                        <>
                            <DrawingsInfo drawing={drawing}/>
                            <button className="soumettre-button" onClick={() => setOnModify(true)}> Modifier </button>
                            <button className="soumettre-button" onClick={onDelete}> Supprimer </button>
                        </>
                    }

                    <br/>
                    <br/>
                    
                    <DrawingHistorique drawing={drawing}/>
                </div>
                
                {drawing && drawing.isPublic && (
                    <div className="drawing-comments">
                        <Comments drawingId={drawing._id} isPublic={drawing.isPublic} />
                    </div>
                )}
            </div>
        </section>
    );
};

export default DrawingsDetail;