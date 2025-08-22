// src/data/mockData.ts
import { FeedbackEntry, KPIData, RegionData, ChartData } from "@/types/dashboard";

// Generate mock data for dashboard
export const generateMockFeedback = (count: number = 1000): FeedbackEntry[] => {
  const districts = [
    "กรุงเทพฯ กลาง", "กรุงเทพฯ เหนือ", "กรุงเทพฯ ใต้", "กรุงเทพฯ ตะวันออก", "กรุงเทพฯ ตะวันตก",
    "เหนือ 1", "เหนือ 2", "ใต้ 1", "ใต้ 2", "อีสาน 1", "อีสาน 2", "ตะวันตก", "ตะวันออก"
  ];
  
  const regions = Array.from({ length: 18 }, (_, i) => `ภาค ${i + 1}`);
  
  const serviceTypes = [
    "1.1 เปิดบัญชีเงินฝาก - ออมทรัพย์",
    "1.2 เปิดบัญชีเงินฝาก - กระแสรายวัน", 
    "2.1 ฝากเงินสด - ผ่านเคาน์เตอร์",
    "2.2 ฝากเงินสด - ผ่าน ATM",
    "3.1 ถอนเงินสด - ผ่านเคาน์เตอร์",
    "3.2 ถอนเงินสด - ผ่าน ATM",
    "4.1 โอนเงิน - ในประเทศ",
    "4.2 โอนเงิน - ต่างประเทศ",
    "5.1 ชำระบิล - ค่าสาธารณูปโภค",
    "5.2 ชำระบิล - ผ่าน MyMo Application",
    "6.1 สินเชื่อบุคคล - ดอกเบี้ยคงที่",
    "6.2 สินเชื่อบ้าน - ดอกเบี้ยผันแปร",
    "7.1 บัตรเครดิต - ธนาคารกรุงไทย",
    "7.2 บัตรเดบิต - KTB Visa Debit",
    "8.1 ประกันภัย - ประกันชีวิต",
    "8.2 กองทุนรวม - ตราสารหนี้",
    "9.1 เงินฝากประจำ - 6 เดือน",
    "9.2 เงินฝากประจำ - 12 เดือน",
    "10.1 แลกเปลี่ยนเงินตรา - ดอลลาร์สหรัฐ"
  ];

  const branches = [
    "ธนาคารกรุงไทย สาขาสีลม", "ธนาคารกสิกรไทย สาขาแจ้งวัฒนะ", 
    "ธนาคารไทยพาณิชย์ สาขาลาดพร้าว", "ธนาคารกรุงเทพ สาขาบางนา",
    "ธนาคารทหารไทยธนชาต สาขาเชียงใหม่", "ธนาคารออมสิน สาขาหาดใหญ่",
    "ธนาคารกรุงศรีอยุธยา สาขาขอนแก่น", "ธนาคารยูโอบี สาขานครราชสีมา",
    "ธนาคารซีไอเอ็มบี สาขาอุบลราชธานี", "ธนาคารแลนด์ แอนด์ เฮ้าส์ สาขาภูเก็ต"
  ];

  const sampleComments = [
    "เปิดบัญชีออมทรัพย์ใหม่ พนักงานอธิบายเงื่อนไขชัดเจน ดอกเบี้ยดี ขั้นตอนไม่ซับซ้อน",
    "ฝากเงินผ่าน ATM เครื่องใช้งานได้ดี หน้าจอชัดเจน แต่รอคิวนาน ควรเพิ่มเครื่อง",
    "ถอนเงินที่เคาน์เตอร์ พนักงานตรวจสอบข้อมูลละเอียด ปลอดภัยดี แต่ใช้เวลาค่อนข้างนาน",
    "โอนเงินไปต่างประเทศ ค่าธรรมเนียมแพง แต่บริการดี พนักงานช่วยกรอกฟอร์มให้",
    "ชำระค่าไฟผ่าน MyMo App สะดวกมาก ไม่ต้องมาธนาคาร ระบบเสถียร แจ้งเตือนดี",
    "สมัครสินเชื่อบุคคล เอกสารเยอะ ใช้เวลาอนุมัตินาน แต่อัตราดอกเบี้ยเป็นธรรม",
    "ทำบัตรเครดิตใหม่ ขั้นตอนซับซ้อน พนักงานอธิบายสิทธิประโยชน์ดี มีของแถมสวย",
    "ซื้อประกันชีวิต เบี้ยประกันแพงแต่คุ้มครองครอบคลุม พนักงานให้คำปรึกษาดีมาก",
    "เปิดบัญชีเงินฝากประจำ ดอกเบี้ยสูงกว่าออมทรัพย์ พนักงานแนะนำระยะเวลาที่เหมาะสม",
    "แลกเปลี่ยนดอลลาร์สหรัฐ อัตราแลกเปลี่ยนดี ได้ธนบัตรใหม่สะอาด ควรจองล่วงหน้า",
    "ระบบคิวออนไลน์ดี ลดเวลารอ แต่หน้าจอแสดงเลขคิวควรใหญ่กว่านี้",
    "ที่จอดรถไม่พอ ต้องจอกไกล แต่มีรถรับส่งบริการดี พนักงานรักษาความปลอดภัยช่วยดู",
    "สาขาใหม่สะอาด ตกแต่งสวย แอร์เย็นสบาย แต่โต๊ะทำธุรกรรมน้อยไป ช่วงเที่ยงคิวยาว",
    "ใช้บริการกว่า 20 ปี ประทับใจการพัฒนาระบบ Online Banking ทำได้ทุกที่ทุกเวลา",
    "พนักงานใหม่ ยังไม่คล่องเทคโนโลยี ต้องเรียกหัวหน้ามาช่วยบ่อย แต่ตั้งใจทำงานดี"
  ];

  const mockData: FeedbackEntry[] = [];

  for (let i = 0; i < count; i++) {
    const date = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000);
    const branch = branches[Math.floor(Math.random() * branches.length)];
    const district = districts[Math.floor(Math.random() * districts.length)];
    const region = regions[Math.floor(Math.random() * regions.length)];
    
    mockData.push({
      id: `feedback_${i + 1}`,
      timestamp: date.toLocaleTimeString('th-TH'),
      date: date.toLocaleDateString('th-TH'),
      branch: { branch, district, region },
      serviceType: serviceTypes[Math.floor(Math.random() * serviceTypes.length)] as any,
      satisfaction: {
        care: Math.floor(Math.random() * 5) + 1,
        consultation: Math.floor(Math.random() * 5) + 1,
        speed: Math.floor(Math.random() * 5) + 1,
        accuracy: Math.floor(Math.random() * 5) + 1,
        equipment: Math.floor(Math.random() * 5) + 1,
        environment: Math.floor(Math.random() * 5) + 1,
        overall: Math.floor(Math.random() * 5) + 1,
      },
      comment: sampleComments[Math.floor(Math.random() * sampleComments.length)],
      sentiment: {
        staff: Math.floor(Math.random() * 3) - 1,
        service: Math.floor(Math.random() * 3) - 1,
        technology: Math.floor(Math.random() * 3) - 1,
        products: Math.floor(Math.random() * 3) - 1,
        environment: Math.floor(Math.random() * 3) - 1,
        marketConduct: Math.floor(Math.random() * 3) - 1,
        other: Math.floor(Math.random() * 3) - 1,
      },
      detailedSentiment: {
        staffPoliteness: Math.floor(Math.random() * 3) - 1,
        staffCare: Math.floor(Math.random() * 3) - 1,
        staffConsultation: Math.floor(Math.random() * 3) - 1,
        staffAccuracy: Math.floor(Math.random() * 3) - 1,
        staffSpeed: Math.floor(Math.random() * 3) - 1,
        staffProfessionalism: Math.floor(Math.random() * 3) - 1,
        staffImpression: Math.floor(Math.random() * 3) - 1,
        staffSecurity: Math.floor(Math.random() * 3) - 1,
        
        serviceReadiness: Math.floor(Math.random() * 3) - 1,
        serviceProcess: Math.floor(Math.random() * 3) - 1,
        serviceQueue: Math.floor(Math.random() * 3) - 1,
        serviceDocuments: Math.floor(Math.random() * 3) - 1,
        
        techCore: Math.floor(Math.random() * 3) - 1,
        techQueue: Math.floor(Math.random() * 3) - 1,
        techATM: Math.floor(Math.random() * 3) - 1,
        techKYC: Math.floor(Math.random() * 3) - 1,
        techApp: Math.floor(Math.random() * 3) - 1,
        techBookUpdate: Math.floor(Math.random() * 3) - 1,
        techCashCounter: Math.floor(Math.random() * 3) - 1,
        
        productDetails: Math.floor(Math.random() * 3) - 1,
        productConditions: Math.floor(Math.random() * 3) - 1,
        productApprovalTime: Math.floor(Math.random() * 3) - 1,
        productFlexibility: Math.floor(Math.random() * 3) - 1,
        productSimplicity: Math.floor(Math.random() * 3) - 1,
        
        envCleanliness: Math.floor(Math.random() * 3) - 1,
        envSpace: Math.floor(Math.random() * 3) - 1,
        envTemperature: Math.floor(Math.random() * 3) - 1,
        envDesk: Math.floor(Math.random() * 3) - 1,
        envWaitingArea: Math.floor(Math.random() * 3) - 1,
        envLighting: Math.floor(Math.random() * 3) - 1,
        envSound: Math.floor(Math.random() * 3) - 1,
        envRestroom: Math.floor(Math.random() * 3) - 1,
        envParking: Math.floor(Math.random() * 3) - 1,
        envSignage: Math.floor(Math.random() * 3) - 1,
        envOtherFacilities: Math.floor(Math.random() * 3) - 1,
        
        conductNoDeception: Math.floor(Math.random() * 3) - 1,
        conductNoAdvantage: Math.floor(Math.random() * 3) - 1,
        conductNoForcing: Math.floor(Math.random() * 3) - 1,
        conductNoDisturbance: Math.floor(Math.random() * 3) - 1,
        
        otherImpression: Math.floor(Math.random() * 3) - 1,
      }
    });
  }

  return mockData;
};

