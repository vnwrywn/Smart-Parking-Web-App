import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import AdminLogoutButton from "../../components/AdminLogoutButton";

export default function AdminViewAvailability() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const [buildingsRes, lotsRes, availRes] = await Promise.all([
        api.get("/buildings", { withCredentials: true }),
        api.get("/lots", { withCredentials: true }),
        api.get("/slots/availability", { withCredentials: true }),
      ]);

      const buildings = Array.isArray(buildingsRes.data)
        ? buildingsRes.data
        : buildingsRes.data?.data || [];

      const lots = Array.isArray(lotsRes.data)
        ? lotsRes.data
        : lotsRes.data?.data || [];

      const res1 = availRes.data.data.res1;
      const res2 = availRes.data.data.res2;

      const availableMap = Object.fromEntries(res1.map((r) => [r.lot_id, parseInt(r.count)]));
      const totalMap = Object.fromEntries(res2.map((r) => [r.lot_id, parseInt(r.count)]));

      const lotsWithCounts = lots.map((lot) => ({
        ...lot,
        available_slots: availableMap[lot.id] || 0,
        total_slots: totalMap[lot.id] || 0,
      }));

      const grouped = buildings.map((b) => ({
        ...b,
        lots: lotsWithCounts.filter((l) => l.building_id === b.id),
      }));

      setData(grouped);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteBuilding = async (id) => {
    if (!confirm("Are you sure you want to delete this building?")) return;
    try {
      await api.delete(`/buildings/${id}`, { withCredentials: true });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete building");
    }
  };

  const handleDeleteLot = async (id) => {
    if (!confirm("Are you sure you want to delete this lot?")) return;
    try {
      await api.delete(`/lots/${id}`, { withCredentials: true });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete lot");
    }
  };

  if (loading)
    return <div className="flex justify-center items-center h-screen text-gray-500">Loading...</div>;

  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-3xl font-bold">Admin – Parking Availability</h1>
        <AdminLogoutButton />
      </div>

      <button
        onClick={() => navigate("/admin/dashboard")}
        className="px-3 py-2 text-sm bg-gray-700 text-white rounded hover:bg-gray-800 mb-8"
      >
        ← Back to Dashboard
      </button>

      <div className="mb-4">
        <button
          onClick={() => navigate("/admin/building/create")}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          ➕ Create Building
        </button>
      </div>

      {data.map((building) => (
        <div key={building.id} className="mb-10 border-b pb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">{building.name}</h2>
            <div className="space-x-2">
              <button
                onClick={() => navigate(`/admin/building/edit/${building.id}`)}
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
              >
                📝 Modify
              </button>
              <button
                onClick={() => handleDeleteBuilding(building.id)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                🗑️ Delete
              </button>
            </div>
          </div>

          {building.lots.length === 0 ? (
            <p className="text-gray-500 mb-4">No lots in this building.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              {building.lots.map((lot) => (
                <div
                  key={lot.id}
                  className="border rounded-lg p-4 shadow hover:shadow-md transition"
                >
                  <p className="text-lg font-medium mb-2">{lot.floor_name}</p>
                  <p className="text-gray-600 mb-2">
                    {lot.available_slots} / {lot.total_slots} slots available
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => navigate(`/admin/lot/${lot.id}`)}
                      className="text-blue-600 font-semibold hover:underline"
                    >
                      👁️ View Detail
                    </button>
                    <button
                      onClick={() => navigate(`/admin/lot/edit/${lot.id}`)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      📝 Modify
                    </button>
                    <button
                      onClick={() => handleDeleteLot(lot.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => navigate(`/admin/lot/create?building=${building.id}`)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            ➕ Create Lot
          </button>
        </div>
      ))}
    </div>
  );
}
