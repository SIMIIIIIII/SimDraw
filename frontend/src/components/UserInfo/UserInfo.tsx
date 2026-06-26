import type { IUserInfo } from "../../types/user"
import './UserInfo.css'

const UserInfo = ({userInfos} : {userInfos : IUserInfo}) => {
    const getEmoji = (unified: string) => {
        return String.fromCodePoint(...unified.split('-').map(u => parseInt(u, 16)));
    }
    return (
        <table className="user-info-root">
            <tbody>
                <tr>
                    <td>
                        <h2>Informations du compte</h2>
                        <br />
                        <table className="user-info-table">
                            <br/>
                            
                            <tbody>
                                <tr>
                                    <td className="inscription">
                                        <h3>Emoji</h3>
                                    </td>
                                    <td className="emoji">
                                        {getEmoji(userInfos.userEmoji || '1f60a')}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="inscription">
                                        <h3>Nom d'utilisateur</h3>
                                    </td>
                                    <td>
                                        <h4>{userInfos.username}</h4>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="inscription">
                                        <h3>Nom complet </h3>
                                    </td>
                                    <td>
                                        <h4>{userInfos.name} </h4>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="inscription">
                                        <h3>Adresse e-mail </h3>
                                    </td>
                                    <td>
                                        <h4>{userInfos.email}</h4>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <br />
                    </td>
                    
                </tr>
            </tbody>
      </table>
    )
}

export default UserInfo