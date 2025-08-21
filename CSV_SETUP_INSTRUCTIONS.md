
# การตั้งค่าไฟล์ CSV สำหรับระบบ Cascading Filter

## ไฟล์ที่ต้องเพิ่ม

คุณต้องสร้างโฟลเดอร์ `public/data/` และเพิ่มไฟล์ CSV ดังนี้:

### 1. public/data/regions.csv
```csv
region_id,region_name
region_1,ภาคที่ 1
region_2,ภาคที่ 2
...
region_18,ภาคที่ 18
```

### 2. public/data/provinces.csv
```csv
province_id,province_name,region_id
province_1,จังหวัดกรุงเทพมหานคร,region_5
province_2,จังหวัดสมุทรปราการ,region_5
...
```

### 3. public/data/districts.csv
```csv
district_id,district_name,province_id
district_1,เขตบางรัก,province_1
district_2,เขตพญาไท,province_1
...
```

### 4. public/data/branches.csv
```csv
branch_id,branch_name,district_id
branch_1,หน่วยบริการสีลม,district_1
branch_2,หน่วยบริการราชดำริ,district_2
...
```

## โครงสร้างโฟลเดอร์
```
public/
  data/
    regions.csv
    provinces.csv
    districts.csv
    branches.csv
```

## หมายเหตุ

- หากไม่มีไฟล์ CSV ระบบจะใช้ข้อมูล Mock Data แทน
- ข้อมูล Mock ถูกสร้างขึ้นเพื่อทดสอบการทำงานของระบบ
- เมื่อเพิ่มไฟล์ CSV แล้ว ระบบจะโหลดข้อมูลจริงแทน Mock Data โดยอัตโนมัติ
- ตรวจสอบให้แน่ใจว่าไฟล์ CSV ใช้ encoding UTF-8 เพื่อรองรับภาษาไทย

## การทดสอบ

1. เพิ่มไฟล์ CSV ตามโครงสร้างด้านบน
2. รีเฟรชเพจ
3. ตรวจสอบใน Developer Console ว่ามีการโหลดไฟล์ CSV สำเร็จ
4. ทดสอบการทำงานของ Cascading Filter
