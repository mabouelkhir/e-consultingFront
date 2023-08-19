import React, { useRef,useState } from 'react';
import { Toast } from 'primereact/toast';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';

export default function RejoignezNous() {
    const toast = useRef(null);
    const [checked, setChecked] = useState(false);

    const onUpload = () => {
        toast.current.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
    };

    return (
        <div className=" h-screen mt-8 w-5 mx-auto">
                <div className=" p-4 border surface-card w-full">
    
        
                <div className="text-center mb-5">
                <img src={process.env.PUBLIC_URL + '/images/blocks/logos/hyper.svg'} alt="hyper" height="150" className="mb-3" />

                    <div className="text-900 text-3xl font-medium mb-3">Welcome Back</div>
                   
                </div>

                <div className="">
                    <label htmlFor="firstname" className="block text-700 font-medium mb-1">FirstName</label>
                    <InputText id="firstname" type="text" className="w-full mb-2" />

                    <label htmlFor="lastname" className="block text-900 font-medium mb-2">LastName</label>
                    <InputText id="lastname" type="text" className="w-full mb-3" />

                    <label htmlFor="email1" className="block text-900 font-medium mb-2">Email</label>
                    <InputText id="email1" type="text" className="w-full mb-3" />

                    <label htmlFor="password1" className="block text-900 font-medium mb-2">Password</label>
                    <InputText id="password1" type="password" className="w-full mb-3" />
                    

                    <div className="mb-3">
                        <label htmlFor="file" className="block text-900 font-medium mb-2">Postuler votre CV</label>
                        <FileUpload mode="basic" name="demo[]" url="/api/upload" accept="image/*" maxFileSize={1000000} onUpload={onUpload} />
                    </div>

                    

                    <Button label="Sign In" icon="pi pi-user" className="w-full" />
                </div>
            </div>
        </div>
    );
}
