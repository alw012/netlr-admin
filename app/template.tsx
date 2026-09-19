export default function Template({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="nl-page-enter nl-route-enter">{children}</div>;
}
