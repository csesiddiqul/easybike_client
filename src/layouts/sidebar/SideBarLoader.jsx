import React from "react";
import { Skeleton } from "antd";

const SideBarLoader = () => {
  return (
    <div className="text-center">
      {Array.from({ length: 10 }).map((i) => (
        <Skeleton.Button key={i} active className="mt-1" style={{ width: "240px" }} />
      ))}
    </div>
  );
};

export default SideBarLoader;
