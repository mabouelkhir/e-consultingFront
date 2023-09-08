import React, { useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import axios from 'axios';

const RechercherEmployeurparCandidat = () => {
    const [employeurCode, setEmployeurCode] = useState('');
    const [candidats, setCandidats] = useState([]);
    const toast = useRef(null);

    const fetchCandidats = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/candidat/candidat/employeur/${employeurCode}`);
            console.log(employeurCode);
            const data = response.data; // Assurez-vous que les données renvoyées correspondent à la structure attendue
            console.log(data);
            setCandidats(data);
            setEmployeurCode('');
        } catch (error) {
            console.error('Erreur lors de la récupération des candidats', error);
            toast.current.show({ severity: 'error', summary: 'Erreur', detail: `Erreur lors de la récupération des candidats: ${error.message}`, life: 3000 });
        }
        
    };

    return (
        <div className="RechercherEmployeurparCandidat">
            <div className="card">
                <form onSubmit={fetchCandidats}>
                    <h5>Rechercher des candidats par employeur</h5>
                    <div className="p-field">
                        <label htmlFor="employeurCode">Code de l'employeur</label>
                        <input
                            type="text"
                            id="employeurCode"
                            value={employeurCode}
                            onChange={(e) => setEmployeurCode(e.target.value)}
                        />
                    </div>
                    <Button label="Rechercher" type="submit" />
                </form>
                <DataTable value={candidats}>
                    <Column field="nom" header="Nom" />
                    <Column field="prenom" header="Prénom" />
                    <Column field="email" header="Email" />
                    {/* Ajoutez d'autres colonnes pour les autres propriétés */}
                </DataTable>
                <Toast ref={toast} />
            </div>
        </div>
    );
};

export default RechercherEmployeurparCandidat;
