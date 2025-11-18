import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import api from "../../api/axios";

export default function LotForm() {
  const { id } = useParams();
  const [searchParams] = useSearchParams(); // used for ?building=...
  const isEdit = !!id;
  const navigate = useNavigate();

  const [buildingId, setBuildingId] = useState("");
  const [floorName, setFloorName] = useState("");
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBuildings = async () => {
      const res = await api.get("/buildings", { withCredentials: true });
      const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setBuildings(data);
    };

    fetchBuildings();

    if (isEdit) {
      const fetchLot = async () => {
        try {
          const res = await api.get(`/lots/${id}`, { withCredentials: true });
          const lot = res.data.data || res.data;
          setBuildingId(lot.building_id);
          setFloorName(lot.floor_name);
        } catch (err) {
          console.error(err);
          alert("Failed to load lot data");
        }
      };
      fetchLot();
    } else {
      const defaultBuilding = searchParams.get("building");
      if (defaultBuilding) setBuildingId(defaultBuilding);
    }
  }, [id, searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!buildingId || !floorName.trim())
      return alert("Both building and floor name are required");

    setLoading(true);
    try {
      if (isEdit) {
        await api.put(
          `/lots/${id}`,
          { building_id: buildingId, floor_name: floorName },
          { withCredentials: true }
        );
      } else {
        await api.post(
          "/lots",
          { building_id: buildingId, floor_name: floorName },
          { withCredentials: true }
        );
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
        {isEdit ? "Modify Lot" : "Create Lot"}
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
        <label className="text-gray-700 font-medium">Building</label>
        <select
          value={buildingId}
          onChange={(e) => setBuildingId(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Select Building</option>
          {buildings.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>

        <label className="text-gray-700 font-medium">Floor Name</label>
        <input
          type="text"
          value={floorName}
          onChange={(e) => setFloorName(e.target.value)}
          className="border p-2 rounded"
          placeholder="e.g., B1, 2nd Floor"
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
