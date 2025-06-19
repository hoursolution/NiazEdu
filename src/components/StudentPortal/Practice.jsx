import React from "react";
import logo from "../../assets/zeenlogo.png";

const Practice = () => {
  return (
    <>
      <div>
        {/* main div */}
        <div className=" flex justify-around items-center ">
          {/* 4 divs */}
          <div className="h-[190px]  bg-red-600 w-[360px] rounded-lg shadow-xl">
            {/* further divs */}
            <div className=" flex gap-3 p-2">
              <div className="flex flex-col justify-between gap-8">
                <div className="flex gap-3 flex-col">
                  <p className="text-lg font-bold text-white">WELCOME JONE.</p>
                  <p className="text-xs font-medium  text-white">
                    Lorem ipsum dolor sit amet consectetur
                  </p>
                </div>
                <div className=" text-center">
                  <button className="px-10 py-2 bg-blue-500 rounded-lg shadow-lg hover:bg-blue-400 hover:text-white">
                    Submit
                  </button>
                </div>
              </div>
              <div className="flex flex-col justify-end items-center mb-4">
                <div className="h-20 w-20 bg-white rounded-lg shadow-xl"></div>
              </div>
            </div>
          </div>
          <div className="h-[160px]  bg-red-600 w-[200px]">1</div>
          <div className="h-[160px]  bg-red-600 w-[200px]">1</div>
          <div className="h-[160px]  bg-red-600 w-[200px]">1</div>
        </div>
      </div>
    </>
  );
};

export default Practice;
