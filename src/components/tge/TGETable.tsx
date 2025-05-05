
import { format } from 'date-fns';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TGEProject, SortField, SortConfig } from '@/lib/models/tge-project';

interface TGETableProps {
  projects: TGEProject[];
  sort: SortConfig;
  onSort: (field: SortField) => void;
}

const TGETable = ({ projects, sort, onSort }: TGETableProps) => {
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
    <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
      <Table>
        <TableCaption>List of upcoming Token Generation Events</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => onSort('name')}
            >
              <div className="flex items-center gap-2">
                Project {renderSortIcon('name')}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => onSort('tgeDate')}
            >
              <div className="flex items-center gap-2">
                TGE Date {renderSortIcon('tgeDate')}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50 transition-colors text-right"
              onClick={() => onSort('roadmapScore')}
            >
              <div className="flex items-center justify-end gap-2">
                Roadmap Score {renderSortIcon('roadmapScore')}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50 transition-colors text-right"
              onClick={() => onSort('moralityIndex')}
            >
              <div className="flex items-center justify-end gap-2">
                Morality Index {renderSortIcon('moralityIndex')}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50 transition-colors text-right"
              onClick={() => onSort('socialEngagement')}
            >
              <div className="flex items-center justify-end gap-2">
                Social Engagement {renderSortIcon('socialEngagement')}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50 transition-colors text-right"
              onClick={() => onSort('totalScore')}
            >
              <div className="flex items-center justify-end gap-2">
                Total Score {renderSortIcon('totalScore')}
              </div>
            </TableHead>
            <TableHead>Tags</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.length > 0 ? (
            projects.map(project => (
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
  );
};

export default TGETable;
