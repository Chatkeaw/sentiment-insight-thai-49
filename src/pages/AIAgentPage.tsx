
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Bot, Send, User } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export const AIAgentPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'สวัสดีครับ! ผมคือ AI Assistant ที่จะช่วยวิเคราะห์และตอบคำถามเกี่ยวกับข้อมูล Dashboard ของคุณ มีอะไรให้ผมช่วยเหลือไหมครับ?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sampleQuestions = [
    'แสดงสรุปข้อมูลความพึงพอใจในเดือนนี้',
    'อธิบายแนวโน้มความคิดเห็นเชิงลบที่เพิ่มขึ้น',
    'แนะนำการปรับปรุงบริการในสาขาที่มีคะแนนต่ำ',
    'วิเคราะห์หมวดหมู่ที่มีข้อร้องเรียนมากที่สุด'
  ];

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: generateAIResponse(inputMessage),
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const generateAIResponse = (question: string): string => {
    const responses = [
      'จากข้อมูลที่วิเคราะห์ได้ ผมพบว่าคะแนนความพึงพอใจโดยรวมอยู่ที่ 4.2/5.0 ซึ่งถือว่าอยู่ในระดับดี โดยหัวข้อที่ได้คะแนนสูงสุดคือ "การดูแลเอาใจใส่" ที่ 4.5 คะแนน',
      'จากการวิเคราะห์แนวโน้ม พบว่าความคิดเห็นเชิงลบเพิ่มขึ้น 12% ในช่วง 3 เดือนที่ผ่านมา โดยส่วนใหญ่เป็นเรื่องของระบบเทคโนโลยีและเวลารอคิว',
      'แนะนำให้ปรับปรุงระบบจัดการคิวและอบรมพนักงานในเรื่องการให้บริการที่รวดเร็วขึ้น โดยเฉพาะในช่วงเวลาเร่งด่วน',
      'หมวดหมู่ที่มีข้อร้องเรียนมากสุดคือ "เทคโนโลยีและดิจิทัล" โดยเฉพาะระบบ Core ของธนาคารและเครื่อง ATM ที่มีปัญหาบ่อย'
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleQuestionClick = (question: string) => {
    setInputMessage(question);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="space-y-6 max-w-full">
      <h2 className="text-xl font-semibold text-foreground">AI Agent</h2>

      {/* Sample Questions */}
      <Card className="chart-container-medium">
        <CardHeader>
          <CardTitle className="card-title">คำถามตัวอย่าง</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {sampleQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                className="text-left justify-start h-auto p-3 whitespace-normal"
                onClick={() => handleQuestionClick(question)}
              >
                {question}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chat Messages */}
      <Card className="chart-container-large">
        <CardHeader>
          <CardTitle className="card-title">แชท</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 overflow-y-auto mb-4 space-y-4 p-4 bg-gray-50 rounded-lg">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.type === 'user' ? 'bg-pink-primary text-white' : 'bg-gray-200'
                }`}>
                  {message.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={`max-w-[80%] p-3 rounded-lg ${
                  message.type === 'user' 
                    ? 'bg-pink-primary text-white ml-auto' 
                    : 'bg-white border'
                }`}>
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <div className={`text-xs mt-1 ${
                    message.type === 'user' ? 'text-pink-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString('th-TH')}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border p-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="flex gap-2">
            <Textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="พิมพ์คำถามของคุณ..."
              className="min-h-[60px] resize-none"
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="px-6"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
