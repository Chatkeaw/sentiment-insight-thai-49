import React, { useState, useMemo } from 'react';
import { RefreshCw, BookOpen, RotateCcw } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Topics data
const TOPICS = [
  { id: "t1", name: "1.พนักงานและบุคลากร" },
  { id: "t2", name: "2.ระบบและกระบวนการให้บริการ" },
  { id: "t3", name: "3.เทคโนโลยีและดิจิทัล" },
  { id: "t4", name: "4.เงื่อนไขและผลิตภัณฑ์" },
  { id: "t5", name: "5.สภาพแวดล้อมและสิ่งอำนวยความสะดวก" },
  { id: "t6", name: "6.Market Conduct" },
  { id: "t7", name: "7.อื่นๆ" }
];

// Categories data
const CATEGORIES = [
  { id: "1.1", topicId: "t1", name: "1.1 ความสุภาพและมารยาทของพนักงาน" },
  { id: "1.2", topicId: "t1", name: "1.2 ความเอาใจใส่ในการให้บริการลูกค้า" },
  { id: "1.3", topicId: "t1", name: "1.3 ความสามารถในการตอบคำถามหรือให้คำแนะนำ" },
  { id: "1.4", topicId: "t1", name: "1.4 ความถูกต้องในการให้บริการ" },
  { id: "1.5", topicId: "t1", name: "1.5 ความรวดเร็วในการให้บริการ" },
  { id: "1.6", topicId: "t1", name: "1.6 ความเป็นมืออาชีพและการแก้ไขปัญหาเฉพาะหน้า" },
  { id: "1.7", topicId: "t1", name: "1.7 ความประทับใจในการให้บริการ" },
  { id: "1.8", topicId: "t1", name: "1.8 รปภ, แม่บ้าน" },
  { id: "2.1", topicId: "t2", name: "2.1 ความพร้อมในการให้บริการ" },
  { id: "2.2", topicId: "t2", name: "2.2 กระบวนการให้บริการ ความเป็นธรรมให้บริการ" },
  { id: "2.3", topicId: "t2", name: "2.3 ระบบเรียกคิวและจัดการคิว" },
  { id: "2.4", topicId: "t2", name: "2.4 ภาระเอกสาร" },
  { id: "3.1", topicId: "t3", name: "3.1 ระบบ Core ของธนาคาร" },
  { id: "3.2", topicId: "t3", name: "3.2 เครื่องออกบัตรคิว" },
  { id: "3.3", topicId: "t3", name: "3.3 ATM ADM CDM" },
  { id: "3.4", topicId: "t3", name: "3.4 E-KYC Scanner" },
  { id: "3.5", topicId: "t3", name: "3.5 แอพพลิเคชั่น MyMo" },
  { id: "3.6", topicId: "t3", name: "3.6 เครื่องปรับสมุด" },
  { id: "3.7", topicId: "t3", name: "3.7 เครื่องนับเงิน" },
  { id: "4.1", topicId: "t4", name: "4.1 รายละเอียด ผลิตภัณฑ์" },
  { id: "4.2", topicId: "t4", name: "4.2 เงื่อนไขอนุมัติ" },
  { id: "4.3", topicId: "t4", name: "4.3 ระยะเวลาอนุมัติ" },
  { id: "4.4", topicId: "t4", name: "4.4 ความยืดหยุ่น" },
  { id: "4.5", topicId: "t4", name: "4.5 ความเรียบง่ายข้อมูล" },
  { id: "5.1", topicId: "t5", name: "5.1 ความสะอาด" },
  { id: "5.2", topicId: "t5", name: "5.2 พื้นที่และความคับคั่ง" },
  { id: "5.3", topicId: "t5", name: "5.3 อุณหภูมิ" },
  { id: "5.4", topicId: "t5", name: "5.4 โต๊ะรับบริการ" },
  { id: "5.5", topicId: "t5", name: "5.5 จุดรอรับบริการ" },
  { id: "5.6", topicId: "t5", name: "5.6 แสง" },
  { id: "5.7", topicId: "t5", name: "5.7 เสียง" },
  { id: "5.8", topicId: "t5", name: "5.8 ห้องน้ำ" },
  { id: "5.9", topicId: "t5", name: "5.9 ที่จอดรถ" },
  { id: "5.10", topicId: "t5", name: "5.10 ป้าย-สื่อประชาสัมพันธ์" },
  { id: "5.11", topicId: "t5", name: "5.11 สิ่งอำนวยความสะดวกอื่นๆ" },
  { id: "6.1", topicId: "t6", name: "6.1 ไม่หลอกลวง" },
  { id: "6.2", topicId: "t6", name: "6.2 ไม่เอาเปรียบ" },
  { id: "6.3", topicId: "t6", name: "6.3 ไม่บังคับ" },
  { id: "6.4", topicId: "t6", name: "6.4 ไม่รบกวน" },
  { id: "7.1", topicId: "t7", name: "7.1 ความประทับใจอื่นๆ" }
];

