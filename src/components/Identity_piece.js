import React, { useState, useEffect, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';

import axios from 'axios';

const AjouterUser = () => {
    const toast = useRef(null);

    const [pieces, setPieces] = useState(null);
    const [editingPieceId, setEditingPieceId] = useState(null); // New state for tracking editing status
    const [newPieceName, setnewPieceName] = useState('');
    const [filters1, setFilters1] = useState(null);
    const [formData, setFormData] = useState({
        name: ''
    });
    useEffect(() => {
        
        // Fetch roles from the API when the component mounts
        fetch('http://localhost:8080/api/id_piece/All')
            .then(response => response.json())
            .then(data => {
                setPieces(data);
                console.log(data);
            })
            .catch(error => {
                console.error('Error fetching identity pieces:', error);
            });
    }, []);
    const updatePiece = async (pieceId) => {
        try {
            const response = await axios.put(`http://localhost:8080/api/id_piece/${pieceId}/update`, {
                name: newPieceName
            });
            console.log('Update response:', response.data);

            // Update the function name in the list
            const updatedPieces = pieces.map((piece) => {
                if (piece.id === pieceId) {
                    return { ...piece, name: newPieceName };
                }
                return piece;
            });
            setPieces(updatedPieces);

            // Reset editing status and new name
            setEditingPieceId(null);
            setnewPieceName('');

            // Show success toast
            toast.current.show({ severity: 'success', summary: 'Success', detail: 'id_piece updated successfully.' });
        } catch (error) {
            console.error('Error updating id_piece:', error);
            // Show error toast
            toast.current.show({ severity: 'error', summary: 'Error', detail: `Error updating id_piece: ${error.message}` });
        }
    };

    
    
    
    
    const deleteUser = async (pieceId) => {
        try {
            const response = await axios.delete(`http://localhost:8080/api/id_piece/${pieceId}`);
            console.log('Delete response:', response.data);
    
            // Update the users list or refresh the data after successful deletion
            // You can refetch the data or update the users list in state here
            const updatedPieces = pieces.filter(piece => piece.id !== pieceId);
            setPieces(updatedPieces);
    
            // Show success toast
            toast.current.show({ severity: 'success', summary: 'Success', detail: 'id_piece deleted successfully.' });
        } catch (error) {
            console.error('Error deleting user:', error);
            // Show error toast
            toast.current.show({ severity: 'error', summary: 'Error', detail: `Error deleting id_piece: ${error.message}` });
        }
    };
    
    

    

    
    useEffect(() => {
        // Fetch roles from the API when the component mounts
        fetch('http://localhost:8080/api/id_piece/All')
            .then(response => response.json())
            .then(data => {
                setPieces(data);
                console.log(data);
                initFilters1();
            })
            .catch(error => {
                console.error('Error fetching roles:', error);
            });
    }, []);
    

    const initFilters1 = () => {
        setFilters1({
            'name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        });
    }

    const handleSubmit = async () => {
        try {
            
            // Make the POST request to the API
            const response = await axios.post('http://localhost:8080/api/id_piece/Save', formData);
        
            // Handle success (you can display a success message here)
            console.log('Data saved:', response.data);
        
           
        
            // Clear all input fields by resetting formData to its initial state
            setFormData({
                name: '',
                
            });
        
            // Show success toast
            toast.current.show({ severity: 'success', summary: 'Success', detail: 'id_piece added successfully.' });
            // Fetch the updated list of users from the API
        fetch('http://localhost:8080/api/id_piece/All')
        .then(response => response.json())
        .then(data => {
            setPieces(data);
            console.log(data);
            initFilters1();
        })
        .catch(error => {
            console.error('Error fetching idenity pieces:', error);
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
                {editingPieceId === rowData.id ? (
                    <div>
                        <InputText
                            value={newPieceName}
                            onChange={(e) => setnewPieceName(e.target.value)}
                        />
                        <Button
                            label="Update"
                            className="p-button-rounded p-button-primary"
                            onClick={() => updatePiece(rowData.id)}
                        />
                    </div>
                ) : (
                    <Button
                        label="Edit"
                        className="p-button-rounded p-button-success"
                        onClick={() => setEditingPieceId(rowData.id)}
                    />
                )}
                <Button
                    label="Delete"
                    className="p-button-rounded p-button-danger"
                    onClick={() => deleteUser(rowData.id)}
                />
            </div>
        );
    };
    
    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>Ajouter une id_piece</h5>
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-6">
                            <label htmlFor="name">nom</label>
                            <InputText id="name" type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                        </div>

                        <Button label="Submit" onClick={handleSubmit}></Button>
                    </div>
                </div>
            </div>
            <div className="col-12">
                <div className="card">
                    <h5>List des Piece d'identité</h5>
                    <DataTable value={pieces} paginator className="p-datatable-gridlines" showGridlines rows={10}
                        dataKey="id" filters={filters1} filterDisplay="menu"  responsiveLayout="scroll"
                          emptyMessage="No customers found.">
                        <Column field="name" header="Nom" filter filterPlaceholder="Search by name" style={{ minWidth: '12rem' }} />
                        <Column header="Opération" body={operationBodyTemplate} style={{ minWidth: '10rem', textAlign: 'center' }} />
                    </DataTable>
                    <Toast ref={toast} />
                </div>
            </div>
        </div>
    );
}

export default AjouterUser;
