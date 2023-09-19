import React, { useCallback, useEffect, useRef, useState } from 'react';
import axios from "axios";
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { DataTable } from 'primereact/datatable';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { RadioButton } from 'primereact/radiobutton';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { FileUpload } from 'primereact/fileupload';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Calendar } from 'primereact/calendar';



export const CandidatList = () => {
    const [candidats, setCandidats] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedCandidat, setSelectedCandidat] = useState(null);
    const [filters1, setFilters1] = useState(null);
    const fileUploadRef = useRef(null);
    const toast = useRef(null);

    useEffect(() => {
        fetchCandidats();
    }, []);

    const fetchCandidats = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/candidat/All');
            setCandidats(response.data);
            console.log(response.data);
            initFilters1();

        } catch (error) {
            console.error('Error fetching candidats:', error);
        }
    };
    const dateBodyTemplate = (rowData) => {
        return formatDate(rowData.createdAt);
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
    const dateFilterTemplate = (options) => {
        return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />
    }

    const initFilters1 = () => {
        setFilters1({
            'prenom': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'nom': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'email': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'createdAt': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
            'status': { value: null, matchMode: FilterMatchMode.EQUALS },
            'ref_contrat': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]}
        });
        
    }
    const getImageUrl = (candidatId) => {
        return `http://localhost:8080/api/images/candidat/${candidatId}/image`;
    };

    const imageBodyTemplate = (rowData) => {
        const imageUrl = getImageUrl(rowData.id);
        return <img src={imageUrl} alt="Candidat" style={{ width: '150px', height: 'auto' }} />;
    };
    
    const operationBodyTemplate = (rowData) => {
        const isActif = rowData.status === 'ACTIF';

        return (
            <div>
                <Button label={rowData.status=="ACTIF" ? 'Désactiver' : 'Activer'} className={classNames('p-button-rounded', { 'p-button-success': rowData.status=="INACTIF", 'p-button-info': rowData.status=="ACTIF" })} onClick={() => toggleActivation(rowData.id, rowData.status)} />
                <Button label="Supprimer" className="p-button-rounded p-button-danger" onClick={() => deleteUser(rowData.id)} />
                {isActif && (
                <Button
                    label="Completez le profil"
                    className="p-button-rounded p-button-warning"
                    onClick={() => continueCandidat(rowData)}
                />
            )}          
            </div>
        );
    };
    const verifiedBodyTemplate = (rowData) => {
        return <i className={classNames('pi', { 'text-green-500 pi-check-circle': rowData.status=="ACTIF", 'text-pink-500 pi-times-circle': rowData.status=="INACTIF" })}></i>;
    }

    const verifiedFilterTemplate = (options) => {
        console.log('Filter Value:', options.value);
        return <TriStateCheckbox value={options.value} onChange={(e) => options.filterCallback(e.value ? 'ACTIF' : 'INACTIF')} />;
    };
    
    
    const toggleActivation = async (userId, currentStatus) => {
        try {
            const newStatus = currentStatus === 'ACTIF' ? 'INACTIF' : 'ACTIF';
            const response = await axios.put(`http://localhost:8080/api/candidat/${userId}/${newStatus}`);
            console.log(`${newStatus} response:`, response.data);
    
            // Update the users list or refresh the data after successful operation
            // You can refetch the data or update the users list in state here
            const updatedUsers = candidats.map(candidat => {
                if (candidat.id === userId) {
                    return { ...candidat, status: newStatus };
                }
                return candidat;
            });
            setCandidats(updatedUsers);
    
            // Show success toast
            const toastMessage = newStatus === 'ACTIF' ? 'Activation du candidat réussie.' : 'Désactivation du candidat réussie.';
            toast.current.show({ severity: 'success', summary: 'Success', detail: toastMessage });
        } catch (error) {
            console.error('Error toggling activation:', error);
            // Show error toast
            toast.current.show({ severity: 'error', summary: 'Error', detail: `Error toggling activation: ${error.message}` });
        }
    };
    const updateProfile = async (e) => {
        e.preventDefault();
        try {
            
            console.log("candidat kaml :  "+selectedCandidat)
            // Check if the candidate has a cin object
            if (!selectedCandidat.cin || !selectedCandidat.cin.id) {

            // Create a new cin object with code and date_naissance
            const newCinData = {
                code: selectedCandidat.cin.code, // Assuming you have a field for cin code
                date_naissance: selectedCandidat.cin.date_naissance,
                date_validite : selectedCandidat.cin.date_validite, // Assuming you have a field for cin date
            };
            
            // Make a POST request to create the new cin object
            const newCinResponse = await axios.post(`http://localhost:8080/api/cins/${selectedCandidat.id}`, newCinData);
            console.log('New CIN data created successfully:', newCinResponse.data);

            // Assign the newly created cin object to the selected candidate
            setSelectedCandidat(prev => ({
                ...prev,
                cin: newCinResponse.data,
            }));
        }
            // Update candidate's information
            await axios.put(`http://localhost:8080/api/candidat/${selectedCandidat.id}/Update`, selectedCandidat);
            console.log('Candidate data updated successfully!');

            // Update candidate's cin information (No need to update it again if it was just created)
        if (selectedCandidat.cin && selectedCandidat.cin.id) {
            const cinUpdateData = {
                code: selectedCandidat.cin.code,
                date_naissance: selectedCandidat.cin.date_naissance,
                date_validite : selectedCandidat.cin.date_validite, // Assuming you have a field for cin date

            };

            const cinUpdateResponse = await axios.put(`http://localhost:8080/api/cins/${selectedCandidat.cin.id}`, cinUpdateData);
            console.log('CIN data updated successfully:', cinUpdateResponse.data);
        }
            // Update candidate's profile picture
            if (fileUploadRef.current.files && fileUploadRef.current.files.length > 0) {
                const formData = new FormData();
                formData.append('image', fileUploadRef.current.files[0]);

                const imageResponse = await axios.put(`http://localhost:8080/api/images/candidat/${selectedCandidat.id}/image`, formData);
                console.log('Profile picture updated successfully:', imageResponse.data);
            }

            // Close the modal after updating
            setIsModalVisible(false);
            fetchCandidats();

        } catch (error) {
            console.error('Error updating data:', error);
        }
    };

    const handleFileUpload = (event) => {
        const formData = new FormData();
        formData.append('image', event.files[0]); // Use 'image' as the field name

        axios.put(`http://localhost:8080/api/images/candidat/${selectedCandidat.id}/image`, formData)
            .then(response => {
                console.log('Image upload response:', response.data);
                // You can handle success actions here, like updating the image display or showing a success toast.
                // Once the image is uploaded successfully, you might also want to trigger the profile update to fetch the updated image.
                updateProfile(event); // Call the profile update function again to fetch updated data including the image.
            })
            .catch(error => {
                console.error('Image upload error:', error);
                // You can handle error actions here, like showing an error toast.
            });
    };
    
    
    const deleteUser = async (userId) => {
        try {
            const response = await axios.delete(`http://localhost:8080/api/candidat/${userId}`);
            console.log('Delete response:', response.data);
    
            // Update the users list or refresh the data after successful deletion
            // You can refetch the data or update the users list in state here
            const updatedUsers = candidats.filter(candidat => candidat.id !== userId);
            setCandidats(updatedUsers);
    
            // Show success toast
            toast.current.show({ severity: 'success', summary: 'Success', detail: 'User deleted successfully.' });
        } catch (error) {
            console.error('Error deleting user:', error);
            // Show error toast
            toast.current.show({ severity: 'error', summary: 'Error', detail: `Error deleting user: ${error.message}` });
        }
    };

    const continueCandidat = async (candidat) => {
        setSelectedCandidat(candidat);
        toggleModal(); // Show the modal
    }
    const toggleModal = () => {
        setIsModalVisible(!isModalVisible);
    };

    return (
        <div className="grid p-fluid">
            

            <div className="col-12">
                <div className="card">
                    <h5>List des Candidats</h5>
                    <DataTable
                        value={candidats}
                        paginator
                        className="p-datatable-gridlines"
                        showGridlines
                        rows={10}
                        dataKey="id"
                        filters={filters1}
                        filterDisplay="menu"
                        responsiveLayout="scroll"
                        emptyMessage="No candidats found."
                    >
                        <Column header="Image" body={imageBodyTemplate} style={{ minWidth: '12rem', textAlign: 'center' }} />
                        <Column field="nom" header="Nom" filter filterPlaceholder="Search by lastname" style={{ minWidth: '12rem' }} />
                        <Column field="prenom" header="Prenom" filter filterPlaceholder="Search by firstname" style={{ minWidth: '12rem' }} />
                        <Column field="email" header="Email" filter filterPlaceholder="Search by email" style={{ minWidth: '12rem' }} />
                        <Column header="Date de Creation" field="createdAt" filterField="createdAt" dataType="date" style={{ minWidth: '10rem' }} body={dateBodyTemplate}
                            filter filterElement={dateFilterTemplate} />
                        <Column field="status" header="Activation" dataType="boolean" bodyClassName="text-center" style={{ minWidth: '8rem' }} body={verifiedBodyTemplate} filter filterElement={verifiedFilterTemplate} />
                        <Column header="Référence de Contrat" field="ref_contrat" filter filterPlaceholder="Search by reference" style={{ minWidth: '12rem' }} />
                        <Column header="Opération" body={operationBodyTemplate} style={{ minWidth: '10rem', textAlign: 'center' }} />

                        {/* Other columns you want to display */}
                    </DataTable>
                    <Toast ref={toast} />
                    <Dialog style={{ width: '100%', maxWidth: '1200px' }} // Set the width and max-width
                        className="p-dialog-center" // Center the dialog horizontally
                        visible={isModalVisible} onHide={toggleModal}>
                        <div className="col-12">
                            <div className="card">
                                <h2>Completez le profil</h2>
                                <form>
                                    <div className="grid p-fluid">
                                        <div className="col-12 md:col-4">
                                            <label htmlFor="firstName">Prenom</label>
                                            <InputText id="firstName"
                                                value={selectedCandidat?.prenom || ''}
                                                disabled />
                                            <label htmlFor="lastName">Last Name</label>
                                            <InputText id="lastName"
                                                value={selectedCandidat?.nom || ''}
                                                disabled />
                                            <br /><br />

                                            <label htmlFor="email">Email</label>

                                            <InputText
                                                id="email"
                                                type="text"
                                                value={selectedCandidat?.email || ''}
                                                onChange={(e) => setSelectedCandidat(prev => ({ ...prev, email: e.target.value }))}
                                            />
                                            <br /><br />
                                            <label htmlFor="gender">Genre</label>
                                            <div className="grid">
                                                <div className="col-12 md:col-4">
                                                    <div className="field-radiobutton">
                                                        <RadioButton
                                                            inputId="option1"
                                                            name="option"
                                                            value="Male"
                                                            checked={selectedCandidat?.sexe === 'Male'}
                                                            onChange={(e) => setSelectedCandidat(prev => ({ ...prev, sexe: e.value }))}
                                                        />
                                                        <label htmlFor="option1">Male</label>
                                                    </div>
                                                </div>
                                                <div className="col-12 md:col-4">
                                                    <div className="field-radiobutton">
                                                        <RadioButton
                                                            inputId="option2"
                                                            name="option"
                                                            value="Female"
                                                            checked={selectedCandidat?.sexe === 'Female'}
                                                            onChange={(e) => setSelectedCandidat(prev => ({ ...prev, sexe: e.value }))}
                                                        />
                                                        <label htmlFor="option2">Female</label>
                                                    </div>
                                                </div>
                                            </div>

                                            <label htmlFor="address">Adresse</label>
                                            <InputTextarea
                                                id="address"
                                                placeholder="Adresse"
                                                autoResize
                                                rows="3"
                                                cols="30"
                                                value={selectedCandidat?.adresse || ''}
                                                onChange={(e) => setSelectedCandidat(prev => ({ ...prev, adresse: e.target.value }))}
                                            />
                                            <br /><br />

                                            <label htmlFor="cinCode">Cin</label>
                                            <InputText
                                                id="cinCode"
                                                type="text"
                                                value={selectedCandidat?.cin?.code || ''}
                                                onChange={(e) => setSelectedCandidat(prev => ({ ...prev, cin: { ...prev.cin, code: e.target.value } }))}
                                            />
                                            <br /><br />

                                            <label htmlFor="cinDate">Date de naissance</label>
                                            <Calendar
                                                id="cinDate"
                                                showIcon
                                                showButtonBar
                                                value={selectedCandidat?.cin?.date_naissance ? new Date(selectedCandidat.cin.date_naissance) : null}
                                                onChange={(e) => setSelectedCandidat(prev => ({ ...prev, cin: { ...prev.cin, date_naissance: e.value } }))}
                                                dateFormat="dd/mm/yy"
                                            />
                                            
                                        </div>
                                        <div className="col-12 md:col-4">
                                        <label htmlFor="cinDateValidite">Date de validité</label>
                                            <Calendar
                                                id="cinDateValidite"
                                                showIcon
                                                showButtonBar
                                                value={selectedCandidat?.cin?.date_validite ? new Date(selectedCandidat.cin.date_validite) : null}
                                                onChange={(e) => setSelectedCandidat(prev => ({ ...prev, cin: { ...prev.cin, date_validite: e.value } }))}
                                                dateFormat="dd/mm/yy"
                                            />
                                        <label htmlFor="phoneNumber">Numero de telephone</label>
                                            <InputText
                                                id="phoneNumber"
                                                type="text"
                                                value={selectedCandidat?.num_tel || ''}
                                                onChange={(e) => setSelectedCandidat(prev => ({ ...prev, num_tel: e.target.value }))}
                                            />
                                            <br/><br/>

                                            <label htmlFor="familySituation">Situation Familiale</label>
                                            <InputText
                                                id="familySituation"
                                                type="text"
                                                value={selectedCandidat?.situation_fam || ''}
                                                onChange={(e) => setSelectedCandidat(prev => ({ ...prev, situation_fam: e.target.value }))}
                                            />
                                            <br /><br />

                                            <label htmlFor="numChildren">Nombre d'enfants</label>
                                            <InputNumber
                                                id="numChildren"
                                                value={selectedCandidat?.children || 0}
                                                onValueChange={(e) => setSelectedCandidat(prev => ({ ...prev, children: e.value }))}
                                                showButtons
                                                mode="decimal"
                                                min={0}
                                            />
                                            <br /><br />

                                            <label htmlFor="observation">Observation</label>
                                            <InputText
                                                id="observation"
                                                type="text"
                                                value={selectedCandidat?.obs || ''}
                                                onChange={(e) => setSelectedCandidat(prev => ({ ...prev, obs: e.target.value }))}
                                            />
                                            <br /><br />

                                            <label htmlFor="tl">Test Linguistique</label>
                                            <InputText
                                                id="tl"
                                                type="text"
                                                value={selectedCandidat?.tl || ''}
                                                onChange={(e) => setSelectedCandidat(prev => ({ ...prev, tl: e.target.value }))}
                                            />
                                            <br /><br />

                                            <label htmlFor="group">Groupe</label>
                                            <InputText
                                                id="group"
                                                type="text"
                                                value={selectedCandidat?.groupe || ''}
                                                onChange={(e) => setSelectedCandidat(prev => ({ ...prev, groupe: e.target.value }))}
                                            />
                                            
                                        </div>
                                        <div className="col-12 md:col-4" style={{ textAlign: 'center' }}>
                                            <img
                                                src={getImageUrl(selectedCandidat?.id)}
                                                alt="Candidat"
                                                style={{ width: '150px', height: 'auto' }}
                                            />
                                            <h5>Set Image</h5>
                                            <FileUpload ref={fileUploadRef} mode="basic" name="demo[]" url="./upload.php" accept="image/*" maxFileSize={1000000} onUpload={handleFileUpload} />

                                        </div>
                                    </div>
                                    <Button label="Update" className="p-button-warning" onClick={updateProfile} />
                                    <Button label="Cancel" className="p-button-secondary" onClick={toggleModal} />

                                </form>
                            </div>
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
}