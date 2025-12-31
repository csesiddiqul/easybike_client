import { Modal, Row, Col, Avatar, Tag, Divider, Button } from "antd";
import {
  FiPhone,
  FiMail,
  FiMapPin,
  FiHash,
  FiBriefcase,
  FiCalendar,
} from "react-icons/fi";
import { useState } from "react";
import ViewLicence from "./ViewLicence";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import { useInitDriverLicencePaymentMutation } from "../../redux/api/driverApiSlice";

/* =====================
   STATUS STYLE MAP
===================== */
const statusStyle = {
  pending: { bg: "#facc15", text: "Pending" },
  active: { bg: "#16a34a", text: "Active" },
  expired: { bg: "#dc2626", text: "Expired" },
  suspended: { bg: "#ea580c", text: "Suspended" },
  inactive: { bg: "#6b7280", text: "Inactive" },
};

const ViewDriver = ({ open, onClose, data }) => {
  if (!data) return null;

  const [licenceOpen, setLicenceOpen] = useState(false);

  const status = statusStyle[data.status] || statusStyle.inactive;
  const driverStatus = data.computed_status ?? data.status;

  const [initPayment, { isLoading }] =
    useInitDriverLicencePaymentMutation();

  const handleMakePayment = async (driverId) => {
    try {
      const res = await initPayment(driverId).unwrap();

      if (res?.payment_url) {
        window.location.href = res.payment_url;
      } else {
        toast.error("Payment gateway unavailable");
      }
    } catch {
      toast.error("Failed to initiate payment");
    }
  };

  return (
    <>
      <Modal
        className="modal"
        open={open}
        onCancel={onClose}
        footer={null}
        width={900}
        title="Driver Profile"
      >
        <div className="border rounded-lg p-5 bg-white">
          {/* HEADER */}
          <div className="flex items-center gap-6 mb-4">
            <Avatar
              size={120}
              src={data.driver_image}
              style={{ backgroundColor: "#e5e7eb" }}
            >
              {data.user?.name?.charAt(0)}
            </Avatar>

            <div className="flex-1">
              <h2 className="text-2xl font-semibold">
                {data.user?.name}
              </h2>

              <div className="flex flex-wrap items-center gap-3 mt-2">
                <Tag
                  style={{
                    backgroundColor: status.bg,
                    color: "#fff",
                    border: "none",
                    fontWeight: 500,
                  }}
                >
                  {status.text}
                </Tag>

                <span className="text-gray-500 text-sm">
                  Reg No:
                  <span className="font-bold text-gray-900 ml-1">
                    {data.registration_number}
                  </span>
                </span>

                {["expired", "inactive", "pending"].includes(driverStatus) && (
                  <Button
                    type="primary"
                    danger
                    loading={isLoading}
                    onClick={() => handleMakePayment(data.id)}
                  >
                    Make Payment
                  </Button>
                )}

                {driverStatus === "active" && (
                  <Button
                    type="primary"
                    onClick={() => {
                      onClose();
                      setLicenceOpen(true);
                    }}
                  >
                    View Licence
                  </Button>
                )}
              </div>
            </div>
          </div>

          <Divider />

          {/* BASIC INFO */}
          <Row gutter={[16, 16]}>
            {data.latest_licence && (
              <>
                <Col md={12} xs={24}>
                  <InfoItem icon={<FiCalendar />} label="Active Fiscal Year">
                    <span className="font-semibold text-blue-600">
                      {data.latest_licence.fiscal_year}
                    </span>
                  </InfoItem>
                </Col>

                <Col md={12} xs={24}>
                  <InfoItem icon={<FiCalendar />} label="Expiry Date">
                    <span className="font-semibold text-red-600">
                      {dayjs(data.latest_licence.end_date).format(
                        "DD MMM YYYY"
                      )}
                    </span>
                  </InfoItem>
                </Col>
              </>
            )}

            <Col md={12} xs={24}>
              <InfoItem icon={<FiPhone />} label="Phone">
                {data.user?.phone || "N/A"}
              </InfoItem>
            </Col>

            <Col md={12} xs={24}>
              <InfoItem icon={<FiMail />} label="Email">
                {data.user?.email || "N/A"}
              </InfoItem>
            </Col>

            <Col md={12} xs={24}>
              <InfoItem icon={<FiHash />} label="NID Number">
                {data.nid || "N/A"}
              </InfoItem>
            </Col>

            <Col md={12} xs={24}>
              <InfoItem icon={<FiBriefcase />} label="Experience">
                {data.years_of_experience || 0} years
              </InfoItem>
            </Col>

            <Col md={12} xs={24}>
              <InfoItem icon={<FiCalendar />} label="Registration Date">
                {dayjs(data.registration_date).format("DD MMM YYYY")}
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
                {data.present_address}
              </AddressBox>
            </Col>
            <Col md={12} xs={24}>
              <AddressBox title="Permanent Address">
                {data.permanent_address}
              </AddressBox>
            </Col>
          </Row>
        </div>
      </Modal>

      {/* LICENCE MODAL */}
      <ViewLicence
        open={licenceOpen}
        onClose={() => setLicenceOpen(false)}
        driver={data}
      />
    </>
  );
};

/* SUB COMPONENTS */

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
    <p className="font-medium">{children}</p>
  </div>
);

export default ViewDriver;
