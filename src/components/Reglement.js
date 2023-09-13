import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { AutoComplete } from 'primereact/autocomplete';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Calendar } from 'primereact/calendar';







const Reglement = () => {
    const [autoValue, setAutoValue] = useState([]);
    const [selectedAutoValue, setSelectedAutoValue] = useState(null);
    const [autoFilteredValue, setAutoFilteredValue] = useState([]);
    const [selectedCandidat, setSelectedCandidat] = useState(null);
    const [Reglement, setReglement] = useState([]);
    const [filters1, setFilters1] = useState([]);
    const [editedReglementId, setEditedReglementId] = useState(null);
    const [submitButtonLabel, setSubmitButtonLabel] = useState("Soumettre");


    const toast = useRef(null);
  

    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        type_reglement:'',
        date_reglement:'',
        montant: '',
        ref_contrat:''
    });

    
    const initFilters1 = () => {
        setFilters1({
            'nom': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'prenom': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'type_reglement':{ operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'date_reglement':{ operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
            'montant': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH}] },
            'ref_contrat': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]}
        });
    };

    const fetchTableData = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/reglement/All');
            setReglement(response.data);
            console.log('fetchTableData called successfully'); 
        } catch (error) {
            console.error('Error fetching reglements:', error);
        }
    };

    

    const fetchCandidats = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/candidat/candidats/actifs');
            const formattedCandidats = response.data.map(candidat => ({
                ...candidat,
                fullName: `${candidat.prenom} ${candidat.nom}`,
            
            }));
            console.log('Valeur de autoValue :', formattedCandidats); // Ajoutez cette ligne

            setAutoValue(formattedCandidats);
            setAutoFilteredValue([...formattedCandidats]);
            console.log('fetchCandidats called successfully'); 
        } catch (error) {
            console.error('Error fetching candidats:', error);
        }
    };
    const searchCountry = (event) => {
        setTimeout(() => {
            if (!event.query.trim().length) {
                setAutoFilteredValue([...autoValue]);
            } else {
                setAutoFilteredValue(
                    autoValue.filter((candidat) =>
                        candidat.fullName.toLowerCase().includes(event.query.toLowerCase())
                    )
                );
            }
        }, 250);
    };

    useEffect(() => {
        fetchCandidats();
        fetchTableData();
        initFilters1();
    }, []);

   
    const handleSubmit = async (e, operation) => {
        e.preventDefault();
    
        try {
            let response;
            let successMessage = '';
    
            console.log('Valeur de selectedCandidat :', selectedCandidat);
    
                // Create a payload object with the required data
                const payload = {
                    type_reglement: formData.type_reglement,
                    date_reglement: formData.date_reglement,
                    montant: formData.montant,
                    ref_contrat: formData.ref_contrat,}
                
                    // Check if selectedCandidat is not null
                    
                if (selectedCandidat) {
                    // Add candidatId to the payload
                    
                    payload.candidatId = selectedCandidat.id;
                    if (editedReglementId) {

                         // Effectuer l'opération de mise à jour
                response = await axios.put(`http://localhost:8080/api/reglement/${editedReglementId}/Update`, payload);
                successMessage = 'Données mises à jour avec succès!';
                setEditedReglementId(null);
                setSubmitButtonLabel("Soumettre");
                    }else{
                // Effectuer d'abord l'opération de sauvegarde.
                response = await axios.post(`http://localhost:8080/api/reglement/Save/candidat/${payload.candidatId}`, payload);
                successMessage = 'Data saved successfully!';
                    }
                setFormData({
                    type_reglement: '',
                    date_reglement: '',
                    montant: '',
                    ref_contrat: ''
                });
                fetchTableData();
                console.log("Save operation called successfully:");

            } 
            console.log(successMessage);
            if (toast.current) {
                // Afficher le toast de succès.
                toast.current.show({ severity: 'success', summary: 'Success', detail: successMessage });
            }
        } catch (error) {
            if (toast.current) {
                // Afficher le toast d'erreur.
                toast.current.show({ severity: 'error', summary: 'Error', detail: `Error: ${error.message}` });
            }
        }
    };
    


    
    
    const operationBodyTemplate = (rowData) => {
        return (
            <div>
                <Button label="Edit" className="p-button-rounded p-button-info" onClick={() => editReglement(rowData)} />
                <Button label="Supprimer" className="p-button-rounded p-button-danger" onClick={() => deleteReglement(rowData.id)} />

            </div>
        );
    };
    const editReglement = (rowData) => {
        // Mettez à jour le formulaire avec les données de la ligne sélectionnée
        setFormData({
            type_reglement: rowData.type_reglement,
            date_reglement: rowData.date_reglement,
            montant: rowData.montant,
            ref_contrat: rowData.ref_contrat,
        });
    
        // Mettez à jour le candidat sélectionné
        setSelectedCandidat(rowData.candidat);
    
        // Stockez l'ID du règlement en cours de modification
        setEditedReglementId(rowData.id);
    
        // Changez le libellé du bouton en "Modifier"
        setSubmitButtonLabel("Modifier");
    };
    
    const deleteReglement = async (reglementId) => {
        try {
            const response = await axios.delete(`http://localhost:8080/api/reglement/${reglementId}`);
            console.log('Reglement deleted:', reglementId);
    
            // Update the users list or refresh the data after successful deletion
            // You can refetch the data or update the users list in state here
            const updatedReglement = Reglement.filter(Reglement => Reglement.id !== reglementId);
            setReglement(updatedReglement);
             if (toast.current) {
            // Afficher le toast de succès.
            toast.current.show({ severity: 'success', summary: 'Success', detail: 'Employeur deleted successfully.' });
        }
    } catch (error) {
        console.error('Error deleting employeur:', error);
            // Show success toast
            if (toast.current) {
                // Afficher le toast d'erreur.
                toast.current.show({ severity: 'error', summary: 'Error', detail: `Error deleting employeur: ${error.message}` });
            } else {
                console.error('Toast reference is null.');
            }
            
        }};
    const dateBodyTemplate = (rowData) => {
        return formatDate(rowData.date_reglement);
    }
    const formatDate = (value) => {
        if (value) {
            const date_reglement = new Date(value); // Convert the string value to a Date object
    
            return date_reglement.toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            });
        }
        return ''; }

    return (

        <div className="col-12">
            <div className="card">
            <form onSubmit={handleSubmit}>
            <h5>Ajouter un Reglement</h5>
                    <div className="grid p-fluid">
                        <div className="col-12 md:col-6">
                            <h5>Candidat</h5>
                            <AutoComplete
                                placeholder="Search"
                                id="dd"
                                dropdown
                                value={selectedCandidat}
                                onChange={(e) => setSelectedCandidat(e.value)}
                                suggestions={autoFilteredValue}
                                completeMethod={searchCountry}
                                field="fullName"
                            />
                       
                        <div className="field col-12 md:col-6">
                            <label htmlFor="type_reglement">Type_reglement</label>
                            <InputText id="type_reglement" type="type_reglement" value={formData.type_reglement} onChange={(e) => setFormData({ ...formData, type_reglement: e.target.value })} />
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="date_reglement">Date_reglement</label>
                            <Calendar id="date_reglement"  value={formData.date_reglement} onChange={(e) => setFormData({ ...formData, date_reglement: e.target.value })} showIcon/>
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="montant">Montant</label>
                            <InputText id="montant" type="montant" value={formData.montant} onChange={(e) => setFormData({ ...formData, montant: e.target.value })} />
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="ref_contrat">Ref_contrat</label>
                            <InputText id="ref_contrat" type="ref_contrat" value={formData.ref_contrat} onChange={(e) => setFormData({ ...formData, ref_contrat: e.target.value })} />
                        </div>
                        

                        
                        <Button label={submitButtonLabel} type="submit"/>
                       
                
                 </div>
                 </div>
                         </form>
                         <div className="col-12">
                <div className="card">
                    <h5>List des Reglemnets</h5>
                    <DataTable value={Reglement} paginator className="p-datatable-gridlines" showGridlines rows={10}
                        dataKey="id"  filterDisplay="menu"  responsiveLayout="scroll"
                          emptyMessage="No customers found.">
                        <Column field="candidat.nom" header="Nom" filter filterPlaceholder="Search by nom" style={{ minWidth: '12rem' }} />
                        <Column field="candidat.prenom" header="Prenom" filter filterPlaceholder="Search by prenom" style={{ minWidth: '12rem' }} />
                        <Column field="type_reglement" header="Type_reglement" filterPlaceholder="Search by type_reglement" style={{ minWidth: '12rem' }} />
                         
                        <Column field="date_reglement" header="Date_reglement" filterField="date_reglement" dataType="date_reglement" style={{ minWidth: '12rem' }} body={dateBodyTemplate}
                            />
                      <Column field="montant" header="Montant" filter filterPlaceholder="Search by montant" style={{ minWidth: '12rem' }} />
                        <Column field="ref_contrat" header="Ref_contrat" filter filterPlaceholder="Search by Ref_contrat" style={{ minWidth: '12rem' }} />
                        <Column header="Opération" body={operationBodyTemplate} style={{ minWidth: '12rem', textAlign: 'center' }} />
                        <Toast ref={toast} />
                    </DataTable>
                    
                </div>
                         
                         </div>
                        </div>
                        </div>
                        
                    
              
            
                    
                    
               
    );
    
    
    }


export default Reglement;