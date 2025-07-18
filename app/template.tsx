// app/template.tsx
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-transition h-100">{children}</div>;
}
