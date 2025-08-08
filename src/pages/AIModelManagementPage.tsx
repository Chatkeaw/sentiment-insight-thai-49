import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  Brain, 
  Settings, 
  BarChart3, 
  Database, 
  Cpu, 
  Upload, 
  Download,
  Play,
  Pause,
  RefreshCw,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AIModel {
  id: string;
  name: string;
  type: 'sentiment' | 'classification' | 'prediction';
  version: string;
  status: 'active' | 'inactive' | 'training' | 'error';
  accuracy: number;
  lastTrained: string;
  description: string;
  isDefault: boolean;
}

const mockModels: AIModel[] = [
  {
    id: '1',
    name: 'Sentiment Analysis Model v2.1',
    type: 'sentiment',
    version: '2.1.0',
    status: 'active',
    accuracy: 94.2,
    lastTrained: '2024-01-10 14:30:00',
    description: 'โมเดลวิเคราะห์ความรู้สึกจากข้อความภาษาไทย รองรับการจำแนกประเภท 7 หมวดหมู่',
    isDefault: true
  },
  {
    id: '2',
    name: 'Feedback Classification Model',
    type: 'classification',
    version: '1.5.2',
    status: 'active',
    accuracy: 89.7,
    lastTrained: '2024-01-08 09:15:00',
    description: 'โมเดลจำแนกประเภทข้อเสนอแนะและข้อร้องเรียน',
    isDefault: false
  },
  {
    id: '3',
    name: 'Customer Satisfaction Prediction',
    type: 'prediction',
    version: '1.2.0',
    status: 'training',
    accuracy: 86.5,
    lastTrained: '2024-01-05 16:45:00',
    description: 'โมเดลทำนายระดับความพึงพอใจของลูกค้าจากข้อมูลพฤติกรรม',
    isDefault: false
  }
];

