import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import UserLogoutButton from "../../components/UserLogoutButton";

export default function ViewAvailability() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [buildingsRes, lotsRes, availRes] = await Promise.all([
          api.get("/buildings"),
          api.get("/lots"),
          api.get("/slots/availability"),
        ]);

        const buildings = Array.isArray(buildingsRes.data)
        ? buildingsRes.data
        : buildingsRes.data?.data || [];

        const lots = Array.isArray(lotsRes.data)
        ? lotsRes.data
        : lotsRes.data?.data || [];
        const res1 = availRes.data.data.res1;
        const res2 = availRes.data.data.res2;

        // Convert arrays to lookup maps for easier merging
        const availableMap = Object.fromEntries(res1.map(r => [r.lot_id, parseInt(r.count)]));
        const totalMap = Object.fromEntries(res2.map(r => [r.lot_id, parseInt(r.count)]));

        // Combine lot info with availability data
        const lotsWithCounts = lots.map(lot => ({
          ...lot,
          available_slots: availableMap[lot.id] || 0,
          total_slots: totalMap[lot.id] || 0,
        }));

        // Group by building
        const grouped = buildings.map(building => ({
          ...building,
          lots: lotsWithCounts.filter(l => l.building_id === building.id),
        }));

        setData(grouped);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to load availability data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
        <h1 className="text-3xl font-bold text-center mb-8">Parking Availability</h1>
        <UserLogoutButton />
      </div>

      {data.map((building) => (
        <div key={building.id} className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">{building.name}</h2>
          {building.lots.length === 0 ? (
            <p className="text-gray-500">No lots found in this building.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {building.lots.map((lot) => (
                <div
                  key={lot.id}
                  className="border rounded-lg p-4 shadow hover:shadow-md transition"
                >
                  <p className="text-lg font-medium mb-2">{lot.floor_name}</p>
                  <p className="text-gray-600 mb-2">
                    {lot.available_slots} / {lot.total_slots} slots available
                  </p>
                  <Link
                    to={`/user/lot/${lot.id}`}
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    View Lot Detail →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
