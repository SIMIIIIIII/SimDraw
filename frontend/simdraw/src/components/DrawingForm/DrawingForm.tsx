import './DrawingForm.css'

interface CreateDrawingProps {
    title: string;
    description: string;
    theme: string;
    players: number;
    onSubmit: (e: React.ChangeEvent) => void;
    setTitle: (title: string) => void;
    setDescription: (description: string) => void;
    setTheme: (theme: string) => void;
    setPlayers: (players: number) => void;
    message: string | null;
}

const DrawingForm = ({
    title,
    description,
    theme,
    players,
    onSubmit,
    setTitle,
    setDescription,
    setTheme,
    setPlayers,
    message
}: CreateDrawingProps) => {
    return (
        <section className="create">
            <div className="small-box">
                <h2>Créer un dessin</h2>

                {message && <p className="error"> Erreur: {message} <br/></p> }

                <form onSubmit={onSubmit}>
                    <table>
                        <tbody>
                            <tr>
                                <td>Titre du dessin</td>
                                <td>
                                    <input
                                        type="text"
                                        placeholder="title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </td>
                            </tr>
                            <tr>
                            <td>Nombre des joueur</td>
                            <td>
                                    <input
                                        type="number"
                                        placeholder="Number of players"
                                        value={players}
                                        onChange={(e) => setPlayers(parseInt(e.target.value))}
                                    />
                            </td>
                            </tr>
                            <tr>
                                <td>Theme</td>
                                <td>
                                    <input
                                        type="text"
                                        value={theme}
                                        onChange={(e) => setTheme(e.target.value)}
                                        placeholder="Theme"
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td> Description</td>
                                <td>
                                    <textarea
                                        placeholder="La description du projet"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    ></textarea>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <input type="submit" value="Créer"/>
                </form>
            </div>
        </section>
    )
}

export default DrawingForm