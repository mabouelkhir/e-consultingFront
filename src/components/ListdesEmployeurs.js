import React, { useState, useEffect, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';

import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';

import axios from 'axios';

const ListdesEmployeurs = () => {
    const toast = useRef(null);

    const [employeur, setEmployeur] = useState([]);
    const [filters1, setFilters1] = useState(null);


    
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        email: '',
        adresse: '',  
        num_tel: '',     
    });

    const initFilters1 = () => {
        setFilters1({
            'nom': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'prenom': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'email': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'adresse': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'num_tel': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },

            
        });
    }

    const handleSubmit = async () => {
        try {
          
        
            // Make the POST request to the API
            const response = await axios.post('http://localhost:8080/api/employeur/Save', formData);
        
            // Handle success (you can display a success message here)
            console.log('Data saved:', response.data);
        
            // Update the users list or refresh the data after successful addition
            // You can refetch the data or update the users list in state here
        
            // Clear all input fields by resetting formData to its initial state
            setFormData({
                nom: '',
                prenom: '',
                email: '',
                adresse:'',
                num_tel:'',

              
            });
          
        
            // Show success toast
            toast.current.show({ severity: 'success', summary: 'Success', detail: 'Employeur added successfully.' });
            // Fetch the updated list of users from the API
        fetch('http://localhost:8080/api/employeur/All')
        .then(response => response.json())
        .then(data => {
            setEmployeur(data);
            console.log(data);
            initFilters1();
        })
        .catch(error => {
            console.error('Error fetching employeurs:', error);
        });
        } catch (error) {
            // Handle error (you can display an error message here)
            console.error('Error saving data:', error);
            // Show error toast
            toast.current.show({ severity: 'error', summary: 'Error', detail: `Error saving data: ${error.message}` });
        }
    };
    useEffect(() => {
        fetch('http://localhost:8080/api/employeur/All')
            .then(response => response.json())
            .then(data => {
                setEmployeur(data);
                console.log(data);
                initFilters1();
            })
            .catch(error => {
                console.error('Error fetching employeurs:', error);
            });
    }, []);
    
    
 
    const deleteEmployeur = async (employeurId) => {
        try {
            const response = await axios.delete(`http://localhost:8080/api/employeur/${employeurId}`);
            console.log('Employeur deleted:', employeurId);
    
            // Update the users list or refresh the data after successful deletion
            // You can refetch the data or update the users list in state here
            const updatedEmployeur = employeur.filter(employeur => employeur.id !== employeurId);
            setEmployeur(updatedEmployeur);
    
            // Show success toast
            toast.current.show({ severity: 'success', summary: 'Success', detail: 'Employeur deleted successfully.' });
        } catch (error) {
            console.error('Error deleting employeur:', error);
            // Show error toast
            toast.current.show({ severity: 'error', summary: 'Error', detail: `Error deleting employeur: ${error.message}` });
        }
    };
    
    

    
   
    

    

   
    
    const operationBodyTemplate = (rowData) => {
        return (
            <div>
               
                <Button label="Supprimer" className="p-button-rounded p-button-danger" onClick={() => deleteEmployeur(rowData.id)} />
            </div>
        );
    };
    
    
    

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>Ajouter un Employeur</h5>
                    <div className="p-fluid formgrid grid">
                       
                        <div className="field col-12 md:col-6">
                            <label htmlFor="nom">Nom</label>
                            <InputText id="nom" type="text" value={formData.nom} onChange={(e) => setFormData({ ...formData, nom: e.target.value })} />
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="prenom">Prenom</label>
                            <InputText id="prenom" type="text" value={formData.prenom} onChange={(e) => setFormData({ ...formData, prenom: e.target.value })} />
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="email">E-mail</label>
                            <InputText id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="adresse">Adresse</label>
                            <InputText id="adresse" type="adresse" value={formData.adresse} onChange={(e) => setFormData({ ...formData, adresse: e.target.value })} />
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="num_tel">Num_Tel</label>
                            <InputText id="num_tel" type="text" value={formData.num_tel} onChange={(e) => setFormData({ ...formData, num_tel: e.target.value })} />
                        </div>
                       
                        <Button label="Submit" onClick={handleSubmit}></Button>
                    </div>
                </div>
            </div>
            <div className="col-12">
                <div className="card">
                    <h5>List des Employeurs</h5>
                    <DataTable value={employeur} paginator className="p-datatable-gridlines" showGridlines rows={10}
                        dataKey="id" filters={filters1} filterDisplay="menu"  responsiveLayout="scroll"
                          emptyMessage="No customers found.">
                        <Column field="nom" header="Nom" filter filterPlaceholder="Search by lastname" style={{ minWidth: '12rem' }} />
                        <Column field="prenom" header="Prenom" filter filterPlaceholder="Search by firstname" style={{ minWidth: '12rem' }} />
                        <Column field="email" header="Email" filter filterPlaceholder="Search by email" style={{ minWidth: '12rem' }} />
                        <Column field="adresse" header="Adresse" filter filterPlaceholder="Search by adresse" style={{ minWidth: '12rem' }} />
                        <Column field="num_tel" header="Num_Tel" filter filterPlaceholder="Search by num_tel" style={{ minWidth: '12rem' }} />
                        <Column header="Opération" body={operationBodyTemplate} style={{ minWidth: '10rem', textAlign: 'center' }} />
                    </DataTable>
                    <Toast ref={toast} />
                </div>
            </div>
        </div>
    );
}

export default ListdesEmployeurs;
