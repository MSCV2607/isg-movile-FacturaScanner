import { useState } from 'react';
import { View } from 'react-native';

import { AccionFila } from '../AccionFila';
import { CorreoOtraPersona } from '../CorreoOtraPersona';
import { DetailCard } from '../DetailCard';
import { styles } from './AccionesExportar.styles';

type AccionesExportarProps = {
  accionEnCurso: 'excel' | 'fotos' | 'compartir' | null;
  onExcel: () => void;
  onCompartir: () => void;
  /** Para lo que todavía no está disponible (envío por correo). */
  onProximamente: () => void;
};

/** Exportar a Excel, enviar por correo y compartir. El envío por correo es solo visual por ahora. */
export function AccionesExportar({ accionEnCurso, onExcel, onCompartir, onProximamente }: AccionesExportarProps) {
  const [otroAbierto, setOtroAbierto] = useState(false);
  const [correo, setCorreo] = useState('');

  return (
    <DetailCard title="Exportar y enviar">
      <View style={styles.list}>
        <AccionFila
          icono="grid-outline"
          destacadaVerde
          titulo="Exportar a Excel"
          descripcion="Genera un archivo .xlsx con los datos y los ítems."
          cargando={accionEnCurso === 'excel'}
          onPress={onExcel}
        />
        <View style={styles.divider} />
        <AccionFila
          icono="mail-outline"
          titulo="Enviarme por correo"
          descripcion="A tu correo, con el Excel y la foto adjuntos."
          etiqueta="Próximamente"
          onPress={onProximamente}
        />
        <View style={styles.divider} />
        <AccionFila
          icono="paper-plane-outline"
          titulo="Enviar a otra persona"
          descripcion="Escribí un correo y se lo mandamos."
          etiqueta="Próximamente"
          desplegada={otroAbierto}
          onPress={() => setOtroAbierto((abierto) => !abierto)}
        />
        {otroAbierto ? (
          <CorreoOtraPersona correo={correo} onCorreoChange={setCorreo} onEnviar={onProximamente} />
        ) : null}
        <View style={styles.divider} />
        <AccionFila
          icono="share-social-outline"
          titulo="Compartir"
          descripcion="Elegí a dónde enviarla: WhatsApp, Drive u otra app."
          cargando={accionEnCurso === 'compartir'}
          onPress={onCompartir}
        />
      </View>
    </DetailCard>
  );
}
