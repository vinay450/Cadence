export interface SupplyChainData {
  id: string;
  timestamp: string;
  productId: string;
  productName: string;
  category: string;
  supplierId: string;
  supplierName: string;
  quantity: number;
  unitCost: number;
  storageLocation: string;
  warehouseUtilization: number;
  daysInStorage: number;
  orderFulfillmentTime: number;
  supplierDeliveryTime: number;
  qualityScore: number;
  transportationCost: number;
  isDamaged: boolean;
  isReturned: boolean;
  returnReason?: string;
}

// Helper function to generate random data within a range
const randomInRange = (min: number, max: number) => 
  Math.floor(Math.random() * (max - min + 1)) + min;

// Helper function to generate a random date within the last 90 days
const randomDate = () => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * 90));
  return date.toISOString();
};

// Product categories
const categories = [
  "Electronics",
  "Furniture",
  "Clothing",
  "Food & Beverage",
  "Office Supplies",
  "Automotive",
  "Home Goods",
  "Sports Equipment"
];

// Storage locations
const storageLocations = [
  "A-1", "A-2", "A-3", "B-1", "B-2", "B-3",
  "C-1", "C-2", "C-3", "D-1", "D-2", "D-3"
];

// Supplier names
const suppliers = [
  "Global Supply Co",
  "Tech Solutions Inc",
  "Quality Goods Ltd",
  "Fast Delivery Systems",
  "Premium Products Corp",
  "Reliable Suppliers LLC",
  "Eco-Friendly Materials",
  "Bulk Wholesale Group"
];

// Generate the dataset
export const supplyChainData: SupplyChainData[] = Array.from({ length: 500 }, (_, index) => {
  const category = categories[Math.floor(Math.random() * categories.length)];
  const supplierIndex = Math.floor(Math.random() * suppliers.length);
  const quantity = randomInRange(1, 1000);
  const unitCost = randomInRange(10, 1000);
  const daysInStorage = randomInRange(1, 90);
  const orderFulfillmentTime = randomInRange(1, 7);
  const supplierDeliveryTime = randomInRange(1, 14);
  const qualityScore = randomInRange(1, 100);
  const isDamaged = Math.random() < 0.05;
  const isReturned = Math.random() < 0.03;
  
  return {
    id: `SC-${String(index + 1).padStart(4, '0')}`,
    timestamp: randomDate(),
    productId: `P-${String(Math.floor(Math.random() * 1000)).padStart(4, '0')}`,
    productName: `${category} Item ${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
    category,
    supplierId: `S-${String(supplierIndex + 1).padStart(3, '0')}`,
    supplierName: suppliers[supplierIndex],
    quantity,
    unitCost,
    storageLocation: storageLocations[Math.floor(Math.random() * storageLocations.length)],
    warehouseUtilization: randomInRange(60, 95),
    daysInStorage,
    orderFulfillmentTime,
    supplierDeliveryTime,
    qualityScore,
    transportationCost: Math.round(unitCost * 0.1 * (1 + Math.random() * 0.5)),
    isDamaged,
    isReturned,
    returnReason: isReturned ? ["Damaged", "Wrong Item", "Quality Issue", "Customer Return"][Math.floor(Math.random() * 4)] : undefined
  };
});

// Add some patterns and anomalies to make the data more realistic
supplyChainData.forEach((item, index) => {
  // Add seasonal patterns
  const date = new Date(item.timestamp);
  const month = date.getMonth();
  
  // Higher inventory in Q4
  if (month >= 9 && month <= 11) {
    item.quantity = Math.round(item.quantity * 1.5);
  }
  
  // Add supplier performance patterns
  if (item.supplierName === "Fast Delivery Systems") {
    item.supplierDeliveryTime = Math.max(1, item.supplierDeliveryTime - 3);
  }
  
  // Add quality issues for certain categories
  if (item.category === "Electronics" && Math.random() < 0.1) {
    item.qualityScore = Math.max(1, item.qualityScore - 20);
    item.isDamaged = true;
  }
  
  // Add warehouse utilization patterns
  if (index % 50 === 0) {
    item.warehouseUtilization = 95; // Simulate peak periods
  }
});

export default supplyChainData; 