import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, TrendingUp, Clock, Filter, ArrowUpDown } from 'lucide-react';
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

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const target = new Date(targetDate);
      
      if (isPast(target)) {
        setTimeLeft('Launched');
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
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="flex items-center gap-1 text-xs font-medium text-primary">
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

const Projects = () => {
  const [sortBy, setSortBy] = useState<'date' | 'score'>('date');
  const [filterTag, setFilterTag] = useState<string>('all');

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    (tgeProjectsData as TGEProject[]).forEach(project => {
      project.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, []);

  // Get upcoming TGEs with filtering and sorting
  const upcomingTGEs = useMemo(() => {
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
    
    return filtered.slice(0, 5);
  }, [filterTag, sortBy]);

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
                  View All
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
            </div>

            <div className="space-y-3">
              {upcomingTGEs.map((project) => (
                <Link
                  key={project.id}
                  to="/tge"
                  className="block p-3 rounded-lg bg-background hover:bg-muted/50 transition-all border hover:border-primary/20 hover:shadow-sm group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold group-hover:text-primary transition-colors">
                          {project.name}
                        </h3>
                        {project.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {new Date(project.tgeDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <CountdownTimer targetDate={project.tgeDate} />
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-sm font-medium">
                          <TrendingUp className="h-4 w-4 text-primary" />
                          {project.totalScore}
                        </div>
                        <p className="text-xs text-muted-foreground">Score</p>
                      </div>
                    </div>
                  </div>
                  <LaunchProgress targetDate={project.tgeDate} />
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Projects;
