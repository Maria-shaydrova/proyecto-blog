import React from 'react';
import { Global } from '../../helpers/Global';
import { Peticion } from '../../helpers/Peticion';
import { Link } from 'react-router-dom';
import porDefecto from '../../assets/porDefecto.png';

export const Listado = ({ articulos, setArticulos }) => {

    const eliminar = async (id) => {

        let { datos } = await Peticion(Global.url + "articulo/" + id, "DELETE");
        console.log(datos);

        if (datos.status === "success") {

            //Otra forma de mostrar los articulos que quedan tras eliminar uno
            //FILTRANDO
            // let articulosActualizados = articulos.filter(articulo => articulo._id !== id);
            //HACIENDO UNA PETICION AL SERVIDOR
            let articulosActualizados = await Peticion(Global.url + "articulos");
            setArticulos(articulosActualizados.datos.articulos);
        }
    };


    return (
        articulos.map(articulo => {
            return (
                <article key={articulo._id} className="articulo-item">
                    <div className='mascara'>
                        {articulo.imagen !== "default.png" && <img src={Global.url + 'imagen/' + articulo.imagen} />}
                        {articulo.imagen === "default.png" && <img src={porDefecto} alt='default.png'/>}
                    </div>
                    <div className='datos'>
                        <h3 className="title"><Link to={"/articulo/" + articulo._id}>{articulo.titulo}</Link></h3>
                        <p className="description">{articulo.contenido}</p>
                        <div className='botones'>
                            <Link to={"/editar/" + articulo._id} className="edit">Editar</Link>
                            <button className="delete" onClick={() => {
                                eliminar(articulo._id);
                            }}>Eliminar</button>
                        </div>
                    </div>
                </article>
            )
        })
    )
}
