
export const Peticion = async (url, metodo, datosGuardar = "", archivos = false) => {

    let cargando = true;

    //Por defecto definimos que el método es GET
    let opciones = {
        method: "GET"
    };

    //Si el metodo es DELETE lo cambio
    if (metodo == "GET" || metodo == "DELETE") {
        opciones = {
            method: metodo,
        }
    }

    //Si el metodo es POST o PUT le pasamos mas parámetros a las opciones
    if (metodo == "POST" || metodo == "PUT") {

        let body = JSON.stringify(datosGuardar);

        if (archivos) {
            opciones = {
                method: metodo,
                body: datosGuardar
            }
        }
        else {
            opciones = {
                method: metodo,
                body,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        }
    }

    const peticion = await fetch(url, opciones);
    const datos = await peticion.json();

    cargando = false;

    return {
        datos,
        cargando
    }

}