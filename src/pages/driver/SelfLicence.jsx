import { Button, Tag } from "antd";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import Loader from "../../components/custom/Loader";

import {
  useInitDriverLicencePaymentMutation,
  useGetMyDriverProfileQuery,
} from "../redux/api/driverApiSlice";

import { useGetSystemSettingsQuery } from "../redux/api/systemSettingApiSlice";

const MyLicencePage = () => {
  /* =====================
     FETCH DRIVER PROFILE
  ===================== */
  const { data, isLoading, error } = useGetMyDriverProfileQuery();

  // ✅ backend response: { success: true, data: {...driver} }
  const driver = data?.data;

  /* ================= SYSTEM SETTINGS ================= */
  const { data: settingRes } = useGetSystemSettingsQuery();
  const setting = settingRes?.data;

  const cityName =
    setting?.city_corporation_name || "City Corporation";

  const cityLogo =
    setting?.city_corporation_logo || null;

  const [initPayment, { isLoading: paying }] =
    useInitDriverLicencePaymentMutation();

  if (isLoading) return <Loader />;

  if (error || !driver) {
    return (
      <div className="p-6 text-center text-red-600">
        Failed to load licence information
      </div>
    );
  }

  /* =====================
     LICENCE INFO
  ===================== */
  const licence = driver.latest_licence;

  const isExpired =
    licence?.end_date &&
    dayjs(licence.end_date).isBefore(dayjs(), "day");

  const imageUrl = driver.driver_image
    ? `${import.meta.env.VITE_API_URL}/storage/${driver.driver_image}`
    : null;

  /* =====================
     PRINT
  ===================== */
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

  /* =====================
     RENEW PAYMENT
  ===================== */
  const handleRenew = async () => {
    try {
      const res = await initPayment(driver.id).unwrap();

      if (res?.payment_url) {
        // 🔥 new tab
        window.open(res.payment_url, "_blank", "noopener,noreferrer");
      } else {
        toast.error("Payment gateway unavailable");
      }
    } catch {
      toast.error("Failed to initiate renewal payment");
    }
  };

  return (
    <div className="card-layout">
      {/* PAGE HEADER */}
      <div className="flex justify-between headerbg items-center py-2 mb-4">
        <h1 className="text-xl font-bold text-gray-600">
          My Driving Licence
        </h1>
      </div>

      <div className="border rounded-xl p-6 bg-white shadow-sm flex flex-col  items-center" >


        {/* ================= LICENCE CARD ================= */}
        <div
          id="print-area"
          className="rounded-xl overflow-hidden shadow-xl border bg-white max-w-md w-full"
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



          {/* BODY */}
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
                    {licence?.fiscal_year?.name ??
                      `${dayjs(licence?.start_date).year()}–${dayjs(
                        licence?.end_date
                      ).year()}`}
                  </p>

                  <p
                    className={`text-sm font-semibold ${isExpired ? "text-red-600" : "text-green-600"
                      }`}
                  >
                    Expiry Date:{" "}
                    {licence?.end_date
                      ? dayjs(licence.end_date).format("DD MMM YYYY")
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="bg-gray-100 px-4 py-2 text-xs text-center text-gray-600">
            Digitally approved by {cityName}
          </div>
        </div>

        {/* ================= ACTIONS ================= */}
        <div className="flex justify-center mb-4 gap-6 mt-8 items-center">

          {/* STATUS BUTTON */}
          <div>
            {isExpired ? (
              <Button
                size="large"

                className="
                px-10 py-5 text-lg font-semibold
                text-white-600
                border-red-600
                cursor-default
                shadow-lg
                hover:  text-white-600
                "
              >
                ❌ Licence Expired
              </Button>
            ) : (
              <Button
                size="large"

                className="
                px-10 py-5 text-lg font-semibold
                text-green-600
                border-green-600
                cursor-default
                shadow-lg
                hover: text-green-600
                "
              >
                ✅ Licence Active
              </Button>
            )}
          </div>

          {/* ACTION BUTTON */}
          <div>
            {!isExpired && (
              <Button
                type="primary"
                size="large"
                onClick={handlePrint}
                className="px-10 py-5 text-lg font-semibold shadow-lg"
              >
                Print Licence
              </Button>
            )}

            {isExpired && (
              <Button
                danger
                size="large"
                loading={paying}
                onClick={handleRenew}
                className="px-10 py-5 text-lg font-semibold shadow-lg"
              >
                Renew Licence
              </Button>
            )}
          </div>

        </div>

      </div>
    </div>
  );

};

export default MyLicencePage;
