import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Toast } from 'primereact/toast';
import { AutoComplete } from 'primereact/autocomplete';

export const AjouterPassport = () => {
    const toast = useRef(null);
    const [autoFilteredValue, setAutoFilteredValue] = useState([]);
    const [autoValue, setAutoValue] = useState([]);
    const [candidates, setCandidates] = useState([]);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [passports, setPassports] = useState([]);
    const [dialogFormData, setDialogFormData] = useState({
        code: '',
        date_validite: null,
    });
    const [isEditDialogVisible, setIsEditDialogVisible] = useState(false);
const [editDialogFormData, setEditDialogFormData] = useState({
    code: '',
    date_validite: null,
});
const [selectedPassportForEdit, setSelectedPassportForEdit] = useState(null);



    useEffect(() => {
        fetchCandidates();
        fetchPassports();
    }, []);
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


    const fetchCandidates = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/candidat/candidats/actifs');
            const formattedCandidats = response.data.map(candidat => ({
                ...candidat,
                fullName: `${candidat.prenom} ${candidat.nom}`,

            }));
            setAutoValue(formattedCandidats);
            setAutoFilteredValue([...formattedCandidats]);
            setCandidates(formattedCandidats);

            console.log(formattedCandidats);
        } catch (error) {
            console.error('Error fetching candidats:', error);
        }
    };

    const fetchPassports = async () => {
        try {
            const response = await axios.get('http://localhost:8080/passports/all');
            setPassports(response.data);
        } catch (error) {
            console.error('Error fetching passports:', error);
        }
    };
    const passportBodyTemplate = (rowData) => {
        return (
            <div>
                <p>Passport Code: {rowData.code}</p>
                <p>Date de validité: {formatDate(rowData.date_validite)}</p>
            </div>
        );
    };
    const getImageUrl = (candidatId) => {
        return `http://localhost:8080/api/images/candidat/${candidatId}/image`;
    };

    const imageBodyTemplate = (rowData) => {
        const imageUrl = getImageUrl(rowData.candidat.id);
        return <img src={imageUrl} alt="Candidat" style={{ width: '150px', height: 'auto' }} />;
    };
    const openEditDialog = (passport) => {
        setSelectedPassportForEdit(passport);
        setEditDialogFormData({
            code: passport.code,
            date_validite: new Date(passport.date_validite),
        });
        setIsEditDialogVisible(true);
    };
    
    const closeEditDialog = () => {
        setSelectedPassportForEdit(null);
        setIsEditDialogVisible(false);
    };
    
    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setEditDialogFormData({
            ...editDialogFormData,
            [name]: value,
        });
    };
    
    const handleUpdatePassport = async () => {
        try {
            if (selectedPassportForEdit && selectedPassportForEdit.id) {
                const { code, date_validite } = editDialogFormData;
                const payload = {
                    code,
                    date_validite,
                };
    
                const response = await axios.put(`http://localhost:8080/passports/${selectedPassportForEdit.id}/update`, payload);
    
                console.log('Passport updated successfully:', response.data);
    
                fetchPassports();
                closeEditDialog();
    
                toast.current.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Passport updated successfully.',
                });
            } else {
                console.error('No passport selected for edit.');
            }
        } catch (error) {
            console.error('Error updating passport:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Error updating passport.',
            });
        }
    };
    
    

    
    const actionsBodyTemplate = (rowData) => {
        const handleDelete = async () => {
            try {
                const response = await axios.delete(`http://localhost:8080/passports/${rowData.id}/delete`);
    
                console.log('Passport deleted successfully:', response.data);
    
                fetchPassports();
    
                toast.current.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Passport deleted successfully.',
                });
            } catch (error) {
                console.error('Error deleting passport:', error);
    
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Error deleting passport.',
                });
            }
        };
    
        return (
            <div>
                <Button
                    label="Supprimer Passport"
                    className="p-button-rounded p-button-danger"
                    onClick={handleDelete}
                />
                <Button
                label="Edit Passport"
                className="p-button-rounded p-button-primary"
                onClick={() => openEditDialog(rowData)}
            />
            </div>
        );
    };
    

    const handleAddPassport = async () => {
        try {
            if (selectedCandidate && selectedCandidate.id) {
                const { code, date_validite } = dialogFormData;
                const payload = {
                    code,
                    date_validite,
                };
    
                const response = await axios.post(`http://localhost:8080/passports/${selectedCandidate.id}/create`, payload);
    
                console.log('Passport added successfully:', response.data);
    
                setDialogFormData({
                    code: '',
                    date_validite: null,
                });
    
                fetchPassports();
    
                toast.current.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Passport added successfully.',
                });
            } else {
                console.error('No candidate selected.');
            }
        } catch (error) {
            console.error('Error adding passport:', error);
    
            if (error.response && error.response.data) {
                // Check if there's a custom error message from the server
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: error.response.data, // Display the custom error message
                });
            } else {
                // If there's no custom message, show a generic error message
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Error adding passport.',
                });
            }
        }
    };
    

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="grid p-fluid">
            <div className="col-12">
                <div className="card">
                    <h5>Ajouter Passport</h5>
                    <form>
                        <div className="p-fluid formgrid grid">
                            <div className="field col-12 md:col-6">
                                <label htmlFor="code">Code Passport</label>
                                <InputText
                                    id="code"
                                    type="text"
                                    value={dialogFormData.code}
                                    onChange={(e) => setDialogFormData({ ...dialogFormData, code: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="field col-12 md:col-6">
                                <label htmlFor="date_validite">Date de Validité</label>
                                <Calendar
                                    id="date_validite"
                                    showIcon
                                    showButtonBar
                                    value={dialogFormData.date_validite}
                                    onChange={(e) =>
                                        setDialogFormData({
                                            ...dialogFormData,
                                            date_validite: e.value,
                                        })
                                    }
                                    dateFormat="dd/mm/yy"
                                />
                            </div>
                            <div className="field col-12 md:col-6">
                                <label htmlFor="selectedCandidate">Sélectionner un Candidat</label>
                                <AutoComplete
                                    placeholder="Search"
                                    id="dd"
                                    dropdown
                                    value={selectedCandidate}
                                    onChange={(e) => setSelectedCandidate(e.value)}
                                    suggestions={autoFilteredValue}
                                    completeMethod={searchCountry}
                                    field="fullName"
                                    required
                                />
                            </div>
                            <Button
                                label="Ajouter"
                                type="button"
                                onClick={handleAddPassport}
                            />
                        </div>
                    </form>
                </div>
            </div>
            <div className="col-12">
                <div className="card">
                    <h5>Liste des Passports</h5>
                    <DataTable
                        value={passports}
                        paginator
                        className="p-datatable-gridlines"
                        showGridlines
                        rows={10}
                        dataKey="id"
                        emptyMessage="No passports found."
                    >
                        <Column header="Image" body={imageBodyTemplate} style={{ minWidth: '12rem', textAlign: 'center' }} />
                        <Column header="Nom" field="candidat.nom" />
                        <Column header="Prenom" field="candidat.prenom" />
                        <Column header="Cin" field="candidat.cin.code" />
                        <Column header="Passport" body={passportBodyTemplate} style={{ minWidth: '20rem' }} />
                        <Column header="Actions" body={actionsBodyTemplate} />

                    </DataTable>
                    <Toast ref={toast} />
                </div>
                <Dialog
    visible={isEditDialogVisible}
    onHide={closeEditDialog}
    header="Edit Passport"
>
    <div className="p-fluid formgrid grid">
        <div className="field col-12 md:col-6">
            <label htmlFor="code">Code Passport</label>
            <InputText
                id="code"
                type="text"
                name="code"
                value={editDialogFormData.code}
                onChange={handleEditFormChange}
                required
            />
        </div>
        <div className="field col-12 md:col-6">
            <label htmlFor="date_validite">Date de Validité</label>
            <Calendar
                id="date_validite"
                showIcon
                showButtonBar
                name="date_validite"
                value={editDialogFormData.date_validite}
                onChange={handleEditFormChange}
                dateFormat="dd/mm/yy"
            />
        </div>
    </div>
    <div className="p-dialog-footer">
        <Button
            label="Update"
            onClick={handleUpdatePassport}
        />
        <Button
            label="Cancel"
            onClick={closeEditDialog}
            className="p-button-secondary"
        />
    </div>
</Dialog>

            </div>
        </div>
    );
};
