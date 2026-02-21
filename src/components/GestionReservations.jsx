import { useEffect, useState } from 'react';
import api from '../services/api';

function GestionReservations() {
  const [reservations, setReservations] = useState([]);
  const [formulaire, setFormulaire] = useState({
    client: '',telephone: '',personnes: '',date: '',heure: '',statut: 'En attente'
  });
  const [modifiedId, setModifiedId] = useState(null);

  useEffect(() => {
    chargerReservations();
  }, []);

  function chargerReservations() {
    api.get('/reservations').then(res => setReservations(res.data))
    .catch(error => {console.error('Erreur chargement commandes :', error);
});
    
  }

  function soumettreFormulaire(e) {
    e.preventDefault();
    if (modifiedId) {
      api.put(`/reservations/${modifiedId}`, formulaire).then(() => {
        setModifiedId(null);
        chargerReservations();
        setFormulaire({ client: '', telephone: '', personnes: '', date: '', heure: '', statut: 'En attente' });
      })
      .catch(error => {console.error('Erreur modification réservation :', error);});
    } else {
      api.post('/reservations', formulaire).then(() => {
        chargerReservations();
        setFormulaire({ client: '', telephone: '', personnes: '', date: '', heure: '', statut: 'En attente' });
      })
      .catch(error => {console.error('Erreur ajout réservation :', error);});
    }
  }

  function supprimerReservation(id) {
    if (window.confirm('Annuler cette réservation ?')) {
      api.delete(`/reservations/${id}`).then(() => chargerReservations())
      .catch(error => {console.error('Erreur suppression réservation :', error);});
    }
  }

  function modifierReservation(reservation) {
    setFormulaire({
      client: reservation.client,
      telephone: reservation.telephone,
      personnes: reservation.personnes,
      date: reservation.date,
      heure: reservation.heure,
      statut: reservation.statut
    });
    setModifiedId(reservation.id);
  }

  function changerStatut(id, nouveauStatut) {
    const reservation = reservations.find(reservation => reservation.id === id);
    api.put(`/reservations/${id}`, { ...reservation, statut: nouveauStatut })
      .then(() => chargerReservations())
      .catch(error => {console.error('Erreur changement statut :', error);});
  }

  function getCouleurStatut(statut) {
    if (statut === 'Confirmée') return 'text-success fw-bold';
    if (statut === 'Annulée') return 'text-danger fw-bold';
    if (statut === 'En attente') return 'text-warning fw-bold';
    return '';
  }

  return (
    <div>
      <h2 className="mb-4 fw-bold text-center">Gestion des Réservations</h2>

      {/* FORMULAIRE */}
      <div className="card mb-4">
        <div className="card-header bg-success text-white">
          <h5 className="mb-0">{modifiedId ? 'Modifier la Réservation' : 'Nouvelle Réservation'}</h5>
        </div>
        <div className="card-body">
          <form onSubmit={soumettreFormulaire}>
            <div className="row">
              <div className="col-md-3">
                <input type="text"className="form-control mb-3"placeholder="Nom du client"value={formulaire.client}onChange={(e) => setFormulaire({ ...formulaire, client: e.target.value })}required/>
              </div>
              <div className="col-md-2">
                <input type="tel"className="form-control mb-3"placeholder="Téléphone"value={formulaire.telephone}onChange={(e) => setFormulaire({ ...formulaire, telephone: e.target.value })}required/>
              </div>
              <div className="col-md-2">
                <input type="number"className="form-control mb-3"placeholder="Personnes"min="1"value={formulaire.personnes}onChange={(e) => setFormulaire({ ...formulaire, personnes: e.target.value })}required/>
              </div>
              <div className="col-md-2">
                <input type="date"className="form-control mb-3"value={formulaire.date}onChange={(e) => setFormulaire({ ...formulaire, date: e.target.value })}required/>
              </div>
              <div className="col-md-2">
                <input type="time"className="form-control mb-3"value={formulaire.heure}onChange={(e) => setFormulaire({ ...formulaire, heure: e.target.value })}required/>
              </div>
              <div className="col-md-1">
                <button type="submit" className="btn btn-success w-100">{modifiedId ? '✓' : '+'}</button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* TABLEAU RÉSERVATIONS */}
      <div className="card">
        <div className="card-body">
          <table className="table table-hover">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Client</th>
                <th>Téléphone</th>
                <th>Personnes</th>
                <th>Date</th>
                <th>Heure</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((reservation, index) => (
                <tr key={reservation.id}>
                  <td>{index + 1}</td>
                  <td>{reservation.client}</td>
                  <td>{reservation.telephone}</td>
                  <td>{reservation.personnes} personnes.</td>
                  <td>{reservation.date}</td>
                  <td>{reservation.heure}</td>
                  <td>
                    <select className={`form-select form-select-sm ${getCouleurStatut(reservation.statut)}`}value={reservation.statut}onChange={(e) => changerStatut(reservation.id, e.target.value)}>
                      <option value="En attente" className='text-warnimg'>En attente</option>
                      <option value="Confirmée" className='text-sucess'>Confirmée</option>
                      <option value="Annulée" className='text-danger'>Annulée</option>
                    </select>
                  </td>
                  <td>
                    <button className="btn btn-sm btn-warning me-2" onClick={() => modifierReservation(reservation)}>Modifier</button>
                    <button className="btn btn-sm btn-danger" onClick={() => supprimerReservation(reservation.id)}>Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
export default GestionReservations;