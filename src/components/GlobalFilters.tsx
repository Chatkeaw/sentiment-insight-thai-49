import React, { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface GlobalFiltersProps {
  onFiltersChange?: (filters: FilterState) => void;
}

interface FilterState {
  serviceTypes: string[];
  region: string;
  district: string;
  branch: string;
  timeRange: string;
  // เพิ่มเดือน/ปี เพื่อใช้เป็นตัวกรองกลางของทั้งแอป
  month: string;  // '1'..'12'
  year: string;   // '2025'
}

type MonthState = { month: string; year: string };

const MONTHS = [
  { value: "1", label: "มกราคม" },
  { value: "2", label: "กุมภาพันธ์" },
  { value: "3", label: "มีนาคม" },
  { value: "4", label: "เมษายน" },
  { value: "5", label: "พฤษภาคม" },
  { value: "6", label: "มิถุนายน" },
  { value: "7", label: "กรกฎาคม" },
  { value: "8", label: "สิงหาคม" },
  { value: "9", label: "กันยายน" },
  { value: "10", label: "ตุลาคม" },
  { value: "11", label: "พฤศจิกายน" },
  { value: "12", label: "ธันวาคม" }
];

function getInitialMonth(): MonthState {
  // 1) ถ้ามีค่าที่เคยเลือกใน localStorage ให้ใช้ก่อน
  try {
    const saved = localStorage.getItem("dashboard.month");
    if (saved) {
      const v = JSON.parse(saved) as MonthState;
      if (v && MONTHS.some(m => m.value === v.month) && /^\d{4}$/.test(v.year)) {
        return v;
      }
    }
  } catch (_) {}
  // 2) ไม่งั้นใช้เดือน/ปีปัจจุบัน
  const now = new Date();
  return { month: String(now.getMonth() + 1), year: String(now.getFullYear()) };
}

const GlobalFilters: React.FC<GlobalFiltersProps> = ({ onFiltersChange }) => {
  // --- ตัวเลือกแบบ mock ---
  const serviceTypes = [
    "การฝากเงิน/ถอนเงิน",
    "การซื้อผลิตภัณฑ์",
    "การชำระค่าบริการ/ค่าธรรมเนียม",
    "อื่นๆ"
  ];

  const regions = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        value: `ภาค ${i + 1}`,
        label: `ภาค ${i + 1}`
      })),
    []
  );

  const getDistrictsForRegion = (region: string) => {
    if (!region || region === "All") return [];
    return Array.from({ length: 3 }, (_, i) => ({
      value: `${region} เขต ${i + 1}`,
      label: `เขต ${i + 1}`
    }));
  };

  const getBranchesForDistrict = (district: string) => {
    if (!district || district === "All") return [];
    return Array.from({ length: 5 }, (_, i) => ({
      value: `${district} สาขา ${i + 1}`,
      label: `สาขา ${i + 1}`
    }));
  };

  const timeRanges = [
    { value: "1day", label: "วันนี้" },
    { value: "1week", label: "1 สัปดาห์ล่าสุด" },
    { value: "1month", label: "1 เดือนล่าสุด" },
    { value: "3months", label: "3 เดือนล่าสุด" },
    { value: "6months", label: "6 เดือนล่าสุด" },
    { value: "1year", label: "1 ปีล่าสุด" }
  ];

  // --- สร้างค่าเริ่มต้นของเดือน/ปี (เดือนล่าสุด) ---
  const initialMonth = useMemo(getInitialMonth, []);
  const [filters, setFilters] = useState<FilterState>({
    serviceTypes: [],
    region: "",
    district: "",
    branch: "",
    timeRange: "1month",
    month: initialMonth.month,
    year: initialMonth.year
  });

  const districts = useMemo(
    () => getDist
