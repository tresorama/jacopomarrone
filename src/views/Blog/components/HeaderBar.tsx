import Link, { type LinkProps } from "next/link";
import { ArrowLeft } from "@/views/_components/icons";

/**
 * @example
 * ```tsx
 * <HeaderBar>
 *   <HeaderBar.BackButton href="/about">Back</HeaderBar.BackButton>
 *   <HeaderBar.Title as="h2">Home</HeaderBar.Title>
 * </HeaderBar>
 * ```
 */
export const HeaderBar = ({ children }: { children: React.ReactNode; }) => {
  return (
    <nav className="pointer-events-none absolute left-0 top-0 z-10 py-8 px-6 lg:px-16 w-full flex items-center justify-between text-zinc-700">
      {children}
    </nav>
  );
};

const BackButton = ({ children, ...linkProps }: LinkProps & { children: React.ReactNode; }) => {
  return (
    <Link
      {...linkProps}
      className="text-preset-h3 font-normal pointer-events-auto inline-flex items-center"
    >
      <ArrowLeft />
      <span className="text-[0.5em] mt-[0.15em] ml-[-0.15em]">{children}</span>
    </Link>
  );
};

const Title = ({ as, children }: { as: keyof JSX.IntrinsicElements, children: React.ReactNode; }) => {
  const Component = as ?? 'span';
  return (
    <Component className="text-preset-h4 font-normal">
      {children}
    </Component>
  );
};

HeaderBar.BackButton = BackButton;
HeaderBar.Title = Title;