import { serviciosRegistros } from '../servicios/serviciosRegistros.js';
import { registrarVotanteEleccion } from '../algorand/registrarCompromisos.js';
import { calcularSha256 } from '../utiles/utilesCrypto.js';
import { registrarAnuladorEleccion } from '../algorand/registrarAnuladores.js';

export const controladorPapeleta = {

  //----------------------------------------------------------------------------

  async registrarSolicitudPapeleta(peticion, respuesta) {
    try {
      console.log(`Registrando solicitud de papeleta para la elección ${peticion.params.idEleccion}`);

      const { cuentaAddr, proofBase64, publicInputs } = peticion.body;
      if (!cuentaAddr || !proofBase64 || !publicInputs) {
        return respuesta.status(400).json({ error: 'Cuenta, prueba y entradas públicas son requeridas' });
      }

      const proof = Buffer.from(proofBase64, 'base64');
      const proofHash = calcularSha256(proof);

      // TODO: comentar después de pruebas
      console.log(cuentaAddr);
      console.log(proofHash);
      console.log(publicInputs);

      const resultadoRegistrar = await registrarAnuladorEleccion(peticion.bd, {
        eleccionId: parseInt(peticion.params.idEleccion),
        destinatario: cuentaAddr,
        proof,
        proofHash,
        publicInputs,
      });

      console.log('Resultado del registro:', resultadoRegistrar);
      respuesta.json({ txId: resultadoRegistrar.txId, proofHash });

    } catch (error) {
      respuesta.status(500).json({ error: error.message });
    }
  },

  //----------------------------------------------------------------------------

  async completarSolicitudPapeleta(peticion, respuesta) {
    try {
      console.log(`Registrando solicitud de papeleta para la elección ${peticion.params.idEleccion}`);

      const { anulador } = peticion.body;
      if (!anulador) {
        return respuesta.status(400).json({ error: 'Anulador es requerido' });
      }

      console.log(anulador);

      const resultadoSolicitar = await solicitarPapeletaEleccion(peticion.bd, {
        eleccionId: parseInt(peticion.params.idEleccion),
        anulador,
      });

      console.log('Resultado de la solicitud:', resultadoSolicitar);
      respuesta.json({ txId: resultadoSolicitar.txId, anulador });

    } catch (error) {
      respuesta.status(500).json({ error: error.message });
    }
  },

  //----------------------------------------------------------------------------
  //----------------------------------------------------------------------------

  // async obtenerDetalleEleccion(peticion, respuesta) {
  //   try {
  //     const detalleEleccion = serviciosElecciones.obtenerDetalle(
  //       peticion.bd,
  //       peticion.params.idEleccion,
  //       peticion.votante.dni
  //     );
  //     if (!detalleEleccion) {
  //       return respuesta.status(404).json({ error: 'Elección no encontrada' });
  //     }
  //     console.log('Detalle de elección:', detalleEleccion);
  //     respuesta.json(detalleEleccion);
  //   } catch (error) {
  //     respuesta.status(500).json({ error: error.message });
  //   }
  // },

  //----------------------------------------------------------------------------

  // async anularRegistroEnEleccion(peticion, respuesta) {
  //   try {
  //     await serviciosRegistros.eliminar(
  //       peticion.bd,
  //       peticion.votante.dni,
  //       peticion.params.idEleccion
  //     );
  //     respuesta.sendStatus(204);
  //   } catch (error) {
  //     respuesta.status(400).json({ error: error.message });
  //   }
  // },

  //----------------------------------------------------------------------------
  //----------------------------------------------------------------------------
};