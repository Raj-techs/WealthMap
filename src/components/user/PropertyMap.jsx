import React, { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { db } from "../../firebase/config";
import { getAuth } from "firebase/auth";
import { logActivity } from "../../firebase/logActivity";
import { collection, getDocs, query, where, addDoc, serverTimestamp } from "firebase/firestore";
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// US Cities (sample, you can expand this list)
const US_CITIES = [
  "New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia",
  "San Antonio", "San Diego", "Dallas", "San Jose", "Austin", "Jacksonville",
  "Fort Worth", "Columbus", "Charlotte", "San Francisco", "Indianapolis", "Seattle",
  "Denver", "Washington","Mountain View", "Boston", "El Paso", "Detroit", "Nashville"
];

const PROPERTY_TYPES = [
  { label: "All Types", value: "" },
  { label: "Residential", value: "residential" },
  { label: "Commercial", value: "commercial" },
  { label: "Industrial", value: "industrial" },
  { label: "Raw Land", value: "rawland" },
];

const PropertyMap = () => {
  const [properties, setProperties] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [type, setType] = useState("");
  const [city, setCity] = useState("");
  const [price, setPrice] = useState([0, 10000000]);
  const [searchCity, setSearchCity] = useState("");
  const [params] = useSearchParams();
  const focusedLat = parseFloat(params.get("lat"));
  const focusedLng = parseFloat(params.get("lng"));

  useEffect(() => {
    const fetchProperties = async () => {
      const q = query(collection(db, "properties"), where("approved", "==", true));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProperties(data);
      setFiltered(data);
    };
    fetchProperties();
  }, []);

  // Add ownerNetWorth filter and estimation
  const [netWorth, setNetWorth] = useState([0, 1000000000]);
  const [estimated, setEstimated] = useState(null);

  useEffect(() => {
    let result = properties;
    if (type) result = result.filter(p => p.type === type);
    if (city) result = result.filter(p => p.city === city);
    result = result.filter(
      p =>
        typeof p.price === "number" &&
        p.price >= price[0] &&
        p.price <= price[1] &&
        typeof p.ownerNetWorth === "number" &&
        p.ownerNetWorth >= netWorth[0] &&
        p.ownerNetWorth <= netWorth[1]
    );
    setFiltered(result);

    // Estimation logic based on type
    if (type && result.length > 0) {
      // Example: average price and net worth for selected type
      const avgPrice =
        result.reduce((sum, p) => sum + (p.price || 0), 0) / result.length;
      const avgNetWorth =
        result.reduce((sum, p) => sum + (p.ownerNetWorth || 0), 0) / result.length;
      setEstimated({
        avgPrice,
        avgNetWorth,
        count: result.length,
      });
    } else {
      setEstimated(null);
    }
  }, [type, city, price, netWorth, properties]);

  const handleBookmark = async (property) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        alert("Please log in to bookmark.");
        return;
      }
      await addDoc(collection(db, "bookmarks"), {
        userId: user.uid,
        propertyId: property.id,
        bookmarkedAt: serverTimestamp(),
        imageUrl: property.imageUrl ?? "",
      });
      alert("Bookmarked!");
      await logActivity({
        userId: user.uid,
        role: "user",
        action: `Bookmarked property ${property.id}`,
        actionType: "bookmarked",
      });
    } catch (e) {
      console.error("Bookmark error:", e);
      alert("Failed to bookmark.");
    }
  };

  const FocusMarker = ({ targetProperty }) => {
    const map = useMap();

    useEffect(() => {
      if (targetProperty && targetProperty.lat && targetProperty.lng) {
        map.setView([targetProperty.lat, targetProperty.lng], 13, { animate: true });
      }
    }, [targetProperty, map]);

    if (!targetProperty || typeof targetProperty.lat !== "number" || typeof targetProperty.lng !== "number") {
      return null;
    }

    return (
      <Marker
        position={[targetProperty.lat, targetProperty.lng]}
        icon={getMarkerIcon()}
      >
        <Popup>
          <div className="text-sm">
            <img
              src={targetProperty.imageUrl || "https://placehold.co/200x120?text=No+Image"}
              alt="Property"
              className="mb-2 rounded w-full max-w-[200px] h-[100px] object-cover"
            />
            <strong className="block text-blue-700">{targetProperty.address}</strong>
            <div className="mt-1">Price: <span className="font-semibold text-green-700">₹{targetProperty.price?.toLocaleString()}</span></div>
            <div>Size: {targetProperty.size} sqft</div>
            <div>Net Worth: ₹{targetProperty.ownerNetWorth?.toLocaleString()}</div>
            <button
              className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs transition"
              onClick={() => handleBookmark(targetProperty)}
            >
              Bookmark
            </button>
          </div>
        </Popup>
      </Marker>
    );
  };

  const location = useLocation();
  const focusedId = location.state?.propertyId;
  const focusedProperty = filtered.find((p) => p.id === focusedId);

  const FitBounds = ({ markers }) => {
    const map = useMap();
    useEffect(() => {
      if (!markers.length) return;
      const bounds = L.latLngBounds(markers.map(p => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }, [markers]);
    return null;
  };

  // Responsive marker icon size
  const getMarkerIcon = () =>
    new L.Icon({
      iconUrl: markerIcon,
      iconRetinaUrl: markerIcon2x,
      shadowUrl: markerShadow,
      iconSize: window.innerWidth < 640 ? [25, 41] : [35, 55],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

  // Filter US cities by search
  const filteredCities = US_CITIES.filter(c =>
    c.toLowerCase().includes(searchCity.toLowerCase())
  );

  return (
    <div className="w-full max-w-6xl mx-auto px-2 py-4">
      <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center text-blue-700">Explore Properties Across the US</h2>
      {/* Filter Bar */}
      <div className="flex flex-wrap gap-4 mb-4 items-end justify-center bg-white/80 rounded-lg shadow p-4">
        <div className="flex flex-col min-w-[120px]">
          <label className="block text-xs font-medium mb-1 text-gray-700">Type</label>
          <select
            className="border rounded px-2 py-1 text-sm"
            value={type}
            onChange={e => setType(e.target.value)}
          >
            {PROPERTY_TYPES.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col min-w-[160px]">
          <label className="block text-xs font-medium mb-1 text-gray-700">City</label>
          <input
            type="text"
            placeholder="Search city"
            className="border rounded px-2 py-1 text-sm mb-1"
            value={searchCity}
            onChange={e => setSearchCity(e.target.value)}
          />
          <select
            className="border rounded px-2 py-1 text-sm"
            value={city}
            onChange={e => setCity(e.target.value)}
          >
            <option value="">All Cities</option>
            {filteredCities.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col min-w-[180px]">
          <label className="block text-xs font-medium mb-1 text-gray-700">Price (0 - 1 Cr)</label>
          <input
            type="range"
            min={0}
            max={10000000}
            step={100000}
            value={price[1]}
            onChange={e => setPrice([0, Number(e.target.value)])}
            className="w-full"
          />
          <div className="text-xs mt-1 text-gray-600">Up to <span className="font-semibold text-blue-700">₹{(price[1]/100000).toFixed(2)} Cr</span></div>
        </div>
        <div className="flex flex-col min-w-[200px]">
          <label className="block text-xs font-medium mb-1 text-gray-700">Owner Net Worth (0 - 100 Cr)</label>
          <input
            type="range"
            min={0}
            max={1000000000}
            step={1000000}
            value={netWorth[1]}
            onChange={e => setNetWorth([0, Number(e.target.value)])}
            className="w-full"
          />
          <div className="text-xs mt-1 text-gray-600">
            Up to <span className="font-semibold text-blue-700">₹{(netWorth[1]/10000000).toFixed(2)} Cr</span>
          </div>
        </div>
      </div>
      <div className="relative rounded-lg overflow-hidden shadow-lg border border-blue-100">
        <MapContainer
          center={focusedLat && focusedLng ? [focusedLat, focusedLng] : [39.8283, -98.5795]}
          zoom={focusedLat && focusedLng ? 13 : 4}
          style={{ height: "60vh", width: "100%" }}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {focusedProperty && <FocusMarker targetProperty={focusedProperty} />}
          <FitBounds markers={filtered.filter(p => typeof p.lat === "number" && typeof p.lng === "number")} />
          {filtered
            .filter(p => typeof p.lat === 'number' && typeof p.lng === 'number')
            .map((property) => (
              <Marker
                key={property.id}
                position={[property.lat, property.lng]}
                icon={getMarkerIcon()}
              >
                <Popup>
                  <div className="text-sm">
                    <img
                      src={property.imageUrl || "https://placehold.co/200x120?text=No+Image"}
                      alt="Property"
                      className="mb-2 rounded w-full max-w-[200px] h-[100px] object-cover"
                    />
                    <strong className="block text-blue-700">{property.address}</strong>
                    <div className="mt-1">Price: <span className="font-semibold text-green-700">₹{property.price?.toLocaleString()}</span></div>
                    <div>Size: {property.size} sqft</div>
                    <div>Net Worth: ₹{property.ownerNetWorth?.toLocaleString()}</div>
                    <button
                      className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs transition"
                      onClick={() => handleBookmark(property)}
                    >
                      Bookmark
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
        </MapContainer>
        {/* Animated pin for engagement */}
        <div className="absolute top-4 left-4 bg-white/90 rounded-full px-3 py-1 shadow flex items-center gap-2 animate-bounce z-10">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path fill="#2563eb" d="M12 2C7.03 2 3 6.03 3 11c0 5.25 7.11 10.74 8.07 11.43a1 1 0 0 0 1.13 0C13.89 21.74 21 16.25 21 11c0-4.97-4.03-9-9-9Zm0 17.88C9.09 17.13 5 13.61 5 11c0-3.86 3.14-7 7-7s7 3.14 7 7c0 2.61-4.09 6.13-7 8.88ZM12 6a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 8a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z"/></svg>
          <span className="text-xs font-semibold text-blue-700">Find your next property!</span>
        </div>
      </div>
      <div className="mt-4 text-gray-600 text-center text-sm">
        {filtered.length === 0 && "No properties found for selected filters."}
        {filtered.length > 0 && (
          <span>
            Showing <span className="font-semibold text-blue-700">{filtered.length}</span> properties
          </span>
        )}
        {estimated && (
          <div className="mt-2 text-xs text-gray-500">
            <span>Avg Price: <span className="font-semibold text-green-700">₹{Math.round(estimated.avgPrice).toLocaleString()}</span></span>
            {" | "}
            <span>Avg Net Worth: <span className="font-semibold text-blue-700">₹{Math.round(estimated.avgNetWorth).toLocaleString()}</span></span>
            {" | "}
            <span>Count: <span className="font-semibold">{estimated.count}</span></span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyMap;