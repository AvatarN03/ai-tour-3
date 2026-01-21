import Image from "next/image";

const Loading = () => {
  return (
    <div className="fixed inset-0 w-screen h-screen flex justify-center items-center bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 flex-col gap-4 z-50">
      <div className="absolute bg-purple-600 blur-[125px] top-10 left-10 w-96 h-96 z-0" />
      <div className="absolute bg-purple-600 blur-[125px] top-10 right-10 w-86 h-86 z-0" />
      <Image
        src="/logo.png"
        alt="logo"
        width={92}
        height={92}
        className="animate-pulse"
      />
      <h3 className="text-2xl font-semibold">AI Tour</h3>
      <p className="text-xs">Loading...</p>
    </div>
  );
};

export default Loading;
