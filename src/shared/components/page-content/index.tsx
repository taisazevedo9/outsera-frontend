interface PageContentProps {
  children: React.ReactNode;
}

export default function PageContent({ children }: PageContentProps) {
  return (
    <div className="col-lg-12">
      <div className="row mt-4">{children}</div>
    </div>
  );
}
