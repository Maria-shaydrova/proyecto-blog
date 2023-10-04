import React, { useState, useEffect } from 'react';
import { useForm } from "../../hooks/useForm";
import { Peticion } from "../../helpers/Peticion";
import { Global } from "../../helpers/Global";
import { useParams } from 'react-router-dom';
import porDefecto from '../../assets/porDefecto.png';


export const Editar = () => {

  const { formulario, enviado, cambiar, setFormulario } = useForm({});
  const [resultado, setResultado] = useState("");
  const [articulo, setArticulo] = useState({});
  const params = useParams();

  useEffect(() => {
    conseguirArticulo();
  }, []);

  useEffect(() => {
    console.log("Formulario actualizado:", formulario);
  }, [formulario]);



  const conseguirArticulo = async () => {

    const { datos } = await Peticion(Global.url + "articulo/" + params.id, "GET");

    if (datos.status === "success") {
      setArticulo(datos.articulo);
      setFormulario(datos.articulo);
    }
  }


  const editarArticulo = async (e) => {

    //Recoger datos formulario
    e.preventDefault();

    // Verifica si el formulario y los datos del artículo son iguales
    if (JSON.stringify(formulario) === JSON.stringify(articulo)) {
      // No se realizaron cambios, mostrar mensaje de éxito
      setResultado("guardado");
      return;
    }

    let nuevoArticulo = formulario;
    console.log("El nuevo artículo es:", nuevoArticulo);

    //Guardar datos en el backend
    const { datos } = await Peticion(Global.url + "articulo/" + params.id, "PUT", nuevoArticulo);

    if (datos.status === "success") {
      setFormulario(datos.articulo);
      setResultado("guardado")
    } else {
      setResultado("error");
    }
  }

  const subirImagen = async () => {

    //Subir la imagen
    const fileInput = document.querySelector('#file');

    if (fileInput.files[0]) {
      setResultado("guardado");

      const formData = new FormData();
      formData.append('file0', fileInput.files[0]);

      const subida = await Peticion(Global.url + "subir-imagen/" + params.id, "POST", formData, true);

      if (subida.datos.status === "success") {
        // setResultado("guardado");
        setArticulo({ ...articulo, imagen: subida.datos.articulo_actualizado.imagen });
        setFormulario({ ...formulario, imagen: subida.datos.articulo_actualizado.imagen });
      }
      else {
        setResultado("error");
      }
    }
  }

  return (
    <div className='jumbo'>
      <h2>Editar artículo</h2>
      <form className='formulario' onSubmit={editarArticulo}>
        <h4 className={`resultado ${resultado === "guardado" ? "exito" : resultado === "error" ? "error" : "oculto"}`}>
          {resultado === "guardado" ? "Artículo actualizado correctamente." : resultado === "error" ? "Datos incorrectos." : ""}
        </h4>
        <div className='form-group'>
          <label htmlFor="titulo">Título</label>
          <input type="text" name="titulo" onInput={cambiar} defaultValue={articulo.titulo} />
        </div>
        <div className='form-group'>
          <label htmlFor="contenido">Contenido</label>
          <textarea type="text" name="contenido" onInput={cambiar} defaultValue={articulo.contenido} />
        </div>
        <div className='form-group'>
          <div className="mascara">
            {articulo.imagen !== "default.png" && <img src={Global.url + 'imagen/' + articulo.imagen} />}
            {articulo.imagen === "default.png" && <img src={porDefecto} alt='default.png'/>}
          </div>
          <label htmlFor="file0">Imagen</label>
          <input type="file" name="file0" id='file' defaultValue={articulo.imagen} onChange={subirImagen} />
        </div>
        <div className='center-button'>
          <input type='submit' className='btn btn-success' value="Guardar" />
        </div>
      </form>
    </div>
  )
}
