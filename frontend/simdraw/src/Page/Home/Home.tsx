import { ShowDrawings } from "../../components/ShowDrawings/ShowDrawings"
import { useEffect, useState } from "react";
import { API_URL } from "../../config";

import type { ApiError, ApiResponseWithData } from "../../types/api";
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
        .then((data: ApiResponseWithData<IDrawing[]>) => {
            if (data.success) setDrawings(data.data);
            else {
                const error : ApiError = (data as any) as ApiError
                alert(error.error);
            }
            setLoading(false);
        })
        .catch((error) => {
            console.error('Error:', error);
            setLoading(false);
        });
    }, []);

    if (loading) return <div>Chargement des dessins...</div>;
    return <ShowDrawings drawings={drawings}/>
}

export default Home;