// Category examples
const CATEGORY_EXAMPLES: Record<string, { definition: string; example: string }> = {
  "1.1": { definition: "น้ำเสียง การแต่งกาย บุคลิกภาพของพนักงาน", example: "พูดจาสุภาพ ไพเราะ แต่งกายสุภาพ" },
  "1.2": { definition: "ความเอาใจใส่ การดูแลลูกค้า", example: "ให้บริการดี น่ารัก ไม่เท" },
  "1.3": { definition: "การตอบคำถาม/ให้คำแนะนำ", example: "แนะนำดี สื่อสารฟังชัด เข้าใจง่าย" },
  "1.4": { definition: "ความถูกต้องของเอกสาร/ข้อมูล", example: "ทำงานเรียบร้อย ถูกต้อง" },
  "1.5": { definition: "ความรวดเร็วและตรงเวลา", example: "รวดเร็ว ทันใจ ตรงต่อเวลา ไม่ล่าช้า" },
  "1.6": { definition: "แก้ปัญหาเฉพาะหน้า/มืออาชีพ", example: "เกิดข้อผิดพลาด แต่แก้ไขปัญหาได้รวด" },
  "1.7": { definition: "ความประทับใจโดยรวม", example: "ดีเยี่ยม ยอดเยี่ยม มาก ควรปรับปรุงจุดเล็กน้อย" },
  "1.8": { definition: "ความปลอดภัย/ความสะอาดพื้นที่", example: "พื้นที่สะอาด ปลอดภัย ดูแลตลอด" },
  "2.1": { definition: "ความพร้อมก่อน/ระหว่างให้บริการ", example: "เปิดช่องบริการครบ อุปกรณ์พร้อม" },
  "2.2": { definition: "ความเป็นธรรมของขั้นตอน", example: "คิวเป็นธรรม ไม่เลือกปฏิบัติ" },
  "2.3": { definition: "ระบบเรียกคิว/จัดคิว", example: "เรียกคิวต่อเนื่อง ไม่สะดุด" },
  "2.4": { definition: "ภาระเอกสาร", example: "แบบฟอร์มชัดเจน เอกสารไม่ซับซ้อน" },
  "3.1": { definition: "ระบบหลักธนาคาร", example: "ระบบ Core เสถียร ไม่ล่ม" },
  "3.2": { definition: "ตู้กดบัตรคิว", example: "เครื่องออกบัตรคิวใช้งานได้ต่อเนื่อง" },
  "3.3": { definition: "ATM/ADM/CDM", example: "ตู้ฝากถอนใช้งานได้ ป้ายชัดเจน" },
  "3.4": { definition: "E-KYC/สแกนเอกสาร", example: "สแกนเร็ว จับข้อมูลครบ" },
  "3.5": { definition: "แอป MyMo", example: "เข้าแอปได้ ลื่นไหล ไม่เด้ง" },
  "3.6": { definition: "เครื่องปรับสมุดบัญชี", example: "พิมพ์รายการเร็ว ไม่ค้าง" },
  "3.7": { definition: "เครื่องนับเงิน", example: "ตรวจนับแม่นยำ เสียงไม่ดังรบกวน" },
  "4.1": { definition: "รายละเอียดผลิตภัณฑ์", example: "สื่อสารสั้น กระชับ เข้าใจง่าย" },
  "4.2": { definition: "เงื่อนไขอนุมัติ", example: "เงื่อนไขชัดเจน ไม่กำกวม" },
  "4.3": { definition: "ระยะเวลาอนุมัติ", example: "แจ้งเวลาชัด ได้ตามกำหนด" },
  "4.4": { definition: "ความยืดหยุ่นของผลิตภัณฑ์", example: "มีทางเลือกผ่อนปรนตามสถานการณ์" },
  "4.5": { definition: "ความเรียบง่ายของข้อมูล", example: "อินโฟกราฟิกสั้น ไม่เยิ่นเย้อ" },
  "5.1": { definition: "ความสะอาดพื้นที่", example: "พื้น/โต๊ะสะอาด ไม่มีฝุ่น" },
  "5.2": { definition: "ความกว้าง/ความคับคั่ง", example: "ที่นั่งเพียงพอ ไม่แออัด" },
  "5.3": { definition: "อุณหภูมิ", example: "แอร์เย็นกำลังดี ไม่หนาว/ร้อนเกิน" },
  "5.4": { definition: "โต๊ะรับบริการ", example: "มีอุปกรณ์ครบ ป้ายบอกชัด" },
  "5.5": { definition: "จุดรอรับบริการ", example: "มีที่นั่งรอ/ลำดับคิวชัดเจน" },
  "5.6": { definition: "แสงสว่าง", example: "สว่างเพียงพอ ไม่แยงตา" },
  "5.7": { definition: "เสียง", example: "ไม่ดังรบกวน ประกาศฟังชัด" },
  "5.8": { definition: "ห้องน้ำ", example: "สะอาด มีกระดาษทิชชู สบู่" },
  "5.9": { definition: "ที่จอดรถ", example: "มีที่จอดชัดเจน ใกล้อาคาร" },
  "5.10": { definition: "ป้าย/สื่อประชาสัมพันธ์", example: "ป้ายชัด อ่านง่าย อัปเดตล่าสุด" },
  "5.11": { definition: "สิ่งอำนวยความสะดวกอื่นๆ", example: "มีน้ำดื่ม/ที่ชาร์จ/ทางลาดผู้พิการ" },
  "6.1": { definition: "ไม่หลอกลวง", example: "ข้อมูลจริง ไม่บิดเบือน ไม่โฆษณาเกินจริง" },
  "6.2": { definition: "ไม่เอาเปรียบ", example: "ค่าธรรมเนียมโปร่งใส ไม่มีซ่อนเร้น" },
  "6.3": { definition: "ไม่บังคับ", example: "ไม่ยัดเยียดขาย/ผูกเงื่อนไข" },
  "6.4": { definition: "ไม่รบกวน", example: "ติดต่อในเวลาสมเหตุสมผล ยกเลิกได้ง่าย" },
  "7.1": { definition: "ความประทับใจอื่นๆ", example: "พนักงานยิ้มแย้ม บรรยากาศดี" }
};

