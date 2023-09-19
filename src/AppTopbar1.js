import React  from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';


export const AppTopbar1 = (props) => {

    return (
        <div className="layout-topbar">
        <Link to="/" className="layout-topbar-logo">
            <img src={props.layoutColorMode === 'light' ? 'assets/layout/images/logo.png' : 'assets/layout/images/logo.png'} alt="logo"/>
            <span>PMI CONSULTING</span>
        </Link>
    
            <button type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={props.onMobileTopbarMenuClick}>
                <i className="pi pi-ellipsis-v" />
            </button>

            <ul className={classNames("layout-topbar-menu lg:flex origin-top", {'layout-topbar-menu-mobile-active': props.mobileTopbarMenuActive })}>
                <li>
                    <Link to="/loginform" className="p-link layout-topbar-button">
                        <i className="pi pi-user"/>
                        <span>Profile</span>
                    </Link>
                </li>
        


                   
                  
                </ul>
        </div>
    );
}
