import { useEffect, useState } from 'react';
import api from '../services/api';

function GestionCommandes() {
  const [commandes, setCommandes] = useState([]);

  useEffect(() => {
    chargerCommandes();
  }, []);

  function chargerCommandes() {
    api.get('/commandes')
      .then(res => setCommandes(res.data))
      .catch(error => {console.error('Erreur chargement commandes :', error);
      });
  }

  function changerStatut(id, nouveauStatut) {
    const commande = commandes.find(commande => commande.id === id);

    api.put(`/commandes/${id}`, { ...commande, statut: nouveauStatut })
      .then(() => chargerCommandes())
      .catch(error => {
        console.error('Erreur changement statut :', error);
      });
  }

  function supprimerCommande(id) {
    if (window.confirm('Supprimer cette commande ?')) {
      api.delete(`/commandes/${id}`)
        .then(() => chargerCommandes())
        .catch(error => {
          console.error('Erreur suppression commande :', error);
        });
    }
  }

  return (
    <div>
      <h2 className="mb-4 fw-bold text-center">Liste des Commandes</h2>
      <div className="row">
        {commandes.map(commande => (
          <div key={commande.id} className="col-md-4 mb-4">
            <div className="card">
              <div className="card-header bg-warning">
                <h5 className="mb-0 text-center">Table {commande.table}</h5>
              </div>
              <div className="card-body">
                <h6>Plats commandés :</h6>
                <ul>{commande.plats.map((plat, i)=>(<li key={i}>{plat}</li>))}</ul>
                <h4 className="text-primary">Total : {commande.total} MAD</h4>
                {/* STATUT */}
                <div className="mb-3">
                  <div className="form-check">
                    <input className="form-check-input"type="checkbox"checked={commande.statut === 'En préparation'}onChange={()=>changerStatut(commande.id, 'En préparation')}/>
                    <label className="form-check-label">En préparation</label>
                  </div>

                  <div className="form-check">
                    <input className="form-check-input"type="checkbox"checked={commande.statut === 'En cours'}onChange={()=>changerStatut(commande.id, 'En cours')}/>
                    <label className="form-check-label">En cours</label>
                  </div>

                  <div className="form-check">
                    <input className="form-check-input"type="checkbox"checked={commande.statut === 'Servie'}onChange={()=>changerStatut(commande.id, 'Servie')}/>
                    <label className="form-check-label">Servie</label>
                  </div>
                </div>
                {/* supprimer commande */}
                <button className="btn btn-danger btn-sm w-100"onClick={() => supprimerCommande(commande.id)}>Supprimer</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GestionCommandes;