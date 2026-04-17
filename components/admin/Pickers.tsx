// ========= SIZE PICKER =========
const ALL_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

export function SizePicker({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (sizes: string[]) => void;
}) {
  const toggle = (size: string) => {
    onChange(
      selected.includes(size)
        ? selected.filter((s) => s !== size)
        : [...selected, size],
    );
  };

  return (
    <div className="flex flex-wrap gap-2">
      {ALL_SIZES.map((size) => {
        const active = selected.includes(size);
        return (
          <button
            key={size}
            type="button"
            onClick={() => toggle(size)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
              active
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
            }`}
          >
            {size}
          </button>
        );
      })}
    </div>
  );
}

// ========= COLOR PICKER =========
const PRESET_COLORS = [
  "#1B4F72",
  "#2980B9",
  "#1E8449",
  "#27AE60",
  "#922B21",
  "#E74C3C",
  "#784212",
  "#E67E22",
  "#1C2833",
  "#FFFFFF",
  "#F2F3F4",
  "#717D7E",
  "#F8BBD0",
  "#B39DDB",
  "#80DEEA",
  "#A5D6A7",
];

export function ColorPicker({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (colors: string[]) => void;
}) {
  const toggle = (color: string) => {
    onChange(
      selected.includes(color)
        ? selected.filter((c) => c !== color)
        : [...selected, color],
    );
  };

  const addCustom = (color: string) => {
    if (!selected.includes(color)) {
      onChange([...selected, color]);
    }
  };

  return (
    <div className="space-y-3">
      {/* Presets grid */}
      <div className="flex flex-wrap gap-2">
        {PRESET_COLORS.map((color) => {
          const active = selected.includes(color);
          return (
            <button
              key={color}
              type="button"
              onClick={() => toggle(color)}
              title={color}
              className={`w-7 h-7 rounded-full border-2 transition-all ${
                active
                  ? "border-primary scale-110 shadow-md"
                  : "border-border hover:scale-105"
              }`}
              style={{ backgroundColor: color }}
            />
          );
        })}

        {/* Custom color input */}
        {/* <label
          className="w-7 h-7 rounded-full border-2 border-dashed border-border hover:border-primary/50 flex items-center justify-center cursor-pointer transition-colors overflow-hidden"
          title="Custom color"
        >
          <span className="text-muted-foreground text-xs">+</span>
          <input
            type="color"
            className="sr-only"
            onChange={(e) => addCustom(e.target.value)}
          />
        </label> */}
      </div>

      {/* Selected colors preview */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected.map((color) => (
            <div
              key={color}
              className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-muted border border-border text-xs"
            >
              <span
                className="w-3 h-3 rounded-full border border-border/50 inline-block"
                style={{ backgroundColor: color }}
              />
              <span className="text-muted-foreground font-mono">{color}</span>
              <button
                type="button"
                onClick={() => toggle(color)}
                className="text-muted-foreground hover:text-foreground ml-0.5"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