const CategoryReferencePage: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const handleRefresh = () => {
    console.log('Refreshing category reference data...');
  };

  const handleReset = () => {
    setSelectedTopic("all");
    setSelectedCategory("all");
  };

  const handleTopicChange = (topicId: string) => {
    setSelectedTopic(topicId);
    // Reset category if it doesn't belong to the new topic
    if (selectedCategory !== "all") {
      const categoryExists = CATEGORIES.some(cat => 
        cat.id === selectedCategory && (topicId === "all" || cat.topicId === topicId)
      );
      if (!categoryExists) {
        setSelectedCategory("all");
      }
    }
  };

  // Get available categories based on selected topic
  const availableCategories = useMemo(() => {
    if (selectedTopic === "all") {
      return CATEGORIES;
    }
    return CATEGORIES.filter(cat => cat.topicId === selectedTopic);
  }, [selectedTopic]);

  // Generate display data (either real data or examples)
  const displayData = useMemo(() => {
    // Since we don't have real data, always show examples based on filters
    let categoriesToShow = availableCategories;
    
    if (selectedCategory !== "all") {
      categoriesToShow = categoriesToShow.filter(cat => cat.id === selectedCategory);
    }

    return categoriesToShow.map(category => {
      const topicName = TOPICS.find(t => t.id === category.topicId)?.name || '';
      const exampleData = CATEGORY_EXAMPLES[category.id] || { definition: '', example: '' };
      
      return {
        mainCategory: topicName,
        subCategory: category.name,
        definition: exampleData.definition,
        example: exampleData.example
      };
    });
  }, [selectedTopic, selectedCategory, availableCategories]);

  const isShowingExamples = displayData.length > 0;

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

        {/* Filters */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              {/* Topic Filter */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  หัวข้อ
                </label>
                <Select value={selectedTopic} onValueChange={handleTopicChange}>
                  <SelectTrigger className="w-full border-pink-200 focus:border-pink-400 focus:ring-pink-400">
                    <SelectValue placeholder="เลือกหัวข้อ" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-pink-200 shadow-lg z-50">
                    <SelectItem value="all">เลือกทั้งหมด</SelectItem>
                    {TOPICS.map((topic) => (
                      <SelectItem key={topic.id} value={topic.id}>
                        {topic.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Category Filter */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  หมวดหมู่
                </label>
                <Select 
                  value={selectedCategory} 
                  onValueChange={setSelectedCategory}
                  disabled={selectedTopic === "all"}
                >
                  <SelectTrigger 
                    className="w-full border-pink-200 focus:border-pink-400 focus:ring-pink-400 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <SelectValue placeholder={selectedTopic === "all" ? "เลือกทั้งหมด" : "เลือกหมวดหมู่"} />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-pink-200 shadow-lg z-50">
                    <SelectItem value="all">เลือกทั้งหมด</SelectItem>
                    {availableCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* View Type Filter */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  ประเภทการแสดง
                </label>
                <Select value="all" onValueChange={() => {}}>
                  <SelectTrigger className="w-full border-pink-200 focus:border-pink-400 focus:ring-pink-400">
                    <SelectValue placeholder="เลือกประเภท" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-pink-200 shadow-lg z-50">
                    <SelectItem value="all">แสดงทั้งหมด</SelectItem>
                    <SelectItem value="definition">เฉพาะคำนิยาม</SelectItem>
                    <SelectItem value="example">เฉพาะตัวอย่าง</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Reset Button */}
              <div className="flex justify-start md:justify-end">
                <Button
                  onClick={handleReset}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 border-pink-200 hover:bg-pink-50 text-pink-600 px-4 py-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  รีเซ็ตตัวกรอง
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category Reference Table */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-xl font-semibold text-gray-800">
              ตารางอ้างอิงหมวดหมู่ (Category Reference)
              {isShowingExamples && (
                <span className="text-sm font-normal text-gray-600 ml-2">
                  - แสดงตัวอย่าง {displayData.length} รายการ
                </span>
              )}
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
                  {displayData.map((row, index) => (
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