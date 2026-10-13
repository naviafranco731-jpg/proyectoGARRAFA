import { useState } from 'react';
import { StyleSheet } from 'react-native';

import { BottomNav } from '../bottom-nav';
import { ButtonGroup, OutlineButton, PrimaryButton } from '../button';
import { NumberField, TextAreaField, TimeField } from '../field';
import { Card, ScreenBody, ScreenShell } from '../screen';
import { ScreenHeader } from '../screen-header';
import { SelectField } from '../select-field';

const PLACAS = [
  { label: 'ABC-1234 · Camión 1', value: 'abc-1234' },
  { label: 'DEF-5678 · Camión 2', value: 'def-5678' },
  { label: 'GHI-9012 · Camión 3', value: 'ghi-9012' },
];

const CONDUCTORES = [
  { label: 'Juan Pérez', value: 'juan-perez' },
  { label: 'María Gómez', value: 'maria-gomez' },
  { label: 'Carlos Rojas', value: 'carlos-rojas' },
];

const ZONAS = [
  { label: 'Zona Norte', value: 'norte' },
  { label: 'Zona Sur', value: 'sur' },
  { label: 'Zona Centro', value: 'centro' },
];

const RUTAS = [
  { label: 'Ruta 1 · Mercados', value: 'ruta-1' },
  { label: 'Ruta 2 · Distribuidores', value: 'ruta-2' },
  { label: 'Ruta 3 · Pedidos especiales', value: 'ruta-3' },
];

export function NuevaSalidaScreen() {
  const [placa, setPlaca] = useState('');
  const [conductor, setConductor] = useState('');
  const [zona, setZona] = useState('');
  const [ruta, setRuta] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [hora, setHora] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [navActive, setNavActive] = useState<'inicio' | 'camiones' | 'rutas' | 'garrafas' | 'mas'>(
    'garrafas',
  );

  return (
    <ScreenShell>
      <ScreenHeader
        title="Nueva Salida"
        subtitle="Registra la salida de un vehículo desde planta"
        onBack={() => {}}
      />

      <ScreenBody>
        <Card>
          <SelectField
            label="Placa del vehículo"
            value={placa}
            onChange={setPlaca}
            options={PLACAS}
          />
          <SelectField
            label="Conductor asignado"
            value={conductor}
            onChange={setConductor}
            options={CONDUCTORES}
          />
          <SelectField
            label="Zona asignada"
            value={zona}
            onChange={setZona}
            options={ZONAS}
          />
          <SelectField label="Ruta de entrega" value={ruta} onChange={setRuta} options={RUTAS} />
          <NumberField
            label="Cantidad de garrafas"
            placeholder="0"
            value={cantidad}
            onChangeText={setCantidad}
          />
          <TimeField label="Hora de salida estimada" value={hora} onChangeText={setHora} />
          <TextAreaField
            label="Observaciones"
            placeholder="Notas adicionales sobre la salida"
            value={observaciones}
            onChangeText={setObservaciones}
          />
        </Card>

        <ButtonGroup>
          <OutlineButton label="Cancelar" onPress={() => {}} style={styles.action} />
          <PrimaryButton label="Registrar salida" onPress={() => {}} style={styles.action} />
        </ButtonGroup>
      </ScreenBody>

      <BottomNav active={navActive} onChange={setNavActive} />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  action: {
    flex: 1,
  },
});
