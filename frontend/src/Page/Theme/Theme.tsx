import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../config';
import type { ApiResponse } from '../../types/api';
import './Theme.css';

interface ITheme {
    _id: string;
    theme: string;
}

const Theme = () => {
    const [themes, setThemes] = useState<ITheme[]>([]);
    const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
    const [nbPlayers, setNbPlayers] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchApprovedThemes();
    }, []);

    const fetchApprovedThemes = async () => {
        try {
            const response = await fetch(`${API_URL}/theme/getApproved`, {
                credentials: 'include'
            });
            const data: ApiResponse<ITheme[]> = await response.json();
            
            if (data.success && data.data) {
                setThemes(data.data);
            }
        } catch (error) {
            alert('Erreur lors du chargement des thèmes');
        }
    };

    const handleThemeClick = (themeName: string) => {
        setSelectedTheme(themeName);
    };

    const handleCreateTheme = async () => {
        const newTheme = prompt('Entrez le nom du thème :', '');
        
        if (!newTheme || !newTheme.trim()) {
            alert('Veuillez remplir le champ.');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/theme/create`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ newTheme: newTheme.trim() })
            });

            const data: ApiResponse<null> = await response.json();

            if (data.success) {
                alert(data.message || `Thème "${newTheme}" envoyé avec succès !`);
            } else {
                alert(data.error || 'Erreur lors de la création du thème');
            }
        } catch (error) {
            alert('Erreur réseau lors de la création du thème');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedTheme) {
            alert('Vous n\'avez pas cliqué sur un thème.');
            return;
        }

        if (!nbPlayers.trim()) {
            alert('Veuillez indiquer le nombre de joueurs.');
            return;
        }

        const nb = parseInt(nbPlayers);
        if (isNaN(nb) || nb < 2 || nb > 4) {
            alert('Veuillez entrer un nombre entier entre 2 et 4 inclus.');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/theme/commencer`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    theme: selectedTheme,
                    nbJoueurs: nb
                })
            });

            const data: ApiResponse<null> = await response.json();

            if (data.success) {
                navigate('/');
            } else {
                alert(data.error || 'Erreur lors de la création de la partie');
            }
        } catch (error) {
            alert('Erreur réseau lors de la création de la partie');
        }
    };

    const splitThemesIntoColumns = () => {
        const thirdSize = Math.ceil(themes.length / 3);
        return [
            themes.slice(0, thirdSize),
            themes.slice(thirdSize, 2 * thirdSize),
            themes.slice(2 * thirdSize)
        ];
    };

    const [col1, col2, col3] = splitThemesIntoColumns();

    return (
        <div className="theme-page">
            <p className="txt-theme">Sélectionner votre thème :</p>
            
            <div id="theme-container" className="container">
                <div className="theme-column scrollable-element">
                    <ul>
                        {col1.map((theme) => (
                            <li
                                key={theme._id}
                                className={selectedTheme === theme.theme ? 'selected-theme' : ''}
                                onClick={() => handleThemeClick(theme.theme)}
                            >
                                {theme.theme}
                            </li>
                        ))}
                    </ul>
                </div>
                
                <div className="theme-column scrollable-element">
                    <ul>
                        {col2.map((theme) => (
                            <li
                                key={theme._id}
                                className={selectedTheme === theme.theme ? 'selected-theme' : ''}
                                onClick={() => handleThemeClick(theme.theme)}
                            >
                                {theme.theme}
                            </li>
                        ))}
                    </ul>
                </div>
                
                <div className="theme-column scrollable-element">
                    <ul>
                        {col3.map((theme) => (
                            <li
                                key={theme._id}
                                className={selectedTheme === theme.theme ? 'selected-theme' : ''}
                                onClick={() => handleThemeClick(theme.theme)}
                            >
                                {theme.theme}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <button 
                className="creation-theme" 
                type="button" 
                onClick={handleCreateTheme}
            >
                Créer un thème
            </button>
            
            <form className="theme-form" onSubmit={handleSubmit}>
                <div className="nb-joueurs">
                    Indiquez le nombre de joueurs :
                    <input
                        type="number"
                        min="2"
                        max="4"
                        value={nbPlayers}
                        onChange={(e) => setNbPlayers(e.target.value)}
                        placeholder="2-4"
                    />
                </div>
                
                <button type="submit" className="commencer">
                    Commencer
                </button>
            </form>
        </div>
    );
};

export default Theme;
