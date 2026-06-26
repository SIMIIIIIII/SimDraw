import Picker from "../EmojiPicker/EmojiPicker";
import './SubscriptionForm.css'

interface ISubscriptionFormProps {
    username : string;
    password: string;
    email: string;
    name: string;
    disableSubmit: boolean;
    passwordFeedback: string | null;
    usernameFeedback: string | null;
    emailFeedback: string | null;
    currentEmoji: string
    onSubmit : (param: React.ChangeEvent) => void;
    onUsernameChange: (param: string) => void;
    onPasswordChange: (param: string) => void;
    setEmail: (param: string) => void;
    onEmailChange: (param: string) => void;
    setEmoji: (param: string) => void;
    setName: (param: string) => void;
}



const SubscriptionForm = ({
    username,
    password,
    email,
    name,
    disableSubmit,
    passwordFeedback,
    usernameFeedback,
    emailFeedback,
    currentEmoji,
    onSubmit,
    onUsernameChange,
    onPasswordChange,
    setEmail,
    onEmailChange,
    setEmoji,
    setName,
} : ISubscriptionFormProps) => {
    return (
        <form className="subscription-form" onSubmit={onSubmit}>
            <table>
                <tbody>
                    <tr>
                        <td className="inscription">
                        {' '}
                        <h4>Nom d'utilisateur </h4>
                        </td>
                        <td>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => onUsernameChange(e.target.value)}
                            placeholder="username"
                        />
                        {usernameFeedback && (
                            <h6 className="error"> {usernameFeedback} </h6>
                        )}
                        </td>
                    </tr>
                    <tr>
                        <td className="inscription">
                        <h4>Mot de passe </h4>
                        </td>
                        <td>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => onPasswordChange(e.target.value)}
                            placeholder="password"
                        />
                        {passwordFeedback && (
                            <h6 className="error"> {passwordFeedback}</h6>
                        )}
                        </td>
                    </tr>
                    <tr>
                        <td className="inscription">
                        <h4> Nom complet </h4>
                        </td>
                        <td>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Full name"
                        />
                        </td>
                    </tr>
                    <tr>
                        <td className="inscription">
                        <h4> Adresse e-mail </h4>
                        </td>
                        <td>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => {setEmail(e.target.value);}}
                            onBlur={(e) => onEmailChange(e.target.value)}
                            placeholder="email"
                        />
                        {emailFeedback && (
                            <h6 className="error"> {emailFeedback} </h6>
                        )}
                        </td>
                    </tr>
                </tbody>
            </table>
            <Picker save={setEmoji} currentEmoji={currentEmoji}/>
            <br />
            <input type="submit" value="S'enregistrer" disabled={disableSubmit}/>
        </form>
    )
}

export default SubscriptionForm;