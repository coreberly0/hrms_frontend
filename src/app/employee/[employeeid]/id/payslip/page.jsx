"use client";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useMemo, useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Eye, Download, Share2, Mail, X } from "lucide-react";

const MONTHS = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

const START_YEAR = 2000;
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from(
	{ length: CURRENT_YEAR - START_YEAR + 1 },
	(_, index) => CURRENT_YEAR - index
);

function buildPayslipData(employeeData, month, year, options = {}) {
	const companyDetailsEmpty = options.companyDetailsEmpty ?? false;

	return {
		companyName: companyDetailsEmpty
			? ""
			: employeeData?.companyName || "Company Name",
		companyAddress: companyDetailsEmpty ? "" : "Company Address",
		cityPincode: companyDetailsEmpty ? "" : "City, Pincode",
		country: companyDetailsEmpty ? "" : "India",
		employeeName: employeeData?.employeeName || "N/A",
		employeeId: employeeData?.employeeCode || "N/A",
		payPeriod: `${month} ${year}`,
		paidDays: "22",
		lossOfPayDays: "0",
		payDate: "Feb 01 2026",
		earnings: [
			{
				label: "Basic",
				amount: employeeData?.salary ? Math.round(employeeData.salary * 0.5) : 0,
			},
			{
				label: "House Rent Allowance",
				amount: employeeData?.salary ? Math.round(employeeData.salary * 0.3) : 0,
			},
		],
		deductions: [
			{
				label: "Income Tax",
				amount: employeeData?.salary ? Math.round(employeeData.salary * 0.1) : 0,
			},
			{
				label: "Provident Fund",
				amount: employeeData?.salary ? Math.round(employeeData.salary * 0.12) : 0,
			},
		],
	};
}

function generatePayslipPDF({ employeeData, month, year, companyDetailsEmpty }) {
	const payslipData = buildPayslipData(employeeData, month, year, {
		companyDetailsEmpty,
	});

	const grossEarnings = payslipData.earnings.reduce(
		(sum, item) => sum + item.amount,
		0
	);
	const totalDeductions = payslipData.deductions.reduce(
		(sum, item) => sum + item.amount,
		0
	);
	const netPayable = grossEarnings - totalDeductions;

	const formatCurrency = (value) => `INR ${value.toLocaleString("en-IN")}`;

	const doc = new jsPDF();
	const left = 14;
	let currentY = 18;

	doc.setFontSize(18);
	doc.setFont("helvetica", "bold");
	doc.text("PAYSLIP", left, currentY);

	doc.setFontSize(11);
	doc.setFont("helvetica", "normal");
	currentY += 8;

	if (payslipData.companyName) {
		doc.setFont("helvetica", "bold");
		doc.text(payslipData.companyName, left, currentY);
		doc.setFont("helvetica", "normal");
		currentY += 5;
	}

	const addressLines = [
		payslipData.companyAddress,
		payslipData.cityPincode,
		payslipData.country,
	].filter(Boolean);
	addressLines.forEach((line) => {
		doc.text(line, left, currentY);
		currentY += 5;
	});

	currentY += 4;
	doc.setFont("helvetica", "bold");
	doc.text(`Payslip for ${payslipData.payPeriod}`, left, currentY);
	doc.setFont("helvetica", "normal");
	currentY += 8;

	autoTable(doc, {
		startY: currentY,
		theme: "grid",
		head: [["Employee Details", ""]],
		body: [
			["Employee Name", payslipData.employeeName],
			["Employee ID", payslipData.employeeId],
			["Pay Period", payslipData.payPeriod],
			["Pay Date", payslipData.payDate],
			["Paid Days", payslipData.paidDays],
			["Loss of Pay Days", payslipData.lossOfPayDays],
			["Department", employeeData?.department || "-"],
			["Designation", employeeData?.designation || "-"],
		],
		headStyles: {
			fillColor: [238, 238, 238],
			textColor: 20,
			fontStyle: "bold",
		},
		styles: { fontSize: 10, cellPadding: 3 },
		columnStyles: { 0: { cellWidth: 45 } },
	});

	const tableTop = doc.lastAutoTable.finalY + 8;
	autoTable(doc, {
		startY: tableTop,
		theme: "grid",
		head: [["Earnings", "Amount"]],
		body: [
			...payslipData.earnings.map((item) => [
				item.label,
				formatCurrency(item.amount),
			]),
			["Gross Earnings", formatCurrency(grossEarnings)],
		],
		headStyles: {
			fillColor: [238, 238, 238],
			textColor: 20,
			fontStyle: "bold",
		},
		styles: { fontSize: 10, cellPadding: 3 },
		columnStyles: { 1: { halign: "right", cellWidth: 50 } },
	});

	autoTable(doc, {
		startY: doc.lastAutoTable.finalY + 8,
		theme: "grid",
		head: [["Deductions", "Amount"]],
		body: [
			...payslipData.deductions.map((item) => [
				item.label,
				formatCurrency(item.amount),
			]),
			["Total Deductions", formatCurrency(totalDeductions)],
		],
		headStyles: {
			fillColor: [238, 238, 238],
			textColor: 20,
			fontStyle: "bold",
		},
		styles: { fontSize: 10, cellPadding: 3 },
		columnStyles: { 1: { halign: "right", cellWidth: 50 } },
	});

	const netPayTop = doc.lastAutoTable.finalY + 12;
	doc.setFillColor(245, 247, 250);
	doc.rect(left, netPayTop, 182, 16, "F");
	doc.setFont("helvetica", "bold");
	doc.text("Total Net Payable", left + 4, netPayTop + 10);
	doc.text(formatCurrency(netPayable), left + 170, netPayTop + 10, {
		align: "right",
	});

	doc.setFont("helvetica", "normal");
	doc.setFontSize(9);
	doc.text(
		"Total Net Payable = Gross Earnings - Total Deductions",
		left,
		netPayTop + 22
	);

	const fileName = `${month}-${year}-Payslip.pdf`;
	doc.save(fileName);
}

