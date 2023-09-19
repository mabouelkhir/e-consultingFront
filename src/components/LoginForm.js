import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import axios from "axios"; // Import Axios

const LoginForm = ({ onLogin }) => {
    const history = useHistory();

    // Define state variables for email and password
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Handle form submission
    const handleSubmit = async () => {
        try {
            const response = await axios.post("http://localhost:8080/api/auth/login", {
                email: email,
                password: password,
            });

            // Assuming the login is successful and the server returns user data
            const userData = response.data;

            // You can call the onLogin callback to update the login status
            onLogin(userData);

            // Redirect to the desired page (e.g., homepage)
            history.push("/admin/home");
        } catch (error) {
            // Handle login failure, e.g., show an error message
            console.error("Login error:", error);
            // You can display an error message to the user here
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
