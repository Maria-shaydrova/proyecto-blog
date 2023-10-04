const mongoose = require("mongoose");

const conexion = async() => {

    try{
        await mongoose.connect("mongodb://0.0.0.0:27017/mi_blog");
        //En caso de error pasar estos parámetros:
        // useNewUrlParser: true
        // useUnifiesTopoogy: true
        //useCreateIndex: true
        console.log("Conectado correctamente a la base de datos mi_blog");
    }
    catch(error){
        console.log(error);
        throw new Error("No se ha podido establecer conexión con la base de datos.");
    }
}

module.exports = {
    conexion
}