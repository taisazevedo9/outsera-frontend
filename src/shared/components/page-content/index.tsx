interface PageContentProps {
  children: React.ReactNode;
}

export default function PageContent({ children }: PageContentProps) {
  return (
    <div className="col-12">
      <div className="row mt-3 mt-md-4 g-2 g-md-3">{children}</div>
    </div>
  );
}