export const AIModelManagementPage: React.FC = () => {
  const [models, setModels] = useState<AIModel[]>(mockModels);
  const [selectedModel, setSelectedModel] = useState<AIModel | null>(null);
  const [isTraining, setIsTraining] = useState(false);
  const { toast } = useToast();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-emerald-500"><CheckCircle className="w-3 h-3 mr-1" />ใช้งาน</Badge>;
      case 'inactive':
        return <Badge variant="secondary">ไม่ใช้งาน</Badge>;
      case 'training':
        return <Badge className="bg-blue-500"><RefreshCw className="w-3 h-3 mr-1 animate-spin" />กำลังฝึก</Badge>;
      case 'error':
        return <Badge variant="destructive"><AlertTriangle className="w-3 h-3 mr-1" />ข้อผิดพลาด</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'sentiment': return <Brain className="w-4 h-4" />;
      case 'classification': return <BarChart3 className="w-4 h-4" />;
      case 'prediction': return <Cpu className="w-4 h-4" />;
      default: return <Database className="w-4 h-4" />;
    }
  };

  const handleStartTraining = (modelId: string) => {
    setIsTraining(true);
    toast({
      title: "เริ่มการฝึกโมเดล",
      description: "กำลังเริ่มการฝึกโมเดล AI กระบวนการนี้อาจใช้เวลาหลายชั่วโมง",
    });
    
    // Simulate training process
    setTimeout(() => {
      setModels(prev => prev.map(model => 
        model.id === modelId 
          ? { ...model, status: 'training' as const }
          : model
      ));
      setIsTraining(false);
    }, 2000);
  };

  const handleToggleModel = (modelId: string, isActive: boolean) => {
    setModels(prev => prev.map(model => 
      model.id === modelId 
        ? { ...model, status: isActive ? 'active' as const : 'inactive' as const }
        : model
    ));
    
    toast({
      title: isActive ? "เปิดใช้งานโมเดล" : "ปิดใช้งานโมเดล",
      description: isActive ? "โมเดลพร้อมใช้งานแล้ว" : "โมเดลถูกปิดใช้งาน",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">จัดการโมเดล AI</h1>
          <p className="text-muted-foreground">
            จัดการและกำหนดค่าโมเดล Machine Learning สำหรับการวิเคราะห์ความคิดเห็น
          </p>
        </div>
        
        <div className="space-x-2">
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            อัปโหลดโมเดล
          </Button>
          <Button>
            <Brain className="mr-2 h-4 w-4" />
            สร้างโมเดลใหม่
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">โมเดลทั้งหมด</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{models.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">โมเดลที่ใช้งาน</CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {models.filter(m => m.status === 'active').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ความแม่นยำเฉลี่ย</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(models.reduce((sum, m) => sum + m.accuracy, 0) / models.length)}%
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">กำลังฝึก</CardTitle>
            <RefreshCw className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {models.filter(m => m.status === 'training').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="models" className="space-y-6">
        <TabsList>
          <TabsTrigger value="models">โมเดล AI</TabsTrigger>
          <TabsTrigger value="training">การฝึกโมเดล</TabsTrigger>
          <TabsTrigger value="performance">ประสิทธิภาพ</TabsTrigger>
          <TabsTrigger value="integrations">การเชื่อมต่อ</TabsTrigger>
        </TabsList>

        <TabsContent value="models" className="space-y-4">
          <div className="grid gap-4">
            {models.map((model) => (
              <Card key={model.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(model.type)}
                        <CardTitle className="text-lg">{model.name}</CardTitle>
                        {model.isDefault && (
                          <Badge variant="outline">ค่าเริ่มต้น</Badge>
                        )}
                      </div>
                      <CardDescription>{model.description}</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(model.status)}
                      <Switch
                        checked={model.status === 'active'}
                        onCheckedChange={(checked) => handleToggleModel(model.id, checked)}
                        disabled={model.status === 'training'}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">เวอร์ชัน</Label>
                      <p className="text-sm text-muted-foreground">{model.version}</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">ความแม่นยำ</Label>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{model.accuracy}%</span>
                        </div>
                        <Progress value={model.accuracy} className="h-2" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">ฝึกล่าสุด</Label>
                      <p className="text-sm text-muted-foreground">{model.lastTrained}</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">การจัดการ</Label>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStartTraining(model.id)}
                          disabled={model.status === 'training' || isTraining}
                        >
                          <Play className="h-4 w-4 mr-1" />
                          ฝึกใหม่
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4 mr-1" />
                          ตั้งค่า
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="training" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>การฝึกโมเดลใหม่</CardTitle>
              <CardDescription>
                กำหนดค่าและเริ่มการฝึกโมเดล AI ใหม่
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>ชื่อโมเดล</Label>
                  <Input placeholder="กรอกชื่อโมเดล" />
                </div>
                <div className="space-y-2">
                  <Label>ประเภทโมเดล</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกประเภท" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sentiment">Sentiment Analysis</SelectItem>
                      <SelectItem value="classification">Classification</SelectItem>
                      <SelectItem value="prediction">Prediction</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>คำอธิบาย</Label>
                <Textarea placeholder="อธิบายโมเดลและวัตถุประสงค์" />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>ชุดข้อมูลฝึก</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกชุดข้อมูล" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="feedback_2024">Feedback Data 2024</SelectItem>
                      <SelectItem value="feedback_2023">Feedback Data 2023</SelectItem>
                      <SelectItem value="combined">Combined Dataset</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>อัลกอริทึม</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกอัลกอริทึม" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="transformer">Transformer</SelectItem>
                      <SelectItem value="lstm">LSTM</SelectItem>
                      <SelectItem value="bert">BERT Thai</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button className="w-full">
                <Play className="mr-2 h-4 w-4" />
                เริ่มการฝึกโมเดล
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>ประสิทธิภาพโมเดล</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {models.map((model) => (
                    <div key={model.id} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{model.name}</span>
                        <span>{model.accuracy}%</span>
                      </div>
                      <Progress value={model.accuracy} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>การใช้ทรัพยากร</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>CPU Usage</span>
                      <span>65%</span>
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Memory Usage</span>
                      <span>78%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>GPU Usage</span>
                      <span>42%</span>
                    </div>
                    <Progress value={42} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>AWS Integration</CardTitle>
                <CardDescription>การเชื่อมต่อกับ AWS SageMaker</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>สถานะการเชื่อมต่อ</span>
                  <Badge className="bg-emerald-500">เชื่อมต่อแล้ว</Badge>
                </div>
                <div className="space-y-2">
                  <Label>Region</Label>
                  <Input value="ap-southeast-1" readOnly />
                </div>
                <div className="space-y-2">
                  <Label>Endpoint</Label>
                  <Input value="https://runtime.sagemaker.ap-southeast-1.amazonaws.com" readOnly />
                </div>
                <Button variant="outline" className="w-full">
                  ทดสอบการเชื่อมต่อ
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Webhook Configuration</CardTitle>
                <CardDescription>การตั้งค่า Webhook สำหรับการแจ้งเตือน</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Webhook URL</Label>
                  <Input placeholder="https://your-webhook-url.com" />
                </div>
                <div className="space-y-2">
                  <Label>Secret Key</Label>
                  <Input type="password" placeholder="กรอก Secret Key" />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch />
                  <Label>เปิดใช้งาน Webhook</Label>
                </div>
                <Button variant="outline" className="w-full">
                  ทดสอบ Webhook
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};