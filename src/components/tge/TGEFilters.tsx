
import { useState } from 'react';
import { Filter, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import { FilterConfig } from '@/lib/models/tge-project';

interface TGEFiltersProps {
  availableTags: string[];
  filters: FilterConfig;
  setFilters: React.Dispatch<React.SetStateAction<FilterConfig>>;
  totalCount: number;
  filteredCount: number;
}

const TGEFilters = ({ 
  availableTags, 
  filters, 
  setFilters, 
  totalCount,
  filteredCount 
}: TGEFiltersProps) => {
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

  return (
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
        Showing {filteredCount} of {totalCount} projects
      </div>
    </div>
  );
};

export default TGEFilters;
