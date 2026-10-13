import { useState } from 'react';
import { StyleSheet } from 'react-native';

import { ButtonGroup, OutlineButton, PrimaryButton } from '../button';
import { PasswordField, SwitchField, TextField } from '../field';
import { Card, ScreenBody, ScreenShell } from '../screen';
import { ScreenHeader } from '../screen-header';
import { SelectField } from '../select-field';

const ROLES = [
  { label: 'Administrador', value: 'admin' },
  { label: 'Supervisor de planta', value: 'supervisor' },
  { label: 'Conductor', value: 'conductor' },
  { label: 'Atención al cliente', value: 'atencion' },
];

export function RegistrarUsuarioScreen() {
  const [nombre, setNombre] = useState('');
  const [cedula, setCedula] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('');
  const [habilitado, setHabilitado] = useState(true);

  return (
    <ScreenShell>
      <ScreenHeader
        title="Registrar Usuario"
        subtitle="Crea una cuenta y asigna sus permisos"
        onBack={() => {}}
      />

      <ScreenBody>
        <Card>
          <TextField
            label="Nombre completo"
            placeholder="Ej. Juan Pérez"
            value={nombre}
            onChangeText={setNombre}
            autoCapitalize="words"
          />
          <TextField
            label="CI (Cédula de identidad)"
            placeholder="Ej. 8765432"
            value={cedula}
            onChangeText={setCedula}
            keyboardType="number-pad"
          />
          <TextField
            label="Teléfono"
            placeholder="Ej. 700 00000"
            value={telefono}
            onChangeText={setTelefono}
            keyboardType="phone-pad"
          />
          <TextField
            label="Correo electrónico"
            placeholder="usuario@correo.com"
            value={correo}
            onChangeText={setCorreo}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <PasswordField value={password} onChangeText={setPassword} />
          <SelectField label="Rol asignado" value={rol} onChange={setRol} options={ROLES} />
          <SwitchField
            label="Estado de cuenta"
            description="Habilitar acceso de inmediato"
            value={habilitado}
            onValueChange={setHabilitado}
          />
        </Card>

        <ButtonGroup>
          <OutlineButton label="Cancelar" onPress={() => {}} style={styles.action} />
          <PrimaryButton label="Guardar usuario" onPress={() => {}} style={styles.action} />
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
