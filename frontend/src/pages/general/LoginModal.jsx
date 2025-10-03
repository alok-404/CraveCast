import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";




const LoginModal = () => {
  const navigate = useNavigate();

  //animations
  const modalRef = useRef(null)

  useEffect(() => {
    gsap.from(modalRef.current, {
      scale: 0.8,
      delay: 0.5,
      duration: 3,
      ease: "elastic.out(1,0.3)"
    });
  }, []);



  return (
    <div  className="fixed inset-0 bg-white bg-opacity-50 flex  flex-col items-center justify-center z-50 gap-4">

        <h1 className="text-5xl text-[font1] ">CraveCast</h1>

      <div
    ref={modalRef}
      className="h-90 w-90">
        <div className=" h-1/2 ">
          <img src="/public/Bear Clipart Cartoon.jpg" alt="" />
        </div>

        <div className="flex flex-col items-center p-6 rounded-lg shadow-lg ">
          <h2 className="mt-2 text-xl font-bold mb-4">Login Required</h2>

          {/* <button
          onClick={onClose}
          className=" bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Close
        </button> */}

          <button
            onClick={() => {
              navigate("/user/login");
            }}
            className=" bg-[#fa5306] text-white px-4 -ml-3 py-2 rounded hover:bg-[#f04d02]"
          >
            Login please
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
