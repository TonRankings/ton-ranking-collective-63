
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowLeft, Filter, ArrowUp, ArrowDown, Tag } from 'lucide-react';
import Header from '../components/Header';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { ScrollArea } from '../components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from '../components/ui/dropdown-menu';
import { Slider } from '../components/ui/slider';
import { TGEProject, SortConfig, FilterConfig, SortField } from '../lib/models/tge-project';
import tgeProjectsData from '../lib/tge-projects.json';

const TGE = () => {
  const [projects, setProjects] = useState<TGEProject[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<TGEProject[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Sorting state
  const [sort, setSort] = useState<SortConfig>({
    field: 'tgeDate',
    direction: 'asc'
  });
  
  // Filtering state
  const [filters, setFilters] = useState<FilterConfig>({
    tags: [],
    minScore: 0,
    maxScore: 10
  });
  
  // Available tags from all projects
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  
  // Load and process projects
  useEffect(() => {
    // Convert the imported JSON to TGEProject array
    const loadedProjects = tgeProjectsData as TGEProject[];
    setProjects(loadedProjects);
    
    // Extract all unique tags
    const tags = new Set<string>();
    loadedProjects.forEach(project => {
      project.tags.forEach(tag => tags.add(tag));
    });
    setAvailableTags(Array.from(tags).sort());
    
    setTimeout(() => {
      setIsLoaded(true);
    }, 300);
  }, []);
  
  // Apply sorting and filtering when projects, sort, or filters change
  useEffect(() => {
    if (projects.length === 0) return;
    
    let result = [...projects];
    
    // Apply tag filters
    if (filters.tags.length > 0) {
      result = result.filter(project => 
        filters.tags.some(tag => project.tags.includes(tag))
      );
    }
    
    // Apply score filter
    result = result.filter(project => 
      project.totalScore >= filters.minScore && 
      project.totalScore <= filters.maxScore
    );
    
    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      
      // Compare based on the selected field
      if (sort.field === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sort.field === 'tgeDate') {
        comparison = new Date(a.tgeDate).getTime() - new Date(b.tgeDate).getTime();
      } else {
        comparison = a[sort.field] - b[sort.field];
      }
      
      // Apply sort direction
      return sort.direction === 'asc' ? comparison : -comparison;
    });
    
    setFilteredProjects(result);
  }, [projects, sort, filters]);
  
  // Toggle sort direction or change sort field
  const handleSort = (field: SortField) => {
    if (sort.field === field) {
      setSort({
        ...sort,
        direction: sort.direction === 'asc' ? 'desc' : 'asc'
      });
    } else {
      setSort({
        field,
        direction: 'asc'
      });
    }
  };
  
  // Toggle a tag filter
  const toggleTagFilter = (tag: string) => {
    setFilters(prev => {
      const tagExists = prev.tags.includes(tag);
      return {
        ...prev,
        tags: tagExists 
          ? prev.tags.filter(t => t !== tag) 
          : [...prev.tags, tag]
      };
    });
  };
  
  // Update score range filter
  const handleScoreRangeChange = (values: number[]) => {
    setFilters(prev => ({
      ...prev,
      minScore: values[0],
      maxScore: values[1]
    }));
  };
  
  // Reset all filters
  const resetFilters = () => {
    setFilters({
      tags: [],
      minScore: 0,
      maxScore: 10
    });
  };
  
  // Format score with one decimal place
  const formatScore = (score: number) => score.toFixed(1);
  
  // Render sort icon
  const renderSortIcon = (field: SortField) => {
    if (sort.field !== field) return null;
    return sort.direction === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />;
  };

  // Render trend indicator
  const renderTrendIndicator = (project: TGEProject, field: keyof typeof project.trends) => {
    if (!project.trends || !project.trends[field]) return null;
    
    const trend = project.trends[field];
    if (trend === 'up') {
      return <ArrowUp size={14} className="text-green-500 ml-1" />;
    } else if (trend === 'down') {
      return <ArrowDown size={14} className="text-red-500 ml-1" />;
    }
    
    return null;
  };

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
          <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
            <div className="flex items-center space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter size={16} />
                    Filter
                    {(filters.tags.length > 0 || filters.minScore > 0 || filters.maxScore < 10) && 
                      <Badge variant="secondary" className="ml-2">
                        {filters.tags.length + (filters.minScore > 0 || filters.maxScore < 10 ? 1 : 0)}
                      </Badge>
                    }
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[280px]">
                  <div className="p-2">
                    <h4 className="mb-2 text-sm font-medium">Tags</h4>
                    <ScrollArea className="h-[180px]">
                      <div className="grid grid-cols-2 gap-2 mb-4 p-1">
                        {availableTags.map(tag => (
                          <DropdownMenuCheckboxItem
                            key={tag}
                            checked={filters.tags.includes(tag)}
                            onCheckedChange={() => toggleTagFilter(tag)}
                          >
                            <div className="flex items-center">
                              <Tag size={12} className="mr-2" />
                              {tag}
                            </div>
                          </DropdownMenuCheckboxItem>
                        ))}
                      </div>
                    </ScrollArea>
                    
                    <DropdownMenuSeparator />
                    
                    <h4 className="my-2 text-sm font-medium">Score Range</h4>
                    <div className="px-2 py-4">
                      <Slider
                        value={[filters.minScore, filters.maxScore]}
                        min={0}
                        max={10}
                        step={0.1}
                        onValueChange={handleScoreRangeChange}
                        className="mb-2"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{filters.minScore.toFixed(1)}</span>
                        <span>{filters.maxScore.toFixed(1)}</span>
                      </div>
                    </div>
                    
                    <DropdownMenuSeparator />
                    
                    <div className="pt-2 text-center">
                      <Button variant="ghost" size="sm" onClick={resetFilters} className="w-full">
                        Reset Filters
                      </Button>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {filters.tags.length > 0 && (
                <ScrollArea className="w-[300px] whitespace-nowrap">
                  <div className="flex gap-1 py-1">
                    {filters.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="cursor-pointer flex-shrink-0" onClick={() => toggleTagFilter(tag)}>
                        {tag} <span className="ml-1">×</span>
                      </Badge>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>
            
            <div className="text-sm text-muted-foreground">
              Showing {filteredProjects.length} projects
            </div>
          </div>
          
          {/* TGE Projects Table */}
          <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
            <Table>
              <TableCaption>List of upcoming Token Generation Events</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-2">
                      Project {renderSortIcon('name')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleSort('tgeDate')}
                  >
                    <div className="flex items-center gap-2">
                      TGE Date {renderSortIcon('tgeDate')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50 transition-colors text-right"
                    onClick={() => handleSort('roadmapScore')}
                  >
                    <div className="flex items-center justify-end gap-2">
                      Roadmap Score {renderSortIcon('roadmapScore')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50 transition-colors text-right"
                    onClick={() => handleSort('moralityIndex')}
                  >
                    <div className="flex items-center justify-end gap-2">
                      Morality Index {renderSortIcon('moralityIndex')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50 transition-colors text-right"
                    onClick={() => handleSort('socialEngagement')}
                  >
                    <div className="flex items-center justify-end gap-2">
                      Social Engagement {renderSortIcon('socialEngagement')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50 transition-colors text-right"
                    onClick={() => handleSort('totalScore')}
                  >
                    <div className="flex items-center justify-end gap-2">
                      Total Score {renderSortIcon('totalScore')}
                    </div>
                  </TableHead>
                  <TableHead>Tags</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.length > 0 ? (
                  filteredProjects.map(project => (
                    <TableRow key={project.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{project.name}</TableCell>
                      <TableCell>{format(new Date(project.tgeDate), 'dd MMM yyyy')}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end">
                          {formatScore(project.roadmapScore)}
                          {renderTrendIndicator(project, 'roadmapScore')}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end">
                          {formatScore(project.moralityIndex)}
                          {renderTrendIndicator(project, 'moralityIndex')}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end">
                          {formatScore(project.socialEngagement)}
                          {renderTrendIndicator(project, 'socialEngagement')}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        <div className="flex items-center justify-end">
                          {formatScore(project.totalScore)}
                          {renderTrendIndicator(project, 'totalScore')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {project.tags.map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No projects found matching the current filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TGE;
