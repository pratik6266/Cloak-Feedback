import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <>
      <div className="fixed top-0 left-0 w-full z-10">
        <Navbar />
      </div>
      <div className="flex items-center justify-center h-screen bg-gray-800">
        <span className="font-bold text-4xl text-white">
          Welcome to Mystry Message
        </span>
      </div>
    </>
  );
}
