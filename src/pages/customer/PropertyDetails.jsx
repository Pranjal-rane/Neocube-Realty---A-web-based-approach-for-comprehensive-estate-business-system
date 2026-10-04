import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import PublicNav from "../../components/PublicNav";

const API_URL = "http://localhost:8080";

export default function PropertyDetails() {
  const { id } = useParams();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  // =========================================================
  // BLUEPRINT VIEWER STATE
  // =========================================================

  const [showBlueprint, setShowBlueprint] =
    useState(false);

  const [zoom, setZoom] = useState(1);

  const [position, setPosition] = useState({
    x: 0,
    y: 0,
  });

  const [dragging, setDragging] =
    useState(false);

  const [dragStart, setDragStart] = useState({
    x: 0,
    y: 0,
  });

  // =========================================================
  // FETCH PROPERTY
  // =========================================================

  useEffect(() => {
    async function fetchProperty() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/properties/${id}`
        );

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error(
              "Property not found"
            );
          }

          throw new Error(
            `Failed to fetch property. Status: ${response.status}`
          );
        }

        const data = await response.json();

        setProperty(data);
      } catch (err) {
        console.error(
          "Property Details API Error:",
          err
        );

        setError(
          err.message ||
            "Unable to load property."
        );
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchProperty();
    }
  }, [id]);

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
  // INQUIRY SUBMIT
  // =========================================================

  function handleSubmit(e) {
    e.preventDefault();

    // Existing inquiry flow kept unchanged
    setSubmitted(true);
  }

  // =========================================================
  // OPEN BLUEPRINT
  // =========================================================

  function openBlueprint() {
    setZoom(1);

    setPosition({
      x: 0,
      y: 0,
    });

    setShowBlueprint(true);
  }

  // =========================================================
  // CLOSE BLUEPRINT
  // =========================================================

  function closeBlueprint() {
    setShowBlueprint(false);

    setZoom(1);

    setPosition({
      x: 0,
      y: 0,
    });

    setDragging(false);
  }

  // =========================================================
  // ZOOM IN
  // =========================================================

  function zoomIn() {
    setZoom((current) =>
      Math.min(
        Number((current + 0.25).toFixed(2)),
        4
      )
    );
  }

  // =========================================================
  // ZOOM OUT
  // =========================================================

  function zoomOut() {
    setZoom((current) => {
      const next = Number(
        (current - 0.25).toFixed(2)
      );

      if (next <= 1) {
        setPosition({
          x: 0,
          y: 0,
        });

        return 1;
      }

      return next;
    });
  }

  // =========================================================
  // RESET VIEW
  // =========================================================

  function resetBlueprint() {
    setZoom(1);

    setPosition({
      x: 0,
      y: 0,
    });
  }

  // =========================================================
  // MOUSE WHEEL ZOOM
  // =========================================================

  function handleWheel(e) {
    e.preventDefault();

    if (e.deltaY < 0) {
      zoomIn();
    } else {
      zoomOut();
    }
  }

  // =========================================================
  // START DRAG
  // =========================================================

  function handlePointerDown(e) {
    if (zoom <= 1) return;

    setDragging(true);

    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });

    e.currentTarget.setPointerCapture(
      e.pointerId
    );
  }

  // =========================================================
  // DRAG BLUEPRINT
  // =========================================================

  function handlePointerMove(e) {
    if (!dragging || zoom <= 1) return;

    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  }

  // =========================================================
  // STOP DRAG
  // =========================================================

  function handlePointerUp() {
    setDragging(false);
  }

  // =========================================================
  // KEYBOARD ESC
  // =========================================================

  useEffect(() => {
    function handleEscape(e) {
      if (
        e.key === "Escape" &&
        showBlueprint
      ) {
        closeBlueprint();
      }
    }

    window.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [showBlueprint]);

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-offwhite">
        <PublicNav />

        <div className="mx-auto max-w-3xl px-5 py-16 text-center">
          <p className="text-muted">
            Loading property details...
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error || !property) {
    return (
      <div className="min-h-screen bg-offwhite">
        <PublicNav />

        <div className="mx-auto max-w-3xl px-5 py-16 text-center">
          <p className="text-muted">
            {error ||
              "Property not found."}
          </p>

          <Link
            to="/properties"
            className="mt-2 inline-block text-maroon hover:underline"
          >
            Back to listings
          </Link>
        </div>
      </div>
    );
  }

  // =========================================================
  // BLUEPRINT API URL
  // =========================================================

  const blueprintUrl =
    `${API_URL}/api/properties/${property.propertyId}/blueprint/view`;

  const isPdf =
    property.blueprintPath
      ?.toLowerCase()
      .endsWith(".pdf");

  return (
    <>
      {/* =====================================================
          MAIN PROPERTY PAGE
      ===================================================== */}

      <div className="min-h-screen bg-offwhite">
        <PublicNav />

        <div className="mx-auto max-w-5xl px-5 py-10">
          {/* BACK */}

          <Link
            to="/properties"
            className="text-sm text-maroon hover:underline"
          >
            ← Back to listings
          </Link>

          <div className="mt-4 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
            {/* =================================================
                LEFT SIDE
            ================================================= */}

            <div>
              {/* PROPERTY IMAGE */}

              <div className="relative h-72 overflow-hidden rounded-xl bg-cream">
                {property.imagePath ? (
                  <img
                    src={property.imagePath}
                    alt={
                      property.propertyName
                    }
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-muted">
                    No property image available
                  </div>
                )}

                <span className="absolute right-3 top-3 rounded-full border-2 border-maroon bg-white/90 px-3 py-1 text-xs font-mono text-maroon">
                  Verified ·{" "}
                  {property.propertyId}
                </span>
              </div>

              {/* PROPERTY NAME */}

              <h1 className="mt-5 font-display text-2xl uppercase tracking-[0.05em] text-ink">
                {property.propertyName ||
                  "Property"}
              </h1>

              {/* LOCATION */}

              <p className="text-muted">
                {property.location ||
                  "Location not available"}
              </p>

              {/* PRICE */}

              <p className="mt-2 font-mono text-xl font-semibold text-maroon">
                ₹
                {Number(
                  property.price || 0
                ).toLocaleString(
                  "en-IN"
                )}
              </p>

              {/* PROPERTY SPECS */}

              <div className="mt-6 grid grid-cols-3 gap-4 rounded-xl border border-cream bg-white p-4 shadow-card">
                <Spec
                  label="BHK"
                  value={
                    property.bhk ?? "N/A"
                  }
                />

                <Spec
                  label="Area"
                  value={
                    property.areaSqft
                      ? `${property.areaSqft} sqft`
                      : "N/A"
                  }
                />

                <Spec
                  label="Type"
                  value={
                    property.propertyType ||
                    "N/A"
                  }
                />
              </div>

              {/* DESCRIPTION */}

              {property.description && (
                <div className="mt-6 rounded-xl border border-cream bg-white p-4 shadow-card">
                  <p className="text-sm font-medium text-ink">
                    Description
                  </p>

                  <p className="mt-2 text-sm leading-6 text-muted">
                    {property.description}
                  </p>
                </div>
              )}

              {/* LOCATION */}

              <div className="mt-6 rounded-xl border border-cream bg-white p-4 shadow-card">
                <p className="text-sm font-medium text-ink">
                  Location
                </p>

                <p className="mt-1 text-sm text-muted">
                  {property.location ||
                    "Location not available"}
                </p>
              </div>

              {/* =================================================
                  2D BLUEPRINT
              ================================================= */}

              {property.blueprintPath && (
                <div className="mt-6 rounded-xl border border-cream bg-white p-5 shadow-card">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="font-display text-sm uppercase tracking-[0.12em] text-ink">
                        2D Property Blueprint
                      </h2>

                      <p className="mt-1 text-xs text-muted">
                        Explore the internal layout of this property
                      </p>
                    </div>

                    {!isPdf && (
                      <button
                        type="button"
                        onClick={openBlueprint}
                        className="btn-primary shrink-0"
                      >
                        View Interactive Blueprint
                      </button>
                    )}

                    {isPdf && (
                      <a
                        href={blueprintUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-primary shrink-0"
                      >
                        Open Blueprint PDF
                      </a>
                    )}
                  </div>

                  {/* IMAGE PREVIEW */}

                  {!isPdf && (
                    <button
                      type="button"
                      onClick={openBlueprint}
                      className="mt-5 block w-full cursor-zoom-in overflow-hidden rounded-xl border border-cream bg-offwhite p-3 text-left"
                    >
                      <img
                        src={blueprintUrl}
                        alt="Property Blueprint"
                        className="max-h-[550px] w-full rounded-lg object-contain"
                      />

                      <p className="mt-3 text-center text-xs text-muted">
                        Click blueprint to zoom and explore
                      </p>
                    </button>
                  )}

                  {/* PDF MESSAGE */}

                  {isPdf && (
                    <div className="mt-5 rounded-xl bg-cream/50 p-6 text-center">
                      <p className="text-sm font-medium text-ink">
                        2D Blueprint PDF Available
                      </p>

                      <p className="mt-1 text-xs text-muted">
                        Open the PDF to view the complete floor plan.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* =================================================
                RIGHT SIDE
            ================================================= */}

            <div>
              <div className="rounded-xl border border-cream bg-white p-5 shadow-card">
                <h2 className="font-display text-sm uppercase tracking-[0.12em] text-ink">
                  Send Inquiry
                </h2>

                {submitted ? (
                  <p className="mt-4 rounded-lg bg-sage/10 p-3 text-sm text-ink">
                    Your inquiry has been received.
                    A broker will contact you shortly.
                  </p>
                ) : (
                  <form
                    onSubmit={handleSubmit}
                    className="mt-4 space-y-3"
                  >
                    <input
                      required
                      placeholder="Name"
                      className="input"
                      value={form.name}
                      onChange={(e) =>
                        update(
                          "name",
                          e.target.value
                        )
                      }
                    />

                    <input
                      required
                      placeholder="Mobile"
                      className="input"
                      value={form.phone}
                      onChange={(e) =>
                        update(
                          "phone",
                          e.target.value
                        )
                      }
                    />

                    <input
                      required
                      type="email"
                      placeholder="Email"
                      className="input"
                      value={form.email}
                      onChange={(e) =>
                        update(
                          "email",
                          e.target.value
                        )
                      }
                    />

                    <textarea
                      rows={3}
                      placeholder="Message"
                      className="input"
                      value={form.message}
                      onChange={(e) =>
                        update(
                          "message",
                          e.target.value
                        )
                      }
                    />

                    <button
                      type="submit"
                      className="btn-primary w-full"
                    >
                      Submit Inquiry
                    </button>
                  </form>
                )}

                <button
                  type="button"
                  className="btn-outline mt-3 w-full"
                >
                  Schedule Site Visit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =======================================================
          INTERACTIVE BLUEPRINT MODAL
      ======================================================= */}

      {showBlueprint && (
        <div className="fixed inset-0 z-[100] bg-black/80 p-3 sm:p-6">
          <div className="flex h-full w-full flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
            {/* HEADER */}

            <div className="flex items-center justify-between gap-4 border-b border-cream bg-white px-4 py-3">
              <div className="min-w-0">
                <h2 className="truncate font-display text-sm uppercase tracking-[0.12em] text-ink">
                  2D Floor Plan
                </h2>

                <p className="truncate text-xs text-muted">
                  {property.propertyName}
                </p>
              </div>

              <button
                type="button"
                onClick={closeBlueprint}
                className="rounded-lg border border-cream px-3 py-2 text-sm text-ink hover:bg-cream"
              >
                ✕
              </button>
            </div>

            {/* VIEWER */}

            <div className="relative flex-1 overflow-hidden bg-[#151515]">
              <div
                className={`flex h-full w-full items-center justify-center select-none ${
                  zoom > 1
                    ? dragging
                      ? "cursor-grabbing"
                      : "cursor-grab"
                    : "cursor-default"
                }`}
                onWheel={handleWheel}
                onPointerDown={
                  handlePointerDown
                }
                onPointerMove={
                  handlePointerMove
                }
                onPointerUp={
                  handlePointerUp
                }
                onPointerCancel={
                  handlePointerUp
                }
                onPointerLeave={
                  handlePointerUp
                }
              >
                <img
                  src={blueprintUrl}
                  alt="Interactive property blueprint"
                  draggable="false"
                  style={{
                    transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                    transition: dragging
                      ? "none"
                      : "transform 0.2s ease",
                  }}
                  className="max-h-[82vh] max-w-[92vw] object-contain"
                />
              </div>

              {/* =================================================
                  CONTROLS
              ================================================= */}

              <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-xl border border-white/10 bg-black/80 p-2 shadow-xl backdrop-blur">
                <button
                  type="button"
                  onClick={zoomOut}
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-lg font-semibold text-ink hover:bg-cream"
                  title="Zoom Out"
                >
                  −
                </button>

                <div className="flex min-w-[70px] items-center justify-center rounded-lg bg-white px-3 py-2 text-xs font-medium text-ink">
                  {Math.round(
                    zoom * 100
                  )}
                  %
                </div>

                <button
                  type="button"
                  onClick={zoomIn}
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-lg font-semibold text-ink hover:bg-cream"
                  title="Zoom In"
                >
                  +
                </button>

                <button
                  type="button"
                  onClick={resetBlueprint}
                  className="ml-1 flex h-10 items-center justify-center rounded-lg bg-maroon px-3 text-xs font-medium text-white hover:opacity-90"
                  title="Reset"
                >
                  ↻ Reset
                </button>
              </div>

              {/* =================================================
                  HELPER TEXT
              ================================================= */}

              <div className="absolute left-4 top-4 rounded-lg bg-black/70 px-3 py-2 text-xs text-white">
                {zoom > 1
                  ? "Drag to move • Scroll to zoom"
                  : "Scroll or use + to zoom"}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ==========================================================
// PROPERTY SPECIFICATION
// ==========================================================

function Spec({ label, value }) {
  return (
    <div className="text-center">
      <p className="font-mono text-lg font-semibold text-ink">
        {value}
      </p>

      <p className="text-xs uppercase tracking-wide text-muted">
        {label}
      </p>
    </div>
  );
}