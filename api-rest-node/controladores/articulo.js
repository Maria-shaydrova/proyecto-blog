
const fs = require("fs");
const path = require("path");
const { validarArticulo } = require("../helpers/validar");
const Articulo = require("../modelos/Articulo");
const { resourceUsage } = require("process");
const { error } = require("console");

const crear = async (req, res) => {

    //Recoger los parametros por post a guardar
    let parametros = req.body;

    //Validar datos
    try {
        validarArticulo(parametros);
    } catch (error) {
        return res.status(400).json({
            status: "error",
            mensaje: "Los datos introducidos no son correctos"
        });
    }

    //Crear el objeto a guardar y asignar los valores al objeto de forma automatica
    const articulo = new Articulo(parametros);

    //Guardar el articulo en la base de datos ---> ESTO YA NO SE USA PORQUE .save NO ACEPTA FUNCIONES DE CALLABACK
    // articulo.save((error, articuloGuardado) => {

    //     if(error || !articuloGuardado){
    //         return res.status(400).json({
    //             status: "error",
    //             mensaje: "No se ha podido guardar el artículo en la base de datos"
    //         });
    //     }

    //     return res.status(200).json({
    //         status : "success",
    //         mensaje: "Artículo guardado en la base de datos",
    //         articulo: articuloGuardado
    //     });
    // });

    //-----------ENTONCES HAY QUE HACERLO CON PROMESAS  !!!!!!!!!!!!!!!!!----------------

    await articulo
        .save()
        .then((articuloGuardado) => {
            // Devolver resultado
            return res.status(200).json({
                status: "success",
                articulo: articuloGuardado,
            });
        })
        .catch((error) => {
            return res.status(400).json({
                status: "Error",
                mensaje: "No se ha guardado el artículo",
            });
        });
};

//----------AQUI PASA LO MISMO: MongooseError: Query.prototype.exec() no longer accepts a callback------
// const listar = (req, res) => {
//     let consulta = Articulo.find({}).exec((error, articulos) => {

//         if(error || !articulos){
//             return res.status(400).json({
//                 status: "Error",
//                 mensaje: "No se han encontrado articulos",
//               });
//         }

//         return res.status(200).json({
//             status: "Success",
//             articulos
//           });
//     })
// }

//SE TIENE QUE HACER DE ESTA FORMA:

const listar = (req, res) => {

    //Buscamos dentro de los articulos
    //ESTE METODO ES UNA CONSULTA A LA BD EQUIVALENTE A SELECT * FROM ....
    let consulta = Articulo.find({})

    //Ordenamos los articulos
    //.sort({fecha: -1}) -> para filtrar de más nuevo a más antiguo
    consulta.sort({ fecha: -1 })

    //Ponemos limite a la cantidad de articulos que queremos visualizar SI HEMOS RECIBIDO PARAMETRO POR LA URL
    if (req.params.ultimos) {
        //Convertimos el parametro recibido a entero
        const ultimos = parseInt(req.params.ultimos);
        //Si el parametro recibido es un entero -> LIMITAMOS LA CONSULTA A TANTOS ARTICULOS COMO VALOR DEL PARAMETRO
        if (!isNaN(ultimos) && Number.isInteger(ultimos)) {
            consulta.limit(req.params.ultimos);
        }
        //Si es paramentro recibido es un cadena, nos saltamos este paso y mostramos todos los articulos
    }


    consulta.then((articulos) => {
        //Ha entrado a consulta de artículos exitosa
        return res.status(200).send({
            status: "success",
            parametros: req.params.ultimos,
            contador: articulos.length,
            articulos
        })
    }).catch((error) => {
        return res.status(404).json({
            status: "error",
            mensaje: "No se han encontrado artículos"
        });
    });
}

const uno = (req, res) => {
    //Recoger el id del articulo por la url
    let id = req.params.id;

    //Buscar el artículo
    Articulo.findById(id)

        //Si existe articulo con ese id devolver resultado
        .then((articulo) => {
            return res.status(200).json({
                status: "success",
                articulo
            });

        })
        //Si no existe articulo con ese id devolver error
        .catch((error) => {
            return res.status(404).json({
                status: "error",
                mensaje: "No se ha encontrado el articulo"
            });
        });
}

const borrar = (req, res) => {
    //Recoger el id del articulo por la url
    let id = req.params.id;

    Articulo.findOneAndDelete({ _id: id })
        //Si se ha encontrado el articulo con el id que hemos pasado como parametro
        .then((articuloBorrado) => {
            // No se encontró el artículo con el ID proporcionado
            if (articuloBorrado === null) {
                return res.status(404).json({
                    status: "error",
                    mensaje: "No se ha encontrado el artículo para borrar"
                });
            }
            // El artículo se encontró y se eliminó con éxito
            return res.status(200).json({
                status: "success",
                articulo_borrado: articuloBorrado
            });
        })
        //Si no se ha encontrado el artículo con el id que hemos enviado por parámetro
        .catch((error) => {
            return res.status(500).json({
                status: "error",
                mensaje: "Error al borrar el articulo"
            });
        })
}


