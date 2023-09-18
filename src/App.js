import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { Route, useLocation } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';

import { AppTopbar } from './AppTopbar';
import { AppTopbar1 } from './AppTopbar1';

import { AppFooter } from './AppFooter';
import { AppMenu } from './AppMenu';
import { AppConfig } from './AppConfig';

import Dashboard from './components/Dashboard';
import ButtonDemo from './components/ButtonDemo';
import ChartDemo from './components/ChartDemo';
import Documentation from './components/Documentation';
import FileDemo from './components/FileDemo';
import FloatLabelDemo from './components/FloatLabelDemo';
import FormLayoutDemo from './components/FormLayoutDemo';
import InputDemo from './components/InputDemo';
import ListDemo from './components/ListDemo';
import MenuDemo from './components/MenuDemo';
import Candidats from './components/Candidats';
import Agents from './components/Agents';
import Employeur from './components/Employeur';
import AjouterUser from './components/AjouterUser';
import Reglement from './components/Reglement';
import Rendez_vous from './components/Rendez_vous';
import EmployeurPage from './components/EmployeurPage';
import MessagesDemo from './components/MessagesDemo';
import MiscDemo from './components/MiscDemo';
import OverlayDemo from './components/OverlayDemo';
import MediaDemo from './components/MediaDemo';
import PanelDemo from './components/PanelDemo';
import TableDemo from './components/TableDemo';
import TreeDemo from './components/TreeDemo';
import InvalidStateDemo from './components/InvalidStateDemo';
import BlocksDemo from './components/BlocksDemo';
import IconsDemo from './components/IconsDemo';
import Fonctions from './components/Fonctions'
import Identity_piece from './components/Identity_piece'
import Dossier from './components/Dossier';


import Crud from './pages/Crud';
import EmptyPage from './pages/EmptyPage';
import TimelineDemo from './pages/TimelineDemo';

import PrimeReact from 'primereact/api';
import { Tooltip } from 'primereact/tooltip';

import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import 'prismjs/themes/prism-coy.css';
import './assets/demo/flags/flags.css';
import './assets/demo/Demos.scss';
import './assets/layout/layout.scss';
import './App.scss';
import { Redirect } from 'react-router-dom';
import Homepage from './components/Homepage';
import RejoignezNous from './components/Rejoignez-nous';
import LoginForm from './components/LoginForm';
import { BrowserRouter as Router } from 'react-router-dom';

