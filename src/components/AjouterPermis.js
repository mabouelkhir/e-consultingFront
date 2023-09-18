import React, { useEffect, useState, useRef } from 'react';
import axios from "axios";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { AutoComplete } from 'primereact/autocomplete';



export const AjouterPermis = () => {
    const toast = useRef(null);
    const [autoFilteredValue, setAutoFilteredValue] = useState([]);
    const [autoValue, setAutoValue] = useState([]);
    const [candidats, setCandidats] = useState([]);
    const [selectedCandidat, setSelectedCandidat] = useState(null);
    const [permis, setPermis] = useState([]);
    const [selectedPermis, setSelectedPermis] = useState(null);
    const [selectedPermisCategorie, setSelectedPermisCategorie] = useState(null);
    const [permisCategorie, setPermisCategorie] = useState([]);
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const [dialogFormData, setDialogFormData] = useState({
        categorie: '',
        date_delivrance: '',
    });
    const [isUpdateDialogVisible, setIsUpdateDialogVisible] = useState(false);
    const [updateDialogFormData, setUpdateDialogFormData] = useState({
        code: '',
        date_validite: null,
        permisID: null, // To store the selected permis ID
    });

    const [categoryOptions] = useState(['AM', 'A1', 'A', 'B', 'C', 'D', 'EB', 'EC', 'ED']); // Dropdown options

    const [formData, setFormData] = useState({
        code: '',
        date_validite: '',
    });

    useEffect(() => {
        fetchCandidats();
        fetchPermis();
        fetchPermisCategorie();
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

    const fetchCandidats = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/candidat/candidats/actifs');
            const formattedCandidats = response.data.map(candidat => ({
                ...candidat,
                fullName: `${candidat.prenom} ${candidat.nom}`,

            }));
            setAutoValue(formattedCandidats);
            setAutoFilteredValue([...formattedCandidats]);
            setCandidats(formattedCandidats);

            console.log(formattedCandidats);
        } catch (error) {
            console.error('Error fetching candidats:', error);
        }
    };
    const fetchPermis = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/permis/All');
            setPermis(response.data);
        } catch (error) {
            console.error('Error fetching candidats:', error);
        }
    };
    const fetchPermisCategorie = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/permis/permisCategorie/All');
            setPermisCategorie(response.data);
        } catch (error) {
            console.error('Error fetching candidats:', error);
        }
    };
    const openDialog = () => {
        setIsDialogVisible(true);
    };
    const closeDialog = () => {
        setIsDialogVisible(false);
    };
    const handleDialogFormChange = (e) => {
        const { name, value } = e.target;
        setDialogFormData({
            ...dialogFormData,
            [name]: value,
        });
    };
    const handleAddCategorie = async () => {
        try {
            // Construct the payload
            const payload = {
                categorie: dialogFormData.categorie,
                date_delivrance: dialogFormData.date_delivrance,
            };

            // Send a POST request to add the category
            const response = await axios.post(
                `http://localhost:8080/api/permis/${selectedPermis.id}/ajouterCategorie`,
                payload
            );

            console.log('Category added successfully:', response.data);

            // Clear the dialog form
            setDialogFormData({
                categorie: '',
                date_delivrance: '',
            });

            fetchPermis();
            fetchPermisCategorie(); // Add this line to update Permis Categorie data


            // Close the dialog
            closeDialog();

            // Refresh the permit data
        } catch (error) {
            console.error('Error adding category:', error);
        }
    };


    const handleAjouterPermis = (permit) => {
        setSelectedPermis(permit);
        openDialog(); // Open the dialog
    };

    const getImageUrl = (candidatId) => {
        return `http://localhost:8080/api/images/candidat/${candidatId}/image`;
    };

    const imageBodyTemplate = (rowData) => {
        const imageUrl = getImageUrl(rowData.candidat.id);
        return <img src={imageUrl} alt="Candidat" style={{ width: '150px', height: 'auto' }} />;
    };


    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const permisBodyTemplate = (rowData) => {
        return (
            <div>
                <p>Permis Code : {rowData.code}</p>
                <p>Date de validité : {formatDate(rowData.date_validite)}</p>

                <ul>
                    {permisCategorie
                        .filter((categorie) => categorie.permis.id === rowData.id)
                        .map((categorie) => (
                            <li key={categorie.id}>
                                Catégorie: {categorie.categorie}, Date de Délivrance: {formatDate(categorie.date_delivrance)}
                                <Button
                                    icon="pi pi-times"
                                    className="p-button-rounded p-button-danger p-button-text"
                                    onClick={() => handleRemoveCategorie(categorie.id)}
                                />
                            </li>
                        ))}
                </ul>
            </div>
        );
    };
    const handleRemoveCategorie = async (permisCategorieID) => {
        try {
            // Send a DELETE request to remove the Permis Categorie
            const response = await axios.delete(`http://localhost:8080/api/permis/deletePermisCategorie/${permisCategorieID}`);

            console.log('Category removed successfully:', response.data);

            // Refresh the permit data after removing the category
            fetchPermis();
            fetchPermisCategorie(); // Add this line to update Permis Categorie data


            // Show a success toast
            toast.current.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Permis Categorie removed successfully.',
            });
        } catch (error) {
            console.error('Error removing category:', error);

            // Show an error toast
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Error removing Permis Categorie.',
            });
        }
    };
    const openUpdateDialog = (permis) => {
        setUpdateDialogFormData({
            code: permis.code,
            date_validite: new Date(permis.date_validite),
            permisID: permis.id,
        });
        setIsUpdateDialogVisible(true);
    };
    const handleUpdateDialogFormChange = (e) => {
        const { name, value } = e.target;
        setUpdateDialogFormData({
            ...updateDialogFormData,
            [name]: value,
        });
    };

    const handleUpdatePermis = async () => {
        try {
            const { code, date_validite, permisID } = updateDialogFormData;
            const payload = {
                code,
                date_validite,
            };

            // Send a PUT request to update the permis
            const response = await axios.put(
                `http://localhost:8080/api/permis/updatePermis/${permisID}`,
                payload
            );

            console.log('Permis updated successfully:', response.data);

            // Close the update dialog
            setIsUpdateDialogVisible(false);

            // Refresh the permit data
            fetchPermis();

            // Show a success toast
            toast.current.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Permis updated successfully.',
            });
        } catch (error) {
            console.error('Error updating permis:', error);

            // Show an error toast
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Error updating permis.',
            });
        }
    };


    const actionsBodyTemplate = (rowData) => {
        return (
            <div>
                <Button
                    label="Ajouter Catégorie"
                    className="p-button-rounded p-button-success"
                    onClick={() => handleAjouterPermis(rowData)}
                />
                <Button
                    label="Modifier Permis"
                    className="p-button-rounded p-button-primary"
                    onClick={() => openUpdateDialog(rowData)} // Open the update dialog
                />
            </div>
        );
    };

    const handleSubmit = async () => {
        // Assuming you have the ID of the selected candidat in selectedCandidat.id
        if (selectedCandidat && selectedCandidat.id) {
            const payload = {
                code: formData.code,
                date_validite: formData.date_validite,
            };

            try {
                // Step 1: Create the dossier
                const createResponse = await axios.post(`http://localhost:8080/api/permis/${selectedCandidat.id}/AddPermis`, payload);


                console.log('Permis added successfully:', createResponse.data);

                // Clear the form fields after successful submission
                setFormData({
                    code: '',
                    date_validite: '',
                });

                // Show success toast
                toast.current.show({ severity: 'success', summary: 'Success', detail: 'Dossier added successfully.' });
                fetchPermis();
            } catch (error) {
                console.error('Error adding dossier or linking pieces:', error);
                // Show error toast
                toast.current.show({ severity: 'error', summary: 'Error', detail: `Error adding dossier or linking pieces: ${error.message}` });
            }
        } else {
            // Handle the case where no candidat is selected
            // You may show an error message or take other appropriate actions
        }
    };
    // Filter the available subfonctions based on the selected function

    return (
        <div className="grid p-fluid">
            <div className="col-12">
                <div className="card">
                    <h5>Ajouter Permis au Candidat</h5>
                    <form onSubmit={handleSubmit}>

                        <div className="p-fluid formgrid grid">
                            <div className="field col-12 md:col-6">
                                <label htmlFor="numeroDossier">Numero de Permis</label>
                                <InputText id="numeroDossier" type="text" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} required />
                            </div>
                            <div className="field col-12 md:col-6">
                                <label htmlFor="nom">Candidat</label>
                                <AutoComplete
                                    placeholder="Search"
                                    id="dd"
                                    dropdown
                                    value={selectedCandidat}
                                    onChange={(e) => setSelectedCandidat(e.value)}
                                    suggestions={autoFilteredValue}
                                    completeMethod={searchCountry}
                                    field="fullName"
                                    required
                                />
                            </div>
                            <div className="field col-12 md:col-6">
                                <label htmlFor='date_validite'>Date de Validité</label>
                                <Calendar
                                    id="datevalidite"
                                    showIcon
                                    showButtonBar
                                    value={formData.date_validite ? new Date(formData.date_validite) : null}
                                    onChange={(e) => setFormData({ ...formData, date_validite: e.value })}
                                    dateFormat="dd/mm/yy"
                                />
                            </div>


                            <Button label="Submit" type="submit"></Button>
                        </div>
                    </form>

                </div>
            </div>
            <div className="col-12">
                <div className="card">
                    <h5>Liste des permis</h5>
                    <DataTable
                        value={permis}
                        paginator
                        className="p-datatable-gridlines"
                        showGridlines
                        rows={10}
                        dataKey="id"
                        emptyMessage="No candidats found."
                    >
                        <Column header="Image" body={imageBodyTemplate} style={{ minWidth: '12rem', textAlign: 'center' }} />
                        <Column header="Nom" field="candidat.nom" />
                        <Column header="Prenom" field="candidat.prenom" />
                        <Column header="Cin" field="candidat.cin.code" />
                        <Column header="Permis" body={permisBodyTemplate} style={{ minWidth: '35rem' }} />
                        <Column header="Actions" body={actionsBodyTemplate} />
                    </DataTable>
                    <Toast ref={toast} />

                </div>
            </div>
            <Dialog
                visible={isDialogVisible}
                header="Ajouter Catégorie"
                modal
                onHide={closeDialog}
            >
                <div className="p-grid p-fluid">
                    <div className="p-field col-12">
                        <label htmlFor="categorie">Catégorie</label>
                        <Dropdown
                            id="categorie"
                            name="categorie"
                            value={dialogFormData.categorie}
                            options={categoryOptions}
                            onChange={handleDialogFormChange}
                            placeholder="Sélectionnez une catégorie"
                            required
                        />
                    </div>
                    <div className="p-field col-12">
                        <label htmlFor="date_delivrance">Date de Délivrance</label>
                        <Calendar
                            id="date_delivrance"
                            name="date_delivrance"
                            value={dialogFormData.date_delivrance}
                            onChange={handleDialogFormChange}
                            dateFormat="dd/mm/yy"
                            showIcon
                            showButtonBar
                        />
                    </div>
                    <div className="p-dialog-footer">
                        <Button label="Ajouter" onClick={handleAddCategorie} />
                        <Button label="Annuler" onClick={closeDialog} className="p-button-text" />
                    </div>
                </div>
            </Dialog>

            <Dialog
                visible={isUpdateDialogVisible}
                header="Modifier Permis"
                modal
                onHide={() => setIsUpdateDialogVisible(false)}
            >
                <div className="p-grid p-fluid">
                    <div className="p-field col-12">
                        <label htmlFor="updateCode">Code</label>
                        <InputText
                            id="updateCode"
                            name="code"
                            value={updateDialogFormData.code}
                            onChange={handleUpdateDialogFormChange}
                        />
                    </div>
                    <div className="p-field col-12">
                        <label htmlFor="updateDateValidite">Date de Validité</label>
                        <Calendar
                            id="updateDateValidite"
                            name="date_validite"
                            value={updateDialogFormData.date_validite}
                            onChange={handleUpdateDialogFormChange}
                            dateFormat="dd/mm/yy"
                            showIcon
                            showButtonBar
                        />
                    </div>
                    <div className="p-dialog-footer">
                        <Button label="Update" onClick={handleUpdatePermis} />
                        <Button label="Annuler" onClick={() => setIsUpdateDialogVisible(false)} className="p-button-text" />
                    </div>
                </div>
            </Dialog>

        </div>
    );
}