const editar = (req, res) => {
    //Recoger el id del articulo por la url
    let id = req.params.id;

    //Recoger los datos del body
    let parametros = req.body;

    //Validar datos
    try {
        validarArticulo(parametros);
    } catch (error) {
        return res.status(500).json({
            status: "error",
            mensaje: "Los datos introducidos no son correctos"
        });
    }

    //Buscar y actualizar el artículo
    Articulo.findOneAndUpdate({ _id: id }, parametros, { new: true })

        .then((articuloActualizado) => {
            // No se encontró el artículo con el ID proporcionado
            if (!articuloActualizado) {
                return res.status(404).json({
                    status: "error",
                    mensaje: "No se ha encontrado el artículo para actualizar"
                });
            }
            // El artículo se encontró y se actualizó con éxito
            return res.status(200).json({
                status: "success",
                articulo_actualizado: articuloActualizado
            });
        })
        //Error al actualizar el articulo
        .catch((error) => {
            return res.status(500).json({
                status: "error",
                mensaje: "Error al actualizar el articulo"
            });
        })

}

const subir = (req, res) => {

    //Configurar multer -> DENTRO DE articulo.js DE RUTAS

    //Recoger el fichero de imagen subido
    //Si no se ha subido el archivo
    if (!req.file && !req.files) {
        return res.status(404).json({
            status: "error",
            mensaje: "No se ha seleccionado imagen"
        });
    }

    //Obtener el nombre del archivo
    let archivo = req.file.originalname;

    //Obtener la extension del archivo
    let archivo_split = archivo.split("\.");
    let extension = archivo_split[1];

    //Comprobar si la extension es correcta
    if (extension !== 'jpg' && extension !== 'png' && extension !== 'jpeg' && extension !== 'gif') {
        //Si no cumple con la extensio -> BORRAR ARCHIVO Y DAR RESPUESTA
        fs.unlink(req.file.path, (error) => {
            return res.status(400).json({
                status: "error",
                mensaje: "Archivo no válido"
            });
        })
    }
    //Si todo va bien, actualizar el articulo
    else {

        //Recoger el id del articulo por la url
        let id = req.params.id;

        //Buscar y actualizar el artículo
        Articulo.findOneAndUpdate({ _id: id }, { imagen: req.file.filename }, { new: true })

            .then((articuloActualizado) => {
                // No se encontró el artículo con el ID proporcionado
                if (!articuloActualizado) {
                    return res.status(404).json({
                        status: "error",
                        mensaje: "No se ha encontrado el artículo para actualizar"
                    });
                }
                // El artículo se encontró y se actualizó con éxito -> DEVOLVEMOS RESPUESTA
                return res.status(200).json({
                    status: "success",
                    articulo_actualizado: articuloActualizado,
                    fichero_actualizado: req.file
                });
            })
            //Error al actualizar el articulo
            .catch((error) => {
                return res.status(500).json({
                    status: "error",
                    mensaje: "Error al actualizar el articulo"
                });
            })
    }
}

const imagen = (req, res) => {
    let fichero = req.params.fichero;
    let ruta_fisica = "./imagenes/articulos/" + fichero;

    fs.stat(ruta_fisica, (error, existe) => {
        if (existe) {
            return res.sendFile(path.resolve(ruta_fisica));
        }
        else {
            return res.status(404).json({
                status: "error",
                mensaje: "No se ha encontrado la imagen",
                existe,
                fichero,
                ruta_fisica
            });
        }
    });
}

const buscador = (req, res) => {

    //Obtener el string de la busqueda
    let busqueda = req.params.busqueda;

    //Find OR -> equivalente a SELECT * FROM ... WHERE condicion = '..' OR condicion = '...' OR condicon = '...' ....;
    const consulta = Articulo.find({
        "$or": [
            { "titulo": { "$regex": busqueda, "$options": "i" } },
            { "contenido": { "$regex": busqueda, "$options": "i" } }
        ]
    })
    //Ordenar 
    consulta.sort({ fecha: -1 })
    //Ejecutar consulta
    consulta.exec()

        .then((articulosEncontrados) => {

            if (!articulosEncontrados || articulosEncontrados.length <= 0) {
                return res.status(404).json({
                    status: "error",
                    mensaje: "No se han encontrado artículos"
                });
            }

            return res.status(200).json({
                status: "success",
                articulos: articulosEncontrados
            })
        })

        .catch((error) => {
            return res.status(500).json({
                status: "error",
                mensaje: "Error al buscar artículos",
            });
        })
}


module.exports = {
    crear,
    listar,
    uno,
    borrar,
    editar,
    subir,
    imagen,
    buscador
};