
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export const RegionalPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-96 h-64 flex items-center justify-center">
        <CardContent className="text-center">
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            ศักยภาพรายพื้นที่
          </h2>
          <p className="text-lg text-muted-foreground">
            กำลังพัฒนา
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
