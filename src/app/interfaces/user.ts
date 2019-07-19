export interface User {
    nick: string;
    subnick?: string;
    status?: string;
    age?: number;
    email: string;
    friend: boolean;
    uid: any;
    avatar?: string;
    friends?: any;
}