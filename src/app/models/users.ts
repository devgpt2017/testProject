export class Users{
    page: number;
    total: number;
    total_pages: number;
    data?: UserData[];
}

export class UserData {
    id: number;
    first_name: string;
    last_name: string;
    full_name: string;
    mobile: number;
    email: string;
    avatar: string;
}