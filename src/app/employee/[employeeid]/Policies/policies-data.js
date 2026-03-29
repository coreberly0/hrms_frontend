export const policySegments = [
  {
    key: "attendance-working-hours",
    title: "Attendance & Working Hours Policy",
    policyId: "HR-ATT-001",
    effectiveDate: "01 Apr 2026",
    owner: "HR Operations",
    reviewCycle: "Annual",
    purpose:
      "To establish clear attendance, punctuality, and work-hour expectations that support operational continuity and employee well-being.",
    scope: [
      "Applies to all full-time, probationary, and contract employees.",
      "Applicable across office, hybrid, and approved work-from-home arrangements.",
    ],
    keyGuidelines: [
      "Standard working hours are 9:00 AM to 6:00 PM, Monday to Friday.",
      "Employees must mark attendance in the HRMS before 9:15 AM.",
      "Late login or early logout beyond approved limits may be treated as short leave.",
      "A 60-minute meal break and two 10-minute refresh breaks are permitted.",
      "Any attendance regularization request must be submitted within 2 working days.",
    ],
    managerResponsibilities: [
      "Review and approve attendance exceptions within 24 hours.",
      "Escalate repeated absenteeism to HRBP for corrective action.",
    ],
    nonCompliance:
      "Repeated non-adherence can result in loss of pay, performance counseling, or disciplinary action as per company code of conduct.",
  },
  {
    key: "leave",
    title: "Leave Policy",
    policyId: "HR-LEV-002",
    effectiveDate: "01 Apr 2026",
    owner: "HR Shared Services",
    reviewCycle: "Annual",
    purpose:
      "To provide a fair and transparent framework for planned and unplanned leave while ensuring business continuity.",
    scope: [
      "Applies to all employees on payroll.",
      "Leave entitlement varies based on employment type and service period.",
    ],
    keyGuidelines: [
      "Annual leave, casual leave, and sick leave are credited as per HRMS policy settings.",
      "Planned leave should be applied at least 3 working days in advance.",
      "Sick leave exceeding 2 consecutive days requires a medical certificate.",
      "Unapproved absence may be treated as Leave Without Pay (LWP).",
      "Carry-forward and encashment rules are processed at financial year-end.",
    ],
    approvalWorkflow: [
      "Employee submits leave request in HRMS.",
      "Reporting Manager reviews workload impact and approves/rejects.",
      "HR validates policy limits for final processing.",
    ],
    nonCompliance:
      "Policy misuse, false documentation, or frequent unplanned absence may invite disciplinary proceedings.",
  },
  {
    key: "payroll-salary",
    title: "Payroll / Salary Policy",
    policyId: "FIN-PAY-003",
    effectiveDate: "01 Apr 2026",
    owner: "Finance & Payroll",
    reviewCycle: "Bi-Annual",
    purpose:
      "To define salary computation, statutory deductions, payroll timelines, and employee responsibilities for accurate payroll processing.",
    scope: [
      "Applies to all salaried employees receiving payroll through company systems.",
      "Covers fixed pay, variable payouts, reimbursements, and statutory deductions.",
    ],
    keyGuidelines: [
      "Payroll is processed monthly and salary is credited on the last working day.",
      "Cut-off date for attendance and reimbursement inputs is the 25th of each month.",
      "Deductions include PF, ESI (where applicable), professional tax, and income tax.",
      "Payslips are published in HRMS and treated as confidential employee records.",
      "Payroll queries should be raised within 5 working days of salary credit.",
    ],
    approvalWorkflow: [
      "HR and Managers freeze attendance and leave data.",
      "Finance validates payable days and deductions.",
      "Payroll is released after authorized sign-off.",
    ],
    nonCompliance:
      "Submission of inaccurate claims or payroll data manipulation may lead to recovery and disciplinary action.",
  },
  {
    key: "it-security",
    title: "IT & Security Policy",
    policyId: "IT-SEC-004",
    effectiveDate: "01 Apr 2026",
    owner: "Information Security",
    reviewCycle: "Quarterly",
    purpose:
      "To protect company systems, applications, and data assets against unauthorized access, loss, or misuse.",
    scope: [
      "Applies to all users with access to company devices, networks, and business applications.",
      "Includes email, cloud storage, HRMS, project tools, and internal communication platforms.",
    ],
    keyGuidelines: [
      "Password sharing is strictly prohibited; MFA must be enabled wherever available.",
      "Only authorized software and extensions may be installed on company devices.",
      "Sensitive data must be shared only through approved channels with access controls.",
      "Any phishing attempt, malware alert, or suspicious activity must be reported immediately.",
      "External USB usage and public Wi-Fi access must follow IT security controls.",
    ],
    managerResponsibilities: [
      "Ensure team completion of mandatory information security training.",
      "Revoke access promptly during role change or exit.",
    ],
    nonCompliance:
      "Security violations may lead to access suspension, formal investigation, and disciplinary action depending on severity.",
  },
  {
    key: "exit-resignation",
    title: "Exit & Resignation Policy",
    policyId: "HR-EXT-005",
    effectiveDate: "01 Apr 2026",
    owner: "HR Business Partner",
    reviewCycle: "Annual",
    purpose:
      "To ensure a smooth, compliant, and auditable offboarding process for resigning employees.",
    scope: [
      "Applies to voluntary resignation, retirement, and role closure exits.",
      "Includes clearance, knowledge transfer, final settlement, and document closure.",
    ],
    keyGuidelines: [
      "Resignation must be submitted through HRMS and acknowledged by the reporting manager.",
      "Standard notice period is 30 days unless otherwise specified in employment terms.",
      "Knowledge transfer plan must be completed and signed off before final working day.",
      "All company assets, credentials, and documents must be returned before clearance.",
      "Experience letter and full-and-final settlement are processed after successful clearance.",
    ],
    approvalWorkflow: [
      "Manager reviews resignation and confirms release date.",
      "HR initiates exit checklist and No-Dues process.",
      "Finance closes pending claims and final settlement.",
    ],
    nonCompliance:
      "Non-completion of notice obligations or asset return may delay relieving formalities and settlement.",
  },
];
