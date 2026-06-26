import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { API_URL } from '../../config';
import { useAuth } from '../../context/AuthContext';
import checkInput from '../../helpers/checkInput'
import ConnexionForm from '../../components/ConnexionForm/ConnexionForm';
import type { ApiResponse } from '../../types/api';
import type { IUser } from '../../types/user';
import './Connexion.css'

const Connexion = () => {
    const [message, setMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [isCorrectUsername, setIsCorrectUsername] = useState<boolean>(false);
    const [isCorrectPassword, setIsCorrectPassword] = useState<boolean>(false);
    
    const navigate = useNavigate();
    const { login } = useAuth();
    const location = useLocation();

    

    useEffect(() => {
        if (loading) setLoading(false);
        }, [loading]);

    const onUsernameChange = (value: string) => {
        setIsCorrectUsername(checkInput.isValidUsername(value));
        setUsername(value);
    };

    const onPasswordChange = (value: string) => {
        setIsCorrectPassword(checkInput.isValidPassword(value));
        setPassword(value);
    };

    const onSubmit = (e: React.ChangeEvent) => {
        e.preventDefault();
        const datas = {
            password: password,
            username: username,
        };

        fetch(`${API_URL}/account/login`, {
            credentials: 'include',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datas),
        })
        .then(async (response) => {
            return await response.json(); 
        })
        .then((data : ApiResponse<IUser>) => {
            if (data.success) {
                login(data.data!)
                const redirect = location.state?.redirect || '/';
                navigate(redirect)
            }
            else setMessage(data.error!)
        })
        .catch((error) => {
            console.error('Error:', error);
            setLoading(false);
        });
    };

    if (loading) return <div>Connexion en cour...</div>;

    return (
        <section className="connexion-page">
            <div className="small-box">
                <h2>Connectez-vous</h2>
                <br />

                {message && <h3 className="error"> {message}</h3>}
                <ConnexionForm
                    username={username}
                    password={password}
                    onSubmit={onSubmit}
                    onPasswordChange={onPasswordChange}
                    onUsernameChange={onUsernameChange}
                    isCorrectPassword={isCorrectPassword}
                    isCorrectUsername={isCorrectUsername}
                />
                <br />
                <h3>
                <Link to="/subscription">Je crée mon compte</Link>
                </h3>
            </div>
        </section>
    );
};

export default Connexion;
