import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Clock, ChefHat, CheckCircle, Package, History, Inbox } from 'lucide-react-native';
import { useMenu } from '@/contexts/MenuContext';
import { Order } from '@/types/menu';

const STATUS_CONFIG: Record<
  Order['status'],
  { label: string; color: string; icon: typeof Clock }
> = {
  pending: { label: 'Pendente', color: '#F39C12', icon: Clock },
  preparing: { label: 'Preparando', color: '#3498DB', icon: ChefHat },
  ready: { label: 'Pronto', color: '#27AE60', icon: CheckCircle },
  delivered: { label: 'Entregue', color: '#95A5A6', icon: Package },
};

const FILTERS: { key: 'todos' | Order['status']; label: string }[] = [
  { key: 'todos', label: 'Todos' },
  { key: 'pending', label: 'Pendente' },
  { key: 'preparing', label: 'Preparando' },
  { key: 'ready', label: 'Pronto' },
  { key: 'delivered', label: 'Entregue' },
];

export default function HistoricoScreen() {
  const router = useRouter();
  const { orders } = useMenu();
  const [filter, setFilter] = useState<'todos' | Order['status']>('todos');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = useMemo(() => {
    if (filter === 'todos') {
      return orders;
    }
    return orders.filter((order) => order.status === filter);
  }, [orders, filter]);

  const formatDateTime = (date: Date) => {
    const parsed = new Date(date);
    const data = parsed.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    const hora = parsed.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
    return `${data} às ${hora}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}>
          <ArrowLeft size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Histórico de Pedidos</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.filterRow}>
        {FILTERS.map((item) => {
          const isActive = filter === item.key;
          const color =
            item.key === 'todos' ? '#FF6B35' : STATUS_CONFIG[item.key as Order['status']].color;

          return (
            <TouchableOpacity
              key={item.key}
              style={[
                styles.filterChip,
                {
                  borderColor: color,
                  backgroundColor: isActive ? color : '#FFF',
                },
              ]}
              onPress={() => setFilter(item.key)}>
              <Text
                style={[
                  styles.filterChipText,
                  { color: isActive ? '#FFF' : color },
                ]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Inbox size={44} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>Nenhum pedido no histórico</Text>
            <Text style={styles.emptySubtitle}>
              Os pedidos realizados aparecerão aqui para consulta.
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const statusConfig = STATUS_CONFIG[item.status];
          const StatusIcon = statusConfig.icon;

          return (
            <TouchableOpacity
              style={styles.orderCard}
              onPress={() => setSelectedOrder(item)}>
              <View style={styles.orderHeader}>
                <View>
                  <Text style={styles.orderCustomer}>{item.customerName}</Text>
                  <Text style={styles.orderTime}>
                    {formatDateTime(item.createdAt)}
                  </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: statusConfig.color }]}>
                  <StatusIcon size={16} color="#FFF" />
                  <Text style={styles.statusText}>{statusConfig.label}</Text>
                </View>
              </View>

              <View style={styles.orderItems}>
                {item.items.map((orderItem, index) => (
                  <Text key={index} style={styles.orderItemText}>
                    {orderItem.quantity}x {orderItem.menuItem.name}
                  </Text>
                ))}
              </View>

              <View style={styles.orderFooter}>
                <Text style={styles.orderTotal}>
                  Total: R$ {item.total.toFixed(2)}
                </Text>
                <History size={18} color="#B0B0B0" />
              </View>
            </TouchableOpacity>
          );
        }}
      />

      <Modal
        visible={selectedOrder !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedOrder(null)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setSelectedOrder(null)}>
          <View style={styles.modalContent}>
            {selectedOrder && (
              <>
                <Text style={styles.modalTitle}>Detalhes do Pedido</Text>

                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Cliente:</Text>
                  <Text style={styles.modalValue}>
                    {selectedOrder.customerName}
                  </Text>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Data e Horário:</Text>
                  <Text style={styles.modalValue}>
                    {formatDateTime(selectedOrder.createdAt)}
                  </Text>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Status:</Text>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: STATUS_CONFIG[selectedOrder.status].color }
                  ]}>
                    <Text style={styles.statusText}>
                      {STATUS_CONFIG[selectedOrder.status].label}
                    </Text>
                  </View>
                </View>

                <View style={styles.modalDivider} />

                <Text style={styles.modalLabel}>Itens do Pedido:</Text>
                {selectedOrder.items.map((orderItem, index) => (
                  <View key={index} style={styles.modalItem}>
                    <Text style={styles.modalItemName}>
                      {orderItem.quantity}x {orderItem.menuItem.name}
                    </Text>
                    <Text style={styles.modalItemPrice}>
                      R$ {(orderItem.menuItem.price * orderItem.quantity).toFixed(2)}
                    </Text>
                  </View>
                ))}

                <View style={styles.modalDivider} />

                <View style={styles.modalTotal}>
                  <Text style={styles.modalTotalLabel}>Total:</Text>
                  <Text style={styles.modalTotalValue}>
                    R$ {selectedOrder.total.toFixed(2)}
                  </Text>
                </View>
              </>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
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
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  filterChip: {
    borderRadius: 999,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '800',
  },
  list: {
    padding: 16,
  },
  orderCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderCustomer: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  orderTime: {
    fontSize: 14,
    color: '#999',
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  orderItems: {
    marginBottom: 12,
  },
  orderItemText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 12,
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  emptySubtitle: {
    marginTop: 6,
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    maxWidth: 260,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
  },
  modalSection: {
    marginBottom: 12,
  },
  modalLabel: {
    fontSize: 14,
    color: '#999',
    marginBottom: 4,
    fontWeight: '600',
  },
  modalValue: {
    fontSize: 16,
    color: '#333',
  },
  modalDivider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 16,
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  modalItemName: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  modalItemPrice: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  modalTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTotalLabel: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  modalTotalValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FF6B35',
  },
});