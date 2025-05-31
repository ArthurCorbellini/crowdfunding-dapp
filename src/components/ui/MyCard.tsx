import React from "react";
import { cn } from "../../utils/style-utils";

type Props = {
  className?: string;
  children?: React.ReactNode;
};

const MyCard: React.FC<Props> = ({ className, children }) => {
  return (
    <div className={cn("w-full max-w-md bg-stone-900 rounded-2xl shadow-xl p-8 border border-stone-700", className)}>
      {children}
    </div>
  );
};

export default MyCard;
