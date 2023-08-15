import React, { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';

import { Menubar } from 'primereact/menubar';
import { InputText } from 'primereact/inputtext';
import { BreadCrumb } from 'primereact/breadcrumb';
import { Steps } from 'primereact/steps';
import { TabMenu } from 'primereact/tabmenu';
import { TieredMenu } from 'primereact/tieredmenu';
import { Menu } from 'primereact/menu';
import { Button } from 'primereact/button';
import { ContextMenu } from 'primereact/contextmenu';
import { MegaMenu } from 'primereact/megamenu';
import { PanelMenu } from 'primereact/panelmenu';
import { Route, useHistory, useLocation } from 'react-router-dom';
import { PersonalDemo } from '../components/menu/PersonalDemo';
import { ConfirmationDemo } from '../components/menu/ConfirmationDemo';
import {CandidatList} from './CandidatList'
import { CompleterProfil } from './CompleterProfil';
import { CandidatActiveList } from './CandidatActiveList';


const Candidats = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const history = useHistory();
    const location = useLocation();

 

  

    
    

  

 

    const wizardItems = [
        { label: 'List des Candidats', command: () => history.push('/candidats') },
        { label: 'liste des candidats actifs', command: () => history.push('/candidats/actifs') },
        { label: 'Completer le profil', command: () => history.push('/candidats/profil') },
        { label: 'Gestion des Dossiers', command: () => history.push('/candidats/dossiers') },
        
        
    ];

  

   
  

  

  

 


    
    

    return (
        <div className="grid p-fluid">
            

            <div className="col-12 md:col-12">
                <div className="card card-w-title">
                    <h5>Gestion des Candidats</h5>
                    <TabMenu model={wizardItems} activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} />
                    <Route exact path={'/candidats'} component={CandidatList} />
                    <Route exact path={'/candidats/actifs'} component={CandidatActiveList} />
                    <Route exact path={'/candidats/profil'} component={CompleterProfil} />
                    <Route path={'/candidats/dossiers'} component={ConfirmationDemo} />
                    
                </div>
            </div>

            
        </div>
    )
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(Candidats, comparisonFn);