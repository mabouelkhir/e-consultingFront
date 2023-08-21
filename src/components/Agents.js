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
import ListdesAgents  from './ListdesAgents';
import TableOperationAgent from './TableOperationAgent';




const Agents = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const history = useHistory();
    const location = useLocation();

 

  

    
    

  

 

    const wizardItems = [
        { label: 'List des Agents', command: () => history.push('/agents') },
        { label: 'Table Operation Agent', command: () => history.push('/agents/operations') },
      
        
        
    ];

  

   

    

    return (
        <div className="grid p-fluid">
            

            <div className="col-12 md:col-12">
                <div className="card card-w-title">
                    <h5>Gestion des Agents</h5>
                    <TabMenu model={wizardItems} activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} />
                    <Route exact path={'/agents'} component={ListdesAgents} />
                    <Route exact path={'/agents/operations'} component={TableOperationAgent} />
                   
                    
                </div>
            </div>

            
        </div>
    )
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(Agents, comparisonFn);