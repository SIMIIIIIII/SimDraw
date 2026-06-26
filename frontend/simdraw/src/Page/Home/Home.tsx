import { ShowDrawings } from "../../components/ShowDrawings/ShowDrawings"
import { useEffect, useState } from "react";
import { API_URL } from "../../config";
import './Home.css'

import type { ApiResponse} from "../../types/api";
import type { IDrawing } from "../../types/drawing";

const Home = () => {
    const [drawings, setDrawings] = useState<IDrawing[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_URL}`, {
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
        <section className="home-page">
            <br/>
            <ShowDrawings drawings={drawings}/>
        </section>
    )
}

export default Home;