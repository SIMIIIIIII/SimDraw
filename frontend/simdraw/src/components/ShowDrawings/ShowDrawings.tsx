import { Link, useNavigate} from 'react-router-dom';
import Canvas from '../Canvas/Canvas';
import Reactions from '../Reactions/Reactions';
import type { IDrawing } from '../../types/drawing';
import { DrawingsInfo } from '../DrawingInfo/DrawingInfo';
import './ShowDrawings.css'
import Button from '../Button/Button';
import { useAuth } from '../../context/AuthContext';

interface IShowDrawingsProps {
    drawings: IDrawing[],
    message?: string
}

export const ShowDrawings = ({drawings, message} : IShowDrawingsProps) => {
    const { user } = useAuth()
    const navigate = useNavigate();

    const onPlay = () => {
        if (!user) navigate('/login');
        else navigate(`/draw`)
    }

    return (
        <>
            <Button onClick={onPlay}>Jouer</Button>

            {message && <h3>{message}</h3>}
            <div className="scrollable-element">
                {drawings.map((drawing, index) => (

                    <div key={drawing._id} className="small-box">
                        
                        <DrawingsInfo drawing={drawing}/>

                        <Link to={`/drawing/${drawing._id}`}>
                            <Canvas drawingPath={drawing.path} index={index} />
                        </Link>

                        <div>
                            <Reactions drawing={drawing} index={index} />
                        </div>

                        <br />
                    </div>
                ))}
            </div>
        </> 
    );
};