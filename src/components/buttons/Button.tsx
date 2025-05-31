import React from "react";
import { cn } from "../../utils/style-utils";

export type Props = {
  color?: "primary" | "secondary" | "inactive" | "destructive";
} & React.ComponentProps<"button">;

export default function Button(props: Props) {
  const { color = "primary", children, disabled, className, ...rest } = props;

  return (
    <button
      type="button"
      className={cn(
        "btn",
        color === "primary" && "btn-primary",
        color === "secondary" && "btn-secondary",
        color === "inactive" && "btn-inactive",
        color === "destructive" && "btn-destructive",
        "text-sm",
        className,
      )}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}
