const AccountDisabled = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold text-red-800 mb-4">
          Account Disabled
        </h1>
        <h2 className="text-xl font-semibold text-gray-600 mb-4">
          Your account has been disabled
        </h2>
        <p className="text-gray-700 mb-6">
          Please contact support or try again later.
        </p>
      </div>
    </div>
  );
};

export default AccountDisabled;
