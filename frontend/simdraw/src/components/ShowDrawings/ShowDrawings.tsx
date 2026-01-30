import { Link} from 'react-router-dom';
import Canvas from '../Canvas/Canvas';
import Reactions from '../Reactions/Reactions';
import type { IDrawing } from '../../types/drawing';
import { DrawingsInfo } from '../DrawingInfo/DrawingInfo';
import './ShowDrawings.css'

export const ShowDrawings = ({ drawings } : { drawings : IDrawing[] }) => {
    return (
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
    );
};