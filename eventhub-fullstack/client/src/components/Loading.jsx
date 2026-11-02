export default function Loading({ message = "Loading..." }) {
  return (
    <div className="flex min-h-40 items-center justify-center" role="status" aria-live="polite">
      <div className="flex items-center gap-3">
        <span className="h-6 w-6 animate-spin rounded-full border-4 border-slate-300 border-t-indigo-600" aria-hidden="true" />
        <p className="font-medium text-slate-600">{message}</p>
      </div>
    </div>
  );
}
