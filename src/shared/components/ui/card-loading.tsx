export default function CardLoading() {
  return (
    <div className="text-center py-3">
      <div
        className="spinner-border spinner-border-sm text-primary"
        role="status"
      >
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}
