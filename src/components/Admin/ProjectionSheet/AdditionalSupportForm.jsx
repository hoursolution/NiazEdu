import React, { useState, useEffect } from "react";
import { FileText, Edit2, Trash2, Upload, AlertCircle } from "lucide-react";

const BASE_URL = "http://127.0.0.1:8000";
// const BASE_URL = "https://zeenbackend-production.up.railway.app";

const AdditionalSupportForm = ({ studentId }) => {
  const [additionalSupport, setAdditionalSupport] = useState([]);
  const [editId, setEditId] = useState(null);
  const [supportForm, setSupportForm] = useState({
    student: studentId,
    name: "",
    Price: "",
    date: "",
    receipt: null,
  });

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this Support item?"))
      return;

    try {
      const response = await fetch(
        `${BASE_URL}/api/additional-support/${id}/`,
        {
          method: "DELETE",
          headers: { Authorization: `Token ${localStorage.getItem("token")}` },
        }
      );

      if (!response.ok) throw new Error("Failed to delete support item");
      setAdditionalSupport(additionalSupport.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting support item:", error);
    }
  };

  const handleEdit = (id) => {
    const existingItem = additionalSupport.find((item) => item.id === id);
    if (existingItem) {
      setSupportForm({
        student: studentId,
        name: existingItem.name,
        Price: existingItem.Price,
        date: existingItem.date,
        receipt: null,
      });
      setEditId(id);
    }
  };

  const handleFileChange = (e) => {
    setSupportForm({ ...supportForm, receipt: e.target.files[0] });
  };

  useEffect(() => {
    if (!studentId) return;

    fetch(`${BASE_URL}/api/additional-support/?student=${studentId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(
          `Fetched additional support for student ${studentId}:`,
          data
        );
        setAdditionalSupport(data);
      })
      .catch((err) => console.error("Error fetching support data:", err));
  }, [studentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("student", studentId);
      formData.append("name", supportForm.name);
      formData.append("Price", supportForm.Price);
      formData.append("date", supportForm.date);
      if (supportForm.receipt) {
        formData.append("receipt", supportForm.receipt);
      }

      const url = editId
        ? `${BASE_URL}/api/additional-support/${editId}/`
        : `${BASE_URL}/api/additional-support/`;

      const response = await fetch(url, {
        method: editId ? "PUT" : "POST",
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (!response.ok)
        throw new Error(editId ? "Failed to update" : "Failed to add");

      const updatedItem = await response.json();

      setAdditionalSupport((prev) =>
        editId
          ? prev.map((item) => (item.id === editId ? updatedItem : item))
          : [...prev, updatedItem]
      );

      setSupportForm({
        student: studentId,
        name: "",
        Price: "",
        date: "",
        receipt: null,
      });

      setEditId(null);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Additional Support
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Support Name
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Laptop"
                value={supportForm.name}
                onChange={(e) =>
                  setSupportForm({ ...supportForm, name: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={supportForm.Price}
                onChange={(e) =>
                  setSupportForm({ ...supportForm, Price: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={supportForm.date}
                onChange={(e) =>
                  setSupportForm({ ...supportForm, date: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Receipt
              </label>
              <div className="relative">
                <input
                  type="file"
                  className="hidden"
                  id="receipt"
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="receipt"
                  className="flex items-center justify-center w-full px-3 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <Upload className="w-5 h-5 mr-2 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {supportForm.receipt
                      ? supportForm.receipt.name
                      : "Upload Receipt"}
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {editId ? "Update Support" : "Add Support"}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">
          Support History
        </h3>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Receipt
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {additionalSupport.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.Price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.receipt ? (
                      <button
                        onClick={() => window.open(item.receipt, "_blank")}
                        className="flex items-center text-blue-600 hover:text-blue-800"
                      >
                        <FileText className="w-4 h-4 mr-1" />
                        View
                      </button>
                    ) : (
                      <span className="flex items-center text-gray-400">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        No receipt
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(item.id)}
                        className="p-1 text-blue-600 hover:text-blue-800"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1 text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdditionalSupportForm;
