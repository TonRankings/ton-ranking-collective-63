
import { useState, useEffect } from 'react';
import { TGEProject, SortConfig, FilterConfig, SortField } from '@/lib/models/tge-project';

export const useTGEProjects = (initialProjects: TGEProject[]) => {
  const [projects, setProjects] = useState<TGEProject[]>(initialProjects);
  const [filteredProjects, setFilteredProjects] = useState<TGEProject[]>([]);
  
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
  
  // Extract all unique tags
  useEffect(() => {
    if (projects.length > 0) {
      const tags = new Set<string>();
      projects.forEach(project => {
        project.tags.forEach(tag => tags.add(tag));
      });
      setAvailableTags(Array.from(tags).sort());
    }
  }, [projects]);
  
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

  return {
    projects,
    setProjects,
    filteredProjects,
    sort,
    filters,
    setFilters,
    availableTags,
    handleSort
  };
};
