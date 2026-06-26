
export interface IUser {
  id: string;
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

export interface IUserInfo {
  id: string
  username: string;
  userEmoji: string;
  userId: string;
  admin: boolean;
  email: string;
  name:string
}