export default function PayslipPage() {
	const [year, setYear] = useState(2025);
	const [shareMenuOpen, setShareMenuOpen] = useState(null);
	const [viewingPayslip, setViewingPayslip] = useState(null);
	const params = useParams();
	const employeeId = params.employeeid;
	const [employeeData, setEmployeeData] = useState(null);
	const [loadingEmployee, setLoadingEmployee] = useState(true);

	useEffect(() => {
		if (!employeeId) return;

		async function fetchEmployeeData() {
			try {
				const res = await fetch(`/api/employees/${employeeId}`);
				const data = await res.json();
				if (data && data.length > 0) {
					setEmployeeData(data[0]);
				}
			} catch (error) {
				console.error("Error fetching employee data:", error);
			} finally {
				setLoadingEmployee(false);
			}
		}

		fetchEmployeeData();
	}, [employeeId]);

	const handleView = (month, year) => {
		setViewingPayslip({ month, year });
	};

	const handleDownload = (month, year) => {
		if (loadingEmployee) {
			alert("Payslip data is still loading. Please try again in a moment.");
			return;
		}

		if (!employeeData) {
			alert("Employee data not found.");
			return;
		}

		generatePayslipPDF({
			employeeData,
			month,
			year,
			companyDetailsEmpty: false,
		});
	};

	const handleShare = (platform, month, year) => {
		const message = `Check my ${month} ${year} payslip`;
		const url = window.location.href; // or actual payslip URL

		if (platform === "email") {
			window.open(
				`mailto:?subject=Payslip - ${month} ${year}&body=${encodeURIComponent(
					message + "\n" + url
				)}`
			);
		}

		setShareMenuOpen(null);
	};

	const monthCards = useMemo(
		() =>
			MONTHS.map((month) => ({
				month,
				year,
			})),
		[year]
	);

	

	return (
		<div className="p-6 space-y-6">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-2xl font-semibold text-slate-800">Payslip</h1>
					<p className="mt-1 text-slate-600">
						Select a year to view monthly payslips.
					</p>
				</div>

				<div className="flex items-center gap-3">
					<label htmlFor="payslip-year" className="text-sm text-slate-600">
						Year
					</label>
					<select
						id="payslip-year"
						value={year}
						onChange={(event) => setYear(Number(event.target.value))}
						className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-slate-400 focus:outline-none"
					>
						{YEARS.map((option) => (
							<option key={option} value={option}>
								{option}
							</option>
						))}
					</select>
				</div>
			</div>

			<div className="grid gap-5 sm:grid-cols-2">
				{monthCards.map((card) => (
					<div
						key={`${card.month}-${card.year}`}
						className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
					>
						<div className="flex items-center justify-between">
							<h2 className="text-lg font-semibold text-slate-800">
								{card.month.toUpperCase()}
							</h2>
							<span className="text-sm text-slate-500">{card.year}</span>
						</div>

						<div className="mt-4 flex gap-3">
							<button
								type="button"
								onClick={() => handleView(card.month, card.year)}
								className="flex-1 flex items-center justify-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
							>
								<Eye className="h-4 w-4" />
								View
							</button>
							<button
								type="button"
								onClick={() => handleDownload(card.month, card.year)}
								className="flex-1 flex items-center justify-center gap-2 rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
							>
								<Download className="h-4 w-4" />
								Download
							</button>
							<div className="relative">
								<button
									type="button"
									onClick={() =>
										setShareMenuOpen(
											shareMenuOpen === `${card.month}-${card.year}`
												? null
												: `${card.month}-${card.year}`
										)
									}
									className="flex items-center justify-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
								>
									<Share2 className="h-4 w-4" />
								</button>

								{shareMenuOpen === `${card.month}-${card.year}` && (
									<div className="absolute right-0 top-full mt-2 w-40 rounded-lg border border-slate-200 bg-white shadow-lg z-10">
										<button
											type="button"
											onClick={() => handleShare("email", card.month, card.year)}
											className="flex w-full items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-t-lg"
										>
											<Mail className="h-4 w-4" />
											Email
										</button>
									</div>
								)}
							</div>
						</div>
					</div>
				))}
			</div>

			{viewingPayslip && (
				<PayslipModal
					month={viewingPayslip.month}
					year={viewingPayslip.year}
					onClose={() => setViewingPayslip(null)}
					employeeData={employeeData}
					loadingEmployee={loadingEmployee}
				/>
			)}
		</div>
	);
}

