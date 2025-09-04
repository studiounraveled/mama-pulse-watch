import { useContractions } from '@/hooks/useContractions';
import { ContractionTimer } from '@/components/ContractionTimer';
import { CompactStats } from '@/components/CompactStats';
import { ContractionTable } from '@/components/ContractionTable';
import { ContractionChart } from '@/components/ContractionChart';
import { Baby, Heart } from 'lucide-react';

const Index = () => {
  const {
    contractions,
    currentContraction,
    isTracking,
    startContraction,
    stopContraction,
    deleteContraction,
    editContraction,
    addManualContraction,
    clearAllContractions,
    getSummary,
  } = useContractions();

  const summary = getSummary();

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-border/50 shadow-soft">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center gap-3">
            <div className="flex items-center gap-2 text-primary">
              <Baby className="w-8 h-8" />
              <Heart className="w-6 h-6 text-pink-500" />
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-foreground">
                Contracktions
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Monitor your labor progress with precision
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Timer Section with Compact Stats */}
        <section className="md:max-w-md mx-auto">
          <CompactStats summary={summary} />
          <ContractionTimer
            isTracking={isTracking}
            onStart={startContraction}
            onStop={stopContraction}
            startTime={currentContraction?.startTime}
          />
        </section>

        {/* Table - moved up for easier access */}
        <section>
          <ContractionTable
            contractions={contractions}
            onDelete={deleteContraction}
            onEdit={editContraction}
            onAdd={addManualContraction}
            onClearAll={clearAllContractions}
          />
        </section>

        {/* Charts - moved down */}
        <section>
          <ContractionChart contractions={contractions} />
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white/60 backdrop-blur-sm border-t border-border/50 mt-16">
        <div className="container mx-auto px-4 py-6 text-center">
          <p className="text-sm text-muted-foreground">
            Always consult with your healthcare provider about your labor progress
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
