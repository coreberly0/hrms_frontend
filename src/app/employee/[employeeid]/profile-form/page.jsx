"use client"

import { useEffect, useState, useRef } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { useRouter, useParams } from "next/navigation"
import { EmpSidebar } from "@/components/common/emp-sidebar"

// ─── Data Constants ─────────────────────────────────────────────────────────

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat",
  "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh",
  "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan",
  "Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
  "Andaman and Nicobar Islands","Chandigarh","Dadra and Nagar Haveli and Daman and Diu",
  "Delhi","Jammu and Kashmir","Ladakh","Lakshadweep","Puducherry"
]

const COUNTRIES = [
  "India","United States","United Kingdom","Canada","Australia","Germany","France",
  "Japan","China","Singapore","UAE","Saudi Arabia","South Africa","Brazil","Mexico",
  "Italy","Spain","Netherlands","Sweden","Norway","Denmark","Finland","Switzerland",
  "New Zealand","South Korea","Malaysia","Indonesia","Thailand","Philippines",
  "Bangladesh","Sri Lanka","Nepal","Pakistan","Others"
]

const EXPERIENCE_OPTIONS = ["0-1 years","2 years","3 years","3+ years"]

const SOURCE_OF_HIRE_OPTIONS = [
  "Job Boards","Employee Referrals","LinkedIn","Staffing Agencies",
  "Instagram","Official Website","Others"
]

const SKILL_SET_OPTIONS = [
  "C Programming","C++","Java","Python","JavaScript","TypeScript","HTML","CSS",
  "React.js","Next.js","Node.js","Express.js","SQL","MySQL","MongoDB","Power BI",
  "Tableau","AWS","Azure","Docker","Git & GitHub","Linux","Machine Learning Basics",
  "Data Analysis","Cybersecurity Basics","Networking Basics","Flutter","React Native",
  "UI/UX Basics","Others"
]

const DEPARTMENT_OPTIONS = [
  "Information Technology","Software Development","Web Development","Mobile App Development",
  "Data Science & Analytics","AI & Machine Learning","Cybersecurity","Cloud & DevOps",
  "Networking & Infrastructure","Quality Assurance / Testing","Human Resources",
  "Finance & Accounting","Sales","Marketing","Operations","Customer Support",
  "Technical Support","Product Management","Project Management","Business Development",
  "Design (UI/UX / Graphic)","Content & Media","Legal & Compliance",
  "Supply Chain & Logistics","Manufacturing","Healthcare Services","Education & Training","Others"
]

const DEGREE_OPTIONS = [
  "Secondary School Certificate (SSC / 10th)","Higher Secondary Certificate (HSC / 12th)",
  "Diploma","Bachelor of Arts (BA)","Bachelor of Science (BSc)","Bachelor of Commerce (BCom)",
  "Bachelor of Technology (BTech)","Bachelor of Engineering (BE)",
  "Bachelor of Computer Applications (BCA)","Bachelor of Business Administration (BBA)",
  "Bachelor of Education (BEd)","Bachelor of Design (BDes)","Bachelor of Architecture (BArch)",
  "Bachelor of Medicine (MBBS)","Bachelor of Pharmacy (BPharm)","Master of Arts (MA)",
  "Master of Science (MSc)","Master of Commerce (MCom)","Master of Technology (MTech)",
  "Master of Engineering (ME)","Master of Computer Applications (MCA)",
  "Master of Business Administration (MBA)","Master of Education (MEd)",
  "Master of Design (MDes)","Master of Architecture (MArch)","Master of Pharmacy (MPharm)",
  "Doctor of Philosophy (PhD)","Doctor of Medicine (MD)","Chartered Accountant (CA)",
  "Company Secretary (CS)","Others"
]

const FIELD_OF_STUDY_OPTIONS = [
  "Computer Science","Information Technology","Electronics & Communication",
  "Electrical Engineering","Mechanical Engineering","Civil Engineering",
  "Chemical Engineering","Biotechnology","Data Science","Artificial Intelligence",
  "Cybersecurity","Cloud Computing","Business Administration","Commerce","Economics",
  "Finance","Accounting","Marketing","Human Resources","Arts & Humanities","Psychology",
  "Sociology","Political Science","Law","Medicine","Pharmacy","Nursing","Architecture",
  "Design","Media & Journalism","Education","Mathematics","Physics","Chemistry",
  "Biology","Environmental Science","Others"
]

// ─── Small Helpers ───────────────────────────────────────────────────────────

