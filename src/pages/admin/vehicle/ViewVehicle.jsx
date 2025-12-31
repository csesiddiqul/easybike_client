import { Modal, Descriptions, Badge } from "antd";

const ViewVehicle = ({ open, onClose, editData }) => {
  if (!editData) return null;

  const driver = editData.current_driver?.driver;
  const owner = editData?.owner;
  return (
    <Modal
      open={open}a
      onCancel={onClose}
      footer={null}
      title="Vehicle Details"
      width={1000}
    >
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
              editData.status === "approved"
                ? "success"
                : editData.status === "pending"
                  ? "warning"
                  : "error"
            }
          />
        </Descriptions.Item>


        {/* ================= Owner INFO ================= */}

        <Descriptions.Item label="Owner Information">
          {owner ? (
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="Name">
                {owner.name}
              </Descriptions.Item>

              <Descriptions.Item label="Phone">
                {owner.phone}
              </Descriptions.Item>

              <Descriptions.Item label="Email">
                {owner.email}
              </Descriptions.Item>

         

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
        </Descriptions.Item>

        <hr />


        <Descriptions.Item label="Driver Information">
          {driver ? (
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="Name">
                {driver.name}
              </Descriptions.Item>

              <Descriptions.Item label="Phone">
                {driver.phone}
              </Descriptions.Item>

              <Descriptions.Item label="Email">
                {driver.email}
              </Descriptions.Item>

              <Descriptions.Item label="Username">
                {driver.user_name}
              </Descriptions.Item>

              <Descriptions.Item label="Driver Registration Status">
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
        </Descriptions.Item>

      </Descriptions>
    </Modal>
  );
};

export default ViewVehicle;
