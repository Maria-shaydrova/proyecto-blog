import React from 'react';
import { useState, useEffect } from 'react';
import { Global } from '../../helpers/Global';
import { Peticion } from '../../helpers/Peticion';
import { Listado } from './Listado';
import { useParams } from 'react-router-dom';

export const Articulo = () => {

  const [articulo, setArticulo] = useState({});
  const [cargando, setCargando] = useState(true);
  const params = useParams();

  useEffect(() => {
    conseguirArticulo();
  }, []);

  const conseguirArticulo = async () => {

    const { datos, cargando } = await Peticion(Global.url + "articulo/" + params.id, "GET");

    if (datos.status === "success") {
      setArticulo(datos.articulo);
    }
    console.log(articulo);
    setCargando(false);
  }

  return (
    <div className="jumbo">
      {cargando ? "" :
        (
          <>
            <h1>{articulo.titulo}</h1>
            <div className="mascara">
              {articulo.imagen !== "default.png" && <img src={Global.url + 'imagen/' + articulo.imagen} />}
              {articulo.imagen === "default.png" && <img src='https://www.oscarblancarteblog.com/wp-content/uploads/2017/05/react-webpack.png' />}
            </div>
            <p>{articulo.contenido}</p>
          </>
        )
      }
    </div>
  )
}
