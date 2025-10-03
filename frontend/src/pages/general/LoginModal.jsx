import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { Utensils, LogIn } from "lucide-react";

const LoginModal = () => {
  const navigate = useNavigate(); // GSAP animation reference

  const modalRef = useRef(null);
  const containerRef = useRef(null); // Ref to hide the entire backdrop/modal

  useEffect(() => {
    gsap.from(modalRef.current, {
      scale: 0.7,
      delay: 0.2,
      // duration: 0.5,
      ease: "elastic.out(1,0.3)",
    });
  }, ); 

  const handleLoginClick = () => {
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        opacity: 0,
        scale: 0.8,
        duration: 0.5,
        onComplete: () => navigate("/user/login"),
      });
    } else {
      navigate("/user/login");
    }
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-black/85 flex flex-col items-center justify-center z-[999] p-4"
    >

      <div
        ref={modalRef}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-500 transform scale-100"
      >
     {/* Header/Branding Area: Vibrant Orange */} 
        <div className="p-6 bg-[#fa5306] text-white text-center flex flex-col items-center">
                    <Utensils className="w-10  mb-2" />         {" "}
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-wider">
            CraveCast
          </h1>
                 {" "}
        </div>
                {/* Image/Content Area */}       {" "}
        <div className="flex flex-col items-center p-8 pt-2">
                              {/* Image */}         {" "}
          <div className="w-32 h-32 mb-4">
                       {" "}
            <img
              src="/Bear Clipart Cartoon.jpg"
              alt="Chef Mascot"
              className="w-full h-full object-contain rounded-full shadow-md"
            />
                     {" "}
          </div>
                   {" "}
          <h2 className=" text-3xl font-extrabold text-gray-900 mb-2">
            Taste the Feed!
          </h2>
                   {" "}
          <p className="text-md text-gray-600 mb-8 text-center font-medium">
                         Join the CraveCast community to find your best resturant in a second and like, comment, save your favorite reels          {" "}
          </p>
                    {/* Login Button: Green for high contrast and strong CTA */}
                   {" "}
          <button
            onClick={handleLoginClick}
            className="w-full flex items-center justify-center space-x-2 bg-green-500 text-white font-extrabold py-3.5 rounded-full hover:bg-green-600 transition-colors shadow-xl shadow-green-500/30"
          >
                        <LogIn className="w-5 h-5" />           {" "}
            <span>Start My Cravings!</span>         {" "}
          </button>
                 {" "}
        </div>
             {" "}
      </div>
         {" "}
    </div>
  );
};

export default LoginModal;
