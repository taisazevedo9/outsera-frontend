interface PageTitleProps {
  title: string;
  className?: string;
}

export default function PageTitle({ title, className = "" }: PageTitleProps) {
  return (
    <div className="text-center">
      <h1 className={`display-5 display-md-4 fw-bold text-primary mb-2 mb-md-3 ${className}`}>
        {title}
      </h1>
    </div>
  );
}
