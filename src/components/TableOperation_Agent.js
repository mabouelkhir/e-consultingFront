import React, { useState, useEffect, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { classNames } from 'primereact/utils';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';
import { Calendar } from 'primereact/calendar';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { AutoComplete } from 'primereact/autocomplete';

import axios from 'axios';

const TableOperation_Agent = () => {
    const toast = useRef(null);

    const [TableOperation_Agent, setTableOperation_Agent] = useState(null);
    const[operation_agent,setoperation_agent]= useState(null);
    const [filters1, setFilters1] = useState(null);
    const [autoValue, setAutoValue] = useState([]);
    const [selectedAutoValue, setSelectedAutoValue] = useState(null);
    const [autoFilteredValue, setAutoFilteredValue] = useState([]);
    const [selectedCandidat, setSelectedCandidat] = useState(null);

    const [dropdownItem, setDropdownItem] = useState(''); // Initialize as empty string
    const [dropdownItems, setDropdownItems] = useState([]);

    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        montant: '',
        operation_agent: [dropdownItem] // Initialize role as an empty array
        
    });
    
    const fetchTableRoles = async () => {
        try {
          const response = await fetch('http://localhost:8080/api/Operation_Agent/All');
          const data = await response.json();
          console.log('options : ', data);
          setDropdownItems(data);
  
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
    const fetchTableData = async () => {
        try {
          const response = await fetch('http://localhost:8080/api/TableOperation_Agent/All');
          const data = await response.json();
          console.log('Data from API:', data);
          setTableOperation_Agent(data);
          initFilters1(); // Assuming initFilters1 is defined somewhere
  
        } catch (error) {
          console.error('Error fetching data:', error);
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
    
    
   

    const initFilters1 = () => {
        setFilters1({
            'nom': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'prenom': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'montant': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH}] },
            'operation_agent': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] }
           
        });
    }
    
    
  useEffect(() => {
    fetchTableData();
    fetchTableRoles();
    fetchCandidats();
    initFilters1();
  }, []);
    
    const deleteTableOperation_Agent = async (tableoperation_agentId) => {
        try {
            const response = await axios.delete(`http://localhost:8080/api/TableOperation_Agent/${tableoperation_agentId}`);
            console.log('Delete response:', response.data);
    
            // Update the users list or refresh the data after successful deletion
            // You can refetch the data or update the users list in state here
            const updatedTableOperation_Agent = TableOperation_Agent.filter(TableOperation_Agent => TableOperation_Agent.id !== tableoperation_agentId);
            setTableOperation_Agent(updatedTableOperation_Agent);
    
            // Show success toast
            toast.current.show({ severity: 'success', summary: 'Success', detail: 'User deleted successfully.' });
        } catch (error) {
            console.error('Error deleting user:', error);
            // Show error toast
            toast.current.show({ severity: 'error', summary: 'Error', detail: `Error deleting user: ${error.message}` });
        }
    };

    const handleSubmit = async () => {
        try {
            // Create the role object with the selected value
            const operation_agentObject = dropdownItem;
            console.log("operation_agentObject");
            console.log(operation_agentObject);
        
            // Set the role object in the formData
            const updatedFormData = { ...formData, operation_agent: operation_agentObject };
            console.log('Valeur de selectedCandidat :', selectedCandidat);
        
            // Make the POST request to the API
            const response = await axios.post(`http://localhost:8080/api/TableOperation_Agent/Save/candidat/${selectedCandidat.id}`, updatedFormData);
      
        
            // Handle success (you can display a success message here)
            console.log('Data saved:', response.data);
        
           
            // Show success toast
            toast.current.show({ severity: 'success', summary: 'Success', detail: 'User added successfully.' });

            // Fetch the updated list of users from the API
        fetchTableData();
        setFormData({
            nom: '',
            prenom: '',
            montant: '',
            operation_agent: '' // Reset role to empty
           
        });
        setDropdownItem(''); 
       
            toast.current.show({ severity: 'success', summary: 'Success', detail: 'User added successfully.' });
        }catch(error){
        console.error('Error saving data:', error);

        // Affichez un toast d'erreur
        toast.current.show({  severity: 'success', summary: 'Success', detail: 'User added successfully.' });
    }
    };
    
    
    
    
    
    const operationBodyTemplate = (rowData) => {
        return (
            <div>
               
                <Button label="Supprimer" className="p-button-rounded p-button-danger" onClick={() => deleteTableOperation_Agent(rowData.id)} />
            </div>
        );
    };
    
    
    

    return (
        <div className="grid">
            <div className="col-12">
          
                <div className="card">
                <form onSubmit={handleSubmit}>
                    <h5>Ajouter un Operation Agent</h5>
                    <div className="p-fluid formgrid grid">
                    <div className="field col-12 md:col-6">
                    <h5>Candidat</h5>
                            <AutoComplete
                                placeholder="Search"
                                id="dd"
                                value={selectedCandidat}
                                onChange={(e) => setSelectedCandidat(e.value)}
                                suggestions={autoFilteredValue}
                                completeMethod={searchCountry}
                                field="fullName"
                            />
                        <div className="field col-12 md:col-6">
                            <label htmlFor="montant">Montant</label>
                            <InputText id="montant" type="montant" value={formData.montant} onChange={(e) => setFormData({ ...formData, montant: e.target.value })} />
                        </div>
                        <div className="field col-12 md:col-3">
                            <label htmlFor="operation_agent">Operation_Agent</label>
                            <Dropdown id="operation_agent" value={dropdownItem} onChange={(e) => {setDropdownItem(e.value); setFormData({ ...formData, operation_agent: [e.value] }); // Update the role in formData
    }} options={dropdownItems} optionLabel="name" placeholder="Select One" />
                        </div>
                        <Button label="Rechercher" type="submit" />
                    </div>
                    </div>
                    </form>
                </div>
            </div>
            <div className="col-12">
                <div className="card">
                    <h5>List des Operation_Agents</h5>
                    <DataTable value={TableOperation_Agent} paginator className="p-datatable-gridlines" showGridlines rows={10}
                        dataKey="id"  filterDisplay="menu"  responsiveLayout="scroll"
                          emptyMessage="No customers found.">
                        <Column field="candidat.nom" header="Nom" filter filterPlaceholder="Search by nom" style={{ minWidth: '12rem' }} />
                        <Column field="candidat.prenom" header="Prenom" filter filterPlaceholder="Search by prenom" style={{ minWidth: '12rem' }} />
                      <Column field="montant" header="Montant" filter filterPlaceholder="Search by montant" style={{ minWidth: '12rem' }} />
                        <Column field="operation_agent" header="Operation_Agent" filter filterPlaceholder="Search by operation_agent" style={{ minWidth: '12rem' }} body={(rowData) => rowData.operation_agent.name} />
                        <Column header="Opération" body={operationBodyTemplate} style={{ minWidth: '10rem', textAlign: 'center' }} />
                    </DataTable>
                    <Toast ref={toast} />
                </div>
            </div>
        </div>
    );
}

export default TableOperation_Agent;
