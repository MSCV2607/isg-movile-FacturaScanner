import { useEffect, useRef, useState } from 'react';
import { Animated, Easing } from 'react-native';

/** Estilo animado de un giro continuo: una vuelta completa cada `duracion` milisegundos. */
export function useGiro(duracion = 1600) {
  const progreso = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animacion = Animated.loop(
      Animated.timing(progreso, {
        toValue: 1,
        duration: duracion,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    animacion.start();
    return () => animacion.stop();
  }, [progreso, duracion]);

  return {
    transform: [{ rotate: progreso.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) }],
  };
}

/**
 * Avanza por una lista de mensajes cada `cadaMs` milisegundos, con un fundido en cada cambio.
 * Al llegar al último se queda ahí: no vuelve a empezar mientras la lectura sigue.
 */
export function useMensajeRotativo(mensajes: string[], cadaMs = 2200) {
  const [indice, setIndice] = useState(0);
  const opacidad = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const temporizador = setInterval(() => {
      setIndice((actual) => Math.min(actual + 1, mensajes.length - 1));
    }, cadaMs);
    return () => clearInterval(temporizador);
  }, [mensajes.length, cadaMs]);

  useEffect(() => {
    opacidad.setValue(0);
    Animated.timing(opacidad, { toValue: 1, duration: 350, useNativeDriver: true }).start();
  }, [indice, opacidad]);

  return {
    mensaje: mensajes[indice],
    indice,
    estiloFundido: { opacity: opacidad },
  };
}
