
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KPIData } from "@/types/dashboard";

interface KPICardsProps {
  data: KPIData;
}

const KPICards: React.FC<KPICardsProps> = ({ data }) => {
  const kpiItems = [
    {
      title: "แบบประเมินที่ถูกส่งเข้ามา",
      value: data.totalFeedback.toLocaleString(),
      subtitle: "ครั้งทั้งหมด",
      color: "text-pink-deep"
    },
    {
      title: "มีการให้หมายเหตุเพิ่มเติม",
      value: data.feedbackWithComments.count.toLocaleString(),
      subtitle: `${data.feedbackWithComments.percentage}% ของทั้งหมด`,
      color: "text-pink-medium"
    },
    {
      title: "มีการร้องเรียนรุนแรง",
      value: data.severeComplaints.count.toLocaleString(),
      subtitle: `${data.severeComplaints.percentage}% ของทั้งหมด`,
      color: "text-destructive"
    },
    {
      title: "มีการให้ข้อมูลติดต่อกลับ",
      value: data.contactProvided.count.toLocaleString(),
      subtitle: `${data.contactProvided.percentage}% ของทั้งหมด`,
      color: "text-success"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {kpiItems.map((item, index) => (
        <Card key={index} className="kpi-card animate-fade-in hover-scale">
          <CardHeader className="pb-2">
            <CardTitle className="text-body font-semibold text-foreground">{item.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${item.color} mb-1`}>
              {item.value}
            </div>
            <p className="text-body text-muted-foreground">{item.subtitle}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default KPICards;
