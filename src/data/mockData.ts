
import { FeedbackEntry, KPIData, RegionData, ChartData } from "@/types/dashboard";

// Generate mock data for dashboard
export const generateMockFeedback = (count: number = 1000): FeedbackEntry[] => {
  const branches = [
    "สำนักงานใหญ่", "สาขาสีลม", "สาขาแจ้งวัฒนะ", "สาขาลาดพร้าว", "สาขาบางนา",
    "สาขาเชียงใหม่", "สาขาหาดใหญ่", "สาขาขอนแก่น", "สาขานครราชสีมา", "สาขาอุบลราชธานี"
  ];
  
  const districts = [
    "กรุงเทพฯ กลาง", "กรุงเทพฯ เหนือ", "กรุงเทพฯ ใต้", "กรุงเทพฯ ตะวันออก", "กรุงเทพฯ ตะวันตก",
    "เหนือ 1", "เหนือ 2", "ใต้ 1", "ใต้ 2", "อีสาน 1", "อีสาน 2", "ตะวันตก", "ตะวันออก"
  ];
  
  const regions = Array.from({ length: 18 }, (_, i) => `ภาค ${i + 1}`);
  
  const serviceTypes = [
    "การฝากเงิน/ถอนเงิน",
    "การซื้อผลิตภัณฑ์", 
    "การชำระค่าบริการ/ค่าธรรมเนียม",
    "อื่นๆ"
  ] as const;

  const sampleComments = [
    "พนักงานให้บริการดีมาก สุภาพและเอาใจใส่ลูกค้า เครื่อง ATM ทำงานได้ดี สะอาด",
    "รอนาน คิวเยอะมาก พื้นที่แคบ แต่พนักงานพยายามช่วยเหลือดี",
    "ระบบล่มบ่อย เสียเวลามาก พนักงานขออภัยแต่แก้ไขได้ไม่เร็ว สภาพแวดล้อมดี",
    "ประทับใจการบริการมาก พนักงานมืออาชีพ อธิบายผลิตภัณฑ์ชัดเจน ที่จอดรถสะดวก",
    "เครื่องนับเงินเสียบ่อย ต้องรอซ่อม พนักงานช่วยได้ดี แต่ใช้เวลานาน อุณหภูมิร้อน",
    "บริการดีเยี่ยม รวดเร็ว ถูกต้อง สะอาด สะดวก แนะนำเพื่อน MyMo App ใช้ง่าย",
    "ห้องน้ำสกปรก พื้นที่รอคับแคบ แต่พนักงานใจดี ช่วยเหลือดี บริการเร็ว",
    "ระบบ Core ช้า ทำธุรกรรมนาน พนักงานอธิบายดี รอคิวนาน สิ่งอำนวยความสะดวกครบ"
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
      serviceType: serviceTypes[Math.floor(Math.random() * serviceTypes.length)],
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
  const serviceTypes = ["การฝากเงิน/ถอนเงิน", "การซื้อผลิตภัณฑ์", "การชำระค่าบริการ/ค่าธรรมเนียม", "อื่นๆ"];
  
  return serviceTypes.map(type => {
    const count = mockFeedbackData.filter(f => f.serviceType === type).length;
    return {
      name: type,
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

export const getSentimentData = () => {
  // Fixed percentages to match reference: 68%, 27%, 5%
  const totalFeedback = mockFeedbackData.length;
  
  // Calculate counts based on fixed percentages
  const positiveCount = Math.round(totalFeedback * 0.68);
  const negativeCount = Math.round(totalFeedback * 0.27); 
  const neutralCount = totalFeedback - positiveCount - negativeCount; // Remaining for neutral
  
  return {
    positive: { 
      count: positiveCount, 
      percentage: Math.round((positiveCount / totalFeedback) * 100) 
    },
    negative: { 
      count: negativeCount, 
      percentage: Math.round((negativeCount / totalFeedback) * 100) 
    },
    neutral: { 
      count: neutralCount, 
      percentage: Math.round((neutralCount / totalFeedback) * 100) 
    }
  };
};
