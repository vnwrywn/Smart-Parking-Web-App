import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/axios";
import UserLogoutButton from "../../components/UserLogoutButton";

export default function UserLotDetail() {
  const { id } = useParams();
  const [slots, setSlots] = useState([]);
  const [lotInfo, setLotInfo] = useState(null);
  const [mode, setMode] = useState("view"); // view | manage | layout
  const [pendingChanges, setPendingChanges] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const lotRes = await api.get(`/lots/${id}`, { withCredentials: true });
      const lotData = lotRes.data?.data?.[0] || lotRes.data?.data || lotRes.data || null;
      setLotInfo(lotData);

      const res = await api.get(`/slots?lot_id=${id}`, { withCredentials: true });
      const slotData = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setSlots(slotData);
    } catch (err) {
      console.error(err);
      setError("Failed to load lot details");
    } finally {
      setLoading(false);
    }
  };

  // Compute grid boundaries
  const xs = slots.map((s) => s.x);
  const ys = slots.map((s) => s.y);
  const minX = Math.min(...xs, 0);
  const maxX = Math.max(...xs, 0);
  const minY = Math.min(...ys, 0);
  const maxY = Math.max(...ys, 0);

  const cols = maxX - minX + 1;
  const rows = maxY - minY + 1;
  const yToRow = (y) => maxY - y + 1;
  const gridStyle = {
    display: "grid",
    gridTemplateColumns: `repeat(${cols}, 72px)`,
    gridTemplateRows: `repeat(${rows}, 72px)`,
    gap: "8px",
    justifyContent: "center",
  };

  const findSlot = (x, y) => slots.find((s) => s.x === x && s.y === y);
  const isPending = (x, y) => pendingChanges.find((p) => p.x === x && p.y === y);

  // Manage Slot Handlers
  const toggleSlotMark = (slot) => {
    const exists = pendingChanges.find((c) => c.id === slot.id);
    if (exists) {
      // Unmark
      setPendingChanges(pendingChanges.filter((c) => c.id !== slot.id));
    } else {
      const newStatus = slot.occupancy_status === "AVAILABLE" ? "OCCUPIED" : "AVAILABLE";
      setPendingChanges([
        ...pendingChanges,
        {
          type: "toggle",
          id: slot.id,
          x: slot.x,
          y: slot.y,
          oldStatus: slot.occupancy_status,
          newStatus,
        },
      ]);
    }
  };

  const applyManageChanges = async () => {
    setShowConfirmModal(false);
    try {
      await Promise.all(
        pendingChanges.map((slot) =>
          api.patch(`/slots/${slot.id}/toggle`, {}, { withCredentials: true })
        )
      );
      setPendingChanges([]);
      setMode("view");
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Failed to update slot statuses.");
    }
  };

  // ---- LAYOUT HANDLERS ----
  const toggleLayoutCell = (x, y) => {
    const slot = findSlot(x, y);
    const exists = isPending(x, y);

    if (slot && !exists) {
      // mark for deletion
      setPendingChanges([...pendingChanges, { type: "delete", id: slot.id, x, y }]);
      return;
    }
    if (slot && exists?.type === "delete") {
      // unmark deletion
      setPendingChanges(pendingChanges.filter((p) => !(p.x === x && p.y === y)));
      return;
    }
    if (!slot && !exists) {
      // mark to add
      setPendingChanges([...pendingChanges, { type: "add", x, y }]);
      return;
    }
    if (!slot && exists?.type === "add") {
      // unmark addition
      setPendingChanges(pendingChanges.filter((p) => !(p.x === x && p.y === y)));
    }
  };

  const applyLayoutChanges = async () => {
    setShowConfirmModal(false);
    try {
      await Promise.all(
        pendingChanges.map((c) => {
          if (c.type === "add") {
            return api.post(
              "/slots",
              { lot_id: id, x: c.x, y: c.y },
              { withCredentials: true }
            );
          } else if (c.type === "delete") {
            return api.delete(`/slots/${c.id}`, { withCredentials: true });
          }
        })
      );
      setPendingChanges([]);
      setMode("view");
      await fetchData(); // recalculate new boundaries
    } catch (err) {
      alert("Failed to update layout.");
      console.error(err);
    }
  };

  // ---- CONFIRMATION DIALOGS ----
  const openConfirmModal = () => {
    if (pendingChanges.length === 0) {
      alert("No pending changes.");
      setMode("view");
      return;
    }
    setShowConfirmModal(true);
  };

  const discardChanges = () => {
    if (pendingChanges.length === 0) return setMode("view");
    if (window.confirm("Discard all pending changes?")) {
      setPendingChanges([]);
      setMode("view");
    }
  };

  // ---- UI ----
  if (loading)
    return <div className="text-center text-gray-500 p-6">Loading...</div>;
  if (error)
    return <div className="text-center text-red-500 p-6">{error}</div>;

  return (
    <div className="p-6 relative">
      {/* Header */}
      <div className="flex justify-between mb-4">
        <Link to="/user/availability" className="text-blue-600 hover:underline">
          ← Back
        </Link>

        <div className="space-x-2">
          {mode === "view" && (
            <UserLogoutButton />
          )}
        </div>
      </div>

      {/* Title */}
      <h1 className="text-2xl font-bold text-center mb-6">
        {lotInfo ? `${lotInfo.building_name} – ${lotInfo.floor_name}` : `Lot ${id}`}
      </h1>

      {/* Grid */}
      <div style={gridStyle} className="mx-auto">
        {Array.from({ length: rows }).map((_, rowIndex) =>
          Array.from({ length: cols }).map((_, colIndex) => {
            const x = minX + colIndex;
            const y = maxY - rowIndex;
            const slot = findSlot(x, y);
            const pending = isPending(x, y);

            // Decide appearance
            let classes =
              "flex items-center justify-center rounded cursor-pointer font-semibold text-sm ";
            let bg = "";
            let text = "";

            if (mode === "layout") {
              if (slot) {
                bg = "bg-gray-500 text-white";
                text = `${x},${y}`;
                if (pending?.type === "delete") bg += " border-4 border-red-500";
              } else {
                bg =
                  "border-2 border-dashed border-gray-400 text-gray-400 hover:bg-gray-200";
                text = "+";
                if (pending?.type === "add") bg += " bg-green-200 border-green-500";
              }
            } else {
              if (!slot) return <div key={`${x}-${y}`} className="border border-gray-300 rounded" />;
              bg =
                slot.occupancy_status === "AVAILABLE"
                  ? "bg-green-500"
                  : "bg-red-500";
              if (pending?.type === "toggle") bg += " border-4 border-yellow-400";
              text = `${x},${y}`;
            }

            return (
              <div
                key={`${x}-${y}`}
                title={`(${x}, ${y})`}
                className={`${classes} ${bg}`}
                style={{ width: "72px", height: "72px" }}
              >
                {text}
              </div>
            );
          })
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="absolute inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] text-gray-800">
            <h2 className="text-lg font-bold mb-4 text-center">
              Confirm {mode === "manage" ? "Occupancy" : "Layout"} Changes
            </h2>

            <div className="max-h-[200px] overflow-y-auto mb-4 border rounded">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    {mode === "manage" ? (
                      <>
                        <th className="p-2">Coord</th>
                        <th className="p-2">Old</th>
                        <th className="p-2">New</th>
                      </>
                    ) : (
                      <>
                        <th className="p-2">Type</th>
                        <th className="p-2">Coord</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {pendingChanges.map((c, i) => (
                    <tr key={i} className="text-center border-t">
                      {mode === "manage" ? (
                        <>
                          <td className="p-2">
                            ({c.x},{c.y})
                          </td>
                          <td className="p-2">{c.oldStatus}</td>
                          <td className="p-2 font-semibold text-blue-600">
                            {c.newStatus}
                          </td>
                        </>
                      ) : (
                        <>
                          <td
                            className={`p-2 font-semibold ${
                              c.type === "add" ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {c.type.toUpperCase()}
                          </td>
                          <td className="p-2">
                            ({c.x},{c.y})
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={
                  mode === "manage" ? applyManageChanges : applyLayoutChanges
                }
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
