import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

const LoginForm = ({ onLogin }) => {
    const history = useHistory();
    
    // Define state variables for email and password
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Handle form submission
    const handleSubmit = () => {
        // You can add your login logic here, e.g., making an API call
        // Assuming the login is successful, you can call the onLogin callback
        // and redirect to another page, like this:
        if (email === "example@email.com" && password === "password") {
            onLogin(); // Call the onLogin callback to update the login status
            history.push("/home"); // Redirect to the desired page (e.g., homepage)
        } else {
            // Handle login failure, e.g., show an error message
        }
    };

    return (
        <div className="flex align-items-center justify-content-center h-screen">
            <div className="surface-card p-8 shadow-2 border-round  lg:w-3">
                <div className="text-center mb-5">
                    <img src="images/blocks/logos/hyper.svg" alt="hyper" height="50" className="mb-1/3" />
                    <div className="text-900 text-3xl font-medium mb-3">Welcome Back</div>
                </div>

                <div>
                    <label htmlFor="email1" className="block text-900 font-medium mb-2">
                        Email
                    </label>
                    <InputText
                        id="email1"
                        type="text"
                        className="w-full mb-3"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <label htmlFor="password1" className="block text-900 font-medium mb-2">
                        Password
                    </label>
                    <InputText
                        id="password1"
                        type="password"
                        className="w-full mb-3"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <div className="flex align-items-center justify-content-between mb-6"></div>

                    <Button label="Login" className="w-full" onClick={handleSubmit} />
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
