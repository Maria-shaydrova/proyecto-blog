import React from 'react';
import { useState, useEffect } from 'react';
import { Global } from '../../helpers/Global';
import { Peticion } from '../../helpers/Peticion';
import { Listado } from './Listado';
import { useParams } from 'react-router-dom';

export const Busqueda = () => {

  const [articulos, setArticulos] = useState([]);
  const [cargando, setCargando] = useState(true);
  //Recibo el parametro que se pasa por la url -> es un objeto, hay que entrar con el nombre del parametro
  let params = useParams();

  useEffect(() => {
    conseguirArticulos();
  }, []);

  useEffect(() => {
    conseguirArticulos();
  }, [params]);


  const conseguirArticulos = async () => {

    console.log(params.busqueda);
    const { datos, cargando } = await Peticion(Global.url +"buscar/" + params.busqueda, "GET");

    if (datos.status === "success") {
      setArticulos(datos.articulos);
    }
    else{
      setArticulos([]);
    }
    setCargando(false);
  }
  

  return (
    <>
      {cargando ? "" :

        articulos.length > 0 ?
          <Listado articulos={articulos} setArticulos={setArticulos} />
          :
          <h3>No se han encontrado artículos con la búsqueda: <i>"{params.busqueda}"</i></h3>
      }
    </>
  )
}
