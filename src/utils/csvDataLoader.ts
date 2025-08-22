
import { LocationData } from '../types/locations';

// TODO: Add CSV files to public/data/ directory:
// - public/data/regions.csv (columns: region_id, region_name)
// - public/data/provinces.csv (columns: province_id, province_name, region_id)
// - public/data/districts.csv (columns: district_id, district_name, province_id)
// - public/data/branches.csv (columns: branch_id, branch_name, district_id)

// Mock data for development - replace with CSV loading when files are available
const mockLocationData: LocationData = {
  regions: Array.from({ length: 18 }, (_, i) => ({
    id: `region_${i + 1}`,
    name: `ภาค ${i + 1}`,
  })),
  provinces: Array.from({ length: 77 }, (_, i) => ({
    id: `province_${i + 1}`,
    name: `จังหวัด ${i + 1}`,
    regionId: `region_${Math.floor(i / 4) + 1}`, // Distribute provinces across regions
  })),
  districts: Array.from({ length: 200 }, (_, i) => ({
    id: `district_${i + 1}`,
    name: `เขต ${i + 1}`,
    provinceId: `province_${Math.floor(i / 2.5) + 1}`, // Distribute districts across provinces
  })),
  branches: Array.from({ length: 500 }, (_, i) => ({
    id: `branch_${i + 1}`,
    name: `หน่วยบริการ ${i + 1}`,
    districtId: `district_${Math.floor(i / 2.5) + 1}`, // Distribute branches across districts
  })),
};

// Function to parse CSV file
async function parseCSV(csvText: string): Promise<any[]> {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  
  return lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim());
    const obj: any = {};
    headers.forEach((header, index) => {
      obj[header] = values[index] || '';
    });
    return obj;
  });
}

// Load CSV data from files
export async function loadLocationDataFromCSV(): Promise<LocationData> {
  try {
    // Try to load CSV files
    const [regionsRes, provincesRes, districtsRes, branchesRes] = await Promise.all([
      fetch('/data/regions.csv'),
      fetch('/data/provinces.csv'), 
      fetch('/data/districts.csv'),
      fetch('/data/branches.csv'),
    ]);

    if (!regionsRes.ok || !provincesRes.ok || !districtsRes.ok || !branchesRes.ok) {
      throw new Error('CSV files not found');
    }

    const [regionsCSV, provincesCSV, districtsCSV, branchesCSV] = await Promise.all([
      regionsRes.text(),
      provincesRes.text(),
      districtsRes.text(),
      branchesRes.text(),
    ]);

    const [regionsData, provincesData, districtsData, branchesData] = await Promise.all([
      parseCSV(regionsCSV),
      parseCSV(provincesCSV),
      parseCSV(districtsCSV),
      parseCSV(branchesCSV),
    ]);

    return {
      regions: regionsData.map(r => ({
        id: r.region_id,
        name: r.region_name,
      })),
      provinces: provincesData.map(p => ({
        id: p.province_id,
        name: p.province_name,
        regionId: p.region_id,
      })),
      districts: districtsData.map(d => ({
        id: d.district_id,
        name: d.district_name,
        provinceId: d.province_id,
      })),
      branches: branchesData.map(b => ({
        id: b.branch_id,
        name: b.branch_name,
        districtId: b.district_id,
      })),
    };
  } catch (error) {
    console.warn('CSV files not found, using mock data:', error);
    return mockLocationData;
  }
}

// Global location data cache
let locationDataCache: LocationData | null = null;

export async function getLocationData(): Promise<LocationData> {
  if (!locationDataCache) {
    locationDataCache = await loadLocationDataFromCSV();
  }
  return locationDataCache;
}
