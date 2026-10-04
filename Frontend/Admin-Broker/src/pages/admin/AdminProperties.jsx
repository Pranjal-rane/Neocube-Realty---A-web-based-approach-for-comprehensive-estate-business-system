import { useEffect, useState } from "react";
import { DashboardShell } from "../../components/DashboardLayout";
import { Card } from "../../components/Bits";
import { Plus, X, Upload } from "lucide-react";

const API_URL = "http://localhost:8080";

const EMPTY_FORM = {
  title: "",
  locality: "",
  bhk: "2",
  price: "",
  area: "",
  type: "Apartment",
  bathrooms: "",
  description: "",
};

export default function AdminProperties() {
  const [properties, setProperties] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState(EMPTY_FORM);

  const [blueprint, setBlueprint] = useState(null);
  const [blueprintPreview, setBlueprintPreview] = useState("");

  const [loading, setLoading] = useState(false);
  const [loadingProperties, setLoadingProperties] = useState(true);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =========================================================
  // LOAD PROPERTIES FROM BACKEND
  // =========================================================

  useEffect(() => {
    fetchProperties();
  }, []);

  async function fetchProperties() {
    try {
      setLoadingProperties(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/properties`
      );

      if (!response.ok) {
        throw new Error(
          `Failed to load properties (${response.status})`
        );
      }

      const data = await response.json();

      setProperties(
        Array.isArray(data) ? data : []
      );
    } catch (err) {
      console.error(
        "Properties API Error:",
        err
      );

      setError(
        "Unable to load properties. Please make sure the Spring Boot backend is running."
      );
    } finally {
      setLoadingProperties(false);
    }
  }

  // =========================================================
  // FORM UPDATE
  // =========================================================

  function update(key, value) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  // =========================================================
  // BLUEPRINT FILE SELECT
  // =========================================================

  function handleBlueprintChange(event) {
    const file = event.target.files?.[0];

    setError("");
    setSuccess("");

    if (!file) {
      setBlueprint(null);
      setBlueprintPreview("");
      return;
    }

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "application/pdf",
    ];

    if (!allowedTypes.includes(file.type)) {
      setBlueprint(null);
      setBlueprintPreview("");

      setError(
        "Only PNG, JPG, JPEG or PDF blueprint files are allowed."
      );

      event.target.value = "";
      return;
    }

    // Maximum 10 MB
    if (file.size > 10 * 1024 * 1024) {
      setBlueprint(null);
      setBlueprintPreview("");

      setError(
        "Blueprint file size must be less than 10 MB."
      );

      event.target.value = "";
      return;
    }

    setBlueprint(file);

    // Preview image files
    if (file.type.startsWith("image/")) {
      const previewUrl =
        URL.createObjectURL(file);

      setBlueprintPreview(previewUrl);
    } else {
      setBlueprintPreview("");
    }
  }

  // =========================================================
  // RESET FORM
  // =========================================================

  function resetForm() {
    setForm(EMPTY_FORM);

    setBlueprint(null);
    setBlueprintPreview("");
  }

  // =========================================================
  // SAVE PROPERTY + BLUEPRINT
  // =========================================================

  async function handleAdd(event) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // =====================================================
      // STEP 1: CREATE PROPERTY
      // =====================================================

      const propertyPayload = {
        propertyName:
          form.title.trim(),

        location:
          form.locality.trim(),

        propertyType:
          form.type,

        bhk:
          Number(form.bhk),

        bathrooms:
          form.bathrooms
            ? Number(form.bathrooms)
            : null,

        price:
          Number(form.price),

        areaSqft:
          Number(form.area),

        description:
          form.description.trim(),

        status:
          "AVAILABLE",

        featured:
          false,
      };

      console.log(
        "Creating property:",
        propertyPayload
      );

      const createResponse =
        await fetch(
          `${API_URL}/api/properties`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(
                propertyPayload
              ),
          }
        );

      const createText =
        await createResponse.text();

      console.log(
        "Create property status:",
        createResponse.status
      );

      console.log(
        "Create property response:",
        createText
      );

      if (!createResponse.ok) {
        throw new Error(
          `Property creation failed (${createResponse.status}): ${createText}`
        );
      }

      let createdProperty;

      try {
        createdProperty =
          JSON.parse(createText);
      } catch {
        throw new Error(
          "Backend returned an invalid property response."
        );
      }

      const propertyId =
        createdProperty?.propertyId;

      if (!propertyId) {
        throw new Error(
          "Property was created but property ID was not returned."
        );
      }

      console.log(
        "Created property ID:",
        propertyId
      );

      // =====================================================
      // STEP 2: UPLOAD BLUEPRINT
      // =====================================================

      if (blueprint) {
        console.log(
          "Uploading blueprint:",
          blueprint.name
        );

        const formData =
          new FormData();

        formData.append(
          "file",
          blueprint
        );

        const blueprintResponse =
          await fetch(
            `${API_URL}/api/properties/${propertyId}/blueprint`,
            {
              method: "POST",
              body: formData,
            }
          );

        const blueprintText =
          await blueprintResponse.text();

        console.log(
          "Blueprint status:",
          blueprintResponse.status
        );

        console.log(
          "Blueprint response:",
          blueprintText
        );

        if (
          !blueprintResponse.ok
        ) {
          throw new Error(
            `Blueprint upload failed (${blueprintResponse.status}): ${blueprintText}`
          );
        }
      }

      // =====================================================
      // STEP 3: REFRESH DATA
      // =====================================================

      await fetchProperties();

      // =====================================================
      // STEP 4: SUCCESS
      // =====================================================

      setSuccess(
        blueprint
          ? "Property and 2D blueprint saved successfully."
          : "Property saved successfully."
      );

      resetForm();

      setShowForm(false);

    } catch (err) {
      console.error(
        "Add Property Error:",
        err
      );

      setError(
        err?.message ||
          "Unable to save property. Please check the backend."
      );
    } finally {
      setLoading(false);
    }
  }

  // =========================================================
  // FORMAT PRICE
  // =========================================================

  function formatPrice(price) {
    const value =
      Number(price || 0);

    return `₹${value.toLocaleString(
      "en-IN"
    )}`;
  }

  return (
    <DashboardShell
      role="admin"
      title="Property Management"
      subtitle="Properties added here go live on the customer site instantly"
    >
      {/* =====================================================
          TOP BUTTON
      ===================================================== */}

      <div className="mb-4 flex justify-end">
        <button
          onClick={() => {
            setShowForm(
              (current) => !current
            );

            setError("");
            setSuccess("");
          }}
          className="btn-primary gap-2"
          disabled={loading}
        >
          {showForm ? (
            <>
              <X size={16} />
              Close
            </>
          ) : (
            <>
              <Plus size={16} />
              Add Property
            </>
          )}
        </button>
      </div>

      {/* =====================================================
          SUCCESS MESSAGE
      ===================================================== */}

      {success && (
        <div className="mb-4 rounded-xl border border-sage/20 bg-sage/10 px-4 py-3 text-sm text-ink">
          {success}
        </div>
      )}

      {/* =====================================================
          ERROR MESSAGE
      ===================================================== */}

      {error && (
        <div className="mb-4 rounded-xl border border-rustred/20 bg-rustred/5 px-4 py-3 text-sm text-rustred">
          {error}
        </div>
      )}

      {/* =====================================================
          ADD PROPERTY FORM
      ===================================================== */}

      {showForm && (
        <Card className="mb-6">
          <div className="mb-5">
            <h2 className="font-display text-sm uppercase tracking-[0.14em] text-ink">
              New Property
            </h2>

            <p className="mt-1 text-xs text-muted">
              Add property details and a 2D floor plan.
            </p>
          </div>

          <form
            onSubmit={handleAdd}
            className="grid gap-4 sm:grid-cols-2"
          >
            {/* PROPERTY TITLE */}

            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted">
                Property Title
              </label>

              <input
                required
                type="text"
                placeholder="Koregaon Park Residency"
                className="input"
                value={form.title}
                onChange={(e) =>
                  update(
                    "title",
                    e.target.value
                  )
                }
                disabled={loading}
              />
            </div>

            {/* LOCALITY */}

            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted">
                Locality
              </label>

              <input
                required
                type="text"
                placeholder="Koregaon Park, Pune"
                className="input"
                value={form.locality}
                onChange={(e) =>
                  update(
                    "locality",
                    e.target.value
                  )
                }
                disabled={loading}
              />
            </div>

            {/* BHK */}

            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted">
                BHK
              </label>

              <select
                className="input"
                value={form.bhk}
                onChange={(e) =>
                  update(
                    "bhk",
                    e.target.value
                  )
                }
                disabled={loading}
              >
                {[1, 2, 3, 4, 5].map(
                  (n) => (
                    <option
                      key={n}
                      value={n}
                    >
                      {n} BHK
                    </option>
                  )
                )}
              </select>
            </div>

            {/* TYPE */}

            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted">
                Property Type
              </label>

              <select
                className="input"
                value={form.type}
                onChange={(e) =>
                  update(
                    "type",
                    e.target.value
                  )
                }
                disabled={loading}
              >
                {[
                  "Apartment",
                  "Villa",
                  "Penthouse",
                ].map(
                  (type) => (
                    <option
                      key={type}
                      value={type}
                    >
                      {type}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* PRICE */}

            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted">
                Price (INR)
              </label>

              <input
                required
                type="number"
                min="0"
                placeholder="12500000"
                className="input"
                value={form.price}
                onChange={(e) =>
                  update(
                    "price",
                    e.target.value
                  )
                }
                disabled={loading}
              />
            </div>

            {/* AREA */}

            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted">
                Area (sqft)
              </label>

              <input
                required
                type="number"
                min="1"
                placeholder="1450"
                className="input"
                value={form.area}
                onChange={(e) =>
                  update(
                    "area",
                    e.target.value
                  )
                }
                disabled={loading}
              />
            </div>

            {/* BATHROOMS */}

            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted">
                Bathrooms
              </label>

              <input
                type="number"
                min="0"
                placeholder="2"
                className="input"
                value={form.bathrooms}
                onChange={(e) =>
                  update(
                    "bathrooms",
                    e.target.value
                  )
                }
                disabled={loading}
              />
            </div>

            {/* DESCRIPTION */}

            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted">
                Description
              </label>

              <input
                type="text"
                placeholder="Spacious 3 BHK apartment"
                className="input"
                value={form.description}
                onChange={(e) =>
                  update(
                    "description",
                    e.target.value
                  )
                }
                disabled={loading}
              />
            </div>

            {/* =================================================
                2D BLUEPRINT UPLOAD
            ================================================= */}

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted">
                2D Blueprint / Floor Plan
              </label>

              <div className="rounded-xl border border-dashed border-cream bg-offwhite/60 p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                  
                  <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-cream bg-white px-4 py-3 text-sm font-medium text-ink transition hover:border-maroon hover:text-maroon">
                    <Upload size={17} />

                    {blueprint
                      ? "Change Blueprint"
                      : "Choose Blueprint"}

                    <input
                      type="file"
                      accept=".png,.jpg,.jpeg,.pdf,image/png,image/jpeg,application/pdf"
                      className="hidden"
                      onChange={
                        handleBlueprintChange
                      }
                      disabled={loading}
                    />
                  </label>

                  {blueprint && (
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-ink">
                        {blueprint.name}
                      </p>

                      <p className="text-xs text-muted">
                        {(
                          blueprint.size /
                          1024 /
                          1024
                        ).toFixed(2)}{" "}
                        MB
                      </p>
                    </div>
                  )}
                </div>

                <p className="mt-3 text-xs text-muted">
                  Upload a clear 2D floor plan in PNG, JPG,
                  JPEG or PDF format. Maximum size: 10 MB.
                </p>

                {/* IMAGE PREVIEW */}

                {blueprintPreview && (
                  <div className="mt-4 overflow-hidden rounded-xl border border-cream bg-white p-3">
                    <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted">
                      Blueprint Preview
                    </p>

                    <img
                      src={blueprintPreview}
                      alt="Blueprint Preview"
                      className="max-h-[500px] w-full rounded-lg object-contain"
                    />
                  </div>
                )}

                {/* PDF INFO */}

                {blueprint &&
                  blueprint.type ===
                    "application/pdf" && (
                    <div className="mt-4 rounded-lg bg-cream/60 p-4">
                      <p className="text-sm font-medium text-ink">
                        PDF Blueprint Selected
                      </p>

                      <p className="mt-1 text-xs text-muted">
                        This PDF will be stored with the
                        property and shown to customers.
                      </p>
                    </div>
                  )}
              </div>
            </div>

            {/* =================================================
                BUTTONS
            ================================================= */}

            <div className="flex gap-3 sm:col-span-2">
              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
              >
                {loading
                  ? "Saving Property..."
                  : "Save Property"}
              </button>

              <button
                type="button"
                className="btn-outline"
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                  setError("");
                  setSuccess("");
                }}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        </Card>
      )}

      {/* =====================================================
          PROPERTY TABLE
      ===================================================== */}

      <div className="overflow-x-auto rounded-xl border border-cream bg-white shadow-card">
        <table className="w-full text-sm">
          <thead className="bg-cream/60 text-left text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">
                Property
              </th>

              <th className="px-4 py-3">
                Locality
              </th>

              <th className="px-4 py-3">
                BHK
              </th>

              <th className="px-4 py-3">
                Price
              </th>

              <th className="px-4 py-3">
                Blueprint
              </th>

              <th className="px-4 py-3">
                Status
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-cream">
            {loadingProperties ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-sm text-muted"
                >
                  Loading properties...
                </td>
              </tr>
            ) : properties.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-sm text-muted"
                >
                  No properties found.
                </td>
              </tr>
            ) : (
              properties.map(
                (property) => (
                  <tr
                    key={
                      property.propertyId
                    }
                  >
                    <td className="px-4 py-3 font-medium text-ink">
                      {property.propertyName}
                    </td>

                    <td className="px-4 py-3 text-muted">
                      {property.location}
                    </td>

                    <td className="px-4 py-3 text-muted">
                      {property.bhk
                        ? `${property.bhk} BHK`
                        : "N/A"}
                    </td>

                    <td className="px-4 py-3">
                      {formatPrice(
                        property.price
                      )}
                    </td>

                    <td className="px-4 py-3">
                      {property.blueprintPath ? (
                        <span className="rounded-full bg-sage/10 px-2.5 py-1 text-xs font-medium text-ink">
                          Available
                        </span>
                      ) : (
                        <span className="text-xs text-muted">
                          Not uploaded
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-muted">
                      {property.status ||
                        "AVAILABLE"}
                    </td>
                  </tr>
                )
              )
            )}
          </tbody>
        </table>
      </div>
    </DashboardShell>
  );
}