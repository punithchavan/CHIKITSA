import React from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import patientai from "../../assets/patientai.png";
import chikitsa_logo from "../../assets/chikitsa_logo.png";
import chikitsa_name from "../../assets/chikitsa_name.png";
import { MdSettings } from "react-icons/md";

function Patientpage() {
  const navigate = useNavigate();

  return (
    <>
      {/* Main div container */}
      <div className="flex flex-col w-screen h-screen ">
        {/*nagigation bar*/}
        <div className="flex flex-row p-5 items-center justify-between h-max w-full shadow-md bg-white">
        {/* Left side: logo + text */}
        <div className="flex items-center">
          <img src={chikitsa_logo} alt='chikitsa_logo' className="w-12 h-10" />
          <p className="font-bold text-2xl ml-5">CHIKITSA</p>
        </div>
        {/* Right side: settings icon */}
        <button>
          <MdSettings size={30} color="black" />
        </button>
        </div>

        {/*left pannel-> patient pic, details*/}
        <div className="flex flex-col items-center p-3">
          
        </div>
      </div>
    </>
  );
}

export default Patientpage;
