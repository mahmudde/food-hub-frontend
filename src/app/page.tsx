import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative h-[500px] w-full bg-secondary flex items-center justify-center px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="bg-[url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070')] bg-cover bg-center opacity-20 h-full w-full" />
        </div>

        <div className="relative z-10 max-w-3xl w-full text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight">
            It&apos;s the food you love, <br />
            <span className="text-primary">delivered light fast</span>
          </h1>

          <div className="bg-white p-2 rounded-xl shadow-2xl flex flex-col md:flex-row gap-2">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Enter your delivery address"
                className="pl-10 h-12 border-none focus-visible:ring-0 text-lg"
              />
            </div>
            <Button
              size="lg"
              className="bg-primary hover:bg-pink-700 h-12 px-8 text-lg"
            >
              Find Food
            </Button>
          </div>
        </div>
      </section>

      {/* Category Section */}
      <section className="container mx-auto py-16 px-4">
        <h2 className="text-2xl font-bold mb-8 text-gray-800">
          Cuisines you love
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {["Burgers", "Pizza", "Deshi", "Healthy", "Cakes", "Pasta"].map(
            (cat) => (
              <div key={cat} className="group cursor-pointer">
                <div className="h-40 rounded-2xl bg-gray-100 mb-3 overflow-hidden transition-transform group-hover:scale-105">
                  {/* Dummy Image */}
                  <div className="bg-primary/10 h-full w-full flex items-center justify-center text-primary font-bold">
                    {cat}
                  </div>
                </div>
                <p className="font-semibold text-center">{cat}</p>
              </div>
            ),
          )}
        </div>
      </section>
    </div>
  );
}
