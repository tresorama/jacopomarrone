import { useScrollRestoration } from "./hooks/use-scroll-restoration";

export const AppShell = ({ children }: { children: React.ReactNode; }) => {
  useScrollRestoration();
  return <div className="AppShell w-full h-full overflow-auto">{children}</div>;
};