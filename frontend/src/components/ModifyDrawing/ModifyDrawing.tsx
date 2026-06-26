import { useState } from "react"
import type { IDrawing } from "../../types/drawing";
import { API_URL } from "../../config";
import type { ApiResponse } from "../../types/api";
import { useNavigate } from "react-router-dom";

interface IModifyDrawingProps {
    drawing : IDrawing;
    setOnModify: (params : boolean) => void;
    setDrawing: (params : IDrawing) => void;
}

const ModifyDrawing = ({
    drawing,
    setOnModify,
    setDrawing
} : IModifyDrawingProps) => {
    const [title, setTitle] = useState<string>(drawing.title);
    const [description, setDescription] = useState<string | undefined>(drawing.description);
    const navigate = useNavigate()

    const onCancel = () => {
        if (confirm('Êtes-vous sur.e de vouloir annuler ?')){
            setDescription('');
            setTitle('');
            setOnModify(false);
        }
    }

    const onModify = () => {
        if (
            confirm('Êtes-vous sur.e de vouloir modifier ?') &&
            title.trim() === drawing.title.trim() &&
            description?.trim() === drawing.description?.trim()
        ){
            alert('Veillez modifier au moins 1 champ');
        }
        else if (title.trim().length <= 0) {
            alert('Le titre est requis')
        }
        else {
            fetch(`${API_URL}/drawing/${drawing._id}`, {
                'credentials': 'include',
                'method': 'PUT',
                'headers': {'Content-Type' : 'application/json'},
                'body': JSON.stringify({title: title.trim(), description: description?.trim()})
            })
            .then(async(response) => {
                return await response.json();
            })
            .then((data: ApiResponse<IDrawing>) => {
                if (data.success){
                    alert(data.message);
                    setDrawing(data.data!);
                    setOnModify(false);
                }
                else {
                    if (data.error?.includes('Connexion')){
                        let redirect : string;
                        if (drawing && drawing._id) redirect = `/drawing/?id=${drawing._id}`;
                        else redirect = '/';
                        navigate('/login', {state: {redirect: redirect}});
                    }
                    else alert(data.error);
                }
            })
            .catch((error) => alert(error));
        }
    }

    return (
        <>
            <h2>Modifier les informations:</h2>

            <form>
                <table>
                    <tr>
                        <td className="inscription">Titre du dessin</td>
                        <td>
                            <input
                                type="text"
                                placeholder="titre"
                                onChange={(e) => setTitle(e.target.value)}
                                value={title}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td className="inscription"> Description </td>
                        <td>
                            <textarea
                                placeholder="Votre nouvelle description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            ></textarea>
                        </td>
                    </tr>
                </table>
                <br/>
            </form>

            <button className="soumettre-button" onClick={onModify}> Modifier </button>

            <button className="soumettre-button" onClick={onCancel}> Annuler </button>
        </>
    )
}

export default ModifyDrawing