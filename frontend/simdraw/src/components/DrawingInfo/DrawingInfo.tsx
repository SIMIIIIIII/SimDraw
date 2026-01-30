import { Link } from "react-router-dom"
import type { IDrawing } from "../../types/drawing"
import './DrawingInfo.css'


export const DrawingsInfo = ({drawing} : {drawing : IDrawing}) => {
    return (
        <table>
            <tbody>
                <tr>
                    <td>
                        <Link to={`/drawing/${drawing._id}`} className="titre-lien">
                            <h2>{drawing.title}</h2>
                        </Link>
                        <h5>
                            par:{' '}
                            <a href={`/?author=${drawing.author.authorId}`}>
                                {drawing.author.username || 'Inconnu.e'}
                            </a>
                        </h5>
                        <h5>
                            <a href={`/?theme=${drawing.theme}`}>#{drawing.theme}</a>
                        </h5>
                    </td>
                    <td>
                        <h4>Description: </h4> {drawing.description}
                    </td>
                </tr>
            </tbody>
        </table>
    )
}