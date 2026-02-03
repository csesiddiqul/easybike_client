import { Modal, Row, Col, Avatar, Tag, Divider, Button } from "antd";
import {
  FiPhone,
  FiMail,
  FiMapPin,
  FiHash,
  FiCalendar,
  FiUser,
} from "react-icons/fi";
import { enlocalDateFormat } from "../../../utils/main/dateFormat";

const ViewUser = ({ open, onClose, editData }) => {
  if (!editData) return null;

  const user = editData?.user;

  return (
    <Modal
      className="modal"
      open={open}
      onCancel={onClose}
      footer={null}
      width={900}
      title="Owner Profile"
    >
      <div className="border rounded-lg p-5 bg-white">
        {/* HEADER */}
        <div className="flex items-center gap-6 mb-4">
          <Avatar
            size={120}
            src={editData?.image}
            style={{ backgroundColor: "#e5e7eb" }}
          >
            {user?.name?.charAt(0)}
          </Avatar>

          <div className="flex-1">
            <h2 className="text-2xl font-semibold">
              {user?.name || "N/A"}
            </h2>

            <div className="flex flex-wrap items-center gap-3 mt-2">
              <Tag color={user?.status === "Active" ? "green" : "red"}>
                {user?.status}
              </Tag>
            </div>
          </div>
        </div>

        <Divider />

        {/* BASIC INFO */}
        <Row gutter={[16, 16]}>
          <Col md={12} xs={24}>
            <InfoItem icon={<FiPhone />} label="Phone">
              {user?.phone || "N/A"}
            </InfoItem>
          </Col>

          <Col md={12} xs={24}>
            <InfoItem icon={<FiMail />} label="Email">
              {user?.email || "N/A"}
            </InfoItem>
          </Col>

          <Col md={12} xs={24}>
            <InfoItem icon={<FiUser />} label="Father / Husband">
              {editData?.father_or_husband_name || "N/A"}
            </InfoItem>
          </Col>

          <Col md={12} xs={24}>
            <InfoItem icon={<FiHash />} label="NID Number">
              {editData?.nid_number || "N/A"}
            </InfoItem>
          </Col>

          <Col md={12} xs={24}>
            <InfoItem icon={<FiHash />} label="Birth Reg Number">
              {editData?.birth_registration_number || "N/A"}
            </InfoItem>
          </Col>

          <Col md={12} xs={24}>
            <InfoItem icon={<FiCalendar />} label="Created At">
              {editData?.created_at
                ? enlocalDateFormat(editData.created_at)
                : "N/A"}
            </InfoItem>
          </Col>
        </Row>

        <Divider />

        {/* ADDRESS */}
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <FiMapPin /> Address Information
        </h3>

        <Row gutter={[16, 16]}>
          <Col md={12} xs={24}>
            <AddressBox title="Present Address">
              <div><b>Village:</b> {editData?.present_village || "N/A"}</div>
              <div><b>Ward:</b> {editData?.present_ward || "N/A"}</div>
              <div><b>Union:</b> {editData?.present_union?.name || "N/A"}</div>
              <div><b>Upazila:</b> {editData?.present_upazila?.name || "N/A"}</div>
              <div><b>District:</b> {editData?.present_district?.name || "N/A"}</div>
              <div><b>Division:</b> {editData?.present_division?.name || "N/A"}</div>
            </AddressBox>
          </Col>

          <Col md={12} xs={24}>
            <AddressBox title="Permanent Address">
              <div><b>Village:</b> {editData?.permanent_village || "N/A"}</div>
              <div><b>Ward:</b> {editData?.permanent_ward || "N/A"}</div>
              <div><b>Union:</b> {editData?.permanent_union?.name || "N/A"}</div>
              <div><b>Upazila:</b> {editData?.permanent_upazila?.name || "N/A"}</div>
              <div><b>District:</b> {editData?.permanent_district?.name || "N/A"}</div>
              <div><b>Division:</b> {editData?.permanent_division?.name || "N/A"}</div>
            </AddressBox>
          </Col>
        </Row>
      </div>
    </Modal>
  );
};

/* SUB COMPONENTS (same as driver) */

const InfoItem = ({ icon, label, children }) => (
  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200">
      {icon}
    </div>
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-medium">{children}</p>
    </div>
  </div>
);

const AddressBox = ({ title, children }) => (
  <div className="border rounded-lg p-3 bg-gray-50">
    <p className="text-sm text-gray-500 mb-1">{title}</p>
    <div className="space-y-1">{children}</div>
  </div>
);

export default ViewUser;
