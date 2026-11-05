import { useCallback, useEffect, useState } from 'react';

import { container } from '@core/di/container';
import { Empresa } from '@domain/entities/Empresa';
import { normalizarTexto } from '@domain/rules/texto';

const MENSAJE_SIN_EMPRESAS = 'No se pudo cargar la lista de empresas. Revisá tu conexión y tocá Ingresar para reintentar.';

/** Estado del formulario de ingreso: empresa (de la api), usuario y contraseña. */
export function useLogin() {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [empresa, setEmpresa] = useState('');
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [errorEmpresa, setErrorEmpresa] = useState('');
  const [errorUsuario, setErrorUsuario] = useState('');
  const [errorPassword, setErrorPassword] = useState('');
  const [errorGeneral, setErrorGeneral] = useState('');
  const [ingresando, setIngresando] = useState(false);

  const cargarEmpresas = useCallback(async (): Promise<Empresa[]> => {
    try {
      const lista = await container.obtenerEmpresas.ejecutar();
      setEmpresas(lista);
      setErrorEmpresa('');
      return lista;
    } catch {
      setEmpresas([]);
      setErrorEmpresa(MENSAJE_SIN_EMPRESAS);
      return [];
    }
  }, []);

  useEffect(() => {
    cargarEmpresas();
  }, [cargarEmpresas]);

  function cambiarEmpresa(texto: string) {
    setEmpresa(texto);
    setErrorEmpresa('');
    setErrorGeneral('');
  }

  function cambiarUsuario(texto: string) {
    setUsuario(texto);
    setErrorUsuario('');
    setErrorGeneral('');
  }

  function cambiarPassword(texto: string) {
    setPassword(texto);
    setErrorPassword('');
    setErrorGeneral('');
  }

  /** Valida el formulario e ingresa. Devuelve `true` si se puede continuar. */
  async function ingresar(): Promise<boolean> {
    if (ingresando) return false;
    setErrorGeneral('');
    setIngresando(true);
    try {
      // Si la lista no pudo cargarse antes, se reintenta acá.
      const lista = empresas.length > 0 ? empresas : await cargarEmpresas();

      const buscada = normalizarTexto(empresa);
      const elegida = lista.find((item) => normalizarTexto(item.nombre) === buscada);

      let valido = true;
      if (!elegida) {
        if (lista.length > 0) setErrorEmpresa(buscada === '' ? 'Elegí tu empresa' : 'Elegí una empresa de la lista');
        valido = false;
      }
      if (usuario.trim() === '') {
        setErrorUsuario('Ingresá tu usuario');
        valido = false;
      }
      if (password === '') {
        setErrorPassword('Ingresá tu contraseña');
        valido = false;
      }
      if (!valido || !elegida) return false;

      setEmpresa(elegida.nombre);
      const resultado = await container.iniciarSesion.ejecutar({
        empresa: elegida,
        usuario: usuario.trim(),
        password,
      });
      if (!resultado.exito) {
        setErrorGeneral(resultado.mensaje);
        return false;
      }
      return true;
    } finally {
      setIngresando(false);
    }
  }

  return {
    empresa,
    cambiarEmpresa,
    errorEmpresa,
    empresas: empresas.map((item) => item.nombre),
    usuario,
    cambiarUsuario,
    errorUsuario,
    password,
    cambiarPassword,
    errorPassword,
    errorGeneral,
    ingresando,
    ingresar,
  };
}
