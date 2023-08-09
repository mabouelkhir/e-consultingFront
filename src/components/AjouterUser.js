import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { classNames } from 'primereact/utils';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';
import { Calendar } from 'primereact/calendar';
import { Column } from 'primereact/column';
import axios from 'axios';

const AjouterUser = () => {
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
    const verifiedBodyTemplate = (rowData) => {
        return <i className={classNames('pi', { 'text-green-500 pi-check-circle': rowData.accountVerified, 'text-pink-500 pi-times-circle': !rowData.accountVerified })}></i>;
    }

    const verifiedFilterTemplate = (options) => {
        return <TriStateCheckbox value={options.value} onChange={(e) => options.filterCallback(e.value)} />
    }

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
            const roleObject = dropdownItem ;
    
            // Set the role object in the formData
            const updatedFormData = { ...formData, role: roleObject };
            console.log(updatedFormData)

            // Make the POST request to the API
            const response = await axios.post('http://localhost:8080/api/auth/Save', updatedFormData);
    
            // Handle success (you can display a success message here)
            console.log('Data saved:', response.data);
            // Clear all input fields by resetting formData to its initial state
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                role: '', // Reset role to empty
                password: ''
            });
            setDropdownItem(''); // Reset dropdownItem
        } catch (error) {
            // Handle error (you can display an error message here)
            console.error('Error saving data:', error);
        }
    };
    
    

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>Ajouter un Utilisateur</h5>
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-6">
                            <label htmlFor="prenom">Prenom</label>
                            <InputText id="prenom" type="text" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="nom">Nom</label>
                            <InputText id="nom" type="text" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="email">E-mail</label>
                            <InputText id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="password">Password</label>
                            <InputText id="password" type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                        </div>
                        <div className="field col-12 md:col-3">
                            <label htmlFor="role">Role</label>
                            <Dropdown id="role" value={dropdownItem} onChange={(e) => {
        setDropdownItem(e.value);
        setFormData({ ...formData, role: [e.value] }); // Update the role in formData
    }} options={dropdownItems} optionLabel="name" placeholder="Select One" />
                        </div>
                        <Button label="Submit" onClick={handleSubmit}></Button>
                    </div>
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
                    </DataTable>
                </div>
            </div>
        </div>
    );
}

export default AjouterUser;
