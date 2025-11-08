interface CardTitleProps {
  title: string;
}

export default function CardTitle({ title }: CardTitleProps) {
  return <h5 className="card-title">{title}</h5>;
}
