export interface UserDTO {
    id: string;
    avatar: string;
    age: number;
    email: string;
    name: string;
    role: 'admin' | 'user';
    surname: string;
}