function PayslipModal({ month, year, onClose, employeeData, loadingEmployee }) {
	if (loadingEmployee) {
		return (
			<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
				<div className="bg-white rounded-lg p-8">
					<p className="text-slate-600">Loading payslip data...</p>
				</div>
			</div>
		);
	}

	if (!employeeData) {
		return (
			<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
				<div className="bg-white rounded-lg p-8">
					<p className="text-red-600">Employee data not found</p>
					<button onClick={onClose} className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-md">Close</button>
				</div>
			</div>
		);
	}

	const payslipData = buildPayslipData(employeeData, month, year);

	const grossEarnings = payslipData.earnings.reduce(
		(sum, item) => sum + item.amount,
		0
	);
	const totalDeductions = payslipData.deductions.reduce(
		(sum, item) => sum + item.amount,
		0
	);
	const netPayable = grossEarnings - totalDeductions;

	const generatePDF = () => {
		generatePayslipPDF({
			employeeData,
			month,
			year,
			companyDetailsEmpty: false,
		});
	};


	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
				{/* Header */}
				
<div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
	<h2 className="text-xl font-semibold text-slate-800">
		Payslip - {month} {year}
	</h2>

	<div className="flex items-center gap-3">
		<button
			onClick={generatePDF}
			className="px-3 py-1 bg-slate-900 text-white rounded-md text-sm"
		>
			Download PDF
		</button>

		<button
			onClick={onClose}
			className="p-1 hover:bg-slate-100 rounded-md transition"
		>
			<X className="h-5 w-5" />
		</button>
	</div>
</div>


				{/* Content */}
				<div className="p-6 space-y-6">
					{/* Company Details */}
					<div className="space-y-2 text-slate-600">
						<p className="font-medium text-slate-800">{payslipData.companyName}</p>
						<p>{payslipData.companyAddress}</p>
						<p>{payslipData.cityPincode}</p>
						<p>{payslipData.country}</p>
					</div>

					{/* Employee Pay Summary */}
					<div>
						<h3 className="text-lg font-semibold text-slate-800 mb-4">
							Employee Pay Summary <span className="text-red-500">*</span>
						</h3>
						<div className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
							<div className="flex items-center gap-3">
								<span className="text-slate-700 min-w-[140px]">Employee Name</span>
								<span className="text-slate-600">:</span>
								<span className="text-slate-600">{payslipData.employeeName}</span>
							</div>
							<div className="flex items-center gap-3">
								<span className="bg-blue-600 text-white px-2 py-1 text-sm rounded min-w-[100px] text-center">
									Employee ID
								</span>
								<span className="text-slate-600">:</span>
								<span className="text-slate-600">{payslipData.employeeId}</span>
							</div>
							<div className="flex items-center gap-3">
								<span className="text-slate-700 min-w-[140px]">Pay Period</span>
								<span className="text-slate-600">:</span>
								<span className="text-slate-600">{payslipData.payPeriod}</span>
							</div>
							<div className="flex items-center gap-3">
								<span className="text-slate-700 min-w-[100px]">Paid Days</span>
								<span className="text-slate-600">:</span>
								<span className="text-slate-600">{payslipData.paidDays}</span>
							</div>
							<div className="flex items-center gap-3">
								<span className="text-slate-700 min-w-[140px]">Loss of Pay Days</span>
								<span className="text-slate-600">:</span>
								<span className="text-slate-600">{payslipData.lossOfPayDays}</span>
							</div>
							<div className="flex items-center gap-3">
								<span className="text-slate-700 min-w-[100px]">Pay Date</span>
								<span className="text-slate-600">:</span>
								<span className="text-slate-600">{payslipData.payDate}</span>
							</div>
						</div>
					</div>

					{/* Income Details */}
					<div>
						<h3 className="text-lg font-semibold text-slate-800 mb-4">
							Income Details <span className="text-red-500">*</span>
						</h3>
						<div className="grid sm:grid-cols-2 gap-6">
							{/* Earnings */}
							<div className="space-y-3">
								<div className="flex justify-between font-semibold text-slate-800 pb-2 border-b">
									<span>Earnings</span>
									<span>Amount</span>
								</div>
								{payslipData.earnings.map((item, index) => (
									<div key={index} className="flex justify-between text-slate-700">
										<span>{item.label}</span>
										<span>{item.amount}</span>
									</div>
								))}
								<button className="flex items-center gap-2 text-blue-600 text-sm">
									<span className="text-lg">⊕</span> Add Earnings
								</button>
								<div className="flex justify-between font-semibold text-slate-800 pt-2 border-t">
									<span>Gross Earnings</span>
									<span>₹{grossEarnings}</span>
								</div>
							</div>

							{/* Deductions */}
							<div className="space-y-3">
								<div className="flex justify-between font-semibold text-slate-800 pb-2 border-b">
									<span>Deductions</span>
									<span>Amount</span>
								</div>
								{payslipData.deductions.map((item, index) => (
									<div key={index} className="flex justify-between text-slate-700">
										<span>{item.label}</span>
										<span>{item.amount}</span>
									</div>
								))}
								<button className="flex items-center gap-2 text-blue-600 text-sm">
									<span className="text-lg">⊕</span> Add Deductions
								</button>
								<div className="flex justify-between font-semibold text-slate-800 pt-2 border-t">
									<span>Total Deductions</span>
									<span>₹{totalDeductions}</span>
								</div>
							</div>
						</div>
					</div>

					{/* Total Net Payable */}
					<div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
						<div className="flex justify-between items-center">
							<div>
								<p className="text-lg font-semibold text-slate-800">Total Net Payable</p>
								<p className="text-sm text-slate-600">Gross Earnings - Total Deductions</p>
							</div>
							<p className="text-2xl font-bold text-slate-900">₹{netPayable}</p>
						</div>
						<p className="text-right text-sm text-slate-600 mt-2">Amount in words :</p>
					</div>
				</div>
			</div>
		</div>
	);
}
