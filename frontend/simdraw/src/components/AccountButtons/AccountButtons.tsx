import { useNavigate } from "react-router-dom";
import { API_URL } from "../../config";
import { useAuth } from "../../context/AuthContext";

interface IAccountButtonsProps {
    showAdmin : boolean;
    isAdmin: boolean;
    setShowAdmin: (params: boolean) => void
}

const AccountButtons = ({
    showAdmin,
    isAdmin,
    setShowAdmin,
} : IAccountButtonsProps) => {

    const {logout} = useAuth();
    const navigate = useNavigate()

    const onLogout = () => {
        fetch(`${API_URL}/account/logout`, {
            'credentials': "include"
        })
        .finally(() => {
            logout()
            navigate('/');
        });
    }

    return (
        <>
            <button className="soumettre-button" onClick={onLogout}>
                Se déconnecter
            </button>{' '}
            
            <button className="soumettre-button" onClick={() => navigate('/by/?mine=my_drawings')}>
                Mes créations
            </button>{' '}
            
            <button className="soumettre-button" onClick={() => navigate('/account/modify')}>
                Modifier
            </button>{' '}
            {isAdmin && (
                <button
                    className="soumettre-button"
                    onClick={() => setShowAdmin(!showAdmin)}
                >
                    {showAdmin ? "Cacher la gestion" : "Gestion admin"}
                </button>
            )}
        </>
    )
}

export default AccountButtons