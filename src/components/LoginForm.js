import React, { useState } from "react";
import { InputText } from "primereact/inputtext"; // Importez correctement le composant InputText depuis votre bibliothèque
import { Checkbox } from "primereact/checkbox"; // Importez correctement le composant Checkbox depuis votre bibliothèque
import { Button } from "primereact/button"; // Importez correctement le composant Button depuis votre bibliothèque

const LoginForm = () => {
    const [checked, setChecked] = useState(false);

    return (
        <div className="flex align-items-center justify-content-center h-screen ">
            <div className="surface-card p-8 shadow-2 border-round  lg:w-3">
                <div className="text-center mb-5">
                    <img src="images/blocks/logos/hyper.svg" alt="hyper" height="50" className="mb-1/3" />
                    <div className="text-900 text-3xl font-medium mb-3">Welcome Back</div>
                </div>

                <div>
                    <label htmlFor="email1" className="block text-900 font-medium mb-2">
                        Email
                    </label>
                    <InputText id="email1" type="text" className="w-full mb-3" />

                    <label htmlFor="password1" className="block text-900 font-medium mb-2">
                        Password
                    </label>
                    <InputText id="password1" type="password" className="w-full mb-3" />

                    <div className="flex align-items-center justify-content-between mb-6"></div>

                    <Button label="Sign In" icon="pi pi-user" className="w-full" />
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
