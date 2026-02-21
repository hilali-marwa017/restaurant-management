import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

function TableauBord() {
  const [plats, setPlats] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [commandes, setCommandes] = useState([]);

  useEffect(() => {
    chargerDonnees();
  }, []);

  function chargerDonnees() {
    api.get('/plats').then(res => setPlats(res.data));
    api.get('/reservations').then(res => setReservations(res.data));
    api.get('/commandes').then(res => setCommandes(res.data));
  }

  const totalPlats = plats.length;
  const totalReservations = reservations.length;
  const totalCommandes = commandes.length;
  const chiffreAffaires = commandes.reduce((acc, cmd) => acc + cmd.total, 0);

  // Données pour le graphique des catégories
  const categories = ['Entrée', 'Plat Principal', 'Dessert', 'Boisson'];
  const donneesCategories = categories.map(cat => 
    plats.filter(p => p.categorie === cat).length
  );

  const graphiqueCategories = {
    labels: categories,
    datasets: [{
      label: 'Nombre de plats',
      data: donneesCategories,
      backgroundColor: ['#ff6b6b', '#4ecdc4', '#ffd93d', '#95e1d3']
    }]
  };

  // Données pour le graphique des réservations
  const reservationsConfirmees = reservations.filter(r => r.statut === 'Confirmée').length;
  const reservationsEnAttente = reservations.filter(r => r.statut === 'En attente').length;
  const reservationsAnnulees = reservations.filter(r => r.statut === 'Annulée').length;

  const graphiqueReservations = {
    labels: ['Confirmées', 'En attente', 'Annulées'],
    datasets: [{
      data: [reservationsConfirmees, reservationsEnAttente, reservationsAnnulees],
      backgroundColor: ['#28a745', '#ffc107', '#dc3545']
    }]
  };

  return (
    <div className='card-bord'>
      <h2 className="mb-4 text-center fw-bold">Tableau de Bord</h2>
      
      {/* STATISTIQUES */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card stat-card bg-primary text-white">
            <div className="card-body">
              <h6>Total Plats</h6>
              <h2>{totalPlats}</h2>
              <small>Dans le menu</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card stat-card bg-success text-white">
            <div className="card-body">
              <h6>Réservations</h6>
              <h2>{totalReservations}</h2>
              <small>Total</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card stat-card bg-warning text-white">
            <div className="card-body">
              <h6>Commandes</h6>
              <h2>{totalCommandes}</h2>
              <small>En cours</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card stat-card bg-info text-white">
            <div className="card-body">
              <h6>Chiffre d'Affaires</h6>
              <h2>{chiffreAffaires} MAD</h2>
              <small>Aujourd'hui</small>
            </div>
          </div>
        </div>
      </div>

      {/* GRAPHIQUES */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header bg-dark text-white">
              <h5 className="mb-0">📊 Plats par Catégorie</h5>
            </div>
            <div className="card-body">
              <Bar data={graphiqueCategories} options={{ responsive: true }} />
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-header bg-dark text-white">
              <h5 className="mb-0">📅 Statut des Réservations</h5>
            </div>
            <div className="card-body">
              <Pie data={graphiqueReservations} options={{ responsive: true }} />
            </div>
          </div>
        </div>
      </div>

      {/* RÉSERVATIONS RÉCENTES */}
      <div className="card mb-4">
        <div className="card-header bg-dark text-white">
          <h5 className="mb-0">📅 Réservations Récentes</h5>
        </div>
        <div className="card-body">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Client</th>
                <th>Personnes</th>
                <th>Date</th>
                <th>Heure</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {reservations.slice(0, 5).map(r => (
                <tr key={r.id}>
                  <td>{r.client}</td>
                  <td>{r.personnes} pers.</td>
                  <td>{r.date}</td>
                  <td>{r.heure}</td>
                  <td>
                    <span className={`badge ${r.statut === 'Confirmée' ? 'bg-success' : 'bg-warning'}`}>
                      {r.statut}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* COMMANDES EN COURS */}
      <div className="card">
        <div className="card-header bg-dark text-white">
          <h5 className="mb-0">🛎️ Commandes en Cours</h5>
        </div>
        <div className="card-body">
          <div className="row">
            {commandes.filter(c => c.statut !== 'Servie').map(cmd => (
              <div key={cmd.id} className="col-md-4 mb-3">
                <div className="card">
                  <div className="card-body">
                    <h5 className='fw-bold'>Table {cmd.table}</h5>
                    <p className="text-muted">
                      {cmd.plats.join(', ')}
                    </p>
                    <h4 className="text-primary">{cmd.total} MAD</h4>
                    <span className={`badge ${cmd.statut === 'En cours' ? 'bg-warning' : 'bg-secondary'}`}>
                      {cmd.statut}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TableauBord;