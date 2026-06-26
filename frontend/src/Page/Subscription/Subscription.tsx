import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import checkInput from '../../helpers/checkInput';
import { API_URL } from '../../config';
import type { ApiResponse } from '../../types/api';
import type { IUser } from '../../types/user';
import SubscriptionForm from '../../components/SubscriptionForm/SubscriptionForm';
import './Subscription.css';

const Subscription = () => {
    const { user, login } = useAuth();
    const [message, setMessage] = useState<string | null>(null);
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [usernameFeedback, setUsernameFeedback] = useState<string | null>(null);
    const [passwordFeedback, setPasswordFeedback] = useState<string | null>(null);
    const [emailFeedback, setEmailFeedback] = useState<string | null>(null);
    const [disableSubmit, setdisableSubmit] = useState<boolean>(true);
    const [emoji, setEmoji] = useState('1f601');
    const navigate = useNavigate();

    useEffect(() => {
        const shouldDisable : boolean = (
            usernameFeedback !== null ||
            passwordFeedback !== null ||
            emailFeedback !== null ||
            name.length === 0
        );
        setdisableSubmit(shouldDisable);
    }, [usernameFeedback, passwordFeedback, emailFeedback, name]);

    const onUsernameChange = (value : string) => {
        if (checkInput.isValidUsername(value)) setUsernameFeedback(null);
        else setUsernameFeedback(
            "Le nom d'utilisateur doit contenir minimut 6 lettres sans espace"
        );
        setUsername(value);
    };

    const onPasswordChange = (value : string) => {
        if (checkInput.isValidPassword(value)) setPasswordFeedback(null);
        else setPasswordFeedback(
            'Mot de passe faible: au moin 1 chiffre, 1 lettre miniscule, 1 lettre majuscule et 1 caractère spécial'
        );
        setPassword(value);
    };

    const onEmailChange = (value: string) => {
        if (checkInput.isValidEmail(value)) setEmailFeedback(null);
        else setEmailFeedback('Email incorrect');
        setEmail(value);
    };

    const onSubmit = (e : React.ChangeEvent) => {
        e.preventDefault();
        if (disableSubmit) setMessage('Veillez remplir correctement tout les champs !!!');
        else {
            setdisableSubmit(true);

            const newUser = {
                username: username,
                email: email,
                password: password,
                name: name,
                emoji: emoji,
            };

            fetch(`${API_URL}/subscription`, {
                credentials: 'include',
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser),
            })
            .then(async (response) => {
                return await response.json();
            })
            .then((data: ApiResponse<IUser>) => {
                if (data.success){
                    login(data.data!)
                    navigate('/');
                }
                else setMessage(data.error!)
            })
            .catch((error) => {
                setMessage(error);
                setdisableSubmit(true);
            });
        }
    };

    useEffect(() => {
        if (user) navigate('/compte');
    });

    return (
        <section className="subscription-page">
            <div className="small-box">
                <br />

                <h2>Nouveau compte</h2>
                <br />

                {message && <p className="error">{message}</p>}
                <SubscriptionForm
                    username={username}
                    password={password}
                    email={email}
                    name={name}
                    currentEmoji={emoji}
                    emailFeedback={emailFeedback}
                    usernameFeedback={usernameFeedback}
                    passwordFeedback={passwordFeedback}
                    disableSubmit={disableSubmit}
                    onEmailChange={onEmailChange}
                    onPasswordChange={onPasswordChange}
                    onSubmit={onSubmit}
                    onUsernameChange={onUsernameChange}
                    setEmail={setEmail}
                    setEmoji={setEmoji}
                    setName={setName}
                />
            </div>
        </section>
    );
};

export default Subscription;