export const mockFeedbackData = generateMockFeedback(1000);

export const getKPIData = (): KPIData => {
  const total = mockFeedbackData.length;
  const withComments = mockFeedbackData.filter(f => f.comment.length > 10).length;
  const severeComplaints = mockFeedbackData.filter(f => 
    Object.values(f.sentiment).some(v => v === -1) ||
    f.satisfaction.overall <= 2
  ).length;
  const withContact = Math.floor(total * 0.23); // Mock contact data

  return {
    totalFeedback: total,
    feedbackWithComments: {
      count: withComments,
      percentage: Math.round((withComments / total) * 100)
    },
    severeComplaints: {
      count: severeComplaints,
      percentage: Math.round((severeComplaints / total) * 100)
    },
    contactProvided: {
      count: withContact,
      percentage: Math.round((withContact / total) * 100)
    }
  };
};

export const getServiceTypeData = (): ChartData[] => {
  // Group services by main categories for chart display
  const serviceCategories = {
    "บริการเงินฝาก-ถอน": ["1.1", "1.2", "2.1", "2.2", "3.1", "3.2"],
    "บริการโอนเงิน-ชำระบิล": ["4.1", "4.2", "5.1", "5.2"], 
    "สินเชื่อและบัตร": ["6.1", "6.2", "7.1", "7.2"],
    "ผลิตภัณฑ์การลงทุน": ["8.1", "8.2", "9.1", "9.2", "10.1"]
  };
  
  return Object.entries(serviceCategories).map(([category, codes]) => {
    const count = mockFeedbackData.filter(f => 
      codes.some(code => f.serviceType.startsWith(code))
    ).length;
    return {
      name: category,
      value: Math.round((count / mockFeedbackData.length) * 100)
    };
  });
};

