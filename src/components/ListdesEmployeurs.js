import React, { useState, useEffect, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';

import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Dialog} from 'primereact/dialog';

import axios from 'axios';

const ListdesEmployeurs = () => {
    const toast = useRef(null);

    const [employeur, setEmployeur] = useState([]);
    const [filters1, setFilters1] = useState(null);
    const [selectedEmployeur,setSelectedEmployeur] = useState(null);
    const [prestations, setPrestations] = useState([]); // État pour stocker les prestations
  
   
    
    
    
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        email: '',
        adresse: '',  
        num_tel: '',     
        codeEmp:'',
        prestation:'',
        ref_contrat:''
    });

    const [updateDialogVisible, setUpdateDialogVisible] = useState(false);
    const [updateFormData, setUpdateFormData] = useState({
        email: '',
        adresse: '',
        num_tel: '',
        codeEmp:'',
      
        ref_contrat: ''
    });

    const showUpdateDialog = (employeur) => {
        setSelectedEmployeur(employeur);
        setUpdateFormData({
            email:employeur.email,
            adresse:employeur.adresse,
            num_tel:employeur.num_tel,
            codeEmp:employeur.codeEmp,
            ref_contrat:employeur.ref_contrat
          
        });
        setUpdateDialogVisible(true);
    };

    const hideUpdateDialog = () => {
        setUpdateDialogVisible(false);
    };
 
    

    const fetchEmployeurs = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/employeur/All');
            const updatedEmployeurs = response.data;
            setEmployeur(updatedEmployeurs);
            console.log('Employeurs updated successfully:', updatedEmployeurs);
        } catch (error) {
            console.error('Error fetching employeurs:', error);
        }
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
          const employeurId = selectedEmployeur.id;
      
          // Construct the payload for the update request
          const payload = {
            email:updateFormData.email,
            adresse:updateFormData.adresse,
            num_tel:updateFormData.num_tel,
            codeEmp:updateFormData.codeEmp,
            ref_contrat:updateFormData.ref_contrat

          };
      
          // Make the API call to update the dossier
          const response = await axios.put(`http://localhost:8080/api/employeur/${employeurId}/Update`, payload);
      
          console.log('Employeur updated successfully:', response.data);
      
          // Show success toast
          toast.current.show({
            severity: 'success',
            summary: 'Success',
            detail: 'Employeur updated successfully.',
          });
      
          // Close the update dialog
          hideUpdateDialog();
      
          // Refresh the dossier list
          fetchEmployeurs();
          
        } catch (error) {
          console.error('Error updating Employeur:', error);
      
          // Show error toast
          toast.current.show({
            severity: 'error',
            summary: 'Error',
            detail: `Error updating employeur: ${error.message}`,
          });
        }
      };

    const initFilters1 = () => {
        setFilters1({
            'nom': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'prenom': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'email': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'adresse': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'num_tel': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'codeEmp':{ operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'prestation':{ operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'ref_contrat':{ operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            

            
        });
    }

  
    useEffect(() => {
        fetch('http://localhost:8080/api/employeur/All')
            .then(response => response.json())
            .then(data => {
                setEmployeur(data);
                console.log('Employeurs:',data);
                initFilters1();
                console.log(employeur);
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
                 <Button label="Modifier" className="p-button-rounded p-button-primary" onClick={() => showUpdateDialog(rowData)} />
                <Button label="Supprimer" className="p-button-rounded p-button-danger" onClick={() => deleteEmployeur(rowData.id)} />
            </div>
        );
    };
   
    const renderUpdateDialog = () => {
        return (
          <Dialog
            visible={updateDialogVisible}
            onHide={hideUpdateDialog}
            header="Update Employeur"
            style={{ width: '50%' }}
          >
            <div>
              <div className="p-field">
                <label htmlFor="email">E-mail</label>
                <InputText
                  id="updateemail"
                  type="text"
                  name="email"
                  value={updateFormData.email}
                  onChange={handleUpdateFormChange}
                />
              </div>
              <div className="p-field">
                <label htmlFor="adresse">Adresse</label>
                <InputText
                  id="updateAdresse"
                  type="text"
                  name="adresse"
                  value={updateFormData.adresse}
                  onChange={handleUpdateFormChange}
                />
              </div>
              <div className="p-field">
                <label htmlFor="num_tel">Num_Tel</label>
                <InputText
                  id="updatenum_tel"
                  type="text"
                  name="num_tel"
                  value={updateFormData.num_tel}
                  onChange={handleUpdateFormChange}
                />
              </div>
              <div className="p-field">
                <label htmlFor="codeEmp">Code_Emp</label>
                <InputText
                  id="updatecodeEmp"
                  type="text"
                  name="codeEmp"
                  value={updateFormData.codeEmp}
                  onChange={handleUpdateFormChange}
                />
              </div>
              <div className="p-field">
                <label htmlFor="ref_contrat">Ref_Contrat</label>
                <InputText
                  id="updateref_contrat"
                  type="text"
                  name="ref_contrat"
                  value={updateFormData.ref_contrat}
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

    return(
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
                        <Column field="codeEmp" header="Code_Emp" filter filterPlaceholder="Search by code_emp" style={{ minWidth: '12rem' }} />
                       
                        <Column field="ref_contrat" header="Ref_contrat" filter filterPlaceholder="Search by ref_contrat" style={{ minWidth: '12rem' }} />
                        <Column header="Opération" body={operationBodyTemplate} style={{ minWidth: '10rem', textAlign: 'center' }} />


                    </DataTable>
                    <Toast ref={toast} />

                    
                    {renderUpdateDialog()}
                </div>
            </div>
        
    
    )
              
    
}

export default ListdesEmployeurs;
