export interface RegisterRequest {
    email: string;
    password: string;
    displayName: string;
}

export interface RegisterResponse {
    email: string;
    displayName: string;
}