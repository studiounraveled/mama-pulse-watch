import { Contraction } from '@/types/contraction';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { BarChart3, Download } from 'lucide-react';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';

interface ContractionChartProps {
  contractions: Contraction[];
}

export function ContractionChart({ contractions }: ContractionChartProps) {
  const exportToExcel = () => {
    const exportData = contractions
      .filter(c => c.duration !== null)
      .map((contraction, index) => ({
        'Contraction #': index + 1,
        'Start Time': format(new Date(contraction.startTime), 'yyyy-MM-dd HH:mm:ss'),
        'End Time': contraction.endTime ? format(new Date(contraction.endTime), 'yyyy-MM-dd HH:mm:ss') : '',
        'Duration (seconds)': contraction.duration,
        'Duration (mm:ss)': contraction.duration ? `${Math.floor(contraction.duration / 60)}:${(contraction.duration % 60).toString().padStart(2, '0')}` : '',
      }));

    // Add intervals
    const dataWithIntervals = exportData.map((row, index) => {
      if (index > 0) {
        const currentContraction = contractions.filter(c => c.duration !== null)[index];
        const previousContraction = contractions.filter(c => c.duration !== null)[index - 1];
        const intervalMinutes = (new Date(currentContraction.startTime).getTime() - new Date(previousContraction.startTime).getTime()) / (1000 * 60);
        return {
          ...row,
          'Interval (minutes)': Math.round(intervalMinutes * 10) / 10,
        };
      }
      return {
        ...row,
        'Interval (minutes)': '',
      };
    });

    const ws = XLSX.utils.json_to_sheet(dataWithIntervals);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Contractions');
    
    const fileName = `contractions_${format(new Date(), 'yyyy-MM-dd_HH-mm')}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

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
    <div className="space-y-4">
      {/* Analytics Header with Export Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="w-6 h-6" />
            Contraction Analytics
          </h2>
          <p className="text-muted-foreground text-sm">
            Visual analysis of your contraction patterns
          </p>
        </div>
        <Button onClick={exportToExcel} variant="outline" className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export to Excel
        </Button>
      </div>

      {/* Charts Grid */}
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
    </div>
  );
}