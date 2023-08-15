import React, { useEffect, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import axios from 'axios';
import { InputTextarea } from 'primereact/inputtextarea';
import { AutoComplete } from 'primereact/autocomplete';
import { Calendar } from 'primereact/calendar';
import { RadioButton } from 'primereact/radiobutton';
import { fr } from 'primereact/api';

import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';


export const CompleterProfil = () => {
    const [autoValue, setAutoValue] = useState([]);
    const [selectedAutoValue, setSelectedAutoValue] = useState(null);
    const [autoFilteredValue, setAutoFilteredValue] = useState([]);
    const [calendarValue, setCalendarValue] = useState(null);
    const [inputNumberValue, setInputNumberValue] = useState(null);
    const [selectedCandidat, setSelectedCandidat] = useState(null);


    const [radioValue, setRadioValue] = useState(null);

    useEffect(() => {
        fetchCandidats();
    }, []);

    const fetchCandidats = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/candidat/candidats/actifs');
            const formattedCandidats = response.data.map(candidat => ({
                ...candidat,
                fullName: `${candidat.prenom} ${candidat.nom}`
            }));
            setAutoValue(formattedCandidats);
            setAutoFilteredValue([...formattedCandidats]);
            console.log(formattedCandidats);
        } catch (error) {
            console.error('Error fetching candidats:', error);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:8080/api/candidat/${selectedCandidat.id}/update`, selectedCandidat);
            console.log('Data updated successfully!');
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


    return (

        <div className="col-12">
            <div className="card">
                <form onSubmit={handleSubmit}>
                    <div className="grid p-fluid">
                        <div className="col-12 md:col-6">
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

                            <h5>Date de naissance</h5>
                            <Calendar
                                showIcon
                                showButtonBar
                                value={selectedCandidat?.date_naissance || null}
                                onChange={(e) => setSelectedCandidat(prev => ({ ...prev, date_naissance: e.value }))}
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

                            <h5>TL</h5>
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

                        <div className="col-12 md:col-6" style={{ textAlign: 'center' }}>
                            <img
                                src={getImageUrl(selectedCandidat?.id)}
                                alt="Candidat"
                                style={{ width: '250px', height: 'auto' }}
                            />
                        </div>
                    </div>

                    <Button label="Submit" type="submit" />
                </form>
            </div>
        </div>
    )
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(CompleterProfil, comparisonFn);