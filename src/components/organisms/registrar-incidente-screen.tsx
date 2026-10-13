import { useState } from 'react';
import { StyleSheet } from 'react-native';

import { ButtonGroup, OutlineButton, PrimaryButton } from '../atoms/button';
import { TextAreaField } from '../molecules/field';
import { Card, ScreenBody, ScreenShell } from '../molecules/screen';
import { ScreenHeader } from '../molecules/screen-header';
import { SelectField } from '../molecules/select-field';

const TIPOS = [
  { label: 'Avería mecánica', value: 'averia' },
  { label: 'Accidente de tránsito', value: 'accidente' },
  { label: 'Retraso en ruta', value: 'retraso' },
  { label: 'Faltante de garrafas', value: 'faltante' },
  { label: 'Otro', value: 'otro' },
];

const CAMIONES = [
  { label: 'ABC-1234', value: 'abc-1234' },
  { label: 'DEF-5678', value: 'def-5678' },
  { label: 'GHI-9012', value: 'ghi-9012' },
];

const CONDUCTORES = [
  { label: 'Juan Pérez', value: 'juan-perez' },
  { label: 'María Gómez', value: 'maria-gomez' },
  { label: 'Carlos Rojas', value: 'carlos-rojas' },
];

const PRIORIDADES = [
  { label: 'Alta', value: 'alta' },
  { label: 'Media', value: 'media' },
  { label: 'Baja', value: 'baja' },
];

export function RegistrarIncidenteScreen({ onBack }: { onBack?: () => void }) {
  const [tipo, setTipo] = useState('');
  const [camion, setCamion] = useState('');
  const [conductor, setConductor] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [prioridad, setPrioridad] = useState('');

  return (
    <ScreenShell>
      <ScreenHeader
        title="Registrar Incidente"
        subtitle="Reportar novedad en ruta"
        onBack={onBack}
      />

      <ScreenBody>
        <Card>
          <SelectField
            label="Tipo de incidente"
            value={tipo}
            onChange={setTipo}
            options={TIPOS}
          />
          <SelectField
            label="Camión relacionado"
            value={camion}
            onChange={setCamion}
            options={CAMIONES}
          />
          <SelectField
            label="Conductor"
            value={conductor}
            onChange={setConductor}
            options={CONDUCTORES}
          />
          <TextAreaField
            label="Descripción de incidencia"
            placeholder="Describe qué ocurrió en la ruta"
            value={descripcion}
            onChangeText={setDescripcion}
          />
          <SelectField
            label="Prioridad"
            value={prioridad}
            onChange={setPrioridad}
            options={PRIORIDADES}
          />
        </Card>

        <ButtonGroup>
          <OutlineButton label="Cancelar" onPress={() => {}} style={styles.action} />
          <PrimaryButton label="Registrar incidente" onPress={() => {}} style={styles.action} />
        </ButtonGroup>
      </ScreenBody>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  action: {
    flex: 1,
  },
});
