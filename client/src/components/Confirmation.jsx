const Confirmation = ({ onCancel, onConfirm, message }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="fixed inset-0 bg-black opacity-60"
        onClick={onCancel}
      ></div>
      <div className="relative bg-white p-6 rounded-md text-center">
        <p className="mb-4 text-gray-500">{message}</p>
        <div className="flex justify-center items-center space-x-4">
          <button
            onClick={onCancel}
            type="button"
            className="py-2 px-3 text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10"
          >
            No, cancel
          </button>
          <button
            onClick={onConfirm}
            type="button"
            className="py-2 px-3 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300"
          >
            Yes, I'm sure
          </button>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
