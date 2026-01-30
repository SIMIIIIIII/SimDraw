import type { IUser } from "../../../types/user";
import { Link } from "react-router-dom";
import { Emoji } from "emoji-picker-react";

export const UserStatus = ({ user }: { user: IUser | null }) => {
    return (
        <>
            {user ? (
                <Link to="/account">
                    <Emoji unified={user.userEmoji ?? '1f600'} />
                    <h2>{user.username}</h2>
                </Link>
            ) : (
                <Link to="/connexion">Connexion</Link>
            )}
        </>
    );
};