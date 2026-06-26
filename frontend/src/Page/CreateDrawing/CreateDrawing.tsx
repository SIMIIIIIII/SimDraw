import { useState } from "react";
import { API_URL } from "../../config";
import type { ApiResponse } from "../../types/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import DrawingForm from "../../components/DrawingForm/DrawingForm";
import './CreateDrawing.css';


const CreateDrawing = () => {
    const [message, setMessage] = useState<string | null>(null);
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [theme, setTheme] = useState<string>("");
    const [players, setPlayers] = useState<number>(2);
    const navigate = useNavigate();
    const {user, logout} = useAuth();

    const onSubmit = (e: React.ChangeEvent) => {
        e.preventDefault();

        if (!user) navigate('/login', {state: {redirect: '/drawing/create'}});
        else if (title.trim().length === 0) setMessage('Titre requis');
        else if (theme.trim().length === 0) setMessage('Theme Requis');
        else if (players < 2) setMessage('Minimum 2 joueurs requis');
        else {
            fetch(`${API_URL}/drawing`, {
                'credentials': 'include',
                'method': 'POST',
                'headers': {'Content-Type': 'application/json'},
                'body': JSON.stringify({
                    title: title,
                    description: description,
                    theme: theme,
                    maxParticipants: players
                })
            })
            .then(async (response) => {return await response.json()})
            .then((data : ApiResponse<null>) => {
                if (data.success) {
                    alert(data.message)
                    navigate('/');
                }
                else{
                    if (data.error?.includes('Connexion')){
                        logout();
                        navigate('/login');
                    }
                    else setMessage(data.error!);
                }
            })
            .catch((error) => {
                alert(error)
            })
        }
    }

    return (
        <div className="create-drawing-page">
            <DrawingForm
                title={title}
                description={description}
                theme={theme}
                players={players}
                onSubmit={onSubmit}
                setTitle={setTitle}
                setDescription={setDescription}
                setTheme={setTheme}
                setPlayers={setPlayers}
                message={message}
            />
        </div>
    )
}

export default CreateDrawing;