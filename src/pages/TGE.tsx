
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Header from '../components/Header';
import { useTGEProjects } from '../hooks/useTGEProjects';
import TGEFilters from '../components/tge/TGEFilters';
import TGETable from '../components/tge/TGETable';
import { TGEProject } from '../lib/models/tge-project';
import tgeProjectsData from '../lib/tge-projects.json';

const TGE = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [allProjects, setAllProjects] = useState<TGEProject[]>([]);
  
  // Load projects
  useEffect(() => {
    // Convert the imported JSON to TGEProject array
    const loadedProjects = tgeProjectsData as TGEProject[];
    setAllProjects(loadedProjects);
    
    setTimeout(() => {
      setIsLoaded(true);
    }, 300);
  }, []);
  
  // Use the custom hook for managing projects
  const {
    filteredProjects,
    sort,
    filters,
    setFilters,
    availableTags,
    handleSort
  } = useTGEProjects(allProjects);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="app-container pt-20 pb-16">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to home
        </Link>
        
        <div 
          className={`transform transition-all duration-500 ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <h1 className="text-3xl font-bold mb-2">Upcoming TGEs</h1>
          <p className="text-muted-foreground mb-8">
            Track upcoming Token Generation Events on TON blockchain
          </p>
          
          {/* Filter controls */}
          <TGEFilters
            availableTags={availableTags}
            filters={filters}
            setFilters={setFilters}
            totalCount={allProjects.length}
            filteredCount={filteredProjects.length}
          />
          
          {/* TGE Projects Table */}
          <TGETable
            projects={filteredProjects}
            sort={sort}
            onSort={handleSort}
          />
        </div>
      </div>
    </div>
  );
};

export default TGE;
