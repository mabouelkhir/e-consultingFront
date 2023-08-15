import React, { useState, useEffect, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';

import axios from 'axios';

const AjouterUser = () => {
    const toast = useRef(null);

    const [fonctions, setFonctions] = useState(null);
    const [editingFunctionId, setEditingFunctionId] = useState(null); // New state for tracking editing status
    const [newFunctionName, setNewFunctionName] = useState('');
    const [filters1, setFilters1] = useState(null);
    const [formData, setFormData] = useState({
        nom_fonction: ''
    });
    useEffect(() => {
        
        // Fetch roles from the API when the component mounts
        fetch('http://localhost:8080/api/fonction/All')
            .then(response => response.json())
            .then(data => {
                setFonctions(data);
                console.log(data);
            })
            .catch(error => {
                console.error('Error fetching fonctions:', error);
            });
    }, []);
    const updateFunction = async (fonctionId) => {
        try {
            const response = await axios.put(`http://localhost:8080/api/fonction/${fonctionId}/update`, {
                nom_fonction: newFunctionName
            });
            console.log('Update response:', response.data);

            // Update the function name in the list
            const updatedFunctions = fonctions.map((fonction) => {
                if (fonction.id === fonctionId) {
                    return { ...fonction, nom_fonction: newFunctionName };
                }
                return fonction;
            });
            setFonctions(updatedFunctions);

            // Reset editing status and new name
            setEditingFunctionId(null);
            setNewFunctionName('');

            // Show success toast
            toast.current.show({ severity: 'success', summary: 'Success', detail: 'Fonction updated successfully.' });
        } catch (error) {
            console.error('Error updating Fonction:', error);
            // Show error toast
            toast.current.show({ severity: 'error', summary: 'Error', detail: `Error updating Fonction: ${error.message}` });
        }
    };

    
    
    
    
    const deleteUser = async (fonctionId) => {
        try {
            const response = await axios.delete(`http://localhost:8080/api/fonction/${fonctionId}`);
            console.log('Delete response:', response.data);
    
            // Update the users list or refresh the data after successful deletion
            // You can refetch the data or update the users list in state here
            const updatedFunctions = fonctions.filter(fonction => fonction.id !== fonctionId);
            setFonctions(updatedFunctions);
    
            // Show success toast
            toast.current.show({ severity: 'success', summary: 'Success', detail: 'Fonction deleted successfully.' });
        } catch (error) {
            console.error('Error deleting user:', error);
            // Show error toast
            toast.current.show({ severity: 'error', summary: 'Error', detail: `Error deleting Fonction: ${error.message}` });
        }
    };
    
    

    

    
    useEffect(() => {
        // Fetch roles from the API when the component mounts
        fetch('http://localhost:8080/api/fonction/All')
            .then(response => response.json())
            .then(data => {
                setFonctions(data);
                console.log(data);
                initFilters1();
            })
            .catch(error => {
                console.error('Error fetching roles:', error);
            });
    }, []);
    

    const initFilters1 = () => {
        setFilters1({
            'nom_fonction': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        });
    }

    const handleSubmit = async () => {
        try {
            
            // Make the POST request to the API
            const response = await axios.post('http://localhost:8080/api/fonction/Save', formData);
        
            // Handle success (you can display a success message here)
            console.log('Data saved:', response.data);
        
           
        
            // Clear all input fields by resetting formData to its initial state
            setFormData({
                nom_fonction: '',
                
            });
        
            // Show success toast
            toast.current.show({ severity: 'success', summary: 'Success', detail: 'Fonction added successfully.' });
            // Fetch the updated list of users from the API
        fetch('http://localhost:8080/api/fonction/All')
        .then(response => response.json())
        .then(data => {
            setFonctions(data);
            console.log(data);
            initFilters1();
        })
        .catch(error => {
            console.error('Error fetching fonctions:', error);
        });
        } catch (error) {
            // Handle error (you can display an error message here)
            console.error('Error saving data:', error);
            // Show error toast
            toast.current.show({ severity: 'error', summary: 'Error', detail: `Error saving data: ${error.message}` });
        }
    };
    
    
    const operationBodyTemplate = (rowData) => {
        return (
            <div>
                {editingFunctionId === rowData.id ? (
                    <div>
                        <InputText
                            value={newFunctionName}
                            onChange={(e) => setNewFunctionName(e.target.value)}
                        />
                        <Button
                            label="Update"
                            className="p-button-rounded p-button-primary"
                            onClick={() => updateFunction(rowData.id)}
                        />
                    </div>
                ) : (
                    <Button
                        label="Edit"
                        className="p-button-rounded p-button-success"
                        onClick={() => setEditingFunctionId(rowData.id)}
                    />
                )}
                <Button
                    label="Delete"
                    className="p-button-rounded p-button-danger"
                    onClick={() => deleteUser(rowData.id)}
                />
            </div>
        );
    };
    
    
    

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>Ajouter une fonction</h5>
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-6">
                            <label htmlFor="nom_fonction">nom</label>
                            <InputText id="nom_fonction" type="text" value={formData.nom_fonction} onChange={(e) => setFormData({ ...formData, nom_fonction: e.target.value })} />
                        </div>

                        <Button label="Submit" onClick={handleSubmit}></Button>
                    </div>
                </div>
            </div>
            <div className="col-12">
                <div className="card">
                    <h5>List des Fonctions</h5>
                    <DataTable value={fonctions} paginator className="p-datatable-gridlines" showGridlines rows={10}
                        dataKey="id" filters={filters1} filterDisplay="menu"  responsiveLayout="scroll"
                          emptyMessage="No customers found.">
                        <Column field="nom_fonction" header="Nom" filter filterPlaceholder="Search by name" style={{ minWidth: '12rem' }} />
                        <Column header="Opération" body={operationBodyTemplate} style={{ minWidth: '10rem', textAlign: 'center' }} />
                    </DataTable>
                    <Toast ref={toast} />
                </div>
            </div>
        </div>
    );
}

export default AjouterUser;