const App = () => {
    const [layoutMode, setLayoutMode] = useState('static');
    const [layoutColorMode, setLayoutColorMode] = useState('light')
    const [inputStyle, setInputStyle] = useState('outlined');
    const [ripple, setRipple] = useState(true);
    const [staticMenuInactive, setStaticMenuInactive] = useState(false);
    const [overlayMenuActive, setOverlayMenuActive] = useState(false);
    const [mobileMenuActive, setMobileMenuActive] = useState(false);
    const [mobileTopbarMenuActive, setMobileTopbarMenuActive] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // New state for tracking login status
    const [user, setUser] = useState(null); // Store the user object

    const onLogin = (userData) => {
        setUser(userData); // Set the user object when the user logs in
        setIsLoggedIn(true); // Set the login status to true when the user logs in
    }

    const copyTooltipRef = useRef();
    const location = useLocation();

    PrimeReact.ripple = true;

    let menuClick = false;
    let mobileTopbarMenuClick = false;

    useEffect(() => {
        if (mobileMenuActive) {
            addClass(document.body, "body-overflow-hidden");
        } else {
            removeClass(document.body, "body-overflow-hidden");
        }
    }, [mobileMenuActive]);

    useEffect(() => {
        copyTooltipRef && copyTooltipRef.current && copyTooltipRef.current.updateTargetEvents();
    }, [location]);

    const onInputStyleChange = (inputStyle) => {
        setInputStyle(inputStyle);
    }

    const onRipple = (e) => {
        PrimeReact.ripple = e.value;
        setRipple(e.value)
    }

    const onLayoutModeChange = (mode) => {
        setLayoutMode(mode)
    }

    const onColorModeChange = (mode) => {
        setLayoutColorMode(mode)
    }

    const onWrapperClick = (event) => {
        if (!menuClick) {
            setOverlayMenuActive(false);
            setMobileMenuActive(false);
        }

        if (!mobileTopbarMenuClick) {
            setMobileTopbarMenuActive(false);
        }

        mobileTopbarMenuClick = false;
        menuClick = false;
    }

    const onToggleMenuClick = (event) => {
        menuClick = true;

        if (isDesktop()) {
            if (layoutMode === 'overlay') {
                if (mobileMenuActive === true) {
                    setOverlayMenuActive(true);
                }

                setOverlayMenuActive((prevState) => !prevState);
                setMobileMenuActive(false);
            }
            else if (layoutMode === 'static') {
                setStaticMenuInactive((prevState) => !prevState);
            }
        }
        else {
            setMobileMenuActive((prevState) => !prevState);
        }

        event.preventDefault();
    }

    const onSidebarClick = () => {
        menuClick = true;
    }

    const onMobileTopbarMenuClick = (event) => {
        mobileTopbarMenuClick = true;

        setMobileTopbarMenuActive((prevState) => !prevState);
        event.preventDefault();
    }

    const onMobileSubTopbarMenuClick = (event) => {
        mobileTopbarMenuClick = true;

        event.preventDefault();
    }

    const onMenuItemClick = (event) => {
        if (!event.item.items) {
            setOverlayMenuActive(false);
            setMobileMenuActive(false);
        }
    }
    const isDesktop = () => {
        return window.innerWidth >= 992;
    }

    const menu = [
        


    ];
    // Add menu items based on the user's role
if (user && user.role === "Admin") {
    menu.push(
        {
            label: 'Home',
            items: [{
                label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/admin/home'
            }]
        },
        {
            label: 'Gestion', icon: 'pi pi-fw pi-sitemap',
            items: [
                { label: 'Gestion des Utilisateurs', icon: 'pi pi-fw pi-id-card', to: '/admin/users' },
                { label: 'Gestion des Candidats', icon: 'pi pi-fw pi-id-card', to: '/admin/candidats' },
                { label: 'Gestion des Employeurs', icon: 'pi pi-fw pi-id-card', to: '/admin/employeur' },
                { label: 'Gestion des Fonctions', icon: 'pi pi-fw pi-id-card', to: '/admin/fonctions' },
                { label: 'Gestion des Dossiers', icon: 'pi pi-fw pi-id-card', to: '/admin/dossiers' },
                { label: 'Gestion des Agents', icon: 'pi pi-fw pi-id-card', to: '/admin/agents' },
                { label: 'Gestion des Reglements', icon: 'pi pi-fw pi-id-card', to: '/admin/reglements' },
                { label: 'Gestion des piece des identité', icon: 'pi pi-fw pi-id-card', to: '/admin/id_pieces' },
                { label: 'Gestion des Rendez-vous', icon: 'pi pi-fw pi-id-card', to: '/admin/rendez-vous' },

            ]
        },
    );
} else if (user && user.role === "Employeur") {
    menu.push(
        {
            label: 'Gestion',
            items: [{
                label: 'Employeur page', icon: 'pi pi-fw pi-id-card', to: '/employeur/home'
            }]
        },


    );
}

    const addClass = (element, className) => {
        if (element.classList)
            element.classList.add(className);
        else
            element.className += ' ' + className;
    }

    const removeClass = (element, className) => {
        if (element.classList)
            element.classList.remove(className);
        else
            element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }

    const wrapperClass = classNames('layout-wrapper', {
        'layout-overlay': layoutMode === 'overlay',
        'layout-static': layoutMode === 'static',
        'layout-static-sidebar-inactive': staticMenuInactive && layoutMode === 'static',
        'layout-overlay-sidebar-active': overlayMenuActive && layoutMode === 'overlay',
        'layout-mobile-sidebar-active': mobileMenuActive,
        'p-input-filled': inputStyle === 'filled',
        'p-ripple-disabled': ripple === false,
        'layout-theme-light': layoutColorMode === 'light'
    });

    return (
        <div>
            <Route path="/" exact render={() => <Redirect to="/homepage" />} />
            <Route path="/homepage" exact render={() => <Homepage />} />
            <AppTopbar1
                onToggleMenuClick={onToggleMenuClick}
                layoutColorMode={layoutColorMode}
                mobileTopbarMenuActive={mobileTopbarMenuActive}
                onMobileTopbarMenuClick={onMobileTopbarMenuClick}
                onMobileSubTopbarMenuClick={onMobileSubTopbarMenuClick}
            />

            {!isLoggedIn ? (
                <>
                    <Route path="/rejoignez-nous" component={RejoignezNous} />
                    <Route path="/loginform" render={() => <LoginForm onLogin={onLogin} />} />
                </>
            ) : (
                <div className={wrapperClass} onClick={onWrapperClick}>
                    <Tooltip
                        ref={copyTooltipRef}
                        target=".block-action-copy"
                        position="bottom"
                        content="Copied to clipboard"
                        event="focus"
                    />

                    <AppTopbar
                        onToggleMenuClick={onToggleMenuClick}
                        layoutColorMode={layoutColorMode}
                        mobileTopbarMenuActive={mobileTopbarMenuActive}
                        onMobileTopbarMenuClick={onMobileTopbarMenuClick}
                        onMobileSubTopbarMenuClick={onMobileSubTopbarMenuClick}
                    />

                    <div className="layout-sidebar" onClick={onSidebarClick}>
                        <AppMenu model={menu} onMenuItemClick={onMenuItemClick} layoutColorMode={layoutColorMode} />
                    </div>

                    <div className="layout-main-container">
                        <div className="layout-main">
                            {user && (
                                <>
                                    {user.role === "Admin" && (
                                        <>
                                            <Route
                                                path="/admin/home"
                                                exact
                                                render={() => <Dashboard colorMode={layoutColorMode} location={location} />}
                                            />
                                            <Route path="/admin/formlayout" component={FormLayoutDemo} />
                                            <Route path="/admin/input" component={InputDemo} />
                                            <Route path="/admin/floatlabel" component={FloatLabelDemo} />
                                            <Route path="/admin/invalidstate" component={InvalidStateDemo} />
                                            <Route path="/admin/button" component={ButtonDemo} />
                                            <Route path="/admin/fonctions" component={Fonctions} />
                                            <Route path="/admin/id_pieces" component={Identity_piece} />
                                            <Route path={'/admin/dossiers'} component={Dossier} />
                                            <Route path="/admin/table" component={TableDemo} />
                                            <Route path="/admin/list" component={ListDemo} />
                                            <Route path="/admin/tree" component={TreeDemo} />
                                            <Route path="/admin/panel" component={PanelDemo} />
                                            <Route path="/admin/overlay" component={OverlayDemo} />
                                            <Route path="/admin/media" component={MediaDemo} />
                                            <Route path="/admin/menu" component={MenuDemo} />
                                            <Route path="/admin/candidats" component={Candidats} />
                                            <Route path="/admin/agents" component={Agents} />
                                            <Route path="/admin/employeur" component={Employeur} />
                                            <Route path="/admin/reglements" component={Reglement} />
                                            <Route path="/admin/rendez-vous" component={Rendez_vous} />
                                            <Route path="/admin/users" component={AjouterUser} />
                                            <Route path="/admin/messages" component={MessagesDemo} />
                                            <Route path="/admin/blocks" component={BlocksDemo} />
                                            <Route path="/admin/icons" component={IconsDemo} />
                                            <Route path="/admin/file" component={FileDemo} />
                                            <Route path="/admin/chart" render={() => <ChartDemo colorMode={layoutColorMode} location={location} />} />
                                            <Route path="/admin/misc" component={MiscDemo} />
                                            <Route path="/admin/timeline" component={TimelineDemo} />
                                            <Route path="/admin/crud" component={Crud} />
                                            <Route path="/admin/empty" component={EmptyPage} />
                                            <Route path="/admin/documentation" component={Documentation} />

                                        </>
                                    )}
                                    {user.role === "Employeur" && (
                                        <>
                                            <Route path="/employeur/home" component={EmployeurPage} />
                                            {/* Add other employeur-related routes */}
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                        <AppFooter layoutColorMode={layoutColorMode} />
                    </div>
                    <AppConfig
                        rippleEffect={ripple}
                        onRippleEffect={onRipple}
                        inputStyle={inputStyle}
                        onInputStyleChange={onInputStyleChange}
                        layoutMode={layoutMode}
                        onLayoutModeChange={onLayoutModeChange}
                        layoutColorMode={layoutColorMode}
                        onColorModeChange={onColorModeChange}
                    />

                    <CSSTransition classNames="layout-mask" timeout={{ enter: 200, exit: 200 }} in={mobileMenuActive} unmountOnExit>
                        <div className="layout-mask p-component-overlay"></div>
                    </CSSTransition>
                </div>
            )}
        </div>
    );


}

export default App;
