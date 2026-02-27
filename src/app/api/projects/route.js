import { NextResponse } from "next/server";

const mockProjects = [
  {
    id: "1",
    name: "HRMS Dashboard",
    description: "Complete HR management system",
    status: "Ongoing",
    budget: 500000,
    spent: 350000,
    progress: 75,
    startDate: "2024-06-01",
    endDate: "2025-06-30",
    employees: [
      { id: "8", name: "Kishore" },
      { id: "9", name: "Kani" },
    ],
  },
  {
    id: "2",
    name: "Mobile App",
    description: "Employee mobile application",
    status: "Completed",
    budget: 300000,
    spent: 300000,
    progress: 100,
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    employees: [
      { id: "8", name: "Kishore" },
      { id: "10", name: "Reshma" },
    ],
  },
  {
    id: "3",
    name: "AI Analytics",
    description: "Machine learning analytics module",
    status: "Ongoing",
    budget: 400000,
    spent: 200000,
    progress: 50,
    startDate: "2024-09-01",
    endDate: "2025-09-30",
    employees: [
      { id: "8", name: "Kishore" },
      { id: "9", name: "Kani" },
      { id: "10", name: "Reshma" },
    ],
  },
  {
    id: "4",
    name: "Cloud Migration",
    description: "Migrate infrastructure to cloud",
    status: "Not Started",
    budget: 600000,
    spent: 0,
    progress: 0,
    startDate: "2025-03-01",
    endDate: "2025-09-30",
    employees: [
      { id: "10", name: "Reshma" },
    ],
  },
  {
    id: "5",
    name: "Security Audit",
    description: "Complete security assessment",
    status: "Ongoing",
    budget: 150000,
    spent: 75000,
    progress: 50,
    startDate: "2025-01-01",
    endDate: "2025-03-31",
    employees: [
      { id: "9", name: "Kani" },
    ],
  },
];

export async function GET(req) {
  return NextResponse.json(mockProjects);
}
