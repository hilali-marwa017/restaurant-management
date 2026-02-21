import { useEffect, useState } from 'react';
import api from '../services/api';

function GestionMenu() {
  const [plats, setPlats] = useState([]);
  const [formulaire, setFormulaire] = useState({
    nom: '',prix: '',categorie: '',stock: 'Disponible'});
  const [modifiedId, setModifiedId] = useState(null);

  useEffect(() => {
    chargerPlats();
  }, []);

  function chargerPlats() {
    api.get('/plats').then(res => setPlats(res.data))
    .catch(error => {console.error('Erreur chargement plats :', error);});
  }

  function soumettreFormulaire(e) {
    e.preventDefault();
    
    if (modifiedId) {
      api.put(`/plats/${modifiedId}`, formulaire).then(() => {
        setModifiedId(null);
        chargerPlats();
        setFormulaire({ nom: '', prix: '', categorie: '', stock: 'Disponible' });
      })
      .catch(error => {console.error('Erreur modification plat :', error);});
    } else {
      api.post('/plats', formulaire).then(() => {
        chargerPlats();
        setFormulaire({ nom: '', prix: '', categorie: '', stock: 'Disponible' });
      })
      .catch(error => {console.error('Erreur ajout plat :', error);});
    }
  }

  function supprimerPlat(id) {
    if (window.confirm('Supprimer ce plat ?')) {
      api.delete(`/plats/${id}`).then(() => chargerPlats())
      .catch(error => {console.error('Erreur suppression plat :', error);});
    }
  }

  function modifierPlat(plat) {
    setFormulaire({
      nom: plat.nom,
      prix: plat.prix,
      categorie: plat.categorie,
      stock: plat.stock
    });
    setModifiedId(plat.id);
  }

  return (
    <div>
      <h2 className="mb-4 text-center fw-bold">Gestion du Menu</h2>
      {/* FORMULAIRE */}
      <div className="card mb-4">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">{modifiedId ? 'Modifier le Plat' : 'Ajouter un Plat'}</h5>
        </div>
        <div className="card-body">
          <form onSubmit={soumettreFormulaire}>
            <div className="row">
              <div className="col-md-4">
                <input type="text"className="form-control mb-3"placeholder="Nom du plat"value={formulaire.nom}onChange={(e) => setFormulaire({ ...formulaire, nom: e.target.value })}required/>
              </div>
              <div className="col-md-3">
                <input type="number"className="form-control mb-3"placeholder="Prix (MAD)"value={formulaire.prix}onChange={(e) => setFormulaire({ ...formulaire, prix: e.target.value })}required/>
              </div>
              <div className="col-md-3">
                <select className="form-select mb-3"value={formulaire.categorie}onChange={(e) => setFormulaire({ ...formulaire, categorie: e.target.value })}required>
                  <option value="">Catégorie</option>
                  <option value="Entrée">Entrée</option>
                  <option value="Plat Principal">Plat Principal</option>
                  <option value="Dessert">Dessert</option>
                  <option value="Boisson">Boisson</option>
                </select>
              </div>
              <div className="col-md-2">
                <button type="submit" className="btn btn-success w-100">{modifiedId ? 'Modifier' : 'Ajouter'}</button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Cards des plats */}
      <div className="row">
        {plats.map(plat => (
          <div key={plat.id} className="col-md-4 mb-4">
            <div className="card h-100">
              <div className="card-header bg-dark text-white">
                <h5 className="mb-0 text-center fst-italic">{plat.nom}</h5>
              </div>
              <div className="card-body">
                <p className="text-muted mb-2">
                  <strong>Catégorie :</strong> {plat.categorie}
                </p>
                <h4 className="text-primary mb-3">{plat.prix} MAD</h4>
                <span className={`badge ${plat.stock === 'Disponible' ? 'bg-success' : 'bg-danger'} mb-3`}>{plat.stock}</span>
                <div className="d-flex gap-2">
                  <button className="btn btn-sm btn-warning" onClick={() => modifierPlat(plat)}>Modifier</button>
                  <button className="btn btn-sm btn-danger" onClick={() => supprimerPlat(plat.id)}>Supprimer</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GestionMenu;