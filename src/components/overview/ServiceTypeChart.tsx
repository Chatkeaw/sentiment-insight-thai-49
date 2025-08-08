
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { ChartData } from "@/types/dashboard";

interface ServiceTypeChartProps {
  data: ChartData[];
}

const ServiceTypeChart: React.FC<ServiceTypeChartProps> = ({ data }) => {
  return (
    <Card className="chart-container-small animate-fade-in">
      <CardHeader>
        <CardTitle className="card-title">ประเภทการให้บริการ</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} margin={{ bottom: 60, left: 20, right: 20 }}>
            <XAxis 
              dataKey="name" 
              angle={-45}
              textAnchor="end"
              height={100}
              fontSize={12}
              tick={{ fill: 'hsl(var(--foreground))' }}
            />
            <YAxis 
              label={{ value: 'สัดส่วน (%)', angle: -90, position: 'insideLeft' }}
              fontSize={12}
              tick={{ fill: 'hsl(var(--foreground))' }}
            />
            <Tooltip 
              formatter={(value) => [`${value}%`, 'สัดส่วน']}
              labelFormatter={(label) => `ประเภท: ${label}`}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Bar 
              dataKey="value" 
              fill="hsl(var(--primary))" 
              radius={[4, 4, 0, 0]} 
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ServiceTypeChart;
