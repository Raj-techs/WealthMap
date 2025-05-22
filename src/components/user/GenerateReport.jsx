import { useEffect, useState } from "react";
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { logActivity } from "../../firebase/logActivity";
import { getAuth, onAuthStateChanged } from "firebase/auth";

// Excel export helper
const exportToExcel = (data) => {
  // Create CSV content
  const headers = [
    "Address",
    "City",
    "Type",
    "Price",
    "Size (sqft)",
    "Owner",
    "Net Worth",
  ];
  const rows = data.map((prop) => [
    prop.address || "-",
    prop.city || "-",
    prop.type || "-",
    prop.price ? `₹${prop.price.toLocaleString()}` : "-",
    prop.size || "-",
    prop.owner || "-",
    prop.ownerNetWorth ? `₹${prop.ownerNetWorth.toLocaleString()}` : "-",
  ]);
  let csvContent =
    "data:text/csv;charset=utf-8," +
    [headers, ...rows].map((e) => e.join(",")).join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "Report.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const GenerateReport = () => {
  const [bookmarkedProps, setBookmarkedProps] = useState([]);
  const [selectedProps, setSelectedProps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [exportType, setExportType] = useState("pdf");

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (!authUser) {
        setError("No authenticated user found.");
        setLoading(false);
        return;
      }
      try {
        const bookmarkQuery = query(
          collection(db, "bookmarks"),
          where("userId", "==", authUser.uid)
        );
        const snap = await getDocs(bookmarkQuery);

        const rows = [];
        for (const docSnap of snap.docs) {
          const data = docSnap.data();
          const propertyId = data.propertyId || data.id;
          if (!propertyId) continue;

          const propRef = doc(db, "properties", propertyId);
          const propSnap = await getDoc(propRef);
          if (propSnap.exists()) {
            rows.push({ id: propSnap.id, ...propSnap.data() });
          }
        }

        setBookmarkedProps(rows);
        setSelectedProps(rows.map((p) => p.id));
      } catch (err) {
        setError("Failed to load property data.");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const toggleSelection = (id) => {
    setSelectedProps((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const exportPDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });
    doc.setFontSize(18);
    doc.text("Property Report", 14, 16);
    autoTable(doc, {
      startY: 22,
      head: [
        [
          "Address",
          "City",
          "Type",
          "Price",
          "Size (sqft)",
          "Owner",
          "Net Worth",
        ],
      ],
      body: bookmarkedProps
        .filter((prop) => selectedProps.includes(prop.id))
        .map((prop) => [
          prop.address || "-",
          prop.city || "-",
          prop.type || "-",
          prop.price ? `₹${prop.price.toLocaleString()}` : "-",
          prop.size || "-",
          prop.owner || "-",
          prop.ownerNetWorth ? `₹${prop.ownerNetWorth.toLocaleString()}` : "-",
        ]),
      styles: {
        fontSize: 11,
        cellPadding: 3,
        overflow: "linebreak",
      },
      headStyles: {
        fillColor: [30, 64, 175],
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: { fillColor: [240, 245, 255] },
      margin: { left: 14, right: 14 },
      tableWidth: "auto",
    });
    doc.save("Report.pdf");
    logActivity({
      userId: getAuth().currentUser.uid,
      role: "user",
      action: `Generated a PDF report with ${selectedProps.length} properties`,
      actionType: "report_generated",
      consoleLog: `Generated a PDF report with ${selectedProps.length} properties`,
    }).catch(() => {});
  };

  const handleExport = () => {
    const selectedData = bookmarkedProps.filter((prop) =>
      selectedProps.includes(prop.id)
    );
    if (exportType === "pdf") {
      exportPDF();
    } else {
      exportToExcel(selectedData);
      logActivity({
        userId: getAuth().currentUser.uid,
        role: "user",
        action: `Generated an Excel report with ${selectedProps.length} properties`,
        actionType: "report_generated",
        consoleLog: `Generated an Excel report with ${selectedProps.length} properties`,
      }).catch(() => {});
    }
  };

  // Responsive grid classes
  const gridCols =
    "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6";

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mb-4"></div>
        <div className="text-lg text-gray-700">Loading your properties...</div>
      </div>
    );
  if (error)
    return (
      <div className="p-6 text-red-600 text-center font-semibold">{error}</div>
    );
  if (bookmarkedProps.length === 0)
    return (
      <div className="p-6 text-center text-gray-600">
        You have no bookmarked properties yet.<br />
        <span className="text-2xl mt-2 block">🔖</span>
      </div>
    );

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto bg-white rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-blue-800 mb-1 flex items-center gap-2">
            📋 Generate Property Report
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Select properties to include in your downloadable report.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="font-medium text-gray-700 mr-2">Export as:</label>
          <select
            value={exportType}
            onChange={(e) => setExportType(e.target.value)}
            className="border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="pdf">PDF</option>
            <option value="excel">Excel</option>
          </select>
          <button
            onClick={handleExport}
            disabled={selectedProps.length === 0}
            className={`ml-2 flex items-center gap-2 px-5 py-2 rounded font-semibold shadow transition
              ${
                selectedProps.length === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-700 hover:bg-blue-800 text-white"
              }`}
          >
            {exportType === "pdf" ? (
              <>
                <span>📤</span> Export to PDF
              </>
            ) : (
              <>
                <span>📊</span> Export to Excel
              </>
            )}
          </button>
        </div>
      </div>

      <div className={gridCols}>
        {bookmarkedProps.map((prop) => (
          <div
            key={prop.id}
            className={`border-2 rounded-lg shadow-sm p-4 bg-gradient-to-br from-blue-50 to-white hover:shadow-lg transition
              ${
                selectedProps.includes(prop.id)
                  ? "border-blue-700 ring-2 ring-blue-200"
                  : "border-gray-200"
              }`}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-blue-900 truncate max-w-[70%]">
                {prop.address}
              </h3>
              <input
                type="checkbox"
                checked={selectedProps.includes(prop.id)}
                onChange={() => toggleSelection(prop.id)}
                className="mt-1 accent-blue-700 w-5 h-5"
                aria-label="Select property"
              />
            </div>
            <div className="text-sm text-gray-700 flex flex-wrap gap-x-2 gap-y-1">
              <span>🏙️ {prop.city || "-"}</span>
              <span>🏷️ {prop.type}</span>
            </div>
            <div className="text-sm text-gray-600 mt-1">
              <span className="block">
                💰 <span className="font-medium">Price:</span>{" "}
                {prop.price ? `₹${prop.price.toLocaleString()}` : "-"}
              </span>
              <span className="block">
                📐 <span className="font-medium">Size:</span> {prop.size} sqft
              </span>
              <span className="block">
                🧾 <span className="font-medium">Owner:</span> {prop.owner}
              </span>
              <span className="block">
                💼 <span className="font-medium">Net Worth:</span>{" "}
                {prop.ownerNetWorth
                  ? `₹${prop.ownerNetWorth.toLocaleString()}`
                  : "-"}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="text-right text-xs text-gray-400 mt-2">
        {selectedProps.length} property{selectedProps.length !== 1 && "ies"} selected
      </div>
    </div>
  );
};

export default GenerateReport;