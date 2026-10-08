import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DashboardShell } from "../../components/DashboardLayout";
import { Card } from "../../components/Bits";
import PhotoUpload from "../../components/PhotoUpload";
import { useAuth } from "../../lib/auth";
import { Plus, Pencil, X, ExternalLink } from "lucide-react";

const API_BASE = "http://localhost:8080/api";

const LOCALITY_NAMES = [
  "Kharadi, Pune",
  "Baner, Pune",
  "Wakad, Pune",
  "Hinjewadi, Pune",
  "Viman Nagar, Pune",
  "Wagholi, Pune",
  "Kothrud, Pune",
  "Kalyani Nagar, Pune",
];

const EMPTY_FORM = {
  ownerName: "",
  ownerPhone: "",
  ownerEmail: "",
  title: "",
  locality: LOCALITY_NAMES[0],
  bhk: "2",
  type: "Apartment",
  price: "",
  area: "",
  status: "AVAILABLE",
  description: "",
};

function inr(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

function backendToFrontend(property) {
  return {
    ...property,
    id: property.propertyId,
    title: property.propertyName,
    locality: property.location,
    type: property.propertyType,
    area: property.areaSqft,
    price: property.price,
    brokerId: property.addedBy,
    status: property.status,
    images: property.imagePath ? [property.imagePath] : [],
  };
}

export default function BrokerListings() {
  const { user } = useAuth();

  const [allProperties, setAllProperties] = useState([]);
  const [broker, setBroker] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [photos, setPhotos] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [justAdded, setJustAdded] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.brokerId) {
      setLoading(false);
      return;
    }

    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const brokerResponse = await fetch(
          `${API_BASE}/brokers/code/${user.brokerId}`
        );

        if (!brokerResponse.ok) {
          throw new Error("Broker details could not be loaded.");
        }

        const brokerData = await brokerResponse.json();
        setBroker(brokerData);

        const propertiesResponse = await fetch(
          `${API_BASE}/properties`
        );

        if (!propertiesResponse.ok) {
          throw new Error("Properties could not be loaded.");
        }

        const propertiesData = await propertiesResponse.json();

        setAllProperties(propertiesData);
      } catch (err) {
        console.error("Broker listings loading error:", err);
        setError(err.message || "Unable to load listings.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user?.brokerId]);

  const listings = allProperties.filter(
    (property) =>
      broker &&
      Number(property.addedBy) === Number(broker.brokerId)
  );

  function update(key, value) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setPhotos([]);
    setEditingId(null);
    setShowForm(false);
  }

  function startEdit(property) {
    setEditingId(property.propertyId);

    setForm({
      ownerName: property.ownerName || "",
      ownerPhone: property.ownerPhone || "",
      ownerEmail: property.ownerEmail || "",
      title: property.propertyName || "",
      locality: property.location || LOCALITY_NAMES[0],
      bhk: String(property.bhk || 2),
      type: property.propertyType || "Apartment",
      price: String(property.price || ""),
      area: String(property.areaSqft || ""),
      status: property.status || "AVAILABLE",
      description: property.description || "",
    });

    setPhotos(property.imagePath ? [property.imagePath] : []);
    setJustAdded(null);
    setShowForm(true);
  }

  async function handleDelete(propertyId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this listing?"
    );

    if (!confirmed) return;

    try {
      setError("");

      const response = await fetch(
        `${API_BASE}/properties/${propertyId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Listing could not be deleted.");
      }

      setAllProperties((current) =>
        current.filter(
          (property) => property.propertyId !== propertyId
        )
      );
    } catch (err) {
      console.error("Delete listing error:", err);
      setError(err.message || "Unable to delete listing.");
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!broker?.brokerId) {
      setError("Broker details are not available.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const imagePath =
        photos.length > 0 ? photos[0] : null;

      const propertyData = {
        propertyName: form.title,
        location: form.locality,
        propertyType: form.type,
        bhk: Number(form.bhk),
        bathrooms: null,
        price: Number(form.price),
        areaSqft: Number(form.area),
        ownerName: form.ownerName,
        ownerPhone: form.ownerPhone,
        ownerEmail: form.ownerEmail || null,
        description: form.description,
        imagePath,
        blueprintPath: null,
        status: form.status,
        featured: false,
        addedBy: Number(broker.brokerId),
      };

      let response;

      if (editingId) {
        response = await fetch(
          `${API_BASE}/properties/${editingId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(propertyData),
          }
        );
      } else {
        response = await fetch(
          `${API_BASE}/properties`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(propertyData),
          }
        );
      }

      if (!response.ok) {
        throw new Error(
          editingId
            ? "Listing could not be updated."
            : "Listing could not be created."
        );
      }

      const savedProperty = await response.json();

      setAllProperties((current) => {
        if (editingId) {
          return current.map((property) =>
            property.propertyId === editingId
              ? savedProperty
              : property
          );
        }

        return [savedProperty, ...current];
      });

      if (!editingId) {
        setJustAdded(
          backendToFrontend(savedProperty)
        );
      }

      resetForm();
    } catch (err) {
      console.error("Save listing error:", err);
      setError(
        err.message || "Unable to save listing."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <DashboardShell
      role="broker"
      title="My Listings"
      subtitle="Take the owner's details here — it publishes straight to the customer website"
    >
      <div className="mb-4 flex justify-end">
        <button
          onClick={() => {
            setEditingId(null);
            setForm(EMPTY_FORM);
            setPhotos([]);
            setJustAdded(null);
            setShowForm((current) => !current);
          }}
          className="btn-primary gap-2"
        >
          <Plus size={16} />
          New Listing from Owner
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {showForm && (
        <Card className="mb-6">
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-xs uppercase tracking-[0.14em] text-muted">
                  {editingId
                    ? "Edit Listing"
                    : "Owner details"}
                </h3>

                <p className="mt-1 text-xs text-muted">
                  Kept private — visible only to you and Admin,
                  never shown to customers.
                </p>
              </div>

              <button
                type="button"
                onClick={resetForm}
                className="text-muted hover:text-ink"
              >
                <X size={20} />
              </button>
            </div>

            <div>
              <div className="mt-3 grid gap-4 sm:grid-cols-3">
                <input
                  required
                  placeholder="Owner name"
                  className="input"
                  value={form.ownerName}
                  onChange={(e) =>
                    update("ownerName", e.target.value)
                  }
                />

                <input
                  required
                  placeholder="Owner phone"
                  className="input"
                  value={form.ownerPhone}
                  onChange={(e) =>
                    update("ownerPhone", e.target.value)
                  }
                />

                <input
                  type="email"
                  placeholder="Owner email (optional)"
                  className="input"
                  value={form.ownerEmail}
                  onChange={(e) =>
                    update("ownerEmail", e.target.value)
                  }
                />
              </div>
            </div>

            <div>
              <h3 className="font-display text-xs uppercase tracking-[0.14em] text-muted">
                Property details
              </h3>

              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <input
                  required
                  placeholder="Property title"
                  className="input"
                  value={form.title}
                  onChange={(e) =>
                    update("title", e.target.value)
                  }
                />

                <select
                  className="input"
                  value={form.locality}
                  onChange={(e) =>
                    update("locality", e.target.value)
                  }
                >
                  {LOCALITY_NAMES.map((locality) => (
                    <option
                      key={locality}
                      value={locality}
                    >
                      {locality}
                    </option>
                  ))}
                </select>

                <select
                  className="input"
                  value={form.bhk}
                  onChange={(e) =>
                    update("bhk", e.target.value)
                  }
                >
                  {[1, 2, 3, 4].map((number) => (
                    <option
                      key={number}
                      value={number}
                    >
                      {number} BHK
                    </option>
                  ))}
                </select>

                <select
                  className="input"
                  value={form.type}
                  onChange={(e) =>
                    update("type", e.target.value)
                  }
                >
                  {[
                    "Apartment",
                    "Villa",
                    "Penthouse",
                    "Commercial",
                  ].map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>

                <input
                  required
                  type="number"
                  placeholder="Price (INR)"
                  className="input"
                  value={form.price}
                  onChange={(e) =>
                    update("price", e.target.value)
                  }
                />

                <input
                  required
                  type="number"
                  placeholder="Area (sqft)"
                  className="input"
                  value={form.area}
                  onChange={(e) =>
                    update("area", e.target.value)
                  }
                />

                <select
                  className="input"
                  value={form.status}
                  onChange={(e) =>
                    update("status", e.target.value)
                  }
                >
                  <option value="AVAILABLE">
                    Available
                  </option>
                  <option value="SOLD">
                    Sold
                  </option>
                  <option value="RESERVED">
                    Reserved
                  </option>
                </select>

                <textarea
                  rows={3}
                  placeholder="Description for customers (optional)"
                  className="input sm:col-span-2"
                  value={form.description}
                  onChange={(e) =>
                    update("description", e.target.value)
                  }
                />
              </div>
            </div>

            <div>
              <h3 className="font-display text-xs uppercase tracking-[0.14em] text-muted">
                Property photo
              </h3>

              <div className="mt-3">
                <PhotoUpload
                photos={photos}
                onChange={setPhotos}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="btn-primary"
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Update Listing"
                  : "Publish Listing"}
            </button>
          </form>
        </Card>
      )}

      {justAdded && (
        <div className="mb-6 flex items-center justify-between rounded-lg bg-sage/10 p-3 text-sm text-ink">
          <span>
            <span className="font-medium">
              {justAdded.title}
            </span>{" "}
            is live on the customer site — {justAdded.id}
          </span>

          <Link
            to={`/properties/${justAdded.id}`}
            target="_blank"
            className="inline-flex items-center gap-1 text-maroon hover:underline"
          >
            View
            <ExternalLink size={13} />
          </Link>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-cream bg-white shadow-card">
        <table className="w-full text-sm">
          <thead className="bg-cream/60 text-left text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">
                Property
              </th>

              <th className="px-4 py-3">
                Owner
              </th>

              <th className="px-4 py-3">
                Locality
              </th>

              <th className="px-4 py-3">
                Price
              </th>

              <th className="px-4 py-3">
                Status
              </th>

              <th className="px-4 py-3">
                Live page
              </th>

              <th className="px-4 py-3">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-cream">
            {loading && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-6 text-center text-muted"
                >
                  Loading listings...
                </td>
              </tr>
            )}

            {!loading &&
              listings.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-6 text-center text-muted"
                  >
                    No listings yet — use
                    "New Listing from Owner" above.
                  </td>
                </tr>
              )}

            {!loading &&
              listings.map((property) => (
                <tr key={property.propertyId}>
                  <td className="px-4 py-3 font-medium text-ink">
                    {property.propertyName}
                  </td>

                  <td className="px-4 py-3 text-muted">
                    {property.ownerName || "—"}
                  </td>

                  <td className="px-4 py-3 text-muted">
                    {property.location}
                  </td>

                  <td className="px-4 py-3">
                    {inr(property.price)}
                  </td>

                  <td className="px-4 py-3 text-muted">
                    {property.status}
                  </td>

                  <td className="px-4 py-3">
                    <Link
                      to={`/properties/${property.propertyId}`}
                      target="_blank"
                      className="text-maroon hover:underline"
                    >
                      View
                    </Link>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          startEdit(property)
                        }
                        className="inline-flex items-center gap-1 text-maroon hover:underline"
                      >
                        <Pencil size={14} />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(
                            property.propertyId
                          )
                        }
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </DashboardShell>
  );
}