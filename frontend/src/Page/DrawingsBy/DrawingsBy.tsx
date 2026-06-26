import { ShowDrawings } from "../../components/ShowDrawings/ShowDrawings"
import { useEffect, useState } from "react";
import { API_URL } from "../../config";
import './DrawingsBy.css'
import type { ApiResponse} from "../../types/api";
import type { IDrawing } from "../../types/drawing";
import { useSearchParams } from 'react-router-dom';

const DrawingsBy = () => {
    const [drawings, setDrawings] = useState<IDrawing[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const theme = searchParams.get('theme');
        const author = searchParams.get('author');
        const mine = searchParams.get('mine');
        let url : string;

        if (theme) url = `/by/theme/${theme}`;
        else if (author) url = `/by/author/${author}`;
        else if (mine) url = `${mine}`;
        else url = '/';

        fetch(`${API_URL}${url}`, {
            credentials: 'include',
        })
        .then((response) => {
            return response.json();
        })
        .then((data: ApiResponse<IDrawing[]>) => {
            if (data.success) setDrawings(data!.data!);
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
        <section className="drawings-by-page">
            <br/>
            <ShowDrawings drawings={drawings}/>
        </section>
    )
}

export default DrawingsBy;