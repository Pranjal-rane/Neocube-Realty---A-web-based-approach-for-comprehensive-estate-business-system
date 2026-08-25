import { useRef } from "react";
import { X, ImagePlus } from "lucide-react";

const MAX_PHOTOS = 6;

// Stores photos as base64 data URLs (this app has no backend yet, so images
// live in localStorage alongside everything else). Keep uploads reasonably
// sized — a handful of compressed photos per property is fine.
export default function PhotoUpload({ photos, onChange }) {
  const inputRef = useRef(null);

  function handleFiles(fileList) {
    const files = Array.from(fileList).slice(0, MAX_PHOTOS - photos.length);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        onChange((prev) => [...prev, reader.result].slice(0, MAX_PHOTOS));
      };
      reader.readAsDataURL(file);
    });
  }

  function removeAt(index) {
    onChange((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div>
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted">
        Photos {photos.length > 0 && `(${photos.length}/${MAX_PHOTOS})`}
      </span>
      <div className="flex flex-wrap gap-3">
        {photos.map((src, i) => (
          <div key={i} className="group relative h-20 w-20 overflow-hidden rounded-lg border border-cream">
            <img src={src} alt={`Property photo ${i + 1}`} className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => removeAt(i)}
              className="absolute right-1 top-1 rounded-full bg-ink/70 p-0.5 text-white opacity-0 transition group-hover:opacity-100"
            >
              <X size={12} />
            </button>
          </div>
        ))}
        {photos.length < MAX_PHOTOS && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-cream text-muted transition hover:border-maroon hover:text-maroon"
          >
            <ImagePlus size={18} />
            <span className="text-[10px]">Add photo</span>
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}
