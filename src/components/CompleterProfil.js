import React, { useEffect, useState, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import axios from 'axios';
import { InputTextarea } from 'primereact/inputtextarea';
import { AutoComplete } from 'primereact/autocomplete';
import { Calendar } from 'primereact/calendar';
import { RadioButton } from 'primereact/radiobutton';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';





export const CompleterProfil = () => {

    const [autoValue, setAutoValue] = useState([]);
    const [autoFilteredValue, setAutoFilteredValue] = useState([]);
    const [selectedCandidat, setSelectedCandidat] = useState(null);
    const fileUploadRef = useRef(null);
    const toast = useRef(null);


    useEffect(() => {
        fetchCandidats();
    }, []);

    const fetchCandidats = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/candidat/candidats/actifs');
            const formattedCandidats = response.data.map(candidat => ({
                ...candidat,
                fullName: `${candidat.prenom} ${candidat.nom}`,

            }));
            setAutoValue(formattedCandidats);
            setAutoFilteredValue([...formattedCandidats]);

            console.log(formattedCandidats);
        } catch (error) {
            console.error('Error fetching candidats:', error);
        }
    };
    const updateProfile = async (e) => {
        e.preventDefault();
        try {

            console.log("candidat kaml :  " + selectedCandidat)
            // Check if the candidate has a cin object
            if (!selectedCandidat.cin || !selectedCandidat.cin.id) {

                // Create a new cin object with code and date_naissance
                const newCinData = {
                    code: selectedCandidat.cin.code, // Assuming you have a field for cin code
                    date_naissance: selectedCandidat.cin.date_naissance,
                    date_validite: selectedCandidat.cin.date_validite, // Assuming you have a field for cin date
                };

                // Make a POST request to create the new cin object
                const newCinResponse = await axios.post(`http://localhost:8080/cins/${selectedCandidat.id}`, newCinData);
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
                    date_validite: selectedCandidat.cin.date_validite, // Assuming you have a field for cin date

                };

                const cinUpdateResponse = await axios.put(`http://localhost:8080/cins/${selectedCandidat.cin.id}`, cinUpdateData);
                console.log('CIN data updated successfully:', cinUpdateResponse.data);
            }
            // Update candidate's profile picture
            if (fileUploadRef.current.files && fileUploadRef.current.files.length > 0) {
                const formData = new FormData();
                formData.append('image', fileUploadRef.current.files[0]);

                const imageResponse = await axios.put(`http://localhost:8080/api/images/candidat/${selectedCandidat.id}/image`, formData);
                console.log('Profile picture updated successfully:', imageResponse.data);
            }
            toast.current.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Candidat updated successfully.',
            });


            // Close the modal after updating
            fetchCandidats();

        } catch (error) {
            console.error('Error updating data:', error);
        }
    };
    const getImageUrl = (candidatId) => {
        return `http://localhost:8080/api/images/candidat/${candidatId}/image`;
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


    return (

        <div className="col-12">
            <div className="card">
                <form onSubmit={updateProfile}>
                    <div className="grid p-fluid">
                        <div className="col-12 md:col-4">
                            <h5>Candidat</h5>
                            <AutoComplete
                                placeholder="Search"
                                id="dd"
                                dropdown
                                value={selectedCandidat}
                                onChange={(e) => setSelectedCandidat(e.value)}
                                suggestions={autoFilteredValue}
                                completeMethod={searchCountry}
                                field="fullName"
                            />

                            <h5>Email</h5>
                            <InputText
                                id='email'
                                type="text"
                                value={selectedCandidat?.email || ''}
                                onChange={(e) => setSelectedCandidat(prev => ({ ...prev, email: e.target.value }))}
                            />

                            <h5>Genre</h5>
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

                            <h5>Adresse</h5>
                            <InputTextarea
                                id='adresse'
                                placeholder="Adresse"
                                autoResize
                                rows="3"
                                cols="30"
                                value={selectedCandidat?.adresse || ''}
                                onChange={(e) => setSelectedCandidat(prev => ({ ...prev, adresse: e.target.value }))}
                            />
                            <h5>Cin</h5>
                            <InputText
                                id="cinCode"
                                type="text"
                                value={selectedCandidat?.cin?.code || ''}
                                onChange={(e) => setSelectedCandidat(prev => ({ ...prev, cin: { ...prev.cin, code: e.target.value } }))}
                            />

                            <h5>Date de naissance</h5>
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
                            <h5>Date de validité</h5>
                            <Calendar
                                id="cinDateValidite"
                                showIcon
                                showButtonBar
                                value={selectedCandidat?.cin?.date_validite ? new Date(selectedCandidat.cin.date_validite) : null}
                                onChange={(e) => setSelectedCandidat(prev => ({ ...prev, cin: { ...prev.cin, date_validite: e.value } }))}
                                dateFormat="dd/mm/yy"
                            />

                            <h5>Numero de telephone</h5>
                            <InputText
                                type="text"
                                value={selectedCandidat?.num_tel || ''}
                                onChange={(e) => setSelectedCandidat(prev => ({ ...prev, num_tel: e.target.value }))}
                            />

                            <h5>Situation Familiale</h5>
                            <InputText
                                type="text"
                                value={selectedCandidat?.situation_fam || ''}
                                onChange={(e) => setSelectedCandidat(prev => ({ ...prev, situation_fam: e.target.value }))}
                            />

                            <h5>Nombre d'enfants</h5>
                            <InputNumber
                                value={selectedCandidat?.children || 0}
                                onValueChange={(e) => setSelectedCandidat(prev => ({ ...prev, children: e.value }))}
                                showButtons
                                mode="decimal"
                                min={0}
                            />

                            <h5>Observation</h5>
                            <InputText
                                type="text"
                                value={selectedCandidat?.obs || ''}
                                onChange={(e) => setSelectedCandidat(prev => ({ ...prev, obs: e.target.value }))}
                            />

                            <h5>Test Linguistique</h5>
                            <InputText
                                type="text"
                                value={selectedCandidat?.tl || ''}
                                onChange={(e) => setSelectedCandidat(prev => ({ ...prev, tl: e.target.value }))}
                            />

                            <h5>Groupe</h5>
                            <InputText
                                type="text"
                                value={selectedCandidat?.groupe || ''}
                                onChange={(e) => setSelectedCandidat(prev => ({ ...prev, groupe: e.target.value }))}
                            />
                        </div>

                        <div className="col-12 md:col-4" style={{ textAlign: 'center' }}>
                            <img
                                src={getImageUrl(selectedCandidat?.id)}
                                alt="Candidat"
                                style={{ width: '250px', height: 'auto' }}
                            />
                            <h5>Set Image</h5>
                            <FileUpload ref={fileUploadRef} mode="basic" name="demo[]" url="./upload.php" accept="image/*" maxFileSize={1000000} onUpload={handleFileUpload} />

                        </div>
                    </div>

                    <Button label="Submit" type="submit" />
                </form>
                <Toast ref={toast} />

            </div>
        </div>
    )
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(CompleterProfil, comparisonFn);