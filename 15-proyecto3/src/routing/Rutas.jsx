import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Inicio } from '../components/pages/Inicio';
import { Articulos } from '../components/pages/Articulos';
import { Articulo } from '../components/pages/Articulo';
import { Crear } from '../components/pages/Crear';
import { Editar } from '../components/pages/Editar';
import { Header } from '../components/layout/Header';
import { Nav } from '../components/layout/Nav';
import { Sidebar } from '../components/layout/Sidebar';
import { Footer } from '../components/layout/Footer';
import { Busqueda } from '../components/pages/Busqueda';




export const Rutas = () => {
    return (
        <BrowserRouter>
            {/* Layout */}
            <Header />
            <Nav />

            <section id='content' className='content'>
                <Routes>
                    <Route path='/' element={<Inicio />}></Route>
                    <Route path='/inicio' element={<Inicio />}></Route>
                    <Route path='/articulos' element={<Articulos />}></Route>
                    <Route path='/crear-articulos' element={<Crear />}></Route>
                    <Route path='/buscar/:busqueda' element={<Busqueda />}></Route>
                    <Route path='/articulo/:id' element={<Articulo />}></Route>
                    <Route path='/editar/:id' element={<Editar />}></Route>
                    <Route path='*' element={
                        <div className='jumbo'>
                            <h2>Error 404.</h2>
                        </div>
                    }></Route>
                </Routes>
            </section>

            <Sidebar />
            <Footer />
        </BrowserRouter>
    );
}
