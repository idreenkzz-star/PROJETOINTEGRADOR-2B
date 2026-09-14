import { criarReserva, validarDataHora } from '@/contexts/ReservaContext';

describe('Reserva helpers', () => {
  it('cria uma reserva com status confirmada', () => {
    const reserva = criarReserva(
      {
        clienteNome: 'Ana',
        mesaId: '01',
        mesaNumero: 'Mesa 01',
        pessoas: 4,
        data: '2026-10-15',
        hora: '20:30',
      },
      'reserva-test-id'
    );

    expect(reserva).toMatchObject({
      id: 'reserva-test-id',
      clienteNome: 'Ana',
      mesaNumero: 'Mesa 01',
      status: 'confirmada',
      data: '2026-10-15',
      hora: '20:30',
      pessoas: 4,
    });
    expect(reserva.createdAt).toBeInstanceOf(Date);
  });

  it('aceita data e hora válidas', () => {
    expect(validarDataHora('2026-10-15', '20:30')).toBe(true);
  });

  it('rejeita formato inválido de data', () => {
    expect(validarDataHora('15/10/2026', '20:30')).toBe(false);
    expect(validarDataHora('15-10-2026', '20:30')).toBe(false);
  });

  it('rejeita data inexistente no calendário', () => {
    expect(validarDataHora('2026-02-30', '20:30')).toBe(false);
  });

  it('rejeita hora inválida', () => {
    expect(validarDataHora('2026-10-15', '25:00')).toBe(false);
    expect(validarDataHora('2026-10-15', '20:75')).toBe(false);
    expect(validarDataHora('2026-10-15', '20h30')).toBe(false);
  });

  it('rejeita campos vazios', () => {
    expect(validarDataHora('', '')).toBe(false);
    expect(validarDataHora('2026-10-15', '')).toBe(false);
  });
});