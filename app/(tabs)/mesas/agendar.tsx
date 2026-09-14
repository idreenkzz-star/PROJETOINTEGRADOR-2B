import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  CheckCircle,
  CalendarPlus,
  Users,
  X,
} from 'lucide-react-native';
import { useMesas } from '@/contexts/MesaContext';
import { useReservas, validarDataHora } from '@/contexts/ReservaContext';
import type { Reserva } from '@/types/reservas';

function formatarDataBR(data: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) {
    return data;
  }
  const [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}/${ano}`;
}

export default function AgendarMesaScreen() {
  const router = useRouter();
  const { mesas } = useMesas();
  const { reservas, agendarReserva, cancelarReserva } = useReservas();

  const [clienteNome, setClienteNome] = useState('');
  const [idMesaSelecionada, setIdMesaSelecionada] = useState<string>('');
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');
  const [pessoas, setPessoas] = useState('2');
  const [reservaFeita, setReservaFeita] = useState(false);

  const proximasReservas = reservas
    .filter((reserva) => reserva.status === 'confirmada')
    .sort((a, b) => (a.data + a.hora).localeCompare(b.data + b.hora));

  const handleAgendar = () => {
    if (!clienteNome.trim()) {
      Alert.alert('Atenção', 'Por favor, informe o nome do cliente.');
      return;
    }

    if (!idMesaSelecionada) {
      Alert.alert('Atenção', 'Por favor, selecione uma mesa para a reserva.');
      return;
    }

    if (!validarDataHora(data.trim(), hora.trim())) {
      Alert.alert(
        'Atenção',
        'Data e horário inválidos. Use o formato YYYY-MM-DD para a data e HH:MM para o horário.'
      );
      return;
    }

    const quantidadePessoas = Number.parseInt(pessoas, 10);
    if (!Number.isFinite(quantidadePessoas) || quantidadePessoas <= 0) {
      Alert.alert('Atenção', 'Informe a quantidade de pessoas para a reserva.');
      return;
    }

    const mesaSelecionada = mesas.find((mesa) => mesa.id === idMesaSelecionada);
    if (!mesaSelecionada) {
      Alert.alert('Atenção', 'Selecione uma mesa válida.');
      return;
    }

    agendarReserva({
      clienteNome: clienteNome.trim(),
      mesaId: mesaSelecionada.id,
      mesaNumero: mesaSelecionada.numero,
      pessoas: quantidadePessoas,
      data: data.trim(),
      hora: hora.trim(),
    });

    setReservaFeita(true);

    setTimeout(() => {
      router.replace('/mesas/index');
    }, 2000);
  };

  const handleCancelarReserva = (reserva: Reserva) => {
    Alert.alert(
      'Cancelar reserva',
      `Deseja cancelar a reserva de ${reserva.clienteNome} para ${formatarDataBR(reserva.data)} às ${reserva.hora}?`,
      [
        { text: 'Manter', style: 'cancel' },
        {
          text: 'Cancelar reserva',
          style: 'destructive',
          onPress: () => cancelarReserva(reserva.id),
        },
      ]
    );
  };

  if (reservaFeita) {
    return (
      <View style={styles.successContainer}>
        <View style={styles.successContent}>
          <CheckCircle size={80} color="#27AE60" />
          <Text style={styles.successTitle}>Reserva Confirmada!</Text>
          <Text style={styles.successMessage}>
            Sua mesa foi reservada com sucesso
          </Text>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}>
          <ArrowLeft size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Agendar Mesa</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
        <Text style={styles.introText}>
          Reserve uma mesa para o cliente em uma data e horário futuros.
        </Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nome do Cliente</Text>
          <TextInput
            style={styles.input}
            placeholder="Nome de identificação do cliente"
            value={clienteNome}
            onChangeText={setClienteNome}
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Selecione a Mesa</Text>
          <View style={styles.mesasSelectorRow}>
            {mesas.map((mesa) => {
              const isSelected = idMesaSelecionada === mesa.id;
              const isOcupada = mesa.status !== 'vaga';
              return (
                <TouchableOpacity
                  key={mesa.id}
                  disabled={isOcupada}
                  style={[
                    styles.mesaBadge,
                    isSelected && styles.mesaBadgeSelected,
                    isOcupada && styles.mesaBadgeDisabled,
                  ]}
                  onPress={() => setIdMesaSelecionada(mesa.id)}>
                  <Text
                    style={[
                      styles.mesaBadgeText,
                      isSelected && styles.mesaBadgeTextSelected,
                      isOcupada && styles.mesaBadgeTextDisabled,
                    ]}>
                    {mesa.numero.replace('Mesa ', '')}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {mesas.some((mesa) => mesa.status !== 'vaga') && (
            <Text style={styles.mesaHint}>
              Mesas sem cor de seleção estão ocupadas no momento.
            </Text>
          )}
        </View>

        <View style={styles.rowGroup}>
          <View style={[styles.inputGroup, styles.rowInput]}>
            <Text style={styles.label}>Data</Text>
            <TextInput
              style={styles.input}
              placeholder="AAAA-MM-DD"
              value={data}
              onChangeText={setData}
              autoCapitalize="none"
              placeholderTextColor="#999"
            />
          </View>
          <View style={[styles.inputGroup, styles.rowInput]}>
            <Text style={styles.label}>Horário</Text>
            <TextInput
              style={styles.input}
              placeholder="HH:MM"
              value={hora}
              onChangeText={setHora}
              autoCapitalize="none"
              placeholderTextColor="#999"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Quantidade de Pessoas</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 2"
            value={pessoas}
            onChangeText={setPessoas}
            keyboardType="number-pad"
            placeholderTextColor="#999"
          />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleAgendar}>
          <CalendarPlus size={22} color="#FFF" />
          <Text style={styles.submitButtonText}>Confirmar Reserva</Text>
        </TouchableOpacity>

        <View style={styles.sectionDivider} />

        <Text style={styles.sectionTitle}>Próximas Reservas</Text>

        {proximasReservas.length === 0 ? (
          <View style={styles.emptyReservas}>
            <CalendarPlus size={40} color="#9CA3AF" />
            <Text style={styles.emptyReservasText}>
              Nenhuma reserva agendada ainda.
            </Text>
          </View>
        ) : (
          proximasReservas.map((reserva) => (
            <View key={reserva.id} style={styles.reservaCard}>
              <View style={styles.reservaInfo}>
                <Text style={styles.reservaCliente}>{reserva.clienteNome}</Text>
                <View style={styles.reservaMetaRow}>
                  <Text style={styles.reservaMeta}>{reserva.mesaNumero}</Text>
                  <Text style={styles.reservaMeta}>
                    {formatarDataBR(reserva.data)} às {reserva.hora}
                  </Text>
                  <Text style={styles.reservaMeta}>
                    {reserva.pessoas} {reserva.pessoas > 1 ? 'pessoas' : 'pessoa'}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.cancelReservaButton}
                onPress={() => handleCancelarReserva(reserva)}>
                <X size={16} color="#E74C3C" />
              </TouchableOpacity>
            </View>
          ))
        )}

        <View style={styles.peopleHintRow}>
          <Users size={14} color="#6B7280" />
          <Text style={styles.peopleHintText}>
            Você pode cancelar uma reserva a qualquer momento.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#FF6B35',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 60,
  },
  introText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  rowGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  rowInput: {
    flex: 1,
  },
  mesasSelectorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  mesaBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2196F3',
    backgroundColor: '#E3F2FD',
  },
  mesaBadgeSelected: {
    backgroundColor: '#2196F3',
  },
  mesaBadgeDisabled: {
    borderColor: '#E0E0E0',
    backgroundColor: '#F5F5F5',
    opacity: 0.5,
  },
  mesaBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2196F3',
  },
  mesaBadgeTextSelected: {
    color: '#FFF',
  },
  mesaBadgeTextDisabled: {
    color: '#999',
    textDecorationLine: 'line-through',
  },
  mesaHint: {
    marginTop: 8,
    fontSize: 12,
    color: '#999',
  },
  submitButton: {
    backgroundColor: '#FF6B35',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 4,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },
  sectionDivider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  emptyReservas: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    gap: 8,
  },
  emptyReservasText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  reservaCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  reservaInfo: {
    flex: 1,
  },
  reservaCliente: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  reservaMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  reservaMeta: {
    fontSize: 13,
    color: '#666',
  },
  cancelReservaButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FDECEC',
    marginLeft: 12,
  },
  successContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  successContent: {
    alignItems: 'center',
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#27AE60',
    marginTop: 24,
    marginBottom: 12,
  },
  successMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  peopleHintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  peopleHintText: {
    fontSize: 12,
    color: '#6B7280',
  },
});