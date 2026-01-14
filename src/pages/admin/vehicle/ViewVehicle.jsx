import { Modal, Descriptions, Badge } from "antd";

const ViewVehicle = ({ open, onClose, editData }) => {
  if (!editData) return null;

  const driver = editData.current_driver?.driver;
  const owner = editData?.owner;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title="Vehicle Details"
      width={1000}
    >
      {/* ================= VEHICLE INFO ================= */}
      <fieldset className="bg-slate-100 rounded px-4 py-3 border-2 border-gray-300 mb-4">
        <legend className="px-2 font-semibold">Vehicle Information</legend>

        <Descriptions bordered column={1} size="middle">
          <Descriptions.Item label="Registration Number">
            {editData.registration_number}
          </Descriptions.Item>

          <Descriptions.Item label="Vehicle Type">
            {editData.vehicle_type}
          </Descriptions.Item>

          <Descriptions.Item label="Supplier Type">
            {editData.supplier_type}
          </Descriptions.Item>

          <Descriptions.Item label="Vehicle Model">
            {editData.vehicle_model_name}
          </Descriptions.Item>

          <Descriptions.Item label="Chassis Number">
            {editData.chassis_number}
          </Descriptions.Item>

          <Descriptions.Item label="Vehicle Status">
            <Badge
              text={editData.status}
              status={
                editData.status === "active"
                  ? "success"
                  : editData.status === "pending"
                  ? "warning"
                  : "error"
              }
            />
          </Descriptions.Item>
        </Descriptions>
      </fieldset>

      {/* ================= OWNER INFO ================= */}
      <fieldset className="bg-green-100 rounded px-4 py-3 border-2 border-gray-300 mb-4">
        <legend className="px-2 font-semibold">Owner Information</legend>

        {owner ? (
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="Name">{owner.name}</Descriptions.Item>
            <Descriptions.Item label="Phone">{owner.phone}</Descriptions.Item>
            <Descriptions.Item label="Email">{owner.email}</Descriptions.Item>

            <Descriptions.Item label="Owner Account Status">
              <Badge
                text={owner.status}
                status={owner.status === "Active" ? "success" : "error"}
              />
            </Descriptions.Item>
          </Descriptions>
        ) : (
          <Badge text="No owner assigned" status="default" />
        )}
      </fieldset>

      {/* ================= DRIVER INFO ================= */}
      <fieldset className="bg-blue-100 rounded px-4 py-3 border-2 border-gray-300">
        <legend className="px-2 font-semibold">Driver Information</legend>

        {driver ? (
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="Name">{driver.name}</Descriptions.Item>
            <Descriptions.Item label="Phone">{driver.phone}</Descriptions.Item>
            <Descriptions.Item label="Email">{driver.email}</Descriptions.Item>
            <Descriptions.Item label="Username">{driver.user_name}</Descriptions.Item>

            <Descriptions.Item label="Driver Status">
              <Badge
                text={driver.status}
                status={driver.status === "Active" ? "success" : "error"}
              />
            </Descriptions.Item>

            <Descriptions.Item label="Assigned From">
              {editData.current_driver.start_date}
            </Descriptions.Item>

            <Descriptions.Item label="Assignment Status">
              <Badge
                text={editData.current_driver.status}
                status={
                  editData.current_driver.status === "active"
                    ? "success"
                    : "default"
                }
              />
            </Descriptions.Item>
          </Descriptions>
        ) : (
          <Badge text="No driver assigned" status="default" />
        )}
      </fieldset>
    </Modal>
  );
};

export default ViewVehicle;
