import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, TrendingUp } from 'lucide-react';
import Header from '../components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import tgeProjectsData from '../lib/tge-projects.json';
import { TGEProject } from '../lib/models/tge-project';

const Projects = () => {
  // Get upcoming TGEs (next 5)
  const upcomingTGEs = (tgeProjectsData as TGEProject[])
    .sort((a, b) => new Date(a.tgeDate).getTime() - new Date(b.tgeDate).getTime())
    .slice(0, 5);

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
            <div className="space-y-3">
              {upcomingTGEs.map((project) => (
                <Link
                  key={project.id}
                  to="/tge"
                  className="flex items-center justify-between p-3 rounded-lg bg-background hover:bg-muted/50 transition-all border hover:border-primary/20 hover:shadow-sm group"
                >
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
                      TGE Date: {new Date(project.tgeDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm font-medium">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        {project.totalScore}
                      </div>
                      <p className="text-xs text-muted-foreground">Score</p>
                    </div>
                  </div>
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
