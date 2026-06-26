import type { IUser } from "../../../types/user";
import { Link } from "react-router-dom";
import { Emoji } from "emoji-picker-react";

export const UserStatus = ({ user }: { user: IUser | null }) => {
    const getEmoji = (unified: string) => {
        return String.fromCodePoint(...unified.split('-').map(u => parseInt(u, 16)));
    }
    return (
        <>
            {user ? (
                <Link to="/account">
                    <Emoji unified={user.userEmoji ?? '1f600'} />
                    <h2>{getEmoji(user.userEmoji || '1f60a')}{' '}{user.username}</h2>
                </Link>
            ) : (
                <Link to="/login">Login</Link>
            )}
        </>
    );
};