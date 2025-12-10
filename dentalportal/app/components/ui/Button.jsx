// components/ui/Button.jsx
export function Button({ children, variant = "primary", ...props }) {
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
    success: "bg-emerald-600 text-white hover:bg-emerald-700",
    outline: "border-2 border-gray-300 text-gray-700 hover:border-gray-400",
  };
  
  return (
    <button
      className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${variants[variant]}`}
      {...props}
    >
      {children}
    </button>
  );
}