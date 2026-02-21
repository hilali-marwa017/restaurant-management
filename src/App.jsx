import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Sidebar from './components/Sidebar';
import TableauBord from './components/TableauBord';
import GestionMenu from './components/GestionMenu';
import GestionReservations from './components/GestionReservations';
import GestionCommandes from './components/GestionCommandes';

function App() {
  return (
    <Router>
      <div className="gestion-restaurant">
        <Sidebar />
        
        <div className="contenu-principal">
          <div className="container-fluid p-4">
            <Routes>
              <Route path="/" element={<TableauBord />} />
              <Route path="/tableau-bord" element={<TableauBord />} />
              <Route path="/menu" element={<GestionMenu />} />
              <Route path="/reservations" element={<GestionReservations />} />
              <Route path="/commandes" element={<GestionCommandes />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;