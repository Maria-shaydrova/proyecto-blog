import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

export const Sidebar = () => {

  const [buscar, setBuscar] = useState("");
  const navegar = useNavigate();

  const hacerBusqueda = (e) => {
    e.preventDefault();
    let mi_busqueda = e.target.search_field.value;

    //Solo va a buscar articulos cuando la busqueda no es una cadena vacía
    if(mi_busqueda !== ""){
      navegar("buscar/" + mi_busqueda, {replace: true});
    }
    //Si es un string vacío va a sacar todos los articulos
    else{
      navegar("/articulos", {replace:true})
    }
    
  };

  return (
    <aside className="lateral">

      <div className="search">
        <h3 className="title">Buscador</h3>
        <form onSubmit={hacerBusqueda}>
          <input type="text" name='search_field'/>
          <input type='submit' id='search' value='Buscar' />
        </form>
      </div>
      
    </aside>
  );
}
