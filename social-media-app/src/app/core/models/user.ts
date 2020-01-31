export interface IUser {
    id: string;
    email: string;
    avatar: string;
    emailVerified: boolean;
    friends: string[];
    fullName?: string;
}