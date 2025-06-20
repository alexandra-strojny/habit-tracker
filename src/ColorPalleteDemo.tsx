export default function ColorPaletteDemo() {
  return (
    <div className="min-h-screen bg-background-light text-primary flex flex-col items-center justify-center p-6 space-y-6">
      <div className="bg-white rounded-xl shadow-md w-full max-w-md p-6 space-y-4 border">
        <h2 className="text-2xl font-bold">🎨 Color Palette Demo</h2>
        <p className="text-muted-text">This card uses your custom UI color system.</p>

        <div className="space-y-2">
          <div className="bg-primary-blue-green text-white font-medium px-4 py-2 rounded-md text-center hover:bg-primary-blue-green-hover transition">
            Primary Button #2A9D8F
          </div>

          <div className="bg-accent-yellow text-primary-text font-medium px-4 py-2 rounded-md text-center hover:bg-accent-yellow-hover transition">
            Accent Button #F4A261
          </div>

          <div className="bg-dark-card text-dark-text font-medium px-4 py-2 rounded-md text-center">
            Dark Mode Preview #2C2C3E
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-center">
          <div className="bg-background-light p-3 rounded shadow-inner">Light BG</div>
          <div className="bg-background-card p-3 rounded border">Card BG</div>
          <div className="bg-primary-text text-white p-3 rounded">Text Primary</div>
          <div className="bg-muted-text text-white p-3 rounded">Text Muted</div>
        </div>
      </div>
    </div>
  );
}
