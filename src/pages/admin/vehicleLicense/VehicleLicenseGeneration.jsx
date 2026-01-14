import { useState } from "react";
import { Card, Button, message, Input, Modal } from "antd";
import {
  useCreateVehicleLicenseGenerationMutation,
} from "../../redux/api/vehicleLicenseApiSlice";

const VehicleLicenseGeneration = () => {
  const [amount, setAmount] = useState("");

  const [createVehicleLicenseGeneration, { isLoading }] =
    useCreateVehicleLicenseGenerationMutation();

  const handleGenerate = () => {
    if (!amount || Number(amount) <= 0) {
      message.error("Licence fee is required");
      return;
    }

    Modal.confirm({
      title: "Confirm Licence Generation",
      content: (
        <div>
          <p>
            You are about to generate licences for <b>ALL vehicles</b>
            <br />
            <b>Licence Fee:</b> {amount}
          </p>
          <p className="text-red-500 mt-2">
            This action cannot be undone.
          </p>
        </div>
      ),
      okText: "Yes, Generate",
      cancelText: "Cancel",
      okButtonProps: {
        loading: isLoading,
      },
      onOk: async () => {
        try {
          await createVehicleLicenseGeneration({
            licence_fee: amount,
            status: "pending",
          }).unwrap();

          message.success("All vehicle licences generated successfully");
          setAmount("");
        } catch (error) {
          message.error(error?.data?.message || "Something went wrong");
        }
      },
    });
  };

  return (
    <div className="card-layout">
      <h1 className="text-xl font-bold mb-4">
        License Generation (Current Financial Year)
      </h1>

      <Card className="max-w-md">
        <div className="space-y-4">
          <div>
            <label className="font-medium">
              Licence Fee <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              min={1}
              placeholder="Enter licence fee"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <Button
            type="primary"
            block
            loading={isLoading}
            onClick={handleGenerate}
          >
            Generate Licence
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default VehicleLicenseGeneration;
