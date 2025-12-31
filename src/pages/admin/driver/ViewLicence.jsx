import { Modal, Button } from "antd";
import dayjs from "dayjs";

const ViewLicence = ({ open, onClose, driver }) => {
    if (!driver) return null;

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
                <div className=" bg-green-600  p-3 text-white text-center">

                    <h2 className="text-lg font-bold">
                        City Corporation
                    </h2>
                    <p className="text-xs">
                        Driver Licence Card
                    </p>
                </div>

                {/* ================= BODY ================= */}
                <div className="p-4">
                    <div className="flex gap-4">
                        {/* PHOTO */}
                        <div className="border w-28 h-32 flex-shrink-0">
                            <img
                                src={driver.driver_image}
                                alt="Driver"
                                className="w-full rounded h-full object-cover"
                            />
                        </div>

                        {/* INFO */}
                        <div className="flex-1 space-y-1">
                            <h2 className="text-lg font-bold text-gray-900">
                                Name: {driver.user?.name}
                            </h2>

                            <p className="text-base font-semibold text-gray-800">
                                Reg No: {driver.registration_number}
                            </p>

                            <p className="text-base font-semibold text-gray-800">
                                NID: {driver.nid}
                            </p>

                            {/* ================= LICENCE INFO ================= */}
                            <div className="mt-2 space-y-0">
                                <p className="text-sm font-semibold text-blue-700">
                                    Fiscal Year: {driver.latest_licence?.fiscal_year}
                                </p>

                                <p className="text-sm font-semibold text-red-600">
                                    Expiry Date:{" "}
                                    {driver.latest_licence?.end_date
                                        ? dayjs(driver.latest_licence.end_date).format("DD MMM YYYY")
                                        : "N/A"}
                                </p>
                            </div>
                        </div>

                    </div>

                    {/* ================= DIVIDER ================= */}


                    {/* ================= LICENCE INFO ================= */}

                </div>

                {/* ================= FOOTER ================= */}
                <div className="bg-gray-100 px-4 py-2 text-xs text-center text-gray-600">
                    Digitally approved by City Corporation
                </div>
            </div>

            {/* ================= ACTIONS ================= */}
            <div className="flex justify-between mt-4">
                <Button onClick={onClose}>Close</Button>

                <Button type="primary" onClick={() => window.print()}>
                    Print Licence
                </Button>
            </div>
        </Modal>
    );
};

export default ViewLicence;
