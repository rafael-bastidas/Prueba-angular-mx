export interface IData {
    id: number;
    D_FechaIncorporacion: string;
    FK_Asignado_id: number;
    S_Activo: number;
    S_DBName: string;
    S_DBUsuario: string;
    S_LogoURL: string;
    S_NombreCompleto: string;
    S_NombreCorto: string;
    S_SystemUrl: string;
    asignado: IUser;
    created_at: string;
    tw_users_id: number;
    updated_at: string;
    user_created: IUser
}

export interface IUser {
    S_Activo: number
    S_Apellidos: string
    S_FotoPerfilURL: string
    S_Nombre: string
    banned: number
    created_at: string
    deleted_at: any
    email: string
    id: number
    tw_role_id: number
    updated_at: string
    username: string
    verification_token: string
    verified: string
}