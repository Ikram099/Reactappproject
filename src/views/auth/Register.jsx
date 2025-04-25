import Registerform from "../../components/auth/registerform";

function Register () {
    return ( <div className="bg-gray-100 flex justify-center items-center h-screen">
         <div className="lg:p-36 md:p-52 sm:p-20 p-8 w-full lg:w-1/2">
          <h1 className="text-2xl font-semibold mb-4">Register </h1>
        
        <Registerform></Registerform>
          
        </div>
        <div className="w-1/2 h-screen hidden lg:block">
          <img
            src="https://placehold.co/800x/667fff/ffffff.png?text=Your+Image&font=Montserrat"
            alt="Placeholder"
            className="object-cover w-full h-full"
          />
        </div>
        
       
      </div> );
}

export default Register ;