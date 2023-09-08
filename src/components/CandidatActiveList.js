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



export const CandidatActiveList = () => {
    const [candidats, setCandidats] = useState([]);
    const [filters1,setFilters1] = useState([]);
   

    const toast = useRef(null);

    useEffect(() => {
        fetchCandidats();
    }, []);

    const fetchCandidats = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/candidat/candidats/actifs');
            const candidatsData = response.data;
            
             // Filtrer les candidats correspondants à l'employeur sélectionné
      
           // Mettre à jour la liste des candidats affichés
       setCandidats(candidatsData);
            console.log('candidatsData:', candidatsData);
     
        } catch (error) {
            console.error('Error fetching candidats:', error);
        }
    };
    const dateBodyTemplate = (rowData) => {
        return formatDate(rowData.createdAt);
    }
    const formatDate = (value) => {
        if (value) {
            const date = new Date(value); // Convert the string value to a Date object

            return date.toLocaleDateString('en-US', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            });
        }
        return ''; // Return an empty string or other default value if value is null or undefined
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
    
    const operationBodyTemplate = (rowData) => {
        const isActif = rowData.status === 'ACTIF';

        return (
            <div>
                <Button label={rowData.status=="ACTIF" ? 'Désactiver' : 'Activer'} className={classNames('p-button-rounded', { 'p-button-success': rowData.status=="INACTIF", 'p-button-info': rowData.status=="ACTIF" })} onClick={() => toggleActivation(rowData.id, rowData.status)} />
                <Button label="Supprimer" className="p-button-rounded p-button-danger" onClick={() => deleteUser(rowData.id)} />
                {isActif && (
                <Button
                    label="Completez le profil"
                    className="p-button-rounded p-button-warning"
                    onClick={() => continueCandidat(rowData.id)}
                />
            )}          
            </div>
        );
    };
    const verifiedBodyTemplate = (rowData) => {
        return <i className={classNames('pi', { 'text-green-500 pi-check-circle': rowData.status=="ACTIF", 'text-pink-500 pi-times-circle': rowData.status=="INACTIF" })}></i>;
    }

    const verifiedFilterTemplate = (options) => {
        console.log('Filter Value:', options.value);
        return <TriStateCheckbox value={options.value} onChange={(e) => options.filterCallback(e.value ? 'ACTIF' : 'INACTIF')} />;
    };
    
    
    const toggleActivation = async (userId, currentStatus) => {
        try {
            const newStatus = currentStatus === 'ACTIF' ? 'INACTIF' : 'ACTIF';
            const response = await axios.put(`http://localhost:8080/api/candidat/${userId}/${newStatus}`);
            console.log(`${newStatus} response:`, response.data);
    
            // Update the users list or refresh the data after successful operation
            // You can refetch the data or update the users list in state here
            const updatedUsers = candidats.map(candidats => {
                if (candidats.id === userId) {
                    return { ...candidats, status: newStatus };
                }
                return candidats;
            });
            setCandidats(updatedUsers);
    
            // Show success toast
            const toastMessage = newStatus === 'ACTIF' ? 'Activation du candidat réussie.' : 'Désactivation du candidat réussie.';
            toast.current.show({ severity: 'success', summary: 'Success', detail: toastMessage });
        } catch (error) {
            console.error('Error toggling activation:', error);
            // Show error toast
            toast.current.show({ severity: 'error', summary: 'Error', detail: `Error toggling activation: ${error.message}` });
        }
    };
    
    
    const deleteUser = async (userId) => {
        try {
            const response = await axios.delete(`http://localhost:8080/api/candidat/${userId}`);
            console.log('Delete response:', response.data);
    
            // Update the users list or refresh the data after successful deletion
            // You can refetch the data or update the users list in state here
            const updatedUsers = candidats.filter(candidats => candidats.id !== userId);
            setCandidats(updatedUsers);
    
            // Show success toast
            toast.current.show({ severity: 'success', summary: 'Success', detail: 'User deleted successfully.' });
        } catch (error) {
            console.error('Error deleting user:', error);
            // Show error toast
            toast.current.show({ severity: 'error', summary: 'Error', detail: `Error deleting user: ${error.message}` });
        }
    };

    const continueCandidat = async (candidatID) => {
        console.log(candidatID);
    }
    
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
                        <Column field="status" header="Activation" dataType="boolean" bodyClassName="text-center" style={{ minWidth: '8rem' }} body={verifiedBodyTemplate} filter filterElement={verifiedFilterTemplate} />
                        <Column header="Référence de Contrat" field="ref_contrat" filter filterPlaceholder="Search by reference" style={{ minWidth: '12rem' }} />
                        <Column header="Opération" body={operationBodyTemplate} style={{ minWidth: '10rem', textAlign: 'center' }} />

                        {/* Other columns you want to display */}
                    </DataTable>
                    <Toast ref={toast} />
                </div>
            </div>
            
          
        
        </div>
    );
}
export default CandidatActiveList;