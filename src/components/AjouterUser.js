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

import axios from 'axios';

const AjouterUser = () => {
    const toast = useRef(null);

    const [users, setUsers] = useState(null);
    const [filters1, setFilters1] = useState(null);


    const [dropdownItem, setDropdownItem] = useState(''); // Initialize as empty string
    const [dropdownItems, setDropdownItems] = useState([]);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        role: [dropdownItem], // Initialize role as an empty array
        password: ''
    });
    useEffect(() => {
        
        // Fetch roles from the API when the component mounts
        fetch('http://localhost:8080/api/role/All')
            .then(response => response.json())
            .then(data => {
                setDropdownItems(data);
                console.log(data);
            })
            .catch(error => {
                console.error('Error fetching roles:', error);
            });
    }, []);
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
    const toggleActivation = async (userId, activate) => {
        try {
            const action = activate ? 'activer' : 'desactiver';
            const response = await axios.put(`http://localhost:8080/api/auth/${userId}/${action}`);
            console.log(`${action} response:`, response.data);
    
            // Update the users list or refresh the data after successful operation
            // You can refetch the data or update the users list in state here
            const updatedUsers = users.map(user => {
                if (user.id === userId) {
                    return { ...user, accountVerified: activate };
                }
                return user;
            });
            setUsers(updatedUsers);
    
            // Show success toast
            toast.current.show({ severity: 'success', summary: 'Success', detail: `${action} user successful.` });
        } catch (error) {
            console.error('Error toggling activation:', error);
            // Show error toast
            toast.current.show({ severity: 'error', summary: 'Error', detail: `Error toggling activation: ${error.message}` });
        }
    };
    
    const deleteUser = async (userId) => {
        try {
            const response = await axios.delete(`http://localhost:8080/api/auth/${userId}`);
            console.log('Delete response:', response.data);
    
            // Update the users list or refresh the data after successful deletion
            // You can refetch the data or update the users list in state here
            const updatedUsers = users.filter(user => user.id !== userId);
            setUsers(updatedUsers);
    
            // Show success toast
            toast.current.show({ severity: 'success', summary: 'Success', detail: 'User deleted successfully.' });
        } catch (error) {
            console.error('Error deleting user:', error);
            // Show error toast
            toast.current.show({ severity: 'error', summary: 'Error', detail: `Error deleting user: ${error.message}` });
        }
    };
    
    

    const dateFilterTemplate = (options) => {
        return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />
    }
    const verifiedBodyTemplate = (rowData) => {
        return <i className={classNames('pi', { 'text-green-500 pi-check-circle': rowData.accountVerified, 'text-pink-500 pi-times-circle': !rowData.accountVerified })}></i>;
    }

    const verifiedFilterTemplate = (options) => {
        return <TriStateCheckbox value={options.value} onChange={(e) => options.filterCallback(e.value)} />
    }

    
    useEffect(() => {
        // Fetch roles from the API when the component mounts
        fetch('http://localhost:8080/api/auth/All')
            .then(response => response.json())
            .then(data => {
                setUsers(data);
                console.log(data);
                initFilters1();
            })
            .catch(error => {
                console.error('Error fetching roles:', error);
            });
    }, []);
    

    const initFilters1 = () => {
        setFilters1({
            'firstName': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'lastName': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'email': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'createdAt': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
            'role': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
            'accountVerified': { value: null, matchMode: FilterMatchMode.EQUALS }
        });
    }

    const handleSubmit = async () => {
        try {
            // Create the role object with the selected value
            const roleObject = dropdownItem;
        
            // Set the role object in the formData
            const updatedFormData = { ...formData, role: roleObject };
        
            // Make the POST request to the API
            const response = await axios.post('http://localhost:8080/api/auth/Save', updatedFormData);
        
            // Handle success (you can display a success message here)
            console.log('Data saved:', response.data);
        
            // Update the users list or refresh the data after successful addition
            // You can refetch the data or update the users list in state here
        
            // Clear all input fields by resetting formData to its initial state
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                role: '', // Reset role to empty
                password: ''
            });
            setDropdownItem(''); // Reset dropdownItem
        
            // Show success toast
            toast.current.show({ severity: 'success', summary: 'Success', detail: 'User added successfully.' });
            // Fetch the updated list of users from the API
        fetch('http://localhost:8080/api/auth/All')
        .then(response => response.json())
        .then(data => {
            setUsers(data);
            console.log(data);
            initFilters1();
        })
        .catch(error => {
            console.error('Error fetching users:', error);
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
                <Button label={rowData.accountVerified ? 'Désactiver' : 'Activer'} className={classNames('p-button-rounded', { 'p-button-success': !rowData.accountVerified, 'p-button-info': rowData.accountVerified })} onClick={() => toggleActivation(rowData.id, !rowData.accountVerified)} />
                <Button label="Supprimer" className="p-button-rounded p-button-danger" onClick={() => deleteUser(rowData.id)} />
            </div>
        );
    };
    
    
    

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>Ajouter un Utilisateur</h5>
                    <form onSubmit={handleSubmit}>

                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-6">
                            <label htmlFor="prenom">Prenom</label>
                            <InputText id="prenom" type="text" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} required/>
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="nom">Nom</label>
                            <InputText id="nom" type="text" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} required/>
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="email">E-mail</label>
                            <InputText id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required/>
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="password">Password</label>
                            <InputText id="password" type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required/>
                        </div>
                        <div className="field col-12 md:col-3">
                            <label htmlFor="role">Role</label>
                            <Dropdown id="role" value={dropdownItem} onChange={(e) => {
        setDropdownItem(e.value);
        setFormData({ ...formData, role: [e.value] }); // Update the role in formData
    }} options={dropdownItems} optionLabel="name" placeholder="Select One" />
                        </div>
                        <Button label="Submit" type="submit"></Button>
                    </div>
                    </form>
                </div>
            </div>
            <div className="col-12">
                <div className="card">
                    <h5>List des Utilisateurs</h5>
                    <DataTable value={users} paginator className="p-datatable-gridlines" showGridlines rows={10}
                        dataKey="id" filters={filters1} filterDisplay="menu"  responsiveLayout="scroll"
                          emptyMessage="No customers found.">
                        <Column field="lastName" header="Nom" filter filterPlaceholder="Search by lastname" style={{ minWidth: '12rem' }} />
                        <Column field="firstName" header="Prenom" filter filterPlaceholder="Search by firstname" style={{ minWidth: '12rem' }} />
                        <Column field="email" header="Email" filter filterPlaceholder="Search by email" style={{ minWidth: '12rem' }} />
                        <Column header="Date de Creation" field="createdAt" filterField="createdAt" dataType="date" style={{ minWidth: '10rem' }} body={dateBodyTemplate}
                            filter filterElement={dateFilterTemplate} />
                        <Column field="role" header="Role" filter filterPlaceholder="Search by name" style={{ minWidth: '12rem' }} body={(rowData) => rowData.role.name} />
                        <Column field="accountVerified" header="Activation" dataType="boolean" bodyClassName="text-center" style={{ minWidth: '8rem' }} body={verifiedBodyTemplate} filter filterElement={verifiedFilterTemplate} />
                        <Column header="Opération" body={operationBodyTemplate} style={{ minWidth: '10rem', textAlign: 'center' }} />
                    </DataTable>
                    <Toast ref={toast} />
                </div>
            </div>
        </div>
    );
}

export default AjouterUser;
