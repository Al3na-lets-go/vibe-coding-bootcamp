import Welcome from "@/components/Welcome";
import BoatScene from "@/components/BoatScene";
import BootcampFooter from "@/components/BootcampFooter";

export default function Home() {
  const motto = process.env.NEXT_PUBLIC_MOTTO;

  return (
    <main className="min-h-screen flex flex-col">
      {motto ? (
        <BoatScene text={motto} />
      ) : (
        <div className="flex-1 flex items-center justify-center px-6">
          <Welcome />
        </div>
      )}

      <BootcampFooter />
    </main>
  );
}