const Req = () => <span className="text-rose-500 ml-0.5">*</span>

const FL = ({ children, required }) => (
  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
    {children}{required && <Req />}
  </p>
)

const SI = ({ error, className = "", ...props }) => (
  <>
    <input
      {...props}
      className={`w-full h-10 px-3 rounded-lg border text-sm text-slate-800 bg-white
        outline-none transition-all
        focus:ring-2 focus:ring-[#1C225B]/30 focus:border-[#1C225B]
        ${error ? "border-rose-400 bg-rose-50/50" : "border-slate-200 hover:border-slate-300"}
        disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed
        ${className}`}
    />
    {error && <p className="text-[11px] text-rose-500 mt-1">{error}</p>}
  </>
)

const SS = ({ error, className = "", children, ...props }) => (
  <>
    <select
      {...props}
      className={`w-full h-10 px-3 rounded-lg border text-sm text-slate-800 bg-white
        outline-none transition-all cursor-pointer
        focus:ring-2 focus:ring-[#1C225B]/30 focus:border-[#1C225B]
        ${error ? "border-rose-400 bg-rose-50/50" : "border-slate-200 hover:border-slate-300"}
        disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed
        ${className}`}
    >
      {children}
    </select>
    {error && <p className="text-[11px] text-rose-500 mt-1">{error}</p>}
  </>
)

const Card = ({ icon, title, children }) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
    <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-[#1C225B]/5 to-transparent">
      <span className="text-lg">{icon}</span>
      <h2 className="text-sm font-extrabold text-[#1C225B] tracking-tight uppercase">{title}</h2>
    </div>
    <div className="p-6">{children}</div>
  </div>
)

