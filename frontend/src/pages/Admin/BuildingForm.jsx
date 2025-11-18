import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";

export default function BuildingForm() {
  const { id } = useParams(); // undefined for create
  const isEdit = !!id;
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isEdit) {
      const fetchBuilding = async () => {
        try {
          const res = await api.get(`/buildings/${id}`, { withCredentials: true });
          const building = res.data.data || res.data;
          setName(building.name);
        } catch (err) {
          console.error(err);
          alert("Failed to load building");
        }
      };
      fetchBuilding();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("Building name is required");

    setLoading(true);
    try {
      if (isEdit) {
        await api.put(`/buildings/${id}`, { name }, { withCredentials: true });
      } else {
        await api.post("/buildings", { name }, { withCredentials: true });
      }
      navigate("/admin/availability");
    } catch (err) {
      alert(err.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6">
        {isEdit ? "Modify Building" : "Create Building"}
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
        <label className="text-gray-700 font-medium">Building Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded"
          placeholder="Enter building name"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          onClick={() => navigate("/admin/availability")}
          className="text-gray-600 hover:underline"
        >
          Cancel
        </button>
      </form>
    </div>
  );
}
