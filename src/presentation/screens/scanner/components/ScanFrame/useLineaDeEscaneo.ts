import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

/** Estilo animado de una línea que sube y baja `recorrido` píxeles, sin parar. */
export function useLineaDeEscaneo(recorrido: number) {
  const progreso = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animacion = Animated.loop(
      Animated.sequence([
        Animated.timing(progreso, {
          toValue: 1,
          duration: 1800,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(progreso, {
          toValue: 0,
          duration: 1800,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );
    animacion.start();
    return () => animacion.stop();
  }, [progreso]);

  return {
    transform: [{ translateY: progreso.interpolate({ inputRange: [0, 1], outputRange: [0, recorrido] }) }],
  };
}
