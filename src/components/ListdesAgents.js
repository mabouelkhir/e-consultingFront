import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ListdesAgents = () => {
  const [employers, setEmployers] = useState([
    { name: 'Amine', id: 'amine' },
    { name: 'Sarah', id: 'sarah' },
    // ... autres employeurs
  ]);

  const [selectedEmployer, setSelectedEmployer] = useState('');
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/candidat/candidats/actifs');
      setCandidates(response.data);   
    } catch (error) {
      console.error('Error fetching candidats:', error);
    }
  };

  const handleEmployerChange = (id_Employeur) => {
    setSelectedEmployer(id_Employeur);
  };

  return (
    <div>
      <h1>Interface Agent</h1>
      <label htmlFor="employerSelect">Sélectionnez un employeur:</label>
      <select
        id="employerSelect"
        value={selectedEmployer}
        onChange={(e) => handleEmployerChange(e.target.value)}
      >
        <option value="">Sélectionnez un employeur</option>
        {employers.map(employer => (
          <option key={employer.id} value={employer.id}>
            {employer.name}
          </option>
        ))}
      </select>

      {selectedEmployer && (
        <div>
          <h2>Liste des Candidats pour {employers.find(emp => emp.id === selectedEmployer)?.name}</h2>
          <ul>
            {candidates
              .filter(candidate => candidate.id_Employeur === selectedEmployer)
              .map(candidate => (
                <li key={candidate.name}>
                  {candidate.name} - {candidate.qualifications}
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ListdesAgents;
