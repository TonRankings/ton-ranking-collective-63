import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, TrendingUp, Clock, Filter, ArrowUpDown, ChevronDown, ChevronUp, LayoutGrid, Table2, Rocket } from 'lucide-react';
import { differenceInDays, differenceInHours, differenceInMinutes, isPast } from 'date-fns';
import Header from '../components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../components/ui/tooltip';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Progress } from '../components/ui/progress';
import tgeProjectsData from '../lib/tge-projects.json';
import { TGEProject } from '../lib/models/tge-project';

const CountdownTimer = ({ targetDate }: { targetDate: string }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [colorClass, setColorClass] = useState('text-primary');

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const target = new Date(targetDate);
      
      if (isPast(target)) {
        setTimeLeft('Launched');
        setColorClass('text-green-600');
        return;
      }

      const days = differenceInDays(target, now);
      const hours = differenceInHours(target, now) % 24;
      const minutes = differenceInMinutes(target, now) % 60;

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m`);
      } else {
        setTimeLeft(`${minutes}m`);
      }

      // Color coding based on urgency
      if (days <= 3) {
        setColorClass('text-red-600 font-semibold');
      } else if (days <= 7) {
        setColorClass('text-orange-600 font-semibold');
      } else if (days <= 14) {
        setColorClass('text-yellow-600 font-semibold');
      } else {
        setColorClass('text-primary');
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className={`flex items-center gap-1 text-xs font-medium ${colorClass}`}>
      <Clock className="h-3 w-3" />
      {timeLeft}
    </div>
  );
};

const LaunchProgress = ({ targetDate }: { targetDate: string }) => {
  const [progress, setProgress] = useState(0);
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [colorClass, setColorClass] = useState('');

  useEffect(() => {
    const updateProgress = () => {
      const now = new Date();
      const target = new Date(targetDate);
      const totalDays = 30; // Assume 30 days tracking window
      
      if (isPast(target)) {
        setProgress(100);
        setDaysRemaining(0);
        setColorClass('[&>div]:bg-green-500');
        return;
      }

      const days = differenceInDays(target, now);
      setDaysRemaining(days);
      
      const progressValue = Math.max(0, Math.min(100, ((totalDays - days) / totalDays) * 100));
      setProgress(progressValue);
      
      // Color coding based on urgency
      if (days <= 3) {
        setColorClass('[&>div]:bg-red-500'); // Imminent (0-3 days)
      } else if (days <= 7) {
        setColorClass('[&>div]:bg-orange-500'); // Very soon (4-7 days)
      } else if (days <= 14) {
        setColorClass('[&>div]:bg-yellow-500'); // Soon (8-14 days)
      } else {
        setColorClass('[&>div]:bg-primary'); // Normal (15+ days)
      }
    };

    updateProgress();
    const interval = setInterval(updateProgress, 60000);

    return () => clearInterval(interval);
  }, [targetDate]);

  const tooltipText = isPast(new Date(targetDate)) 
    ? 'Launched' 
    : `${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} remaining (${Math.round(progress)}%)`;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="cursor-help">
            <Progress value={progress} className={`h-2 ${colorClass}`} />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const Projects = ({ embedded = false }: { embedded?: boolean }) => {
  const [sortBy, setSortBy] = useState<'date' | 'score'>('date');
  const [filterTag, setFilterTag] = useState<string>('all');
  const [showAll, setShowAll] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    (tgeProjectsData as TGEProject[]).forEach(project => {
      project.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, []);

  // Get upcoming TGEs with filtering and sorting
  const allFilteredTGEs = useMemo(() => {
    let filtered = [...(tgeProjectsData as TGEProject[])];
    
    // Apply tag filter
    if (filterTag !== 'all') {
      filtered = filtered.filter(project => project.tags.includes(filterTag));
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(a.tgeDate).getTime() - new Date(b.tgeDate).getTime();
      } else {
        return b.totalScore - a.totalScore;
      }
    });
    
    return filtered;
  }, [filterTag, sortBy]);

  // Display either 5 or all items based on showAll state
  const upcomingTGEs = showAll ? allFilteredTGEs : allFilteredTGEs.slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50">
      {!embedded && <Header />}
      
      <main className="app-container max-w-7xl mx-auto pt-24 pb-20">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3">TON Projects</h1>
          <p className="text-muted-foreground text-lg">
            Discover upcoming and active projects building on the TON blockchain
          </p>
        </div>

        {/* TGE Tracking Section */}
        <Card className="mb-8 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Upcoming Token Generation Events
                </CardTitle>
                <CardDescription className="mt-2">
                  Track the latest TGE launches and token metrics
                </CardDescription>
              </div>
              <Link to="/tge">
                <Button variant="outline" size="sm" className="gap-2">
                  <Rocket className="h-4 w-4" />
                  TGE
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filters and Sorting */}
            <div className="flex flex-wrap items-center gap-3 mb-4 pb-4 border-b">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={filterTag} onValueChange={setFilterTag}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by tag" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tags</SelectItem>
                    {allTags.map(tag => (
                      <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                <Select value={sortBy} onValueChange={(value) => setSortBy(value as 'date' | 'score')}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Launch Date</SelectItem>
                    <SelectItem value="score">Total Score</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* View Mode Toggle */}
              <div className="ml-auto flex items-center gap-1 border rounded-md p-1">
                <Button
                  variant={viewMode === 'table' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                  className="h-8 px-3"
                >
                  <Table2 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'cards' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('cards')}
                  className="h-8 px-3"
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Card View for Mobile/Compact View */}
            {viewMode === 'cards' ? (
              <div className="grid gap-4">
                {upcomingTGEs.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No projects found matching the current filters.
                  </div>
                ) : (
                  upcomingTGEs.map((project) => (
                    <Link 
                      key={project.id} 
                      to={`/tge/${project.id}`}
                      className="block"
                    >
                      <Card className="hover:shadow-md transition-all hover:border-primary/50">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg mb-1 hover:text-primary transition-colors">
                                {project.name}
                              </h3>
                              <div className="flex flex-wrap gap-1 mb-2">
                                {project.tags.slice(0, 3).map((tag) => (
                                  <Badge key={tag} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center gap-1 text-lg font-bold">
                              <TrendingUp className="h-5 w-5 text-primary" />
                              {project.totalScore.toFixed(1)}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3 mb-3">
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">TGE Date</p>
                              <p className="text-sm font-medium">
                                {new Date(project.tgeDate).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-2 pt-3 border-t">
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Roadmap</p>
                              <p className="text-sm font-semibold">{project.roadmapScore.toFixed(1)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Morality</p>
                              <p className="text-sm font-semibold">{project.moralityIndex.toFixed(1)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Social</p>
                              <p className="text-sm font-semibold">{project.socialEngagement.toFixed(1)}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))
                )}
              </div>
            ) : (
              /* Table View */
              <div className="rounded-md border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr className="border-b">
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Project</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground hidden sm:table-cell">TGE Date</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground hidden lg:table-cell">Roadmap Score</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground hidden lg:table-cell">Morality Index</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground hidden lg:table-cell">Social Engagement</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Total Score</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground hidden md:table-cell">Tags</th>
                      </tr>
                    </thead>
                    <tbody className="bg-background">
                      {upcomingTGEs.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                            No projects found matching the current filters.
                          </td>
                        </tr>
                      ) : (
                        upcomingTGEs.map((project) => (
                          <tr key={project.id} className="border-b hover:bg-muted/30 transition-colors">
                            <td className="px-4 py-3">
                              <Link to={`/tge/${project.id}`} className="font-medium hover:text-primary transition-colors">
                                {project.name}
                              </Link>
                            </td>
                            <td className="px-4 py-3 text-sm text-muted-foreground hidden sm:table-cell">
                              {new Date(project.tgeDate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </td>
                            <td className="px-4 py-3 text-sm hidden lg:table-cell">{project.roadmapScore.toFixed(1)}</td>
                            <td className="px-4 py-3 text-sm hidden lg:table-cell">{project.moralityIndex.toFixed(1)}</td>
                            <td className="px-4 py-3 text-sm hidden lg:table-cell">{project.socialEngagement.toFixed(1)}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1 text-sm font-medium">
                                <TrendingUp className="h-4 w-4 text-primary" />
                                {project.totalScore.toFixed(1)}
                              </div>
                            </td>
                            <td className="px-4 py-3 hidden md:table-cell">
                              <div className="flex flex-wrap gap-1">
                                {project.tags.slice(0, 3).map((tag) => (
                                  <Badge key={tag} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {/* Show All / Show Less Button */}
            {allFilteredTGEs.length > 5 && (
              <div className="mt-4 text-center">
                <Button
                  variant="outline"
                  onClick={() => setShowAll(!showAll)}
                  className="gap-2"
                >
                  {showAll ? (
                    <>
                      Show Less
                      <ChevronUp className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Show All ({allFilteredTGEs.length} total)
                      <ChevronDown className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Projects;
