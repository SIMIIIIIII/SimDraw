import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react'
import { API_URL } from "../../config";
import Canvas from "../Canvas/Canvas";
import type { IDrawing } from "../../types/drawing";
import type { ApiResponse } from "../../types/api";
import { DrawingsInfo } from "../DrawingInfo/DrawingInfo";
import './Admin.css'


const Admin = () => {
    const [drawings, setDrawings] = useState<IDrawing[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${API_URL}/account/admin`, {
            credentials: 'include',
            cache: 'no-store'
        })
        .then(async (response) => {
            return await response.json();
        })
        .then((data : ApiResponse<IDrawing[]>) => {
            if (data.success) {
                setDrawings(Array.isArray(data.data) ? data.data : []);
                setError(null);
            } else {
                setDrawings([]);
                if (data.error?.includes('Connexion')) {
                    alert(data.error);
                    navigate('/login', { state: { redirect: '/admin' } })
                } else {
                    setError(data.error || 'Erreur lors du chargement des dessins admin');
                }
            }
        })
        .catch((error) => {
            setError(error.toString());
            setDrawings([]);
        })
        .finally(() => {
            setIsLoading(false);
        });
        
    }, [navigate]);

    const handleDrawingAction = (value: string, drawingId: string) => {
        let methodChoice = 'PUT';
        if (value === 'refuser') methodChoice = 'DELETE';

        fetch(`${API_URL}/account/admin`, {
            credentials : 'include',
            method: methodChoice,
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify({choice: value, drawingId: drawingId})
        })
        .then(async (response) => {
            return await response.json();
        })
        .then((data : ApiResponse<IDrawing[]>) => {
            if (data.success) {
                setDrawings(drawings.filter((drawing) => drawing._id !== drawingId));
                alert(data.message);
            }
            else {
                if (data.error?.includes('Connexion')){
                    alert(data.error);
                    navigate('/login', { state: { redirect: '/admin' } })
                    return;
                }
                alert(data.error || data.message || 'Erreur lors de l\'action admin');
            }
        })
        .catch((error) => {
            alert(error);
        });
    };

    return (
        <section className="admin-section">
            <h2>Gestion Admin</h2>
            
            {error && <div className="error">{error}</div>}

            {/* Section des dessins terminés */}
            <div className="admin-block">
                <h3>Dessins Terminés</h3>
                {isLoading ? (
                    <p>Chargement des dessins...</p>
                ) : error ? (
                    <p>Impossible de charger les dessins en attente.</p>
                ) : drawings.length > 0 ? (
                    <div className="scrollable-element">
                        {drawings.map((drawing, index) => (
                            <div key={drawing._id} className="small-box">
                                <DrawingsInfo drawing={drawing}/>
                                
                                <Canvas drawingPath={drawing.path} index={index}/>

                                <div className="action-buttons">
                                    <button 
                                        className="btn-reject"
                                        onClick={() => handleDrawingAction('refuser', drawing._id)}
                                    >
                                        Refuser
                                    </button>
                                    <button 
                                        className="btn-accept"
                                        onClick={() => handleDrawingAction('accepter', drawing._id)}
                                    >
                                        Accepter
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>Aucun dessin en attente.</p>
                )}
            </div>
        </section>
    )
}

export default Admin;