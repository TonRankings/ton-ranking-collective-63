import Header from '../components/Header';
import RankingList from '../components/RankingList';
import { getAppsByCategory } from '../lib/data';

const Projects = () => {
  const projectApps = getAppsByCategory('projects');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="app-container max-w-3xl mx-auto pt-24 pb-20">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3">TON Projects</h1>
          <p className="text-muted-foreground text-lg">
            Discover upcoming and active projects building on the TON blockchain
          </p>
        </div>

        <RankingList 
          title="Featured Projects"
          description="Top projects in the TON ecosystem"
          apps={projectApps}
        />
      </main>
    </div>
  );
};

export default Projects;
