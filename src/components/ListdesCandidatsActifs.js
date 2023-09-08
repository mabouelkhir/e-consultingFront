import React, { useCallback, useEffect, useRef, useState } from 'react';
import axios from "axios";
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { DataTable } from 'primereact/datatable';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';

import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Calendar } from 'primereact/calendar';
import { CandidatActiveList } from './CandidatActiveList';
import Candidats from './Candidats';

 const ListdesCandidatsActifs= () => {

    const [ListdesCandidatsActifs, setListdesCandidatsActifs] = useState([]);
    const [candidats, setCandidats] = useState([]);
    const [filters1, setFilters1] = useState(null);
     


    //Toast un message de succès ou d'erreur après avoir effectué une action
    const toast = useRef(null);
   //Cette methode permet de charger les listes des employeurs à partir du serveur
    useEffect(() => {
        fetchCandidats();
    
    }, []);
    

    //fetchCandidats()=fonction asynchrone qui utilise Axios pour effectuer une requête HTTP GET
    const fetchCandidats = async () => {
        // À l'intérieur de fetchCandidats
try {
    const response = await axios.get('http://localhost:8080/api/candidat/candidats/actifs');
    setCandidats(response.data);   
} catch (error) {
    console.error('Error fetching candidats:', error);
}
};

    const dateBodyTemplate = (rowData) => {
        return formatDate(rowData.createdAt);
    }
    const formatDate = (value) => {
        if (value) {
            const date = new Date(value);

            return date.toLocaleDateString('en-US', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            });
        }
        return ''; 
    }
    
    const dateFilterTemplate = (options) => {
        return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />
    }
    const initFilters1 = () => {
        setFilters1({
            'prenom': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'nom': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'email': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'createdAt': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
            'status': { value: null, matchMode: FilterMatchMode.EQUALS },
            'ref_contrat': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]}
        });
        
    }
    const getImageUrl = (candidatId) => {
        return `http://localhost:8080/api/images/candidat/${candidatId}/image`;
    };

    const imageBodyTemplate = (rowData) => {
        const imageUrl = getImageUrl(rowData.id);
        return <img src={imageUrl} alt="Candidat" style={{ width: '150px', height: 'auto' }} />;
    };
    //afficher des boutons d'opération
    
    const toggleStatus = async (candidatId, field, value) => {
        try {
            const response = await axios.put(`http://localhost:8080/api/candidat/${candidatId}/${value}`);
            console.log(""+candidatId+"-"+field+"-"+value)
            // Update the corresponding field for the candidat
            const updatedCandidats = candidats.map(candidat => {
                if (candidat.id === candidatId) {
                    return { ...candidat, [field]: response.data };
                }
                return candidat;
            });
            setCandidats(updatedCandidats);
            fetchCandidats();
        } catch (error) {
            console.error(`Error toggling ${field} status:`, error);
        }
    };

    const operationBodyTemplate = (rowData) => {
        return (
            <div className="operation-buttons">
                <Button
                    label="TLS"
                    className={classNames('p-button-sm', { 'p-button-success': rowData.tlsRecu, 'p-button-danger': !rowData.tlsRecu })}
                    onClick={() => toggleStatus(rowData.id, 'tlsRecu', rowData.tlsRecu ? 'INACTIFTLS' : 'ACTIFTLS')}
                />
                <Button
                    label="OFII"
                    className={classNames('p-button-sm', { 'p-button-success': rowData.ofiiRecu, 'p-button-danger': !rowData.ofiiRecu })}
                    onClick={() => toggleStatus(rowData.id, 'ofiiRecu', rowData.ofiiRecu ? 'INACTIFOFII' : 'ACTIFOFII')}
                />
                <Button
                    label="VISA"
                    className={classNames('p-button-sm', { 'p-button-success': rowData.visaRecu, 'p-button-danger': !rowData.visaRecu })}
                    onClick={() => toggleStatus(rowData.id, 'visaRecu', rowData.visaRecu ? 'INACTIFVISA' : 'ACTIFVISA')}
                />
            </div>
        );
    };
    

        
       
                        
                 
            
                
                    
                  
                
        
        
        
        
        
       
       
       
        return (
            <div className="grid p-fluid">
                <div className="col-12">
                    <div className="card">
                        <h5>List des Candidats Actifs</h5>
                        <DataTable
                        value={candidats}
                        paginator
                        className="p-datatable-gridlines"
                        showGridlines
                        rows={10}
                        dataKey="id"
                        filters={filters1}
                        filterDisplay="menu"
                        responsiveLayout="scroll"
                        emptyMessage="No candidats found."
                    >
                          <Column header="Image" body={imageBodyTemplate} style={{ minWidth: '12rem', textAlign: 'center' }} />
                        <Column field="nom" header="Nom" filter filterPlaceholder="Search by lastname" style={{ minWidth: '12rem' }} />
                        <Column field="prenom" header="Prenom" filter filterPlaceholder="Search by firstname" style={{ minWidth: '12rem' }} />
                        <Column field="email" header="Email" filter filterPlaceholder="Search by email" style={{ minWidth: '12rem' }} />
                        <Column header="Date de Creation" field="createdAt" filterField="createdAt" dataType="date" style={{ minWidth: '10rem' }} body={dateBodyTemplate}
                            filter filterElement={dateFilterTemplate} />

                        <Column header="Référence de Contrat" field="ref_contrat" filter filterPlaceholder="Search by reference" style={{ minWidth: '12rem' }} />
                        <Column header="Opération" body={operationBodyTemplate} style={{ minWidth: '10rem', textAlign: 'center' }} />

                     
                    </DataTable>
                    <Toast ref={toast} />
                </div>
            </div>
        </div>
    );

        
    

    }     



export default ListdesCandidatsActifs;