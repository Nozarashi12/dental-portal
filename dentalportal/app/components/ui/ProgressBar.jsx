// components/ui/ProgressBar.jsx
export function ProgressBar({ value, max = 100 }) {
  const percentage = (value / max) * 100;
  
  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}