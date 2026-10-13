import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  Card,
  FontSize,
  GestionReclamosScreen,
  Icon,
  NuevaSalidaScreen,
  Palette,
  Radius,
  RegistrarIncidenteScreen,
  RegistrarUsuarioScreen,
  ScreenBody,
  ScreenHeader,
  ScreenShell,
  Spacing,
  type IconName,
} from '@/components';

type ScreenKey = 'nueva-salida' | 'registrar-usuario' | 'gestion-reclamos' | 'registrar-incidente';

type MenuItem = {
  key: ScreenKey;
  title: string;
  description: string;
  icon: IconName;
};

const MENU: MenuItem[] = [
  {
    key: 'nueva-salida',
    title: 'Nueva Salida',
    description: 'Registrar la salida de un camión desde planta',
    icon: 'truck',
  },
  {
    key: 'gestion-reclamos',
    title: 'Gestión de Reclamos',
    description: 'Atender y dar seguimiento a reclamos de clientes',
    icon: 'list',
  },
  {
    key: 'registrar-incidente',
    title: 'Registrar Incidente',
    description: 'Reportar novedades ocurridas en ruta',
    icon: 'alert',
  },
  {
    key: 'registrar-usuario',
    title: 'Registrar Usuario',
    description: 'Crear cuentas y asignar roles del sistema',
    icon: 'userPlus',
  },
];

export default function Index() {
  const [screen, setScreen] = useState<ScreenKey | null>(null);
  const goHome = () => setScreen(null);

  if (screen === 'nueva-salida') return <NuevaSalidaScreen onBack={goHome} />;
  if (screen === 'registrar-usuario') return <RegistrarUsuarioScreen onBack={goHome} />;
  if (screen === 'gestion-reclamos') return <GestionReclamosScreen onBack={goHome} />;
  if (screen === 'registrar-incidente') return <RegistrarIncidenteScreen onBack={goHome} />;

  return (
    <ScreenShell>
      <ScreenHeader title="Sistema de Garrafas" subtitle="Panel de gestión de distribución" />

      <ScreenBody>
        {MENU.map((item) => (
          <Pressable
            key={item.key}
            accessibilityRole="button"
            onPress={() => setScreen(item.key)}
            style={({ pressed }) => (pressed ? styles.pressed : undefined)}>
            <Card style={styles.menuCard}>
              <View style={styles.menuIcon}>
                <Icon name={item.icon} size={22} color={Palette.primary} />
              </View>
              <View style={styles.menuText}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuDescription}>{item.description}</Text>
              </View>
              <Icon name="chevronRight" size={18} color={Palette.textMuted} />
            </Card>
          </Pressable>
        ))}
      </ScreenBody>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  menuIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    backgroundColor: Palette.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuText: {
    flex: 1,
    gap: 2,
  },
  menuTitle: {
    fontSize: FontSize.body,
    fontWeight: '700',
    color: Palette.textPrimary,
  },
  menuDescription: {
    fontSize: FontSize.small,
    color: Palette.textSecondary,
  },
  pressed: {
    opacity: 0.7,
  },
});
