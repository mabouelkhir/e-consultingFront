import React, { useEffect, useState } from 'react';
import axios from "axios";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';

export const FonctionCandidat = () => {
    const [candidats, setCandidats] = useState([]);
    const [fonctions, setFonctions] = useState([]);
    const [sousFonctions, setSousFonctions] = useState([]);
    const [selectedCandidat, setSelectedCandidat] = useState(null);
    const [selectedFonction, setSelectedFonction] = useState(null);
    const [selectedSousFonction, setSelectedSousFonction] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        fetchCandidats();
        fetchFonctions();
        fetchSousFonctions();
    }, []);

    const fetchCandidats = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/candidat/candidats/actifs');
            setCandidats(response.data);
        } catch (error) {
            console.error('Error fetching candidats:', error);
        }
    };

    const fetchFonctions = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/fonction/All');
            setFonctions(response.data);
        } catch (error) {
            console.error('Error fetching fonctions:', error);
        }
    };

    const fetchSousFonctions = async () => {
        try {
            const response = await axios.get('http://localhost:8080/subfonctions');
            setSousFonctions(response.data);
        } catch (error) {
            console.error('Error fetching sous-fonctions:', error);
        }
    };

    const handleAjouterFonction = (candidat) => {
        setSelectedCandidat(candidat);
        setSelectedFonction(null);
        setSelectedSousFonction(null);
        setIsModalVisible(true);
    };

    const handleAddFonction = async () => {
        try {
            const fonctionResponse = await axios.put(`http://localhost:8080/api/candidat/${selectedCandidat.id}/fonction/${selectedFonction.id}/add`);
            console.log('Fonction added successfully:', fonctionResponse.data);

            if (selectedSousFonction) {
                const sousFonctionResponse = await axios.put(`http://localhost:8080/api/candidat/${selectedCandidat.id}/subfonction/${selectedSousFonction.id}/add`);
                console.log('Subfonction added successfully:', sousFonctionResponse.data);
            }

            setIsModalVisible(false);
            fetchCandidats();
        } catch (error) {
            console.error('Error adding fonction:', error);
        }
    };
    const getImageUrl = (candidatId) => {
        return `http://localhost:8080/api/images/candidat/${candidatId}/image`;
    };

    const imageBodyTemplate = (rowData) => {
        const imageUrl = getImageUrl(rowData.id);
        return <img src={imageUrl} alt="Candidat" style={{ width: '150px', height: 'auto' }} />;
    };

    const fonctionBodyTemplate = (rowData) => {
        return (
            <div>
                <ul>
                    {rowData.fonctions.map((fonction) => (
                        <li key={fonction.id}>
                            {fonction.nom_fonction}
                            <ul>
                                {rowData.subfonctions
                                    .filter((subfonction) => subfonction.fonction.id === fonction.id)
                                    .map((subfonction) => (
                                        <li key={subfonction.id}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <span>{subfonction.nomSubFonction}</span>
                                                <Button
                                                    icon="pi pi-times"
                                                    className="p-button-rounded p-button-danger p-button-text"
                                                    onClick={() => handleRemoveSubFonction(rowData, subfonction)}
                                                />
                                            </div>
                                        </li>
                                    ))}
                            </ul>
                            <br/>
                            <Button
                                label="Remove Fonction"
                                className="p-button-rounded p-button-danger"
                                onClick={() => handleRemoveFonction(rowData, fonction)}
                            />
                    <br/><br/>

                        </li>
                    ))}
                </ul>
            </div>
        );
    };
    
    
    const handleRemoveSubFonction = async (candidat, subfonction) => {
        try {
            const response = await axios.put(`http://localhost:8080/api/candidat/${candidat.id}/subfonction/${subfonction.id}/remove`);
            console.log('Subfonction removed successfully:', response.data);
            fetchCandidats();
        } catch (error) {
            console.error('Error removing subfonction:', error);
        }
    };
    
    const handleRemoveFonction = async (candidat, fonction) => {
        try {
            const response = await axios.put(`http://localhost:8080/api/candidat/${candidat.id}/fonction/${fonction.id}/remove`);
            console.log('Fonction removed successfully:', response.data);
    
            // Remove associated subfonctions as well
            for (const subfonction of candidat.subfonctions) {
                if (subfonction.fonction.id === fonction.id) {
                    await axios.put(`http://localhost:8080/api/candidat/${candidat.id}/subfonction/${subfonction.id}/remove`);
                    console.log('Subfonction removed successfully:', response.data);
                }
            }
    
            fetchCandidats();
        } catch (error) {
            console.error('Error removing fonction:', error);
        }
    };
    

    const actionsBodyTemplate = (rowData) => {
        return (
            <Button
                label="Ajouter Fonction"
                className="p-button-rounded p-button-success"
                onClick={() => handleAjouterFonction(rowData)}
            />
        );
    };
// Filter the available subfonctions based on the selected function
const filteredSubFonctions = sousFonctions.filter(subFonction => subFonction.fonction.id === selectedFonction?.id);

    return (
        <div className="grid p-fluid">
            <div className="col-12">
                <div className="card">
                    <h5>Ajouter fonctions au candidats</h5>
                    <DataTable
                        value={candidats}
                        paginator
                        className="p-datatable-gridlines"
                        showGridlines
                        rows={10}
                        dataKey="id"
                        emptyMessage="No candidats found."
                    >
                        <Column header="Image" body={imageBodyTemplate} style={{ minWidth: '12rem', textAlign: 'center' }} />
                        <Column header="Nom" field="nom" />
                        <Column header="Prenom" field="prenom" />
                        <Column header="Cin" field="cin.code" />
                        <Column header="Fonction" body={fonctionBodyTemplate} />
                        <Column header="Actions" body={actionsBodyTemplate} />
                    </DataTable>
                </div>
            </div>
            <Dialog
                style={{ width: '400px' }}
                visible={isModalVisible}
                onHide={() => setIsModalVisible(false)}
            >
                <h2>Ajouter Fonction</h2>
                <Dropdown
                    value={selectedFonction}
                    options={fonctions}
                    optionLabel="nom_fonction"
                    onChange={(e) => setSelectedFonction(e.value)}
                    placeholder="Select a Function"
                />
                <Dropdown
                    value={selectedSousFonction}
                    options={filteredSubFonctions}
                    optionLabel="nomSubFonction"
                    onChange={(e) => setSelectedSousFonction(e.value)}
                    placeholder="Select a Sub-Function"
                    disabled={!selectedFonction} // Disable until a function is selected
                />
                <Button label="Add" className="p-button-success" onClick={handleAddFonction} />
            </Dialog>
        </div>
    );
}
