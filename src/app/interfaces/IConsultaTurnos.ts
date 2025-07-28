export interface IConsultaTurnos {
    id?: number;
    paciente: {
        nombre: string;
        documento?: string;
        telefono?: string;
    };
    prioritaria: {
        prioritaria: string;
    };
    fecha: string;
    hora_llegada: string;
    observaciones?: string;
    asignaciones: Array<{
        id_modulo?: number;
        modulo?: {
            modulo: string;
            id?: number;
        };
        hora_asigna: string;
        hora_ini: string;
        hora_fin: string;
        sala: {
            sala: string;
            piso: {
                piso: string;
            };
        };
        caso?: {
            caso: string;
        };
        operario: {
            nombre: string;
        };
        usuarios: {
            nombre: string;
        };
        llamados?: Array<{
            hora_llamado: string;
            id_usuario?: number;
            // agrega más campos si los necesitas
        }>;
    }>;
    created_at?: Date;
}
