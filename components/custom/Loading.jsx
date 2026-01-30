import Image from "next/image";

const Loading = () => {
  return (
    <div className="fixed inset-0 w-screen h-screen flex justify-center items-center bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200  overflow-hidden">
      <div className="absolute bg-purple-600 blur-[125px] top-10 left-10 w-96 h-96 z-0" />
      <div className="absolute bg-purple-600 blur-[125px] bottom-30 right-10 w-[550px] h-86 z-0" />
      <div className="absolute z-0 bottom-0 inset-0">
        <Image
        src={"/loading-banner.png"}
        alt="loading banner"
        fill
        className="object-cover opacity-20 select-none"
      />
      </div>
      <div className="flex-col gap-4 z-50 flex items-center justify-center relative">
        <Image
          src="/logo.png"
          alt="logo"
          width={150}
          height={150}
          className="animate-pulse"
        />
        <h3 className="text-2xl lg:text-5xl font-semibold">AI Tour</h3>
        <p className="text-xs xl:text-2xl">Loading...</p>
      </div>
    </div>
  );
};

export default Loading;
