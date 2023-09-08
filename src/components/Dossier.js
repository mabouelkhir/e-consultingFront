import React, { useState, useEffect, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { classNames } from 'primereact/utils';
import { AutoComplete } from 'primereact/autocomplete';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputSwitch } from 'primereact/inputswitch';
import { MultiSelect } from 'primereact/multiselect';
import { DataTable } from 'primereact/datatable';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';
import { Calendar } from 'primereact/calendar';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';

import axios from 'axios';

const Dossier = () => {
    const toast = useRef(null);

    const [dossiers, setDossiers] = useState(null);
    const [filters1, setFilters1] = useState(null);
    const [autoFilteredValue, setAutoFilteredValue] = useState([]);
    const [autoValue, setAutoValue] = useState([]);
    const [switchValue, setSwitchValue] = useState(false);
    const [selectedCandidat, setSelectedCandidat] = useState(null);
    const [candidats, setCandidats] = useState([]);
    const [displayDialog, setDisplayDialog] = useState(false);
    const [selectedDossier, setSelectedDossier] = useState(null);
    const [dossierPieceChanges, setDossierPieceChanges] = useState({});
    const [formData, setFormData] = useState({
        numeroDossier: '',
        status: '',
        note: '',

    });
    const [updateDialogVisible, setUpdateDialogVisible] = useState(false);
    const [updateFormData, setUpdateFormData] = useState({
        numeroDossier: '',
        status: '',
        note: '',
    });

    const showUpdateDialog = (dossier) => {
        setSelectedDossier(dossier);
        setUpdateFormData({
            numeroDossier: dossier.numeroDossier,
            status: dossier.status,
            note: dossier.note,
        });
        setUpdateDialogVisible(true);
    };

    const hideUpdateDialog = () => {
        setUpdateDialogVisible(false);
    };
    // Function to handle changes in the update form fields
const handleUpdateFormChange = (e) => {
    const { name, value } = e.target;
    setUpdateFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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
    useEffect(() => {
        fetchDossiers();
        fetchCandidats();

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
    const dateBodyTemplate = (rowData) => {
        return formatDate(rowData.date_creation);
    }
    const formatDate = (value) => {
        if (value) {
            const date = new Date(value); // Convert the string value to a Date object


            return date.toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            });
        }
        return ''; // Return an empty string or other default value if value is null or undefined
    }


    const deleteUser = async (dossierId) => {
        try {
            const response = await axios.delete(`http://localhost:8080/api/dossier/${dossierId}/delete`);
            console.log('Delete response:', response.data);
            // Show success toast
            toast.current.show({ severity: 'success', summary: 'Success', detail: 'Dossier deleted successfully.' });
            fetchDossiers();
        } catch (error) {
            console.error('Error deleting dossier:', error);
            // Show error toast
            toast.current.show({ severity: 'error', summary: 'Error', detail: `Error deleting dossier: ${error.message}` });
        }
    };




    const dateFilterTemplate = (options) => {
        return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />
    }



    const fetchDossiers = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/dossier/All');
            setDossiers(response.data);
        } catch (error) {
            console.error('Error fetching candidats:', error);
        }
    };

    const handleSubmit = async () => {
        // Assuming you have the ID of the selected candidat in selectedCandidat.id
        if (selectedCandidat && selectedCandidat.id) {
            const payload = {
                numeroDossier: formData.numeroDossier,
                status: formData.status,
                note: formData.note
            };

            try {
                // Step 1: Create the dossier
                const createResponse = await axios.post(`http://localhost:8080/api/dossier/${selectedCandidat.id}/add`, payload);
                const createdDossierId = createResponse.data.id; // Assuming your API returns the created dossier's ID

                // Step 2: Link pieces to the newly created dossier
                const linkResponse = await axios.post(`http://localhost:8080/api/dossier/${createdDossierId}`, {
                    // Provide the necessary data to link the pieces here
                    // For example, you can pass an array of piece IDs or any required data
                    // Replace 'link-pieces' with the actual endpoint to link pieces
                });

                console.log('Dossier added successfully:', createResponse.data);
                console.log('Pieces linked successfully:', linkResponse.data);

                // Clear the form fields after successful submission
                setFormData({
                    numeroDossier: '',
                    status: '',
                    note: ''
                });

                // Show success toast
                toast.current.show({ severity: 'success', summary: 'Success', detail: 'Dossier added successfully.' });
                fetchDossiers();
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


    // Function to handle the submission of the update form
const handleUpdateFormSubmit = async () => {
  try {
    // Assuming you have the ID of the selected dossier in selectedDossier.id
    const dossierId = selectedDossier.id;

    // Construct the payload for the update request
    const payload = {
      numeroDossier: updateFormData.numeroDossier,
      status: updateFormData.status,
      note: updateFormData.note,
    };

    // Make the API call to update the dossier
    const response = await axios.put(`http://localhost:8080/api/dossier/${dossierId}/update`, payload);

    console.log('Dossier updated successfully:', response.data);

    // Show success toast
    toast.current.show({
      severity: 'success',
      summary: 'Success',
      detail: 'Dossier updated successfully.',
    });

    // Close the update dialog
    hideUpdateDialog();

    // Refresh the dossier list
    fetchDossiers();
  } catch (error) {
    console.error('Error updating dossier:', error);

    // Show error toast
    toast.current.show({
      severity: 'error',
      summary: 'Error',
      detail: `Error updating dossier: ${error.message}`,
    });
  }
};



    const representativeBodyTemplate = (rowData) => {
        const representative = rowData.candidat;
        const imageUrl = getImageUrl(representative.id);

        return (
            <React.Fragment>
                <img alt={representative.fullName} src={imageUrl} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} width={32} style={{ verticalAlign: 'middle' }} />
                <span style={{ marginLeft: '.5em', verticalAlign: 'middle' }} className="image-text">{representative.nom + ' ' + representative.prenom}</span>
            </React.Fragment>
        );
    }
    const representativeFilterTemplate = (options) => {
        return (<>
            <div className="mb-3 text-bold">Candidat Picker</div>
            <MultiSelect value={options.value} options={candidats} itemTemplate={representativesItemTemplate} onChange={(e) => options.filterCallback(e.value)} optionLabel="name" placeholder="Any" className="p-column-filter" />
        </>
        )
    }
    const getImageUrl = (candidatId) => {
        return `http://localhost:8080/api/images/candidat/${candidatId}/image`;
    };
    const representativesItemTemplate = (option) => {
        const imageUrl = getImageUrl(option.id);

        return (
            <div className="p-multiselect-representative-option">
                <img alt={option.fullName} src={imageUrl} width={32} style={{ verticalAlign: 'middle' }} />
                <span style={{ marginLeft: '.5em', verticalAlign: 'middle' }} className="image-text">{option.nom + ' ' + option.prenom}</span>
            </div>
        );
    }


    const operationBodyTemplate = (rowData) => {
        return (
            <div>
                <Button label="Supprimer" className="p-button-rounded p-button-danger" onClick={() => deleteUser(rowData.id)} />
                <Button
                    label="Voir dossier"
                    className="p-button-rounded p-button-info"
                    onClick={() => showDossierDialog(rowData)}
                />
                <Button
        label="Update"
        className="p-button-rounded p-button-primary"
        onClick={() => showUpdateDialog(rowData)}
      />
            </div>
        );
    };
    // Function to show the dialog for a dossier
    const showDossierDialog = (dossier) => {
        setSelectedDossier(dossier);
        setDisplayDialog(true);
    };
    // Function to update a piece in the dossier
    const updateDossierPiece = async (dossierPieceId) => {
        try {
            const dossierPiece = selectedDossier.dossierPieces.find(
                (dp) => dp.id === dossierPieceId
            );

            if (!dossierPiece) {
                console.warn('No dossier piece found for ID:', dossierPieceId);
                return;
            }

            const changes = dossierPieceChanges[dossierPiece.id];
            if (!changes) {
                console.warn('No changes found for dossier piece:', dossierPiece.id);
                return;
            }

            const { note, delivered } = changes;

            const payload = {
                note,
                delivered,
            };

            const dossierId = selectedDossier.id;

            const response = await axios.put(
                `http://localhost:8080/api/dossier/${dossierId}/dossier/${dossierPiece.piece.id}/update`,
                payload
            );

            console.log('Piece updated successfully:', response.data);

            // Show success toast
            toast.current.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Piece updated successfully.',
            });

            // Update the dossiers state to reflect the changes
            fetchDossiers();
        } catch (error) {
            console.error('Error updating piece:', error);

            // Show error toast
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: `Error updating piece: ${error.message}`,
            });
        }
    };


    // Function to update the changes in the state when the input fields change
    const handleNoteChange = (dossierPieceId, newValue) => {
        setDossierPieceChanges((prevChanges) => ({
            ...prevChanges,
            [dossierPieceId]: {
                ...prevChanges[dossierPieceId],
                note: newValue,
            },
        }));
    };

    const handleDeliveredChange = (dossierPieceId, newValue) => {
        console.log(dossierPieceId)
        setDossierPieceChanges((prevChanges) => {
            const updatedChanges = {
                ...prevChanges,
                [dossierPieceId]: {
                    ...prevChanges[dossierPieceId],
                    delivered: newValue,
                },
            };

            console.log('Updated dossierPieceChanges:', updatedChanges);

            return updatedChanges;
        });
    };

    const renderUpdateDialog = () => {
        return (
          <Dialog
            visible={updateDialogVisible}
            onHide={hideUpdateDialog}
            header="Update Dossier"
            style={{ width: '50%' }}
          >
            <div>
              <div className="p-field">
                <label htmlFor="updateNumeroDossier">Numero de dossier</label>
                <InputText
                  id="updateNumeroDossier"
                  type="text"
                  name="numeroDossier"
                  value={updateFormData.numeroDossier}
                  onChange={handleUpdateFormChange}
                />
              </div>
              <div className="p-field">
                <label htmlFor="updateStatus">Status</label>
                <InputText
                  id="updateStatus"
                  type="text"
                  name="status"
                  value={updateFormData.status}
                  onChange={handleUpdateFormChange}
                />
              </div>
              <div className="p-field">
                <label htmlFor="updateNote">Note</label>
                <InputText
                  id="updateNote"
                  type="text"
                  name="note"
                  value={updateFormData.note}
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
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>Ajouter un Dossier</h5>
                    <form onSubmit={handleSubmit}>

                        <div className="p-fluid formgrid grid">
                            <div className="field col-12 md:col-6">
                                <label htmlFor="numeroDossier">Numero de dossier</label>
                                <InputText id="numeroDossier" type="text" value={formData.numeroDossier} onChange={(e) => setFormData({ ...formData, numeroDossier: e.target.value })} required />
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
                                <label htmlFor="status">Status</label>
                                <InputText id="status" type="text" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} required />
                            </div>
                            <div className="field col-12 md:col-6">
                                <label htmlFor="note">Note</label>
                                <InputText id="note" type="text" value={formData.note} onChange={(e) => setFormData({ ...formData, note: e.target.value })} required />
                            </div>

                            <Button label="Submit" type="submit"></Button>
                        </div>
                    </form>

                </div>
            </div>
            <div className="col-12">
                <div className="card">
                    <h5>List des Dossiers</h5>
                    <DataTable value={dossiers} paginator className="p-datatable-gridlines" showGridlines rows={10}
                        dataKey="id" filters={filters1} filterDisplay="menu" responsiveLayout="scroll"
                        emptyMessage="No customers found.">
                        <Column field="numeroDossier" header="Numero dossier" filter filterPlaceholder="Search by lastname" style={{ minWidth: '12rem' }} />
                        <Column header="Candidat" filterField="representative" showFilterMatchModes={false} filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '14rem' }} body={representativeBodyTemplate}
                            filter filterElement={representativeFilterTemplate} />
                        <Column field="status" header="Status" filter filterPlaceholder="Search by email" style={{ minWidth: '12rem' }} />
                        <Column field="note" header="Note" filter filterPlaceholder="Search by email" style={{ minWidth: '12rem' }} />
                        <Column header="Date de Creation" field="date_creation" filterField="date_creation" dataType="date" style={{ minWidth: '9rem' }} body={dateBodyTemplate}
                            filter filterElement={dateFilterTemplate} />
                        <Column header="Opération" body={operationBodyTemplate} style={{ minWidth: '10rem', textAlign: 'center' }} />
                    </DataTable>
                    <Toast ref={toast} />
                </div>
            </div>
            <Dialog
                visible={displayDialog}
                onHide={() => setDisplayDialog(false)}
                header="Dossier Details"
                style={{ width: '80%' }}
            >
                {selectedDossier && (
                    <div>
                        <h5>Numero de Dossier: {selectedDossier.numeroDossier}</h5>
                        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                            {selectedDossier.dossierPieces.map((dossierPiece) => (
                                <div key={dossierPiece.id} style={{ width: '50%', padding: '10px' }}>
                                    <div className="p-field">
                                        <div className="p-formgrid">
                                            <tr>
                                                <td>
                                                    <label>Nom du Piece : </label>
                                                </td>
                                                <td>
                                                    <label><strong>{dossierPiece.piece.nom_piece}</strong></label>
                                                </td>
                                            </tr>

                                            <tr>
                                                <td>
                                                    <label>Delivered:</label>
                                                </td>
                                                <td>
                                                    <InputSwitch
                                                        checked={dossierPieceChanges[dossierPiece.id]?.delivered ?? dossierPiece.delivered}
                                                        onChange={(e) =>
                                                            handleDeliveredChange(
                                                                dossierPiece.id,
                                                                e.value
                                                            )
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <label>Note : </label>
                                                </td>
                                                <td>
                                                    <InputText
                                                        value={
                                                            dossierPieceChanges[dossierPiece.id]?.note ?? dossierPiece.note
                                                        }
                                                        onChange={(e) =>
                                                            handleNoteChange(
                                                                dossierPiece.id,
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <Button
                                                    label="Update"
                                                    onClick={() => updateDossierPiece(dossierPiece.id)}
                                                />
                                            </tr>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </Dialog>
            {renderUpdateDialog()}


        </div>
    );
}

export default Dossier;