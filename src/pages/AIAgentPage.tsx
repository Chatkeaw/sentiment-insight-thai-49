
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Bot, Send, User, MessageSquare } from 'lucide-react';

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
      content: 'สวัสดีครับ ผมคือ AI Agent ที่จะช่วยวิเคราะห์และให้คำแนะนำเกี่ยวกับการให้บริการลูกค้า',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const sampleQuestions = [
    'ช่วยวิเคราะห์แนวโน้มความพึงพอใจลูกค้าในช่วง 6 เดือนที่ผ่านมา และให้คำแนะนำ',
    'เปรียบเทียบผลการดำเนินงานระหว่างสาขาต่าง ๆ และเสนอมาตรการที่ต้องให้ความสนใจ',
    'สรุปข้อร้องเรียนที่มีสำคัญในเดือนนี้ และเสนอแนวทางแก้ไข',
    'ให้คำแนะนำในการพัฒนาคุณภาพการให้บริการสำหรับข้อมูลที่มี'
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
    setShowSuggestions(false);

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
    setShowSuggestions(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputFocus = () => {
    setShowSuggestions(true);
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => setShowSuggestions(false), 200);
  };

  return (
    <div className="space-y-6 max-w-full">
      <div className="flex items-center gap-3">
        <MessageSquare className="w-6 h-6 text-pink-primary" />
        <div>
          <h2 className="text-xl font-semibold text-foreground">แชทกับ AI AGENT</h2>
          <p className="text-sm text-muted-foreground">วิเคราะห์ข้อมูลและให้คำแนะนำเกี่ยวกับการให้บริการลูกค้า</p>
        </div>
      </div>

      {/* Chat Messages */}
      <Card className="h-[600px] flex flex-col">
        <CardContent className="flex-1 p-0">
          <div className="h-[480px] overflow-y-auto p-6 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.type === 'user' ? 'text-white' : 'bg-gray-200'
                }`} style={{
                  backgroundColor: message.type === 'user' ? '#F13596' : undefined
                }}>
                  {message.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={`max-w-[80%] p-3 rounded-lg ${
                  message.type === 'user' 
                    ? 'text-white ml-auto' 
                    : 'bg-white border shadow-sm'
                }`} style={{
                  backgroundColor: message.type === 'user' ? '#F13596' : undefined
                }}>
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <div className={`text-xs mt-1 ${
                    message.type === 'user' ? 'text-pink-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString('th-TH', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border p-3 rounded-lg shadow-sm">
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
          <div className="p-6 border-t bg-white relative">
            <div className="relative">
              {/* Suggestions Dropdown - moved above input */}
              {showSuggestions && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                  <div className="p-2 border-b bg-gray-50">
                    <p className="text-xs text-gray-600 font-medium">คำถามแนะนำ</p>
                  </div>
                  {sampleQuestions.map((question, index) => (

                  ))}
                </div>
              )}
              
              <div className="flex gap-3">
                <Textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="พิมพ์คำถามของคุณที่นี่..."
                  className="min-h-[80px] resize-none flex-1"
                  onKeyPress={handleKeyPress}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="px-8 py-6 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                  style={{
                    backgroundColor: '#F13596',
                    borderColor: '#F13596'
                  }}
                  onMouseEnter={(e) => {
                    if (!e.currentTarget.disabled) {
                      e.currentTarget.style.backgroundColor = '#D12B7E';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!e.currentTarget.disabled) {
                      e.currentTarget.style.backgroundColor = '#F13596';
                    }
                  }}
                  size="lg"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
