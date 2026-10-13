import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { StatusBadge } from '../atoms/badge';
import { PrimaryButton } from '../atoms/button';
import { FontSize, Palette, Spacing, type BadgeTone } from '../atoms/theme';
import { BottomNav } from '../molecules/bottom-nav';
import { FilterTabs, type FilterTabItem } from '../molecules/filter-tabs';
import { Card, ScreenBody, ScreenShell } from '../molecules/screen';
import { ScreenHeader } from '../molecules/screen-header';
import { SuccessModal } from '../molecules/success-modal';

type ReclamoEstado = BadgeTone;

type Reclamo = {
  id: string;
  cliente: string;
  fecha: string;
  zona: string;
  tipo: string;
  estado: ReclamoEstado;
  estadoLabel: string;
};

type FilterKey = 'todos' | 'pendientes' | 'resueltos';

const RECLAMOS: Reclamo[] = [
  {
    id: '1',
    cliente: 'Lucía Fernández',
    fecha: '12/10/2026 · 09:40',
    zona: 'Zona Norte',
    tipo: 'Retraso',
    estado: 'pendiente',
    estadoLabel: 'Pendiente',
  },
  {
    id: '2',
    cliente: 'Pedro Alarcón',
    fecha: '12/10/2026 · 08:15',
    zona: 'Zona Centro',
    tipo: 'Falta de atención',
    estado: 'revision',
    estadoLabel: 'En revisión',
  },
  {
    id: '3',
    cliente: 'Comercial Andina',
    fecha: '11/10/2026 · 17:50',
    zona: 'Zona Sur',
    tipo: 'Problema de distribución',
    estado: 'resuelto',
    estadoLabel: 'Resuelto',
  },
  {
    id: '4',
    cliente: 'Marta Quispe',
    fecha: '11/10/2026 · 14:20',
    zona: 'Zona Norte',
    tipo: 'Retraso',
    estado: 'resuelto',
    estadoLabel: 'Resuelto',
  },
  {
    id: '5',
    cliente: 'Distribuidora El Sol',
    fecha: '10/10/2026 · 11:05',
    zona: 'Zona Centro',
    tipo: 'Problema de distribución',
    estado: 'pendiente',
    estadoLabel: 'Pendiente',
  },
];

function matchesFilter(reclamo: Reclamo, filter: FilterKey) {
  if (filter === 'pendientes') return reclamo.estado !== 'resuelto';
  if (filter === 'resueltos') return reclamo.estado === 'resuelto';
  return true;
}

export function GestionReclamosScreen({ onBack }: { onBack?: () => void }) {
  const [filter, setFilter] = useState<FilterKey>('todos');
  const [navActive, setNavActive] = useState<'inicio' | 'camiones' | 'rutas' | 'garrafas' | 'mas'>(
    'mas',
  );
  const [modalVisible, setModalVisible] = useState(false);

  const filtered = useMemo(
    () => RECLAMOS.filter((reclamo) => matchesFilter(reclamo, filter)),
    [filter],
  );

  const tabs: FilterTabItem<FilterKey>[] = [
    { key: 'todos', label: 'Todos', count: RECLAMOS.length },
    {
      key: 'pendientes',
      label: 'Pendientes',
      count: RECLAMOS.filter((reclamo) => reclamo.estado !== 'resuelto').length,
    },
    {
      key: 'resueltos',
      label: 'Resueltos',
      count: RECLAMOS.filter((reclamo) => reclamo.estado === 'resuelto').length,
    },
  ];

  return (
    <ScreenShell>
      <ScreenHeader
        title="Gestión de Reclamos"
        subtitle="Atención al cliente"
        onBack={onBack}
      />

      <View style={styles.tabsWrapper}>
        <FilterTabs items={tabs} value={filter} onChange={setFilter} />
      </View>

      <ScreenBody>
        {filtered.map((reclamo) => (
          <Card key={reclamo.id} style={styles.reclamoCard}>
            <View style={styles.reclamoHeader}>
              <View style={styles.reclamoInfo}>
                <Text style={styles.cliente}>{reclamo.cliente}</Text>
                <Text style={styles.meta}>{reclamo.fecha}</Text>
              </View>
              <StatusBadge tone={reclamo.estado} label={reclamo.estadoLabel} />
            </View>
            <View style={styles.reclamoFooter}>
              <Text style={styles.tag}>{reclamo.zona}</Text>
              <Text style={styles.tag}>{reclamo.tipo}</Text>
            </View>
          </Card>
        ))}
      </ScreenBody>

      <View style={styles.footer}>
        <PrimaryButton
          label="Nuevo reclamo"
          icon="plus"
          onPress={() => setModalVisible(true)}
        />
      </View>

      <BottomNav active={navActive} onChange={setNavActive} />

      <SuccessModal visible={modalVisible} onConfirm={() => setModalVisible(false)} />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  tabsWrapper: {
    backgroundColor: Palette.surface,
  },
  reclamoCard: {
    gap: Spacing.md,
  },
  reclamoHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  reclamoInfo: {
    flex: 1,
    gap: 2,
  },
  cliente: {
    fontSize: FontSize.body,
    fontWeight: '700',
    color: Palette.textPrimary,
  },
  meta: {
    fontSize: FontSize.small,
    color: Palette.textMuted,
  },
  reclamoFooter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  tag: {
    fontSize: FontSize.small,
    fontWeight: '600',
    color: Palette.textSecondary,
    backgroundColor: Palette.surfaceMuted,
    borderWidth: 1,
    borderColor: Palette.border,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: 999,
    overflow: 'hidden',
  },
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
    backgroundColor: Palette.background,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Palette.border,
  },
});
