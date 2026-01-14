import { useState, useMemo } from "react";
import {
  Select,
  Card,
  Spin,
  Button,
  Checkbox,
  Tag,
  message,
} from "antd";
import {
  useGetMakeVehicleLicensePaymentQuery,
  useCreateVehiclePaymentMutation,
} from "../../redux/api/vehicleLicenseApiSlice";
import { useGetOwnerSelectQuery } from "../../redux/api/ownersApiSlice";
import toast from "react-hot-toast";

const { Option } = Select;

/** Extract start year from "2023-2024" */
const getYear = (fy) => parseInt(fy.split("-")[0], 10);

const VehicleLicense = () => {
  // ---------------- State ----------------
  const [ownerId, setOwnerId] = useState(null);
  const [shouldFetch, setShouldFetch] = useState(false);
  const [selectedLicences, setSelectedLicences] = useState({});
  const [paymentMethod, setPaymentMethod] = useState(null);

  const status = "pending";

  const [createVehiclePayment, { isLoading: paymentLoading }] =
    useCreateVehiclePaymentMutation();

  // ---------------- API ----------------
  const { data: ownersData, isLoading: ownersLoading } =
    useGetOwnerSelectQuery();

  const { data, isLoading, refetch } =
    useGetMakeVehicleLicensePaymentQuery(
      { owner_id: ownerId, phone: "", status },
      { skip: !shouldFetch } // fetch only after search
    );

  // ---------------- Search ----------------
  const handleSearch = () => {
    if (!ownerId) {
      message.error("Please select an owner");
      return;
    }
    setShouldFetch(true);
  };

  // ---------------- Licence Selection ----------------
  const toggleLicence = (vehicle, licence) => {
    const vehicleId = vehicle.vehicle_id;

    const sorted = vehicle.licences
      .filter((l) => l.is_payable)
      .sort((a, b) => getYear(a.fiscal_year) - getYear(b.fiscal_year));

    const selected = selectedLicences[vehicleId] || [];
    const index = sorted.findIndex((l) => l.id === licence.id);
    const isAlreadySelected = selected.some((s) => s.licence_id === licence.id);

    /* ---------------- UNSELECT RULE ---------------- */
    if (isAlreadySelected) {
      const hasNewerSelected = sorted
        .slice(index + 1)
        .some((l) => selected.some((s) => s.licence_id === l.id));

      if (hasNewerSelected) {
        message.error("আগে নতুন fiscal year unselect করতে হবে");
        return;
      }

      const updated = selected.filter(
        (s) => !sorted.slice(index).some((l) => l.id === s.licence_id)
      );

      setSelectedLicences((prev) => ({
        ...prev,
        [vehicleId]: updated,
      }));
      return;
    }

    /* ---------------- SELECT RULE ---------------- */
    const autoSelect = sorted.slice(0, index + 1).map((l) => ({
      licence_id: l.id,
      fee: Number(l.licence_fee),
    }));

    setSelectedLicences((prev) => ({
      ...prev,
      [vehicleId]: autoSelect,
    }));
  };

  const isSelected = (vehicleId, licenceId) =>
    (selectedLicences[vehicleId] || []).some((l) => l.licence_id === licenceId);

  // ---------------- Payload ----------------
  const items = useMemo(
    () => Object.values(selectedLicences).flat().map((l) => ({ licence_id: l.licence_id })),
    [selectedLicences]
  );

  const totalFee = useMemo(
    () => Object.values(selectedLicences).flat().reduce((sum, l) => sum + (l.fee || 0), 0),
    [selectedLicences]
  );

  const handleSubmit = async () => {
    if (!ownerId) return message.error("Owner required");
    if (!paymentMethod) return message.error("Select payment method");
    if (!items.length) return message.error("Select at least one licence");

    try {
      const res = await createVehiclePayment({
        owner_id: ownerId,
        payment_method: paymentMethod,
        items,
      }).unwrap();

      if (paymentMethod === "cash") {
        toast.success("Cash payment recorded");
        refetch();
      }

      if (paymentMethod === "ssl" && res?.payment_url) {
        window.open(res.payment_url, "_blank");
      }
    } catch (err) {
      toast.error(err?.data?.message || "Payment failed");
    }
  };

  // ---------------- Render ----------------
  return (
    <div className="card-layout">
      <h1 className="text-xl font-bold mb-4">Make Vehicle License Payment</h1>

      {/* Search Owner */}
      <div className="flex gap-4 mb-4">
        <Select
          showSearch
          placeholder="Select owner"
          value={ownerId || undefined}
          onChange={setOwnerId}
          loading={ownersLoading}
          style={{ width: 250 }}
          optionFilterProp="children"
        >
          {ownersData?.map((owner) => (
            <Option key={owner.id} value={owner.id}>
              {owner.name}
            </Option>
          ))}
        </Select>

        <Button type="primary" onClick={handleSearch}>
          Search
        </Button>
      </div>

      {/* Licences List */}
      {!shouldFetch ? null : isLoading ? (
        <Spin />
      ) : (
        <div className="flex gap-6">
          {/* LEFT: Payment Options */}
          <Card title="Payment Options" style={{ width: 280 }}>
            <Checkbox
              style={{ fontSize: 18, fontWeight: 600 }}
              checked={paymentMethod === "cash"}
              onChange={() => setPaymentMethod("cash")}
            >
              Cash
            </Checkbox>
            <br />
            <br />
            <Checkbox
              style={{ fontSize: 18, fontWeight: 600 }}
              checked={paymentMethod === "ssl"}
              onChange={() => setPaymentMethod("ssl")}
            >
              SSL Payment
            </Checkbox>

            <div className="mt-4 text-lg font-bold">Total Amount: ৳ {totalFee}</div>

            <Button
              type="primary"
              block
              className="mt-4"
              loading={paymentLoading}
              onClick={handleSubmit}
            >
              Confirm Payment
            </Button>
          </Card>

          {/* RIGHT: Vehicle Licences */}
          <div className="flex-1">
            {data?.data?.map((owner) =>
              owner.vehicles?.map((vehicle) => (
                <Card
                  key={vehicle.vehicle_id}
                  title={`Vehicle: ${vehicle.registration_number}`}
                  className="mb-4"
                >
                  {vehicle.licences.map((licence) => (
                    <div
                      key={licence.id}
                      className="flex justify-between items-center border p-2 mb-2"
                    >
                      <div>
                        <b>{licence.fiscal_year}</b>
                        <br />
                        Fee: ৳{licence.licence_fee}
                      </div>

                      <div className="flex items-center gap-3">
                        <Tag color={licence.status === "active" ? "green" : "orange"}>
                          {licence.status}
                        </Tag>

                        <Checkbox
                          disabled={!licence.is_payable}
                          checked={isSelected(vehicle.vehicle_id, licence.id)}
                          onChange={() => toggleLicence(vehicle, licence)}
                        >
                          Pay
                        </Checkbox>
                      </div>
                    </div>
                  ))}
                </Card>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleLicense;
