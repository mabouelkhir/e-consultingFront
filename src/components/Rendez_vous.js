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
import { Dialog} from 'primereact/dialog';


const Rendez_vous = () =>{

    const [autoValue, setAutoValue] = useState([]);
    const [selectedAutoValue, setSelectedAutoValue] = useState(null);
    const [autoFilteredValue, setAutoFilteredValue] = useState([]);
    const [submitButtonLabel, setSubmitButtonLabel] = useState("Soumettre");
    const [filters1, setFilters1] = useState([]);
    const [SelectedRendez_vous,setSelectedRendez_vous] = useState(null);
    const [selectedCandidat,setSelectedCandidat] = useState(null);
    const toast = useRef(null);
    const [rendez_vous, setRendez_vous] = useState([]);

    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        titre:'',
        description:'',
        date_entretien:'',
        status: ''
      
    });
    

    const initFilters1 = () => {
        setFilters1({
            'nom': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'prenom': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'titre':{ operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'description':{ operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'date_entretien': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS}] },
            'status': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]}
        });
    };

    const fetchTableData = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/rendez_vous/All');
            setRendez_vous(response.data);
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

   
   

      
         
   const handleSubmit = async () => {
  try {
    console.log('Valeur de selectedCandidat:', selectedCandidat);

    if (!selectedCandidat) {
      // Gérer le cas où aucun candidat n'est sélectionné
      console.error('Aucun candidat sélectionné.');
      return;
    }

    const payload = {
      titre: formData.titre,
      description: formData.description,
      date_entretien: formData.date_entretien,
      status: formData.status,
      CandidatId: selectedCandidat.id, // Ajout de l'ID du candidat au payload
    };

    const response = await axios.post(`http://localhost:8080/api/rendez_vous/Save/${selectedCandidat.id}`, payload);
    
    console.log('Réponse du serveur:', response.data);

    setFormData({
      titre: '',
      description: '',
      date_entretien: '',
      status: ''
    });

    fetchTableData();

    if (toast.current) {
      // Afficher le toast de succès.
      toast.current.show({ severity: 'success', summary: 'Success', detail: 'Data saved successfully!' });
    }
  } catch (error) {
    if (toast.current) {
      // Afficher le toast d'erreur.
      toast.current.show({ severity: 'error', summary: 'Error', detail: `Error: ${error.message}` });
    }
  }
};


      const deleteRendez_vous = async (rendez_vousId) => {
      try {
        const response = await axios.delete(`http://localhost:8080/api/rendez_vous/${rendez_vousId}`);
        console.log('Reglement deleted:', rendez_vousId);

        // Update the users list or refresh the data after successful deletion
        // You can refetch the data or update the users list in state here
        const updatedRendez_vous = rendez_vous.filter(rendez_vous=> rendez_vous.id !== rendez_vousId);
        setRendez_vous(updatedRendez_vous);
         if (toast.current) {
        // Afficher le toast de succès.
        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Rendez_vous deleted successfully.' });
    }
} catch (error) {
    console.error('Error deleting Rendez_vous:', error);
        // Show success toast
        if (toast.current) {
            // Afficher le toast d'erreur.
            toast.current.show({ severity: 'error', summary: 'Error', detail: `Error deleting rendes_vous: ${error.message}` });
        } else {
            console.error('Toast reference is null.');
        }
        
    }};
    const dateBodyTemplate = (rowData) => {
        return formatDate(rowData.date_entretien);
    }
    const formatDate = (value) => {
        if (value) {
            const date_entretien = new Date(value); // Convert the string value to a Date object
    
            return date_entretien.toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            });
        }
        return ''; }

        const [updateDialogVisible, setUpdateDialogVisible] = useState(false);
    const [updateFormData, setUpdateFormData] = useState({
        nom: '',
        prenom: '',
        titre: '',
        description:'',
        date_entretien:'',
        status:''
      
    });

    const showUpdateDialog = (rendez_vous) => {
        setSelectedRendez_vous(rendez_vous);
        setUpdateFormData({
            nom:rendez_vous.nom,
            prenom:rendez_vous.prenom,
            titre:rendez_vous.titre,
            description:rendez_vous.description,
            date_entretien:rendez_vous.date_entretien,
            status:rendez_vous.status
           
        });
        setUpdateDialogVisible(true);
    };

    const hideUpdateDialog = () => {
        setUpdateDialogVisible(false);
    };
    
    const handleUpdateFormChange = (e) => {
        const { name, value } = e.target;
        setUpdateFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      };

      const handleUpdateFormSubmit = async () => {
        try {
          // Assuming you have the ID of the selected dossier in selectedDossier.id
          const rendez_vousId = SelectedRendez_vous.id;
      
          // Construct the payload for the update request
          const payload = {
            nom:updateFormData.nom,
            prenom:updateFormData.prenom,
            titre:updateFormData.titre,
            description:updateFormData.description,
            date_entretien:updateFormData.date_entretien,
            status:updateFormData.status
          };
      
          // Make the API call to update the dossier
          const response = await axios.put(`http://localhost:8080/api/rendez_vous/${rendez_vousId}/Update`, payload);
      
          console.log('Rendez_vous updated successfully:', response.data);
      
          // Show success toast
          toast.current.show({
            severity: 'success',
            summary: 'Success',
            detail: 'Agents updated successfully.',
          });
      
          // Close the update dialog
          hideUpdateDialog();
      
          // Refresh the dossier list
          fetchTableData();
          
        } catch (error) {
          console.error('Error updating Employeur:', error);
      
          // Show error toast
          toast.current.show({
            severity: 'error',
            summary: 'Error',
            detail: `Error updating employeur: ${error.message}`,
          });
        }
      }

      const operationBodyTemplate = (rowData) => {
        return (
            <div>
                 <Button label="Modifier" className="p-button-rounded p-button-primary" onClick={() => showUpdateDialog(rowData)} />
                <Button label="Supprimer" className="p-button-rounded p-button-danger" onClick={() => deleteRendez_vous(rowData.id)} />
            </div>
        );
    };

  
 const renderUpdateDialog = () => {
        return (
          <Dialog
            visible={updateDialogVisible}
            onHide={hideUpdateDialog}
            header="Update Rendez_vous"
            style={{ width: '50%' }}
          >
            <div>
              <div className="p-field">
                <label htmlFor="nom">Nom</label>
                <InputText
                  id="updatenom"
                  type="text"
                  name="nom"
                  value={updateFormData.nom}
                  onChange={handleUpdateFormChange}
                />
              </div>
              <div className="p-field">
                <label htmlFor="prenom">Prenom</label>
                <InputText
                  id="updateprenom"
                  type="text"
                  name="prenom"
                  value={updateFormData.prenom}
                  onChange={handleUpdateFormChange}
                />
              </div>
              <div className="p-field">
                <label htmlFor="titre">Titre</label>
                <InputText
                  id="updatetitre"
                  type="text"
                  name="titre"
                  value={updateFormData.titre}
                  onChange={handleUpdateFormChange}
                />
              </div>
              <div className="p-field">
                <label htmlFor="description">Description</label>
                <InputText
                  id="updatedescription"
                  type="text"
                  name="description"
                  value={updateFormData.description}
                  onChange={handleUpdateFormChange}
                />
              </div>
              <div className="p-field">
                <label htmlFor="date_entretien">Date_entretien</label>
                <InputText
                  id="updatedate_entretien"
                  type="text"
                  name="date_entretien"
                  value={updateFormData.date_entretien}
                  onChange={handleUpdateFormChange}
                />
              </div>
              <div className="p-field">
                <label htmlFor="status">Status</label>
                <InputText
                  id="updatestatus"
                  type="text"
                  name="status"
                  value={updateFormData.status}
                  onChange={handleUpdateFormChange}
                />
              </div>


              
              <Button
                label="Update"
                onClick={handleUpdateFormSubmit}
              />
            </div>
          </Dialog>
        );
      };    


      return (

        <div className="col-12">
            <div className="card">
            <form onSubmit={handleSubmit}>
            
            <h5>Ajouter un Rendez_vous</h5>
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
                            <label htmlFor="titre">Titre</label>
                            <InputText id="titre" type="titre" value={formData.titre} onChange={(e) => setFormData({ ...formData, titre: e.target.value })} />
                        </div>
                        <Calendar
  id="date_entretien" value={formData.date_entretien} onChange={(e) => setFormData({ ...formData, date_entretien: e.value })} // Utilisez e.value pour obtenir la valeur de la date
showIcon
/>

                        <div className="field col-12 md:col-6">
                            <label htmlFor="description">Description</label>
                            <InputText id="description" type="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="status">Status</label>
                            <InputText id="status" type="status" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} />
                        </div>
                        

                        
                        <Button label={submitButtonLabel} type="submit"/>
                       
                
                 </div>
                 </div>
                         </form>
                         <div className="col-12">
                <div className="card">
                    <h5>List des Rendez_vous</h5>
                    <DataTable value={rendez_vous} paginator className="p-datatable-gridlines" showGridlines rows={10}
                        dataKey="id"  filterDisplay="menu"  responsiveLayout="scroll"
                          emptyMessage="No customers found.">
                        <Column field="candidat.nom" header="Nom" filter filterPlaceholder="Search by nom" style={{ minWidth: '12rem' }} />
                        <Column field="candidat.prenom" header="Prenom" filter filterPlaceholder="Search by prenom" style={{ minWidth: '12rem' }} />
                        <Column field="titre" header="Titre" filterPlaceholder="Search by titre" style={{ minWidth: '12rem' }} />
                        <Column field="description" header="Description" filter filterPlaceholder="Search by description" style={{ minWidth: '12rem' }} />

                        <Column field="date_entretien" header="Date_entretien" filterField="date_entretien" dataType="date_entretien" style={{ minWidth: '12rem' }} body={dateBodyTemplate}
                            />
                      <Column field="status" header="Status" filter filterPlaceholder="Search by status" style={{ minWidth: '12rem' }} />
                      
                        <Column header="Opération" body={operationBodyTemplate} style={{ minWidth: '12rem', textAlign: 'center' }} />
                        
                    </DataTable>
                    <Toast ref={toast} />
                    {renderUpdateDialog()}
                   
                    
                </div>
                         
                         </div>
                        </div>
                        </div>
                        
                    
              
            
                    
                    
               
    );
    
    

}
export default Rendez_vous;