import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar";
import TopBar from "./TopBar";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";

const RootLayout = () => {
  let isTabletMid = useMediaQuery({ query: "(max-width: 768px)" });
  const [open, setOpen] = useState(isTabletMid ? false : true);
  return (
    <div className="flex bg-slate-100 min-h-screen dark:bg-gray-800">
      <Sidebar setOpen={setOpen} open={open} isTabletMid={isTabletMid} />
      <div className="div flex-1 max-w-full">
        <TopBar setOpen={setOpen} open={open} />
        <main className=" p-2 md:p-5 md:ml-[16rem] mt-16"> 
        {/* max-w-5xl m-auto */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default RootLayout;
