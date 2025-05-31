import React from "react";

type Props = {
  children?: React.ReactNode;
};

const MyCard: React.FC<Props> = ({ children }) => {
  return (
    <div className="w-full max-w-md bg-stone-900 rounded-2xl shadow-xl p-8 border border-stone-700">
      {children}
    </div>
  );
};

export default MyCard;
