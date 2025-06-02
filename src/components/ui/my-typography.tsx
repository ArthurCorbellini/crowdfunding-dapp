import { cn } from "../../utils/style-utils";

type TypographyProps = {
  as?: React.ElementType;
  className?: string;
  children: React.ReactNode;
};

export function H1({ as: Tag = "h1", className, children }: TypographyProps) {
  return (
    <Tag className={cn("scroll-m-20 text-3xl font-bold text-stone-100", className)}>
      {children}
    </Tag>
  );
}

export function H2({ as: Tag = "h2", className, children }: TypographyProps) {
  return (
    <Tag className={cn("scroll-m-20 text-2xl font-bold text-stone-100", className)}>
      {children}
    </Tag>
  );
}

export function H3({ as: Tag = "h3", className, children }: TypographyProps) {
  return (
    <Tag className={cn("scroll-m-20 font-semibold text-stone-100", className)}>
      {children}
    </Tag>
  );
}

// export function H4({ as: Tag = "h4", className, children }: TypographyProps) {
//   return (
//     <Tag className={cn("scroll-m-20 text-xl font-semibold tracking-tight", className)}>
//       {children}
//     </Tag>
//   );
// }

export function P({ as: Tag = "p", className, children }: TypographyProps) {
  return (
    <Tag className={cn("text-stone-100 leading-6 [&:not(:first-child)]:mt-3", className)}>
      {children}
    </Tag>
  );
}

export function Span({ as: Tag = "span", className, children }: TypographyProps) {
  return (
    <Tag className={cn("text-stone-100", className)}>
      {children}
    </Tag>
  );
}

export function Mono({ as: Tag = "p", className, children }: TypographyProps) {
  return (
    <Tag className={cn("text-stone-100 font-mono text-xs", className)}>
      {children}
    </Tag>
  );
}

export function Muted({ as: Tag = "p", className, children }: TypographyProps) {
  return (
    <Tag className={cn("text-stone-400 text-sm", className)}>
      {children}
    </Tag>
  );
}

export function Destructive({ as: Tag = "p", className, children }: TypographyProps) {
  return (
    <Tag className={cn("text-red-600 text-sm", className)}>
      {children}
    </Tag>
  );
}

export function LI({ as: Tag = "li", className, children }: TypographyProps) {
  return (
    <Tag className={cn("pl-3 text-stone-100", className)}>
      • {children}
    </Tag>
  );
}