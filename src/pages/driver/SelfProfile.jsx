import { Row, Col, Avatar, Tag, Divider, Button } from "antd";
import {
  FiPhone,
  FiMail,
  FiMapPin,
  FiHash,
  FiBriefcase,
  FiCalendar,
} from "react-icons/fi";
import { useState } from "react";
import dayjs from "dayjs";
import toast from "react-hot-toast";

import {
  useInitDriverLicencePaymentMutation,
  useGetMyDriverProfileQuery,
} from "../redux/api/driverApiSlice";

import ViewLicence from "../admin/driver/ViewLicence";
import Loader from "../../components/custom/Loader";

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

const DriverProfilePage = () => {
  /* =====================
     API CALL
  ===================== */
  const { data, isLoading, error } = useGetMyDriverProfileQuery();

  const driver = data?.data;

  const [licenceOpen, setLicenceOpen] = useState(false);

  const [initPayment, { isLoading: paying }] =
    useInitDriverLicencePaymentMutation();

  /* =====================
     STATES
  ===================== */
  if (isLoading) return <Loader />;

  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        Failed to load driver profile
      </div>
    );
  }

  if (!driver) {
    return (
      <div className="p-6 text-center text-gray-500">
        Driver data not found
      </div>
    );
  }

  /* =====================
     DERIVED DATA
  ===================== */
  const effectiveStatus = driver.computed_status ?? driver.status;
  const status = statusStyle[effectiveStatus] || statusStyle.inactive;

  const imageUrl = driver.driver_image
    ? `${import.meta.env.VITE_API_URL}/${driver.driver_image}`
    : null;

  /* =====================
     ACTIONS
  ===================== */
  const handleMakePayment = async () => {
    try {
      const res = await initPayment(driver.id).unwrap();

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
     <div className="card-layout">
      {/* PAGE HEADER */}
    <div className="flex justify-between headerbg items-center py-2 mb-4">
        <h1 className="text-xl font-bold text-gray-600">My Profile</h1> 
    </div>

      <div className="max-w-7xl mx-auto">
        <div className="border rounded-xl p-6 bg-white shadow-sm">
          {/* ================= HEADER ================= */}
          <div className="flex flex-col items-center md:flex-row gap-6 mb-4">
             <Avatar
              size={120}
              src={driver.driver_image}
              style={{ backgroundColor: "#e5e7eb" }}
            >
              {data.user?.name?.charAt(0)}
            </Avatar>
            <div className="flex-1">
              <h2 className="text-2xl font-semibold">
                {driver.user?.name}
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
                    {driver.registration_number}
                  </span>
                </span>

                {["expired", "inactive", "pending"].includes(effectiveStatus) && (
                <Button
                    type="primary"
                    danger
                    loading={paying}
                    onClick={async () => {
                    try {
                        const res = await initPayment(driver.id).unwrap();

                        if (res?.payment_url) {
                        window.open(res.payment_url, "_blank", "noopener,noreferrer");
                        } else {
                        toast.error("Payment gateway unavailable");
                        }
                    } catch {
                        toast.error("Failed to initiate payment");
                    }
                    }}
                >
                    Payment
                </Button>
                )}

                {effectiveStatus === "active" && (
                  <Button
                    type="primary"
                    onClick={() => setLicenceOpen(true)}
                  >
                    View Licence
                  </Button>
                )}
              </div>
            </div>
          </div>

          <Divider />

          {/* ================= BASIC INFO ================= */}
          <Row gutter={[16, 16]}>
            {driver.latest_licence && (
              <>
                <Col md={12} xs={24}>
                  <InfoItem icon={<FiCalendar />} label="Active Fiscal Year">
                    <span className="font-semibold text-blue-600">
                      {driver.latest_licence?.fiscal_year?.name ??
                        `${dayjs(driver.latest_licence.start_date).year()}–${dayjs(
                          driver.latest_licence.end_date
                        ).year()}`}
                    </span>
                  </InfoItem>
                </Col>

                <Col md={12} xs={24}>
                  <InfoItem icon={<FiCalendar />} label="Expiry Date">
                    <span className="font-semibold text-red-600">
                      {dayjs(driver.latest_licence.end_date).format(
                        "DD MMM YYYY"
                      )}
                    </span>
                  </InfoItem>
                </Col>
              </>
            )}

            <Col md={12} xs={24}>
              <InfoItem icon={<FiPhone />} label="Phone">
                {driver.user?.phone || "N/A"}
              </InfoItem>
            </Col>

            <Col md={12} xs={24}>
              <InfoItem icon={<FiMail />} label="Email">
                {driver.user?.email || "N/A"}
              </InfoItem>
            </Col>

            <Col md={12} xs={24}>
              <InfoItem icon={<FiHash />} label="NID">
                {driver.nid || "N/A"}
              </InfoItem>
            </Col>

            <Col md={12} xs={24}>
              <InfoItem icon={<FiBriefcase />} label="Experience">
                {driver.years_of_experience} years
              </InfoItem>
            </Col>

            <Col md={12} xs={24}>
              <InfoItem icon={<FiCalendar />} label="Registration Date">
                {dayjs(driver.registration_date).format("DD MMM YYYY")}
              </InfoItem>
            </Col>
          </Row>

          <Divider />

          {/* ================= ADDRESS ================= */}
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <FiMapPin /> Address Information
          </h3>

          <Row gutter={[16, 16]}>
            <Col md={12} xs={24}>
              <AddressBox title="Present Address">
                <div><b>Village:</b> {driver.present_village || "N/A"}</div>
                <div><b>Ward:</b> {driver.present_ward || "N/A"}</div>
                <div><b>Union:</b> {driver.present_union?.name || "N/A"}</div>
                <div><b>Upazila:</b> {driver.present_upazila?.name || "N/A"}</div>
                <div><b>District:</b> {driver.present_district?.name || "N/A"}</div>
                <div><b>Division:</b> {driver.present_division?.name || "N/A"}</div>
              </AddressBox>
            </Col>

            <Col md={12} xs={24}>
              <AddressBox title="Permanent Address">
                <div><b>Village:</b> {driver.permanent_village || "N/A"}</div>
                <div><b>Ward:</b> {driver.permanent_ward || "N/A"}</div>
                <div><b>Union:</b> {driver.permanent_union?.name || "N/A"}</div>
                <div><b>Upazila:</b> {driver.permanent_upazila?.name || "N/A"}</div>
                <div><b>District:</b> {driver.permanent_district?.name || "N/A"}</div>
                <div><b>Division:</b> {driver.permanent_division?.name || "N/A"}</div>
              </AddressBox>
            </Col>
          </Row>
        </div>

        {/* ================= LICENCE MODAL ================= */}
        <ViewLicence
          open={licenceOpen}
          onClose={() => setLicenceOpen(false)}
          driver={driver}
        />
      </div>
    </div>
  );
};

/* =====================
   SUB COMPONENTS
===================== */

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

export default DriverProfilePage;
