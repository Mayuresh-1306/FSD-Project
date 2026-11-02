const variants = {
  primary: "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-300",
  secondary: "bg-slate-100 text-slate-800 hover:bg-slate-200 focus:ring-slate-300",
  danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-300",
  ghost: "bg-transparent text-slate-700 hover:bg-slate-100 focus:ring-slate-300",
};

export default function Button({
  children,
  variant = "primary",
  className = "",
  type = "button",
  disabled = false,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
