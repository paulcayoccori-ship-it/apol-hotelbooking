export interface Client {
  id: number;
  fullName: string;
  documentType: 'DNI' | 'CARNET_EXTRANJERIA';
  documentNumber: string;
  role: string;
  phone?: string;
  email?: string;
}

export interface ClientRegisterPayload {
  fullName: string;
  documentType: 'DNI' | 'CARNET_EXTRANJERIA';
  documentNumber: string;
  password: string;
  phone?: string;
  email?: string;
}

export interface ClientLoginPayload {
  documentNumber: string;
  password: string;
}
