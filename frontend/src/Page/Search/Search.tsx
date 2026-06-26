import './Search.css'
import { ShowDrawings } from "../../components/ShowDrawings/ShowDrawings"
import { useEffect, useState } from "react";
import { API_URL } from "../../config";
import type { ApiResponse} from "../../types/api";
import type { IDrawing } from "../../types/drawing";
import { useSearchParams } from 'react-router-dom';

const Search = () => {
    const [drawings, setDrawings] = useState<IDrawing[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [message, setMessage] = useState<string>("");
    const [searchParams] = useSearchParams();


    useEffect(() => {
        const searchTerm= searchParams.get('search');

        fetch(`${API_URL}/research`, {
            credentials: 'include',
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({searchTerm: searchTerm})
        })
        .then((response) => {
            return response.json();
        })
        .then((data: ApiResponse<IDrawing[]>) => {
            if (data.success) {
                setDrawings(data!.data!);
                setMessage(data!.message!);
            }
            else alert(data.error);
            setLoading(false);
        })
        .catch((error) => {
            console.error('Error:', error);
            setLoading(false);
        });
    }, []);

    if (loading) return <div>Chargement des dessins...</div>;
    return (
        <section className="search-page">
            <br/>
            <ShowDrawings drawings={drawings} message={message}/>
        </section>
    )
}

export default Search;