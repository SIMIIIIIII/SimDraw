import { useState, useEffect } from "react"
import { useAuth,  } from '../../context/AuthContext'
import type { IUserInfo } from "../../types/user"
import { useNavigate } from "react-router-dom"
import { API_URL } from "../../config"
import type { ApiResponse } from "../../types/api"
import UserInfo from "../../components/UserInfo/UserInfo"
import './Account.css'
import AccountButtons from "../../components/AccountButtons/AccountButtons"
import Admin from "../../components/Admin/Admin"


const Account = () => {
    const [userInfos, setUserInfo] = useState<IUserInfo | null>(null);
    const [showAdmin, setShowAdmin] = useState<boolean>(false)
    const {user, logout} = useAuth()
    const navigate = useNavigate()
    
    useEffect(() => {
        if (!user) {
            navigate('/login', {state: {redirect : '/account'}});
        }
        else {
            fetch(`${API_URL}/account`, {
                credentials: "include",
            })
            .then(async (response) => {
                return await response.json()
            })
            .then((data : ApiResponse<IUserInfo>) => {
                if (data.success) setUserInfo(data.data!);
                else if (data.error?.includes('Connexion')){
                    logout();
                    navigate('login', {state: {redirect : '/account'}});
                }
                else alert(data.error);
            })
            .catch((error) => {
                alert(error);
            })
        }
    }, [user, navigate, logout])

    if (!userInfos) return <div>Chargement...</div>
    return (
        <section className="account-page">
            <UserInfo userInfos={userInfos}/>
            <AccountButtons
                showAdmin={showAdmin}
                isAdmin={!!userInfos.admin}
                setShowAdmin={setShowAdmin}
            />
            {showAdmin && <Admin/>}
        </section>
    )
}

export default Account