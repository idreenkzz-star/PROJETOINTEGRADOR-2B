import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Reserva } from "@/types/reservas";
import uuid from "react-native-uuid";

export interface NovaReserva {
  clienteNome: string;
  mesaId: string;
  mesaNumero: string;
  pessoas: number;
  data: string;
  hora: string;
}

interface ReservaContextType {
  reservas: Reserva[];
  agendarReserva: (dados: NovaReserva) => string;
  cancelarReserva: (id: string) => void;
  reload: () => Promise<void>;
}

export function validarDataHora(data: string, hora: string) {
  const dataRegex = /^\d{4}-\d{2}-\d{2}$/;
  const horaRegex = /^\d{2}:\d{2}$/;

  if (!dataRegex.test(data) || !horaRegex.test(hora)) {
    return false;
  }

  const [ano, mes, dia] = data.split("-").map(Number);
  const [horaNum, minuto] = hora.split(":").map(Number);

  const dataObj = new Date(ano, mes - 1, dia);
  if (
    dataObj.getFullYear() !== ano ||
    dataObj.getMonth() !== mes - 1 ||
    dataObj.getDate() !== dia
  ) {
    return false;
  }

  if (horaNum < 0 || horaNum > 23 || minuto < 0 || minuto > 59) {
    return false;
  }

  return true;
}

export function criarReserva(
  dados: NovaReserva,
  reservaId: string = String(uuid.v4())
): Reserva {
  return {
    id: reservaId,
    clienteNome: dados.clienteNome,
    mesaId: dados.mesaId,
    mesaNumero: dados.mesaNumero,
    pessoas: dados.pessoas,
    data: dados.data,
    hora: dados.hora,
    status: 'confirmada',
    createdAt: new Date(),
  };
}

const ReservaContext = createContext<ReservaContextType | undefined>(undefined);

const STORAGE_KEY_RESERVAS = "@myapp:reservas";

export function ReservaProvider({ children }: { children: ReactNode }) {
  const [reservas, setReservas] = useState<Reserva[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const reservasJson = await AsyncStorage.getItem(STORAGE_KEY_RESERVAS);

        if (reservasJson) {
          setReservas(JSON.parse(reservasJson));
        }
      } catch (error) {
        console.error("❌ Erro ao carregar reservas:", error);
      }
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY_RESERVAS, JSON.stringify(reservas)).catch(
      (error) => console.error("❌ Erro ao salvar reservas:", error)
    );
  }, [reservas]);

  const agendarReserva = (dados: NovaReserva) => {
    const novaReserva = criarReserva(dados);

    setReservas((prev) => [...prev, novaReserva]);
    return novaReserva.id;
  };

  const cancelarReserva = (id: string) => {
    setReservas((prev) =>
      prev.map((reserva) =>
        reserva.id === id ? { ...reserva, status: 'cancelada' as const } : reserva
      )
    );
  };

  const reload = async () => {
    try {
      const reservasJson = await AsyncStorage.getItem(STORAGE_KEY_RESERVAS);

      if (reservasJson) setReservas(JSON.parse(reservasJson));
    } catch (error) {
      console.error("Erro ao recarregar reservas:", error);
    }
  };

  return (
    <ReservaContext.Provider
      value={{ reservas, agendarReserva, cancelarReserva, reload }}
    >
      {children}
    </ReservaContext.Provider>
  );
}

export function useReservas(): ReservaContextType {
  const context = useContext(ReservaContext);
  if (!context) {
    throw new Error("useReservas deve ser usado dentro de um <ReservaProvider>");
  }
  return context;
}