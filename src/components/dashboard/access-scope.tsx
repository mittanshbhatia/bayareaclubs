export function AccessScope({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <>
      <p className="text-primary text-sm font-medium">Protected access</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">{title}</h1>
      <p className="text-muted-foreground mt-3 max-w-2xl leading-7">
        {description}
      </p>
    </>
  );
}
