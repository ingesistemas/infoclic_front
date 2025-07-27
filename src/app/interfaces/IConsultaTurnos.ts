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
        id_modulo?: number; // Asegúrate de que id_modulo esté aquí si lo necesitas en Angular
        modulo?: { // Agrega la propiedad 'modulo' a la interfaz de asignaciones
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
    }>;
    created_at?: Date;
}