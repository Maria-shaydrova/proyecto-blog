import { useState } from "react";

export const useForm = ( objetoInicial = {} ) => {

    const [formulario, setFormulario] = useState(objetoInicial);
    
    const serializarFormulario = (formulario) => {
        
        const formData = new FormData(formulario);
        const objetoFormulario = {};

        for (let [name, value] of formData){
            objetoFormulario[name] = value;
        }
        return objetoFormulario;
    }

    const enviado = e => {
        e.preventDefault();

        // let curso = {
        //     titulo: e.target.titulo.value,
        //     anio: e.target.anio.value,
        //     descripcion: e.target.descripcion.value,
        //     autor: e.target.autor.value,
        //     email: e.target.email.value
        // };

        let datos = serializarFormulario(e.target);
        setFormulario(datos);

        // document.querySelector('.codigo').classList.add('enviado');
    }

    const cambiar = ({target}) => {
        const {name, value} = target;
        setFormulario({
            ...formulario,
            [name]: value
        })
    }

    return {
        formulario,
        enviado,
        cambiar,
        setFormulario
    };
}