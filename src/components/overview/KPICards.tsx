
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KPIData } from "@/types/dashboard";
import ExportButton from "@/components/shared/ExportButton";
import { MonthlyComparison } from "@/components/shared/MonthlyComparison";

interface KPICardsProps {
  data: KPIData;
}

const KPICards: React.FC<KPICardsProps> = ({ data }) => {
  const kpiItems = [
    {
      title: "แบบประเมินที่ถูกส่งเข้ามา",
      value: data.totalFeedback,
      previousValue: data.totalFeedback * 0.9, // Mock previous month data
      subtitle: "ครั้งทั้งหมด",
      color: "text-pink-deep"
    },
    {
      title: "มีการให้หมายเหตุเพิ่มเติม",
      value: data.feedbackWithComments.count,
      previousValue: data.feedbackWithComments.count * 0.85,
      subtitle: `${data.feedbackWithComments.percentage}% ของทั้งหมด`,
      color: "text-pink-medium"
    },
    {
      title: "มีการร้องเรียนรุนแรง",
      value: data.severeComplaints.count,
      previousValue: data.severeComplaints.count * 1.15,
      subtitle: `${data.severeComplaints.percentage}% ของทั้งหมด`,
      color: "text-destructive"
    },
    {
      title: "มีการให้ข้อมูลติดต่อกลับ",
      value: data.contactProvided.count,
      previousValue: data.contactProvided.count * 0.95,
      subtitle: `${data.contactProvided.percentage}% ของทั้งหมด`,
      color: "text-success"
    }
  ];

  return (
    <div className="space-y-4 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">ภาพรวมประจำเดือน สิงหาคม 2024</h2>
          <p className="text-sm text-muted-foreground">เปรียบเทียบกับเดือนกรกฎาคม 2024</p>
        </div>
        <ExportButton data={[data]} type="table" filename="monthly-overview" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {kpiItems.map((item, index) => (
          <Card key={index} className="kpi-card animate-fade-in hover-scale">
            <CardHeader className="pb-2">
              <CardTitle className="text-body font-semibold text-foreground">{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${item.color} mb-1`}>
                {item.value.toLocaleString()}
              </div>
              <p className="text-body text-muted-foreground mb-2">{item.subtitle}</p>
              <MonthlyComparison 
                currentValue={item.value} 
                previousValue={item.previousValue}
                format="number"
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default KPICards;
