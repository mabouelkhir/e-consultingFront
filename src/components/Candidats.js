import React, { useState } from 'react';
import { TabMenu } from 'primereact/tabmenu';
import { Route, useHistory, useLocation } from 'react-router-dom';
import {CandidatList} from './CandidatList'
import { CompleterProfil } from './CompleterProfil';
import { CandidatActiveList } from './CandidatActiveList';
import {FonctionCandidat} from './FonctionCandidat'
import {AjouterPermis} from './AjouterPermis'
import { AjouterPassport } from './AjouterPassport';
import { Gestiondesentretiens } from './Gestiondesentretiens';


const Candidats = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const history = useHistory();
        const wizardItems = [
        { label: 'List des Candidats', command: () => history.push('/admin/candidats') },
        { label: 'liste des candidats actifs', command: () => history.push('/admin/candidats/actifs') },
        { label: 'Completer le profil', command: () => history.push('/admin/candidats/profil') },
        { label: 'Ajouter Fonctions', command: () => history.push('/admin/candidats/fonctions') },
        { label: 'Ajouter Permis', command: () => history.push('/admin/candidats/permis') },
        { label: 'Ajouter Passport', command: () => history.push('/admin/candidats/passport') },
        { label:'Gestion des entretiens', command: () =>history.push('/admin/candidats/entretiens')}
        
        
    ];

  

    return (
        <div className="grid p-fluid">
            

            <div className="col-12 md:col-12">
                <div className="card card-w-title">
                    <h5>Gestion des Candidats</h5>
                    <TabMenu model={wizardItems} activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} />
                    <Route exact path={'/admin/candidats'} component={CandidatList} />
                    <Route exact path={'/admin/candidats/actifs'} component={CandidatActiveList} />
                    <Route exact path={'/admin/candidats/profil'} component={CompleterProfil} />
                    <Route path={'/admin/candidats/fonctions'} component={FonctionCandidat} />
                    <Route path={'/admin/candidats/permis'} component={AjouterPermis} />
                    <Route path={'/admin/candidats/passport'} component={AjouterPassport} />
                    <Route exact path={'/admin/candidats/entretiens'} component={Gestiondesentretiens}/>
                    
                </div>
            </div>

            
        </div>
    )
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(Candidats, comparisonFn);