import React from 'react';
import { RefreshCw, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const CategoryReferencePage: React.FC = () => {
  const handleRefresh = () => {
    // Handle refresh functionality
    console.log('Refreshing category reference data...');
  };

  const categoryData = [
    {
      mainCategory: 'พนักงานและบุคลากร',
      subCategory: 'ความสุภาพและมารยาทของพนักงาน',
      definition: 'น้ำเสียง การแต่งกาย บุคลิกภาพของพนักงาน',
      example: 'พูดจาสุภาพ ไพเราะ แต่งกายสุภาพ'
    },
    {
      mainCategory: 'พนักงานและบุคลากร',
      subCategory: 'ความเอาใจใส่ในการให้บริการลูกค้า',
      definition: 'ความเอาใจใส่ การดูแลลูกค้าอย่างใกล้ชิด หรือเป็นกันเอง',
      example: 'ให้บริการดี น่ารัก ไม่น่ารัก'
    },
    {
      mainCategory: 'พนักงานและบุคลากร',
      subCategory: 'ความสามารถในการตอบคำถามหรือให้คำแนะนำ',
      definition: 'ความรู้ในตัวของผลิตภัณฑ์ ทั้งน้ำเสียงและคำตอบชัดเจน',
      example: 'แนะนำดี เสียงดังฟังชัด เข้าใจง่าย'
    },
    {
      mainCategory: 'พนักงานและบุคลากร',
      subCategory: 'ความถูกต้องในการให้บริการ',
      definition: 'ความถูกต้องหรือผิดพลาดในการทำรายการ',
      example: 'ทำงานเรียบร้อย ถูกต้อง'
    },
    {
      mainCategory: 'พนักงานและบุคลากร',
      subCategory: 'ความรวดเร็วในการให้บริการ',
      definition: 'ความเร็ว ความกระฉับกระเฉงในการปฏิบัติหน้าที่พนักงาน',
      example: 'รวดเร็ว ทันใจ ตรงต่อเวลา ช้า อืดอาด'
    },
    {
      mainCategory: 'พนักงานและบุคลากร',
      subCategory: 'การจัดการและแก้ไขปัญหาเฉพาะหน้า',
      definition: 'การหาแนวทาง ความพร้อมรับมือกับปัญหาและอารมณ์',
      example: 'เกิดข้อผิดพลาด แต่แก้ไขปัญหาได้รวด'
    },
    {
      mainCategory: 'พนักงานและบุคลากร',
      subCategory: 'การประทับใจในการให้บริการ',
      definition: 'การชมเชย หรือ ติเตียนการทำงานโดยรวม',
      example: 'ดีเยี่ยม ยอดเยี่ยม แย่มาก ควรปรับปรุง'
    }
  ];

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-3xl font-bold text-gray-800">เอกสารอ้างอิง</h1>
          </div>
          <p className="text-gray-600 text-lg">
            รวบรวมเอกสาร แนวทาง และคู่มือที่เกี่ยวข้องกับการจัดการข้อร้องเรียน
          </p>
        </div>

        {/* Category Reference Table */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-xl font-semibold text-gray-800">
              ตารางอ้างอิงหมวดหมู่ (Category Reference)
            </CardTitle>
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              className="h-9 w-9 p-0 border-pink-200 hover:bg-pink-50"
            >
              <RefreshCw className="h-4 w-4 text-pink-600" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-pink-100 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-pink-50 to-rose-50 hover:bg-gradient-to-r hover:from-pink-50 hover:to-rose-50">
                    <TableHead className="font-bold text-gray-800 text-left">
                      หมวดหมู่หลัก
                    </TableHead>
                    <TableHead className="font-bold text-gray-800 text-left">
                      หมวดหมู่ย่อย
                    </TableHead>
                    <TableHead className="font-bold text-gray-800 text-left">
                      คำนิยาม
                    </TableHead>
                    <TableHead className="font-bold text-gray-800 text-left">
                      ตัวอย่างประโยค
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categoryData.map((row, index) => (
                    <TableRow 
                      key={index}
                      className="hover:bg-pink-25 transition-colors duration-200"
                    >
                      <TableCell className="text-left text-gray-700 font-medium">
                        {row.mainCategory}
                      </TableCell>
                      <TableCell className="text-left text-gray-700">
                        {row.subCategory}
                      </TableCell>
                      <TableCell className="text-left text-gray-600">
                        {row.definition}
                      </TableCell>
                      <TableCell className="text-left text-gray-600">
                        {row.example}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CategoryReferencePage;