const AddressSection = ({ prefix, label, reg, errs }) => (
  <div>
    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">{label}</p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="md:col-span-2">
        <FL required>Address Line 1</FL>
        <SI {...reg(`${prefix}.line1`, { required: "Required" })} placeholder="House / Flat No., Building Name" error={errs?.[prefix]?.line1?.message} />
      </div>
      <div className="md:col-span-2">
        <FL required>Address Line 2</FL>
        <SI {...reg(`${prefix}.line2`, { required: "Required" })} placeholder="Street, Area, Locality" error={errs?.[prefix]?.line2?.message} />
      </div>
      <div>
        <FL required>City</FL>
        <SI {...reg(`${prefix}.city`, { required: "Required" })} placeholder="City" error={errs?.[prefix]?.city?.message} />
      </div>
      <div>
        <FL required>State</FL>
        <SS {...reg(`${prefix}.state`, { required: "Required" })} error={errs?.[prefix]?.state?.message}>
          <option value="">Select State</option>
          {INDIAN_STATES.map(s => <option key={s}>{s}</option>)}
        </SS>
      </div>
      <div>
        <FL required>Country</FL>
        <SS {...reg(`${prefix}.country`, { required: "Required" })} error={errs?.[prefix]?.country?.message}>
          <option value="">Select Country</option>
          {COUNTRIES.map(c => <option key={c}>{c}</option>)}
        </SS>
      </div>
      <div>
        <FL required>Pin Code</FL>
        <SI {...reg(`${prefix}.pinCode`, { required: "Required", pattern: { value: /^\d{6}$/, message: "Enter valid 6-digit pin" } })} placeholder="6-digit pin code" maxLength={6} error={errs?.[prefix]?.pinCode?.message} />
      </div>
    </div>
  </div>
)

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function EmployeeProfilePage() {
  const router = useRouter()
  const params = useParams()
  const employeeid = params?.employeeid

  const [mounted, setMounted] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [profileImagePreview, setProfileImagePreview] = useState(null)
  const [maritalLocked, setMaritalLocked] = useState(false)
  const [selectedSkills, setSelectedSkills] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const fileInputRef = useRef(null)

  const {
    register, handleSubmit, watch, formState: { errors }, reset
  } = useForm({
    defaultValues: {
      firstName: "", lastName: "", email: "", dob: "", gender: "",
      phone: "", altPhone: "", maritalStatus: "",
      spouseName: "", spousePhone: "",
      relationshipType: "", relationshipName: "", relationshipPhone: "",
      presentAddress: { line1: "", line2: "", city: "", state: "", country: "India", pinCode: "" },
      permanentAddress: { line1: "", line2: "", city: "", state: "", country: "India", pinCode: "" },
      aadhar: "", pan: "", accountNumber: "", branch: "", accountLocation: "",
      experience: "", experienceCustom: "", sourceOfHire: "",
      department: "", departmentCustom: "",
      educations: [{ degree: "", institution: "", fieldOfStudy: "", yearOfPassing: "", cgpa: "" }]
    }
  })

  // useFieldArray via a local ref since we can't import useFieldArray here without react-hook-form
  const [educations, setEducations] = useState([
    { id: 1, degree: "", institution: "", fieldOfStudy: "", yearOfPassing: "", cgpa: "" }
  ])

  const maritalStatus = watch("maritalStatus")
  const experience = watch("experience")
  const department = watch("department")
  const dob = watch("dob")

  const calculateAge = (d) => {
    if (!d) return ""
    const today = new Date(), birth = new Date(d)
    let age = today.getFullYear() - birth.getFullYear()
    const m = today.getMonth() - birth.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
    return age > 0 ? age : ""
  }
  const age = calculateAge(dob)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem(`profileData_${employeeid}`)
    const editMode = localStorage.getItem(`profileEditMode_${employeeid}`)
    const locked = localStorage.getItem(`maritalLocked_${employeeid}`)
    const img = localStorage.getItem(`profileImage_${employeeid}`)
    const skills = localStorage.getItem(`profileSkills_${employeeid}`)
    const savedEdu = localStorage.getItem(`profileEducations_${employeeid}`)

    if (saved) reset(JSON.parse(saved))
    if (editMode === "true") { setIsEditMode(true); localStorage.removeItem(`profileEditMode_${employeeid}`) }
    if (locked === "true") setMaritalLocked(true)
    if (img) setProfileImagePreview(img)
    if (skills) setSelectedSkills(JSON.parse(skills))
    if (savedEdu) setEducations(JSON.parse(savedEdu))
  }, [employeeid])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setProfileImagePreview(ev.target.result)
    reader.readAsDataURL(file)
  }

  const toggleSkill = (skill) => {
    setSelectedSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill])
  }

  const addEducation = () => {
    setEducations(prev => [...prev, { id: Date.now(), degree: "", institution: "", fieldOfStudy: "", yearOfPassing: "", cgpa: "" }])
  }

  const removeEducation = (id) => {
    if (educations.length === 1) return
    setEducations(prev => prev.filter(e => e.id !== id))
  }

  const onSubmit = (data) => {
    if (selectedSkills.length === 0) { alert("Please select at least one skill."); return }
    setSubmitting(true)
    const fullData = { ...data, age, skills: selectedSkills }
    localStorage.setItem(`profileData_${employeeid}`, JSON.stringify(fullData))
    localStorage.setItem(`profileSaved_${employeeid}`, "true")
    localStorage.setItem(`profileSkills_${employeeid}`, JSON.stringify(selectedSkills))
    localStorage.setItem(`profileEducations_${employeeid}`, JSON.stringify(educations))
    if (data.maritalStatus) localStorage.setItem(`maritalLocked_${employeeid}`, "true")
    if (profileImagePreview) localStorage.setItem(`profileImage_${employeeid}`, profileImagePreview)
    setTimeout(() => router.push(`/employee/${employeeid}/ProfileDashboard`), 800)
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-[#F4F6FB]">
      <EmpSidebar />

      <div className="flex-1 p-4 md:p-8 max-w-4xl mx-auto space-y-5 pb-16">

        {/* Header */}
        <div className="flex items-start justify-between pt-2">
          <div>
            <h1 className="text-2xl font-extrabold text-[#1C225B] tracking-tight">
              {isEditMode ? "Edit Profile" : "Complete Your Profile"}
            </h1>
            <p className="text-xs text-slate-400 mt-1">Fields marked <span className="text-rose-500">*</span> are mandatory</p>
          </div>
          {isEditMode && (
            <button
              onClick={() => router.push(`/employee/${employeeid}/ProfileDashboard`)}
              className="text-sm px-4 py-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-white hover:shadow-sm transition-all"
            >
              ← Back
            </button>
          )}
        </div>

        {!isEditMode && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl px-5 py-3 text-sm text-blue-700 flex gap-2 items-start">
            <span className="mt-0.5">👋</span>
            <span>Welcome! Please fill in all your profile details to get started. All fields are mandatory.</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>

          {/* ── 1. PROFILE PICTURE ─────────────────────── */}
          <Card icon="🖼️" title="Profile Picture">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-28 h-28 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 overflow-hidden cursor-pointer hover:border-[#1C225B] transition-colors flex-shrink-0 flex items-center justify-center"
              >
                {profileImagePreview
                  ? <img src={profileImagePreview} alt="Profile" className="w-full h-full object-cover" />
                  : <div className="text-center text-slate-400 text-xs p-2"><div className="text-3xl mb-1">📷</div><div>Click to upload</div></div>
                }
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              <div>
                <button type="button" onClick={() => fileInputRef.current?.click()}
                  className="px-5 py-2.5 rounded-xl bg-[#1C225B] text-white text-sm font-bold hover:bg-[#141a47] transition-colors shadow-sm">
                  Upload Photo
                </button>
                <p className="text-xs text-slate-400 mt-2">JPG, PNG, WEBP • Max 5MB</p>
                <p className="text-xs text-slate-400">Square image, min 200×200px recommended</p>
              </div>
            </div>
          </Card>

          {/* ── 2. PERSONAL INFORMATION ────────────────── */}
          <Card icon="👤" title="Personal Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div>
                <FL required>First Name</FL>
                <SI {...register("firstName", { required: "First name is required" })} placeholder="John" error={errors.firstName?.message} />
              </div>
              <div>
                <FL required>Last Name</FL>
                <SI {...register("lastName", { required: "Last name is required" })} placeholder="Doe" error={errors.lastName?.message} />
              </div>

              <div className="md:col-span-2">
                <FL required>Email Address</FL>
                <SI type="email" {...register("email", { required: "Email is required", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email address" } })} placeholder="john.doe@company.com" error={errors.email?.message} />
              </div>

              <div>
                <FL required>Date of Birth</FL>
                <SI type="date" {...register("dob", { required: "Date of birth is required" })} error={errors.dob?.message} />
              </div>
              <div>
                <FL>Age (Auto-calculated)</FL>
                <div className="h-10 px-3 flex items-center rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-500 font-semibold">
                  {age ? `${age} years` : <span className="text-slate-300">—</span>}
                </div>
              </div>

              <div>
                <FL required>Gender</FL>
                <SS {...register("gender", { required: "Gender is required" })} error={errors.gender?.message}>
                  <option value="">Select Gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Non-binary</option>
                  <option>Prefer not to say</option>
                </SS>
              </div>

              <div>
                <FL required>Phone Number</FL>
                <SI {...register("phone", { required: "Phone is required", pattern: { value: /^\d{10}$/, message: "Enter valid 10-digit number" } })} placeholder="10-digit mobile" maxLength={10} error={errors.phone?.message} />
              </div>

              <div>
                <FL required>Alternate Phone Number</FL>
                <SI {...register("altPhone", { required: "Alternate phone is required", pattern: { value: /^\d{10}$/, message: "Enter valid 10-digit number" } })} placeholder="10-digit mobile" maxLength={10} error={errors.altPhone?.message} />
              </div>

              {/* Marital Status block */}
              <div className="md:col-span-2">
                <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/60">
                  <div className="flex items-center justify-between mb-3">
                    <FL required>Marital Status</FL>
                    {maritalLocked && (
                      <span className="text-[11px] bg-amber-100 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full font-semibold flex items-center gap-1">
                        🔒 Locked · Contact manager to edit
                      </span>
                    )}
                  </div>

                  {maritalLocked ? (
                    <div className="h-10 px-3 flex items-center rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-600">
                      {watch("maritalStatus") === "yes" ? "Married" : "Unmarried"}
                    </div>
                  ) : (
                    <SS {...register("maritalStatus", { required: "Marital status is required" })} error={errors.maritalStatus?.message}>
                      <option value="">Select Marital Status</option>
                      <option value="yes">Married</option>
                      <option value="no">Unmarried</option>
                    </SS>
                  )}

                  {maritalStatus === "yes" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-200">
                      <div>
                        <FL required>Spouse Name</FL>
                        <SI {...register("spouseName", { required: "Spouse name is required" })} placeholder="Full name" disabled={maritalLocked} error={errors.spouseName?.message} />
                      </div>
                      <div>
                        <FL required>Spouse Phone Number</FL>
                        <SI {...register("spousePhone", { required: "Required", pattern: { value: /^\d{10}$/, message: "10 digits" } })} placeholder="10-digit mobile" maxLength={10} disabled={maritalLocked} error={errors.spousePhone?.message} />
                      </div>
                    </div>
                  )}

                  {maritalStatus === "no" && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-200">
                      <div>
                        <FL required>Relationship</FL>
                        <SS {...register("relationshipType", { required: "Required" })} disabled={maritalLocked} error={errors.relationshipType?.message}>
                          <option value="">Select</option>
                          <option>Father</option>
                          <option>Mother</option>
                          <option>Guardian</option>
                        </SS>
                      </div>
                      <div>
                        <FL required>Name</FL>
                        <SI {...register("relationshipName", { required: "Required" })} placeholder="Full name" disabled={maritalLocked} error={errors.relationshipName?.message} />
                      </div>
                      <div>
                        <FL required>Phone Number</FL>
                        <SI {...register("relationshipPhone", { required: "Required", pattern: { value: /^\d{10}$/, message: "10 digits" } })} placeholder="10-digit mobile" maxLength={10} disabled={maritalLocked} error={errors.relationshipPhone?.message} />
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </Card>

          {/* ── 3. ADDRESS ─────────────────────────────── */}
          <Card icon="📍" title="Address Details">
            <div className="space-y-7">
              <AddressSection prefix="presentAddress" label="Present Address" reg={register} errs={errors} />
              <div className="border-t border-dashed border-slate-200" />
              <AddressSection prefix="permanentAddress" label="Permanent Address" reg={register} errs={errors} />
            </div>
          </Card>

          {/* ── 4. IDENTIFICATION ──────────────────────── */}
          <Card icon="🪪" title="Identification & Account Details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div>
                <FL required>Aadhaar Card Number</FL>
                <SI {...register("aadhar", { required: "Aadhaar is required", pattern: { value: /^\d{12}$/, message: "Must be 12 digits" } })} placeholder="12-digit number" maxLength={12} error={errors.aadhar?.message} />
              </div>

              <div>
                <FL required>PAN Card Number</FL>
                <SI {...register("pan", { required: "PAN is required", pattern: { value: /^[A-Z]{5}[0-9]{4}[A-Z]$/, message: "Format: ABCDE1234F" } })} placeholder="e.g. ABCDE1234F" maxLength={10} style={{ textTransform: "uppercase" }} error={errors.pan?.message} />
              </div>

              <div>
                <FL required>Bank Account Number</FL>
                <SI {...register("accountNumber", { required: "Account number is required" })} placeholder="Account number" error={errors.accountNumber?.message} />
              </div>

              <div>
                <FL required>Branch Name</FL>
                <SI {...register("branch", { required: "Branch name is required" })} placeholder="e.g. SBI, MG Road Branch" error={errors.branch?.message} />
              </div>

              <div className="md:col-span-2">
                <FL required>Branch Location</FL>
                <SI {...register("accountLocation", { required: "Branch location is required" })} placeholder="City / Area where the branch is located" error={errors.accountLocation?.message} />
              </div>

            </div>
          </Card>

          {/* ── 5. PROFESSIONAL DETAILS ────────────────── */}
          <Card icon="💼" title="Professional Details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div>
                <FL required>Experience</FL>
                <SS {...register("experience", { required: "Experience is required" })} error={errors.experience?.message}>
                  <option value="">Select Experience</option>
                  {EXPERIENCE_OPTIONS.map(o => <option key={o}>{o}</option>)}
                </SS>
                {experience === "3+ years" && (
                  <div className="mt-2">
                    <SI {...register("experienceCustom", { required: "Please specify your experience" })} placeholder="e.g. 5 years in software development" error={errors.experienceCustom?.message} />
                  </div>
                )}
              </div>

              <div>
                <FL required>Source of Hire</FL>
                <SS {...register("sourceOfHire", { required: "Source of hire is required" })} error={errors.sourceOfHire?.message}>
                  <option value="">Select Source</option>
                  {SOURCE_OF_HIRE_OPTIONS.map(o => <option key={o}>{o}</option>)}
                </SS>
              </div>

              <div>
                <FL required>Department</FL>
                <SS {...register("department", { required: "Department is required" })} error={errors.department?.message}>
                  <option value="">Select Department</option>
                  {DEPARTMENT_OPTIONS.map(o => <option key={o}>{o}</option>)}
                </SS>
                {department === "Others" && (
                  <div className="mt-2">
                    <SI {...register("departmentCustom", { required: "Please specify your department" })} placeholder="Specify your department" error={errors.departmentCustom?.message} />
                  </div>
                )}
              </div>

              {/* Skill set multi-select */}
              <div className="md:col-span-2">
                <FL required>Skill Set</FL>
                <p className="text-[11px] text-slate-400 -mt-1 mb-2">Click to select all that apply</p>
                <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 max-h-56 overflow-y-auto">
                  <div className="flex flex-wrap gap-2">
                    {SKILL_SET_OPTIONS.map(skill => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                          selectedSkills.includes(skill)
                            ? "bg-[#1C225B] text-white border-[#1C225B] shadow-sm"
                            : "bg-white text-slate-600 border-slate-200 hover:border-[#1C225B]/40 hover:text-[#1C225B]"
                        }`}
                      >
                        {selectedSkills.includes(skill) ? "✓ " : ""}{skill}
                      </button>
                    ))}
                  </div>
                </div>
                {selectedSkills.length === 0 && (
                  <p className="text-[11px] text-rose-500 mt-1">Please select at least one skill</p>
                )}
                {selectedSkills.length > 0 && (
                  <p className="text-[11px] text-slate-500 mt-1">{selectedSkills.length} skill(s) selected</p>
                )}
              </div>

            </div>
          </Card>

          {/* ── 6. EDUCATION DETAILS ───────────────────── */}
          <Card icon="🎓" title="Education Details">
            <div className="space-y-4">
              {educations.map((edu, index) => (
                <div key={edu.id} className="border border-slate-200 rounded-xl p-5 bg-slate-50/60 relative">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                      Education #{index + 1}
                    </p>
                    {educations.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeEducation(edu.id)}
                        className="text-xs text-rose-500 hover:text-white hover:bg-rose-500 border border-rose-200 hover:border-rose-500 px-2.5 py-1 rounded-lg transition-all"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <FL required>Degree / Course</FL>
                      <SS
                        value={edu.degree}
                        onChange={e => setEducations(prev => prev.map(ed => ed.id === edu.id ? { ...ed, degree: e.target.value } : ed))}
                      >
                        <option value="">Select Degree</option>
                        {DEGREE_OPTIONS.map(d => <option key={d}>{d}</option>)}
                      </SS>
                    </div>

                    <div>
                      <FL required>Institution / University</FL>
                      <SI
                        value={edu.institution}
                        onChange={e => setEducations(prev => prev.map(ed => ed.id === edu.id ? { ...ed, institution: e.target.value } : ed))}
                        placeholder="e.g. Anna University, Chennai"
                      />
                    </div>

                    <div>
                      <FL required>Field of Study</FL>
                      <SS
                        value={edu.fieldOfStudy}
                        onChange={e => setEducations(prev => prev.map(ed => ed.id === edu.id ? { ...ed, fieldOfStudy: e.target.value } : ed))}
                      >
                        <option value="">Select Field</option>
                        {FIELD_OF_STUDY_OPTIONS.map(f => <option key={f}>{f}</option>)}
                      </SS>
                    </div>

                    <div>
                      <FL required>Year of Passing</FL>
                      <SI
                        type="number"
                        value={edu.yearOfPassing}
                        onChange={e => setEducations(prev => prev.map(ed => ed.id === edu.id ? { ...ed, yearOfPassing: e.target.value } : ed))}
                        placeholder={`e.g. ${new Date().getFullYear() - 1}`}
                        min={1950}
                        max={new Date().getFullYear()}
                      />
                    </div>

                    <div>
                      <FL required>CGPA / Percentage</FL>
                      <SI
                        value={edu.cgpa}
                        onChange={e => setEducations(prev => prev.map(ed => ed.id === edu.id ? { ...ed, cgpa: e.target.value } : ed))}
                        placeholder="e.g. 8.5 CGPA or 85%"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addEducation}
                className="w-full py-3.5 rounded-xl border-2 border-dashed border-[#1C225B]/20 text-[#1C225B] hover:border-[#1C225B]/50 hover:bg-[#1C225B]/5 text-sm font-bold transition-all flex items-center justify-center gap-2"
              >
                <span className="text-lg font-light">+</span> Add Education
              </button>
            </div>
          </Card>

          {/* ── SUBMIT ─────────────────────────────────── */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full h-12 rounded-xl bg-[#1C225B] hover:bg-[#141a47] active:scale-[0.99] text-white font-extrabold text-sm tracking-widest uppercase transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-[#1C225B]/20"
          >
            {submitting
              ? <><span className="animate-spin inline-block">⏳</span> Saving Profile...</>
              : isEditMode ? "Update Profile" : "Submit Profile"
            }
          </button>

        </form>
      </div>
    </div>
  )
}
