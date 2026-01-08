import { Modal, Button } from "antd";
import dayjs from "dayjs";

import {
  useGetSystemSettingsQuery,
} from "../../redux/api/systemSettingApiSlice";

const ViewLicence = ({ open, onClose, driver }) => {
  if (!driver) return null;

  /* ================= SYSTEM SETTINGS ================= */
  const { data: settingRes } = useGetSystemSettingsQuery();
  const setting = settingRes?.data;

  const cityName =
    setting?.city_corporation_name || "City Corporation";

  const cityLogo =
    setting?.city_corporation_logo || null;

  /* ================= PRINT ================= */
  const handlePrint = () => {
    const printArea = document.getElementById("print-area");
    if (!printArea) return;

    const printContents = printArea.innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = `
      <html>
        <head>
          <title>Driver Licence</title>
          <style>
            * { box-sizing: border-box; }
            body {
              margin: 0;
              padding: 40px;
              display: flex;
              justify-content: center;
              font-family: Arial, sans-serif;
              background: #ffffff;
            }
            .card {
              width: 440px;
              border-radius: 12px;
              overflow: hidden;
              border: 1px solid #ddd;
            }
            .header {
              background: #16a34a;
              color: white;
              text-align: center;
              padding: 12px;
            }
            .footer {
              background: #f3f4f6;
              text-align: center;
              font-size: 12px;
              padding: 8px;
              color: #555;
            }
            img {
              max-width: 100%;
            }
            @page {
              size: A4;
              margin: 10mm;
            }
          </style>
        </head>
        <body>
          <div class="card">
            ${printContents}
          </div>
        </body>
      </html>
    `;

    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  return (
    <Modal
      className="modal"
      open={open}
      onCancel={onClose}
      footer={null}
      width={480}
      title="Driver Licence"
    >
      {/* ================= PRINT AREA ================= */}
      <div
        id="print-area"
        className="rounded-xl overflow-hidden shadow-lg border bg-white"
      >
        {/* ================= HEADER ================= */}
        <div className="bg-green-600 p-3 text-white">
        {/* CENTER WRAPPER */}
        <div className="flex justify-center">
            
            {/* INNER ROW (logo left, text right) */}
            <div className="flex items-center gap-3">
            
            {/* LOGO */}
            {cityLogo && (
                <img
                src={cityLogo}
                alt="City Logo"
                className="h-10 w-auto object-contain rounded"
                />
            )}

            {/* TEXT */}
            <div className="text-left">
                <h2 className="text-lg font-bold leading-tight">
                {cityName}
                </h2>
                <p className="text-xs opacity-90">
                Driver Licence Card
                </p>
            </div>

            </div>
        </div>
        </div>


        {/* ================= BODY ================= */}
        <div className="p-4">
          <div className="flex py-3 gap-4">
            {/* PHOTO */}
            <div className="border w-28 h-32 flex-shrink-0">
              <img
                src={driver.driver_image}
                alt="Driver"
                className="w-full h-full object-cover rounded"
              />
            </div>

            {/* INFO */}
            <div className="flex-1 space-y-1">
              <h2 className="text-lg font-bold text-gray-900">
                {driver.user?.name}
              </h2>

              <p className="font-semibold">
                Reg No: {driver.registration_number}
              </p>

              <p className="font-semibold">
                NID: {driver.nid}
              </p>

              <div className="mt-2">
                <p className="text-sm font-semibold text-blue-700">
                  Fiscal Year:{" "}
                  {driver.latest_licence?.fiscal_year?.name ?? "N/A"}
                </p>

                <p className="text-sm font-semibold text-red-600">
                  Expiry Date:{" "}
                  {driver.latest_licence?.end_date
                    ? dayjs(
                        driver.latest_licence.end_date
                      ).format("DD MMM YYYY")
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ================= FOOTER ================= */}
        <div className="bg-gray-100 px-4 py-2 text-xs text-center text-gray-600">
          Digitally approved by {cityName}
        </div>
      </div>

      {/* ================= ACTIONS ================= */}
      <div className="flex justify-between mt-4">
        <Button onClick={onClose}>Close</Button>
        <Button type="primary" onClick={handlePrint}>
          Print Licence
        </Button>
      </div>
    </Modal>
  );
};

export default ViewLicence;
