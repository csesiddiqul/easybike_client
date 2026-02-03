import { Modal, Button } from "antd";
import dayjs from "dayjs";
import { useGetSystemSettingsQuery } from "../../redux/api/systemSettingApiSlice";

const VehicleLicence = ({ open, onClose, vehicle }) => {
  if (!vehicle) return null;

  const { data: settingRes } = useGetSystemSettingsQuery();
  const setting = settingRes?.data;

  const cityName = setting?.city_corporation_name || "পৌরসভা";
  const cityLogo = setting?.city_corporation_logo || null;

  const licence = vehicle.active_license;

  const fiscalYear = licence
    ? `${dayjs(licence.expired_at).year() - 1}–${dayjs(
        licence.expired_at
      ).year()}`
    : "";

  const expiryDate = licence
    ? dayjs(licence.expired_at).format("DD MMM YYYY")
    : "";

  /* =========================
     QR DATA (NO PACKAGE)
  ========================= */
  const qrData = licence
    ? `
City: ${cityName}
Registration No: ${vehicle.registration_number}
Vehicle Type: ${vehicle.vehicle_type}
Model: ${vehicle.vehicle_model_name}
Fiscal Year: ${fiscalYear}
Valid Till: ${expiryDate}
`
    : "";

  const qrUrl = qrData
    ? `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
        qrData
      )}`
    : "";

  /* =========================
     PRINT FUNCTION
  ========================= */
  const handlePrint = () => {
    const printArea = document.getElementById("print-area");
    if (!printArea) return;

    const originalContents = document.body.innerHTML;

    document.body.innerHTML = `
      <html>
        <head>
          <title>Vehicle Licence</title>
        </head>
        <body>
          ${printArea.outerHTML}
        </body>
      </html>
    `;

    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  return (
    <Modal open={open} onCancel={onClose} footer={null} width={780}>
      {/* PRINT AREA */}
      <div
        id="print-area"
        style={{
          background: "rgb(118 255 177)",
          border: "4px solid #6b2c91",
          padding: 8,
          fontFamily: `"SolaimanLipi","Noto Serif Bengali", Arial`,
        }}
      >
        <div style={{ border: "2px solid #6b2c91", padding: 16 }}>
          {/* HEADER */}
          <div style={{ textAlign: "center" }}>
            {cityLogo && (
              <img
              className="m-auto"
                src={cityLogo}
                alt="logo"
                style={{ height: 65, marginBottom: 10 }}
              />
            )}
            <div
              style={{
                fontSize: 30,
                fontWeight: "bold",
                color: "#8b0033",
              }}
            >
              {cityName}
            </div>

            {licence && (
              <div style={{ fontSize: 18 }}>
                {fiscalYear} অর্থ বছর, মেয়াদ: {expiryDate} পর্যন্ত
              </div>
            )}
          </div>

          {/* TITLE */}
          <div style={{ textAlign: "center", margin: "16px 0" }}>
            <span
              style={{
                background: "#1e40af",
                color: "#fff",
                padding: "6px 22px",
                borderRadius: 20,
                fontSize: 20,
              }}
            >
              যানবাহন লাইসেন্স
            </span>
          </div>

          {/* REG NO */}
          <div style={{ textAlign: "center", fontSize: 22 }}>
            রেজি নং –
            <span
              style={{
                fontSize: 28,
                fontWeight: "bold",
                marginLeft: 6,
              }}
            >
              {vehicle.registration_number}
            </span>
          </div>

          {/* BODY WITH QR */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 20,
              marginTop: 20,
            }}
          >
            {/* LEFT INFO */}
            <div style={{ flex: 1, fontSize: 18 }}>
              <p>যানবাহনের ধরন - {vehicle.vehicle_type}</p>
              <p>মডেল - {vehicle.vehicle_model_name}</p>

              {licence && (
                <>
                  <p>
                    লাইসেন্স কার্যকর -{" "}
                    {dayjs(licence.activated_at).format("DD MMM YYYY")}
                  </p>
                  <p>
                    মেয়াদ শেষ -{" "}
                    {dayjs(licence.expired_at).format("DD MMM YYYY")}
                  </p>
                </>
              )}
            </div>

            {/* RIGHT QR */}
            {qrUrl && (
              <div
                style={{
                  background: "#fff",
                  padding: 8,
                  border: "2px solid #6b2c91",
                  textAlign: "center",
                }}
              >
                <img
                  src={qrUrl}
                  alt="QR Code"
                  width={100}
                  height={100}
                />
               
              </div>
            )}
          </div>

          {/* FOOTER */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 28,
              fontSize: 16,
            }}
          >
            <div>
              * নির্ধারিত সময়ের মধ্যে নবায়ন করতে হবে। <br />
              * ট্রাফিক আইন মেনে চলুন।
            </div>
            <div style={{ textAlign: "center" }}>
              <b>প্রশাসক</b> <br />
              {cityName}
            </div>
          </div>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
        <Button onClick={onClose}>বন্ধ করুন</Button>
        <Button type="primary" onClick={handlePrint}>
          প্রিন্ট
        </Button>
      </div>
    </Modal>
  );
};

export default VehicleLicence;
