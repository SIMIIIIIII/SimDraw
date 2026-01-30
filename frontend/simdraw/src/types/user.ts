
export interface IUser {
  username: string;
  userEmoji?: string;
  userId: string;
  admin: boolean
}

export interface IAuthContext {
  user: IUser | null;
  login: (userData: IUser) => void;
  logout: () => void;
}