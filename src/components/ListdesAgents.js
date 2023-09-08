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

const ListdesAgents = () => {
    const toast = useRef(null);

    const [agents, setagents] = useState([]);
    const [filters1, setFilters1] = useState(null);
    const [selectedAgent,setSelectedAgent] = useState(null);
  
   
    
    
    
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        email: '',
        adresse: '',  
        tel: ''   
     
    });

    const [updateDialogVisible, setUpdateDialogVisible] = useState(false);
    const [updateFormData, setUpdateFormData] = useState({
        email: '',
        adresse: '',
        tel: ''
      
    });

    const showUpdateDialog = (agents) => {
        setSelectedAgent(agents);
        setUpdateFormData({
            email:agents.email,
            adresse:agents.adresse,
            tel:agents.tel,
           
          
        });
        setUpdateDialogVisible(true);
    };

    const hideUpdateDialog = () => {
        setUpdateDialogVisible(false);
    };
 
    

    const fetchAgents = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/agent/All');
            const updatedAgents = response.data;
            setagents(updatedAgents);
            console.log('Agents updated successfully:', updatedAgents);
        } catch (error) {
            console.error('Error fetching agents:', error);
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
          const agentId = selectedAgent.id;
      
          // Construct the payload for the update request
          const payload = {
            email:updateFormData.email,
            adresse:updateFormData.adresse,
            tel:updateFormData.tel,
           

          };
      
          // Make the API call to update the dossier
          const response = await axios.put(`http://localhost:8080/api/agent/${agentId}/Update`, payload);
      
          console.log('Agent updated successfully:', response.data);
      
          // Show success toast
          toast.current.show({
            severity: 'success',
            summary: 'Success',
            detail: 'Agents updated successfully.',
          });
      
          // Close the update dialog
          hideUpdateDialog();
      
          // Refresh the dossier list
          fetchAgents();
          
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
            'tel': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
             

            
        });
    }

  
    useEffect(() => {
        fetch('http://localhost:8080/api/agent/All')
            .then(response => response.json())
            .then(data => {
                setagents(data);
                console.log('Agent:',data);
                initFilters1();
                console.log(agents);
            })
            .catch(error => {
                console.error('Error fetching agents:', error);
            });
    }, []);
    
    
 
    const deleteAgent= async (agentId) => {
        try {
            const response = await axios.delete(`http://localhost:8080/api/agent/${agentId}`);
            console.log('agent deleted:', agentId);
    
            // Update the users list or refresh the data after successful deletion
            // You can refetch the data or update the users list in state here
            const updatedAgents = agents.filter(agents => agents.id !== agentId);
            setagents(updatedAgents);
    
            // Show success toast
            toast.current.show({ severity: 'success', summary: 'Success', detail: 'Agent deleted successfully.' });
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
                <Button label="Supprimer" className="p-button-rounded p-button-danger" onClick={() => deleteAgent(rowData.id)} />
            </div>
        );
    };
   
    const renderUpdateDialog = () => {
        return (
          <Dialog
            visible={updateDialogVisible}
            onHide={hideUpdateDialog}
            header="Update Agent"
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
                <label htmlFor="tel">Tel</label>
                <InputText
                  id="updatetel"
                  type="text"
                  name="tel"
                  value={updateFormData.tel}
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
                    <h5>List des Agents</h5>
                    <DataTable value={agents} paginator className="p-datatable-gridlines" showGridlines rows={10}
                        dataKey="id" filters={filters1} filterDisplay="menu"  responsiveLayout="scroll"
                          emptyMessage="No customers found.">
                        <Column field="nom" header="Nom" filter filterPlaceholder="Search by lastname" style={{ minWidth: '12rem' }} />
                        <Column field="prenom" header="Prenom" filter filterPlaceholder="Search by firstname" style={{ minWidth: '12rem' }} />
                        <Column field="email" header="Email" filter filterPlaceholder="Search by email" style={{ minWidth: '12rem' }} />
                        <Column field="adresse" header="Adresse" filter filterPlaceholder="Search by adresse" style={{ minWidth: '12rem' }} />
                        <Column field="tel" header="Tel" filter filterPlaceholder="Search by num_tel" style={{ minWidth: '12rem' }} />
                        
                        <Column header="Opération" body={operationBodyTemplate} style={{ minWidth: '10rem', textAlign: 'center' }} />


                    </DataTable>
                    <Toast ref={toast} />

                    
                    {renderUpdateDialog()}
                </div>
            </div>
        
    
    )
              
    
}

export default ListdesAgents;
