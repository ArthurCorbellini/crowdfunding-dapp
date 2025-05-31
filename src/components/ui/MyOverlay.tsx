import React from "react";

type Props = {
  children?: React.ReactNode;
};

const MyOverlay: React.FC<Props> = ({ children }) => {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
    >
      {children}
    </div>
  );
};

export default MyOverlay;
