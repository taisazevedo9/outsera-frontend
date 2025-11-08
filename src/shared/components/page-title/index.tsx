interface PageTitleProps {
  title: string;
  className?: string;
}

export default function PageTitle({ title, className = "" }: PageTitleProps) {
  return (
    <div className="text-center">
      <h1 className={`display-4 fw-bold text-primary mb-2 ${className}`}>
        {title}
      </h1>
    </div>
  );
}
