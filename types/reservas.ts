export type ReservaStatus = 'confirmada' | 'cancelada';

export interface Reserva {
  id: string;
  clienteNome: string;
  mesaId: string;
  mesaNumero: string;
  pessoas: number;
  data: string;
  hora: string;
  status: ReservaStatus;
  createdAt: Date;
}