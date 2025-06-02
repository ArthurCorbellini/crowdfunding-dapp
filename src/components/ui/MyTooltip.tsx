
const MyTooltip = ({ text, children }: { text: React.ReactNode; children: React.ReactNode }) => (
 <div className="relative group inline-block">
    {children}
    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 hidden group-hover:block bg-stone-700 text-sm p-3 rounded-md z-10 whitespace-nowrap">
      {text}
    </div>
  </div>
);
export default MyTooltip;