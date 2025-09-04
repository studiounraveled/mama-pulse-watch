import { Contraction } from '@/types/contraction';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { BarChart3 } from 'lucide-react';
import { format } from 'date-fns';

interface ContractionChartProps {
  contractions: Contraction[];
}

export function ContractionChart({ contractions }: ContractionChartProps) {
  if (contractions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Contraction Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Chart will appear when you have recorded contractions
          </div>
        </CardContent>
      </Card>
    );
  }

  // Prepare data for charts - only completed contractions
  const completedContractions = contractions
    .filter(c => c.duration !== null)
    .slice(0, 20) // Last 20 contractions
    .reverse(); // Show chronologically

  const chartData = completedContractions.map((contraction, index) => ({
    index: index + 1,
    duration: contraction.duration,
    startTime: format(new Date(contraction.startTime), 'HH:mm'),
    fullStartTime: contraction.startTime,
  }));

  // Calculate intervals between contractions
  const intervalData = completedContractions.slice(1).map((contraction, index) => {
    const prevContraction = completedContractions[index];
    const interval = (new Date(contraction.startTime).getTime() - new Date(prevContraction.startTime).getTime()) / (1000 * 60); // in minutes
    return {
      index: index + 2,
      interval: Math.round(interval * 10) / 10, // Round to 1 decimal
      startTime: format(new Date(contraction.startTime), 'HH:mm'),
    };
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Duration Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="startTime" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                label={{ value: 'Duration (seconds)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                formatter={(value) => [`${value}s`, 'Duration']}
                labelFormatter={(label) => `Time: ${label}`}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
              />
              <Bar 
                dataKey="duration" 
                fill="hsl(var(--primary))" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {intervalData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Interval Tracking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={intervalData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="startTime" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  label={{ value: 'Interval (minutes)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  formatter={(value) => [`${value} min`, 'Interval']}
                  labelFormatter={(label) => `Time: ${label}`}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="interval" 
                  stroke="hsl(var(--accent-foreground))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--accent-foreground))', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}