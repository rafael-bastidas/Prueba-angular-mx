export interface ISucess {
    corporativo: ICorporativo
}

export interface IHeaderCorporate {
    S_NombreCorto: string
    S_LogoURL: string
}

export interface IDetailCorporate extends Omit<IHeaderCorporate, "S_LogoURL"> {
    id: number,
    FK_Asignado_id: number
    S_NombreCompleto: string
    S_Activo: number
    D_FechaIncorporacion: string
    S_SystemUrl: string
}

export interface IData extends IHeaderCorporate, IDetailCorporate {
    S_DBName: string
    S_DBUsuario: string
    created_at: string
    tw_users_id: number
    updated_at: string
}

export interface ICorporativo extends IData {
    tw_contactos_corporativo: ITwContactCoporate[]
    tw_contratos_corporativo: any
    tw_documentos_corporativo: any
    tw_empresas_corporativo: any
}

export interface IContact {
    id: number
    N_TelefonoFijo: number
    N_TelefonoMovil: number
    S_Comentarios: string
    S_Email: string
    S_Nombre: string
    S_Puesto: string
    tw_corporativo_id: number
}

export interface ITwContactCoporate extends IContact {
    created_at: string
    updated_at: string
}