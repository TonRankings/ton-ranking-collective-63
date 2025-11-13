import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, TrendingUp } from 'lucide-react';
import Header from '../components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from 'recharts';
import tgeProjectsData from '../lib/tge-projects.json';
import { TGEProject } from '@/lib/models/tge-project';
import { format, formatDistanceToNow, isPast } from 'date-fns';

const TGEDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<TGEProject | null>(null);
  const [timeLeft, setTimeLeft] = useState('');
  const [urgencyColor, setUrgencyColor] = useState('text-primary');

  useEffect(() => {
    const foundProject = (tgeProjectsData as TGEProject[]).find(p => p.id === id);
    if (foundProject) {
      setProject(foundProject);
    }
  }, [id]);

  useEffect(() => {
    if (!project) return;

    const updateCountdown = () => {
      const target = new Date(project.tgeDate);
      
      if (isPast(target)) {
        setTimeLeft('Launched');
        setUrgencyColor('text-green-600');
        return;
      }

      const distance = formatDistanceToNow(target, { addSuffix: false });
      setTimeLeft(distance);

      const days = Math.floor((target.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      
      if (days <= 3) {
        setUrgencyColor('text-red-600');
      } else if (days <= 7) {
        setUrgencyColor('text-orange-600');
      } else if (days <= 14) {
        setUrgencyColor('text-yellow-600');
      } else {
        setUrgencyColor('text-primary');
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, [project]);

  if (!project) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="app-container pt-20 pb-16">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Project not found</h2>
            <Button onClick={() => navigate('/projects')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const radarData = [
    { metric: 'Roadmap', value: project.roadmapScore, fullMark: 10 },
    { metric: 'Morality', value: project.moralityIndex, fullMark: 10 },
    { metric: 'Social', value: project.socialEngagement, fullMark: 10 },
  ];

  const barData = [
    { name: 'Roadmap Score', value: project.roadmapScore },
    { name: 'Morality Index', value: project.moralityIndex },
    { name: 'Social Engagement', value: project.socialEngagement },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 8) return 'from-green-500/10 to-green-500/5 border-green-500/30 hover:shadow-green-500/20';
    if (score >= 6) return 'from-yellow-500/10 to-yellow-500/5 border-yellow-500/30 hover:shadow-yellow-500/20';
    return 'from-red-500/10 to-red-500/5 border-red-500/30 hover:shadow-red-500/20';
  };

  const getIconBg = (score: number) => {
    if (score >= 8) return 'bg-green-500/20 text-green-600';
    if (score >= 6) return 'bg-yellow-500/20 text-yellow-600';
    return 'bg-red-500/20 text-red-600';
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="app-container pt-20 pb-16">
        <Link
          to="/projects"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to projects
        </Link>

        {/* Hero Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{project.name}</h1>
          
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-5 w-5" />
              <span className="font-medium">
                {format(new Date(project.tgeDate), 'MMMM dd, yyyy')}
              </span>
            </div>
            
            <div className={`flex items-center gap-2 font-semibold ${urgencyColor}`}>
              <Clock className="h-5 w-5" />
              <span>{timeLeft}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {project.tags.map(tag => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Score Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Roadmap Score Card */}
          <Card className={`border bg-gradient-to-br ${getScoreGradient(project.roadmapScore)} transition-all duration-300 hover:shadow-lg hover:scale-105 animate-fade-in`}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Roadmap Score
                </CardTitle>
                <div className={`h-8 w-8 rounded-full ${getIconBg(project.roadmapScore)} flex items-center justify-center`}>
                  <TrendingUp className="h-4 w-4" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-1">
                <div className={`text-4xl font-bold ${getScoreColor(project.roadmapScore)}`}>
                  {project.roadmapScore.toFixed(1)}
                </div>
                <span className="text-lg text-muted-foreground font-medium">/10</span>
              </div>
              <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full ${project.roadmapScore >= 8 ? 'bg-green-500' : project.roadmapScore >= 6 ? 'bg-yellow-500' : 'bg-red-500'} transition-all duration-500`}
                  style={{ width: `${project.roadmapScore * 10}%` }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Morality Index Card */}
          <Card className={`border bg-gradient-to-br ${getScoreGradient(project.moralityIndex)} transition-all duration-300 hover:shadow-lg hover:scale-105 animate-fade-in`} style={{ animationDelay: '100ms' }}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Morality Index
                </CardTitle>
                <div className={`h-8 w-8 rounded-full ${getIconBg(project.moralityIndex)} flex items-center justify-center`}>
                  <TrendingUp className="h-4 w-4" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-1">
                <div className={`text-4xl font-bold ${getScoreColor(project.moralityIndex)}`}>
                  {project.moralityIndex.toFixed(1)}
                </div>
                <span className="text-lg text-muted-foreground font-medium">/10</span>
              </div>
              <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full ${project.moralityIndex >= 8 ? 'bg-green-500' : project.moralityIndex >= 6 ? 'bg-yellow-500' : 'bg-red-500'} transition-all duration-500`}
                  style={{ width: `${project.moralityIndex * 10}%` }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Social Engagement Card */}
          <Card className={`border bg-gradient-to-br ${getScoreGradient(project.socialEngagement)} transition-all duration-300 hover:shadow-lg hover:scale-105 animate-fade-in`} style={{ animationDelay: '200ms' }}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Social Engagement
                </CardTitle>
                <div className={`h-8 w-8 rounded-full ${getIconBg(project.socialEngagement)} flex items-center justify-center`}>
                  <TrendingUp className="h-4 w-4" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-1">
                <div className={`text-4xl font-bold ${getScoreColor(project.socialEngagement)}`}>
                  {project.socialEngagement.toFixed(1)}
                </div>
                <span className="text-lg text-muted-foreground font-medium">/10</span>
              </div>
              <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full ${project.socialEngagement >= 8 ? 'bg-green-500' : project.socialEngagement >= 6 ? 'bg-yellow-500' : 'bg-red-500'} transition-all duration-500`}
                  style={{ width: `${project.socialEngagement * 10}%` }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Total Score Card - Special Design */}
          <Card className="border-2 border-primary bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 hover:scale-105 animate-fade-in" style={{ animationDelay: '300ms' }}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-primary flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Total Score
                </CardTitle>
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-primary" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-1">
                <div className="text-4xl font-bold text-primary">
                  {project.totalScore.toFixed(1)}
                </div>
                <span className="text-lg text-primary/70 font-medium">/10</span>
              </div>
              <div className="mt-2 h-1.5 bg-primary/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${project.totalScore * 10}%` }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Radar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Score Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metric" />
                  <PolarRadiusAxis angle={90} domain={[0, 10]} />
                  <Radar
                    name={project.name}
                    dataKey="value"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.6}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Score Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-15} textAnchor="end" height={80} />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Bar dataKey="value" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Historical Trends Chart */}
        {project.scoreHistory && project.scoreHistory.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Historical Score Trends</CardTitle>
              <CardDescription>
                Track how the project's scores have evolved over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={project.scoreHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => format(new Date(value), 'MMM dd')}
                  />
                  <YAxis domain={[0, 10]} />
                  <Tooltip 
                    labelFormatter={(value) => format(new Date(value), 'MMM dd, yyyy')}
                    formatter={(value: number) => value.toFixed(1)}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="roadmapScore" 
                    stroke="#8b5cf6" 
                    strokeWidth={2}
                    name="Roadmap Score"
                    dot={{ fill: '#8b5cf6', r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="moralityIndex" 
                    stroke="#22c55e" 
                    strokeWidth={2}
                    name="Morality Index"
                    dot={{ fill: '#22c55e', r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="socialEngagement" 
                    stroke="#f59e0b" 
                    strokeWidth={2}
                    name="Social Engagement"
                    dot={{ fill: '#f59e0b', r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="totalScore" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    name="Total Score"
                    dot={{ fill: 'hsl(var(--primary))', r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TGEDetail;
