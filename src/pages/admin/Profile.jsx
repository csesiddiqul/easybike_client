import { Tabs } from "antd";
import React from "react";
import { assets } from "../../assets";
import { ChangePassword } from "../../components/ChangePassword";
import Loader from "../../components/custom/Loader";
import { useAuthorized } from "../../hooks/useAuthorized";

const Profile = () => {
  const { user, isLoading } = useAuthorized();
  const onChange = (key) => {
    console.log(key);
  };
  const items = [
    {
      key: "1",
      label: "Profile Information",
      children: "Content of Tab Pane 1",
    },
    {
      key: "2",
      label: "Change Password",
      children: <ChangePassword />,
    },
  ];

  if (isLoading) {
    return <Loader />;
  }
  return (
    <div className="grid gap-4 grid-cols-12">
      <div className="col-span-4 ">
        <div className="card-layout h-full">
          <div className="text-center mb-5">
            <img
              className="w-28 h-28 object-fill rounded-full border m-auto my-4"
              src={assets.no_image}
              alt=""
            />
            <h4 className="font-semibold text-gray-600 mb-2">{user?.name}</h4>
            <small className="text-gray-500 font-semibold bg-green-50 border-green-300 border py-1 px-3 rounded-xl">
              {user?.role?.name}
            </small>
            <p className="text-gray-500 mt-2">{user?.email}</p>
          </div>
        </div>
      </div>
      <div className="col-span-8">
        <div className="card-layout h-full">
          <div>
            <Tabs defaultActiveKey="2" items={items} onChange={onChange} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
