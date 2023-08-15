import React from 'react';

export const AppFooter = (props) => {

    return (
        <div className="layout-footer">
            <img src={props.layoutColorMode === 'light' ? 'assets/layout/images/logo.png' : 'assets/layout/images/logo.png'} alt="Logo" height="20" className="mr-3" />
            by
            <span className="font-medium ml-2">PMI CONSULTING</span>
        </div>
    );
}
