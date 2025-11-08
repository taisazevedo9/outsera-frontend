interface ErrorProps {
  error: string;
}

export default function Error({ error }: ErrorProps) {
  return (
    <div className="alert alert-danger" role="alert">
      {error}
    </div>
  );
}
