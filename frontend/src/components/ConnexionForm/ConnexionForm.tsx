import { type SubmitEventHandler } from "react";
import './ConnexionForm.css'

interface IConnexionFormProps {
    username: string;
    password: string;
    onSubmit: SubmitEventHandler;
    onUsernameChange: (param: string) => void;
    onPasswordChange: (param: string) => void;
    isCorrectPassword: boolean;
    isCorrectUsername: boolean;
}

const ConnexionForm = (
    {
        username,
        password,
        onSubmit,
        onUsernameChange,
        onPasswordChange,
        isCorrectPassword,
        isCorrectUsername,
    } : IConnexionFormProps
) => {

    return (
        <form className="connexion-form" onSubmit={onSubmit}>

            <table>
                <tbody>
                    <tr>
                        <td>
                            <label htmlFor="text"><h3>Username</h3></label>
                            <input
                                type="text"
                                onChange={(e) => onUsernameChange(e.target.value)}
                                value={username}
                                placeholder="username"
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label htmlFor="password"><h3>Password</h3></label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => onPasswordChange(e.target.value)}
                                placeholder="password"
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
            
            <input
                value="Se connecter"
                type="submit"
                disabled={!(isCorrectPassword && isCorrectUsername)}
            />
        </form>
    )
}

export default ConnexionForm