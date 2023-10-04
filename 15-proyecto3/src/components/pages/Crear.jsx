import React, { useState } from 'react';
import { useForm } from "../../hooks/useForm";
import { Peticion } from "../../helpers/Peticion";
import { Global } from "../../helpers/Global";


export const Crear = () => {

  const { formulario, enviado, cambiar, setFormulario } = useForm({});
  const [resultado, setResultado] = useState("no_guardado");

  const guardarArticulo = async (e) => {

    //Recoger datos formulario
    e.preventDefault();
    let nuevoArticulo = formulario;

    //Guardar datos en el backend
    const { datos } = await Peticion(Global.url + "crear", "POST", nuevoArticulo);


    if (datos.status === "success") {
      setResultado("guardado");
    }
    else {
      setResultado("error");
    }

    //Subir la imagen
    const fileInput = document.querySelector('#file');

    if (datos.status === "success" && fileInput.files[0]) {
      setResultado("guardado");

      const formData = new FormData();
      formData.append('file0', fileInput.files[0]);

      const subida = await Peticion(Global.url + "subir-imagen/" + datos.articulo._id, "POST", formData, true);

      if (subida.datos.status !== "success") {
        setResultado("error");
      }
    }
  }

  return (
    <div className='jumbo crear'>
      <h2>Crear un artíclo nuevo</h2>
      <form className='formulario' onSubmit={guardarArticulo}>
        <h4 className={`resultado ${resultado === "guardado" ? "exito" : resultado === "error" ? "error" : "oculto"}`}>
          {resultado === "guardado" ? "Artículo guardado correctamente." : resultado === "error" ? "Datos incorrectos." : ""}
        </h4>
        <div className='form-group'>
          <label htmlFor="titulo">Título</label>
          <input type="text" name="titulo" onChange={cambiar} />
        </div>
        <div className='form-group'>
          <label htmlFor="contenido">Contenido</label>
          <textarea type="text" name="contenido" onChange={cambiar} />
        </div>
        <div className='form-group'>
          <label htmlFor="file0">Imagen</label>
          <input type="file" name="file0" id='file' />
        </div>

        <div className='center-button'>
          <input type='submit' className='btn btn-success' value="Guardar" />
        </div>
      </form>
    </div>
  )
}
