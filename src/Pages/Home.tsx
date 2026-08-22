import Canvas1 from "./Canvas";

export function Home() {
  return (
    <main className="w-dvw min-h-dvh overflow-x-hidden bg-[url(/background.png)] bg-cover bg-center bg-no-repeat">
      {/* Navbar */}
      <section>
        {/* <nav className="w-dvw flex justify-center *:text-shadow-md gap-5 sm:gap-6 lg:gap-10 bg-accent text-secondary font-mono tracking-wider lg:tracking-widest p-3 sm:p-2 lg:p-4 font-bold text-base sm:text-lg lg:text-2xl">
          <h2>HOME</h2>
          <h2>BUILD</h2>
          <h2>COMPARE</h2>
          <h2>ABOUT</h2>
        </nav> */}
      </section>

      {/* Hero */}
      <section>
        <div className="canvas flex justify-center items-center w-full m-10 h-300 z-10">
          <Canvas1 className={"w-full h-full"} />
        </div>
      </section>
    </main>
  );
}
