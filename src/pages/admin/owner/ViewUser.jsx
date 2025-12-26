import { Modal, Badge, Button } from "antd";
import { enlocalDateFormat } from "../../../utils/main/dateFormat";
import { useRef } from "react";

const ViewUser = ({ open, onClose, editData }) => {
    const user = editData?.user;
    const printRef = useRef();

    const handlePrint = () => {
        const printContent = printRef.current.innerHTML;
        const originalContent = document.body.innerHTML;

        document.body.innerHTML = `
            <html>
                <head>
                    <title>Owner Information</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            padding: 20px;
                        }
                        h2 {
                            margin-top: 20px;
                        }
                        img {
                            width: 120px;
                            height: 120px;
                            border-radius: 50%;
                            object-fit: cover;
                        }
                        hr {
                            margin: 8px 0;
                        }
                        p {
                            margin: 4px 0;
                            font-size: 14px;
                        }
                    </style>
                </head>
                <body>
                    ${printContent}
                </body>
            </html>
        `;

        window.print();
        document.body.innerHTML = originalContent;
        window.location.reload();
    };

    return (
        <Modal
            open={open}
            title="View Owner Information"
            onCancel={onClose}
            width={800}
            footer={[
                <Button key="print" type="primary" onClick={handlePrint}>
                    Print
                </Button>,
                <Button key="close" onClick={onClose}>
                    Close
                </Button>,
            ]}
        >
            {/* PRINT AREA */}
            <div ref={printRef} className="p-6 space-y-6">

                {/* Profile Image */}
                <div className="flex justify-center">
                    <img
                        src={editData?.image}
                        alt={user?.name}
                        className="w-32 h-32 rounded-full object-cover border shadow"
                    />
                </div>

                {/* User Account Info */}
                <div>
                    <h2 className="font-semibold text-lg mb-2">Account Information</h2>
                    <hr />

                    <p><strong>Name:</strong> {user?.name || "-"}</p>
                    <p><strong>Email:</strong> {user?.email || "-"}</p>
                    <p><strong>Phone:</strong> {user?.phone || "-"}</p>
                    <p>
                        <strong>Status:</strong>{" "}
                        <Badge
                            status={user?.status === "Active" ? "success" : "error"}
                            text={user?.status}
                        />
                    </p>
                </div>

                {/* Owner Personal Info */}
                <div>
                    <h2 className="font-semibold text-lg mb-2">Personal Information</h2>
                    <hr />

                    <p>
                        <strong>Father / Husband Name:</strong>{" "}
                        {editData?.father_or_husband_name || "-"}
                    </p>
                    <p>
                        <strong>Ward Number:</strong> {editData?.ward_number || "-"}
                    </p>
                    <p>
                        <strong>Mohalla Name:</strong> {editData?.mohalla_name || "-"}
                    </p>
                    <p>
                        <strong>NID Number:</strong> {editData?.nid_number || "-"}
                    </p>
                    <p>
                        <strong>Birth Registration Number:</strong>{" "}
                        {editData?.birth_registration_number || "-"}
                    </p>
                </div>

                {/* Address Info */}
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <h2 className="font-semibold text-lg mb-2">Present Address</h2>
                        <hr />
                        <p>{editData?.present_address || "-"}</p>
                    </div>

                    <div>
                        <h2 className="font-semibold text-lg mb-2">Permanent Address</h2>
                        <hr />
                        <p>{editData?.permanent_address || "-"}</p>
                    </div>
                </div>

                {/* Meta Info */}
                <div>
                    <h2 className="font-semibold text-lg mb-2">System Information</h2>
                    <hr />
                    <p>
                        <strong>Created At:</strong>{" "}
                        {editData?.created_at
                            ? enlocalDateFormat(editData.created_at)
                            : "-"}
                    </p>
                </div>
            </div>
        </Modal>
    );
};

export default ViewUser;