export const getSatisfactionData = (): ChartData[] => {
  const categories = [
    { key: 'care', name: 'การดูแลเอาใจใส่' },
    { key: 'consultation', name: 'การตอบคำถามและให้คำแนะนำ' },
    { key: 'speed', name: 'ความรวดเร็วในการให้บริการ' },
    { key: 'accuracy', name: 'ความถูกต้องในการทำธุรกรรม' },
    { key: 'equipment', name: 'ความพร้อมของเครื่องมือให้บริการ' },
    { key: 'environment', name: 'สภาพแวดล้อมของสาขา' },
    { key: 'overall', name: 'ความพึงพอใจในการเข้าใช้บริการ' }
  ];

  return categories.map(cat => {
    const scores = mockFeedbackData.map(f => f.satisfaction[cat.key as keyof typeof f.satisfaction]);
    const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    
    return {
      name: cat.name,
      value: Math.round(avgScore * 10) / 10
    };
  });
};

export const getRegionSatisfactionData = (): ChartData[] => {
  return Array.from({ length: 18 }, (_, i) => {
    const regionName = `ภาค ${i + 1}`;
    const regionFeedback = mockFeedbackData.filter(f => f.branch.region === regionName);
    
    if (regionFeedback.length === 0) {
      return { name: regionName, value: Math.random() * 2 + 3 }; // Random score 3-5
    }
    
    const avgScore = regionFeedback.reduce((sum, f) => sum + f.satisfaction.overall, 0) / regionFeedback.length;
    return {
      name: regionName,
      value: Math.round(avgScore * 10) / 10
    };
  });
};

// -------------------- CHANGED: return array for pie chart --------------------
export type SentimentItem = { label: string; value: number; color: string };

// ✅ ฟังก์ชันใหม่สำหรับกราฟ Pie (3 ค่า: เขียว/แดง/เทา)
export const getSentimentDataForPie = (): SentimentItem[] => ([
  { label: 'เชิงบวก', value: 68, color: '#10B981' },
  { label: 'เชิงลบ', value: 27, color: '#EF4444' },
]);

// -----------------------------------------------------------------------------