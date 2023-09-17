


import React from 'react';
import { Button } from 'primereact/button';
import { Link } from 'react-router-dom';
import { Menubar } from 'primereact/menubar';
import { InputText } from 'primereact/inputtext';








const Homepage= () => {
   

   return (
       <div className="grid">
           <div className="col-12 md:col-6 p-6 text-center md:text-left flex align-items-center">
               <section>
                   <span className="block text-6xl font-bold mb-1">Créez votre Avenir</span>
                   <div className="flex items-center justify-center text-6xl text-primary font-bold mb-3">avec nous</div>

                   <Link to="/rejoignez-nous">
                   <Button label="Rejoignez-nous" type="button" className="mr-3 p-button-raised" />
                   </Link>
                  
                 
               </section>
           </div>
           <div className="col-12 md:col-6 overflow-hidden">
               <img src="images/blocks/hero/hero-1.png" alt="hero-1" className="md:ml-auto block md:h-full" style={{ clipPath: 'polygon(8% 0, 100% 0%, 100% 100%, 0 100%)' }} />
           </div>
       </div>
   );
}

export default Homepage;
