import React from 'react';
import { Link } from "react-router-dom";

export const Inicio = () => {
  return (
    <div className='inicio'>
      <h1>Bienvenido al blog con React</h1>
      <p>Blog desarollado con MERN Stack (Mongo, Express, React y NodeJS)</p>
        <Link to='/articulos' className='button'>Ver los artículos</Link>

    </div>
  )
}
