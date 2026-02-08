"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useSearchParams } from "next/navigation"
import { Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from "@/components/ui/form"
import { indianStates, indianCities } from "@/data/indianLocations"

import { 
  skillSetOptions,
  departmentOptions,
  experienceOptions,
  sourceOfHireOptions,
  qualificationOptions
} from "@/data/professionalOptions"


import Sidebar from "../EmpSidebar"

export default function EmployeeProfilePage() {
  const searchParams = useSearchParams()
  const employeeId = searchParams.get("employeeId") || "default"

  const role = "employee" // change to "hr" if needed
  const [isProfileSaved, setIsProfileSaved] = useState(false)
  const [maritalStatus, setMaritalStatus] = useState("")
  const [profilePhoto, setProfilePhoto] = useState(null)
  const [mounted, setMounted] = useState(false)
  const [educationList, setEducationList] = useState([0])
  const [experienceLevel, setExperienceLevel] = useState("")
  const [showOtherSkill, setShowOtherSkill] = useState(false)
  const [showOtherDepartment, setShowOtherDepartment] = useState(false)
  const [selectedSkills, setSelectedSkills] = useState([])
  const [educationOtherQualification, setEducationOtherQualification] = useState({})

 

  // Generate year options (current year to 50 years back)
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear()
    const years = []
    for (let i = currentYear; i >= currentYear - 50; i--) {
      years.push(i.toString())
    }
    return years
  }

 const form = useForm({
  defaultValues: {
    firstName: "",
    lastName: "",
    gender: "",
    dateOfBirth: "",
    age: "",
    email: "",
    phone: "",
    alternativePhone: "",
    maritalStatus: "",
    
    // Spouse Details - ADD THESE
    spouseName: "",
    spouseMobile: "",
    
    // Parent Details - ADD THESE
    parentName: "",
    parentMobile: "",
    parentRelation: "",
    
    // ... rest of your fields
    
    // Education fields - ADD THESE
    qualification_0: "",
    otherQualification_0: "",
    degree_0: "",
    institution_0: "",
    fieldOfStudy_0: "",
    yearOfPassing_0: "",
    grade_0: "",
    
    // Add other skill set fields
    otherSkillSetText: "",
  }
})
  useEffect(() => {
    setMounted(true)

    const storageKey = `employeeProfile_${employeeId}`
    const savedFlagKey = `profileSaved_${employeeId}`

    const savedProfile = localStorage.getItem(savedFlagKey)
    const savedData = localStorage.getItem(storageKey)

    if (savedProfile === "true" && savedData) {
      const parsedData = JSON.parse(savedData)

      form.reset(parsedData)
      setMaritalStatus(parsedData.maritalStatus || "")
      setExperienceLevel(parsedData.experience || "")
      setShowOtherSkill(parsedData.skillSet === "Others")
      setShowOtherDepartment(parsedData.department === "Others")
      setIsProfileSaved(true)
    }
  }, [employeeId])

  const onSubmit = (data) => {
    console.log("PROFILE DATA:", data)

    const storageKey = `employeeProfile_${employeeId}`
    const savedFlagKey = `profileSaved_${employeeId}`

    localStorage.setItem(storageKey, JSON.stringify(data))
    localStorage.setItem(savedFlagKey, "true")

    setIsProfileSaved(true)
    setMaritalStatus(data.maritalStatus)

    alert("Profile saved successfully!")
  }

  // Calculate age from date of birth
  const calculateAge = (dob) => {
    if (!dob) return ""
    const birthDate = new Date(dob)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age.toString()
  }

  if (!mounted) return null

  const showViewOnly = role === "employee" && isProfileSaved

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 p-6">
        <div className="max-w-full space-y-4">

          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-[#1C225B]">
              Employee Profile
            </h1>
            <p className="text-sm text-gray-600">Employee ID: {employeeId}</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

              {/* Profile Photo */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Profile Photo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <label 
                      htmlFor="photo-upload" 
                      className="flex items-center gap-2 px-4 py-2 bg-[#1C225B] text-white rounded-lg cursor-pointer hover:bg-[#141a47] transition"
                    >
                      <Upload size={18} />
                      <span>Upload Photo</span>
                    </label>
                    <Input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setProfilePhoto(e.target.files[0])}
                      className="hidden"
                    />
                    {profilePhoto && (
                      <p className="text-sm text-green-600">
                        ✓ {profilePhoto.name}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Personal Details */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Personal Details</CardTitle>
                </CardHeader>

                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">

                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-sm">First Name <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input {...field} className="h-9" required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-sm">Last Name <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input {...field} className="h-9" required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-sm">Gender <span className="text-red-500">*</span></FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          value={field.value ||""}
                          required
                        >
                          <FormControl>
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-sm">Date of Birth <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="date" 
                            className="h-9"
                            onChange={(e) => {
                              field.onChange(e)
                              const age = calculateAge(e.target.value)
                              form.setValue("age", age)
                            }}
                            required
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-sm">Age <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            className="h-9 bg-gray-100" 
                            readOnly 
                            placeholder="Auto-calculated"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-sm">Email <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input type="email" {...field} className="h-9" required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-sm">Phone <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            className="h-9"
                            pattern="[6-9]{1}[0-9]{9}"
                            title="Enter valid 10 digit mobile number"
                            maxLength="10"
                            required
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="alternativePhone"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-sm">
                          Alternative Phone <span className="text-red-500">*</span>
                          {showViewOnly && (
                            <span className="text-xs text-gray-500 ml-1">(View Only)</span>
                          )}
                        </FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            className={`h-9 ${showViewOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
                            disabled={showViewOnly}
                            pattern="[6-9]{1}[0-9]{9}"
                            title="Enter valid 10 digit mobile number"
                            maxLength="10"
                            required
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="maritalStatus"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-sm">
                          Marital Status <span className="text-red-500">*</span>
                          {showViewOnly && (
                            <span className="text-xs text-gray-500 ml-1">(View Only)</span>
                          )}
                        </FormLabel>
                        <Select 
                          onValueChange={(value) => {
                            field.onChange(value)
                            setMaritalStatus(value)
                          }} 
                          value={field.value ||""}
                          disabled={showViewOnly}
                          required
                        >
                          <FormControl>
                            <SelectTrigger className={`h-9 ${showViewOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {maritalStatus === "yes" && (
                    <>
                      <FormField
                        control={form.control}
                        name="spouseName"
                        render={({ field }) => (
                          <FormItem className="space-y-1">
                            <FormLabel className="text-sm">
                              Spouse Name <span className="text-red-500">*</span>
                              {showViewOnly && (
                                <span className="text-xs text-gray-500 ml-1">(View Only)</span>
                              )}
                            </FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                className={`h-9 ${showViewOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
                                disabled={showViewOnly}
                                required
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="spouseMobile"
                        render={({ field }) => (
                          <FormItem className="space-y-1">
                            <FormLabel className="text-sm">
                              Spouse Mobile <span className="text-red-500">*</span>
                              {showViewOnly && (
                                <span className="text-xs text-gray-500 ml-1">(View Only)</span>
                              )}
                            </FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                className={`h-9 ${showViewOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
                                disabled={showViewOnly}
                                pattern="[6-9]{1}[0-9]{9}"
                                title="Enter valid 10 digit mobile number"
                                maxLength="10"
                                required
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  {maritalStatus === "no" && (
                    <>
                      <FormField
                        control={form.control}
                        name="parentRelation"
                        render={({ field }) => (
                          <FormItem className="space-y-1">
                            <FormLabel className="text-sm">
                              Relation <span className="text-red-500">*</span>
                              {showViewOnly && (
                                <span className="text-xs text-gray-500 ml-1">(View Only)</span>
                              )}
                            </FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              value={field.value ||""}
                              disabled={showViewOnly}
                              required
                            >
                              <FormControl>
                                <SelectTrigger className={`h-9 ${showViewOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}>
                                  <SelectValue placeholder="Select relation" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="father">Father</SelectItem>
                                <SelectItem value="mother">Mother</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="parentName"
                        render={({ field }) => (
                          <FormItem className="space-y-1">
                            <FormLabel className="text-sm">
                              Parent Name <span className="text-red-500">*</span>
                              {showViewOnly && (
                                <span className="text-xs text-gray-500 ml-1">(View Only)</span>
                              )}
                            </FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                className={`h-9 ${showViewOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
                                disabled={showViewOnly}
                                required
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="parentMobile"
                        render={({ field }) => (
                          <FormItem className="space-y-1 md:col-span-2">
                            <FormLabel className="text-sm">
                              Parent Mobile <span className="text-red-500">*</span>
                              {showViewOnly && (
                                <span className="text-xs text-gray-500 ml-1">(View Only)</span>
                              )}
                            </FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                className={`h-9 ${showViewOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
                                disabled={showViewOnly}
                                pattern="[6-9]{1}[0-9]{9}"
                                title="Enter valid 10 digit mobile number"
                                maxLength="10"
                                required
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                </CardContent>
              </Card>

              {/* Present Address */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Present Address</CardTitle>
                </CardHeader>

                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3">

                  <FormField
                    control={form.control}
                    name="presentDoorNo"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-sm">Door / Flat Number <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input {...field} className="h-9" required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="presentStreet"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-sm">Street Name <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input {...field} className="h-9" required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="presentArea"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-sm">Area <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input {...field} className="h-9" required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="presentLocation"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-sm">Location <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input {...field} className="h-9" required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="presentCity"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-sm">City <span className="text-red-500">*</span></FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          value={field.value ||""}
                          required
                        >
                          <FormControl>
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder="Select city" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-[200px]">
                            {indianCities.sort().map((city) => (
                              <SelectItem key={city} value={city}>
                                {city}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="presentState"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-sm">State <span className="text-red-500">*</span></FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          value={field.value ||""}
                          required
                        >
                          <FormControl>
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-[200px]">
                            {indianStates.map((state) => (
                              <SelectItem key={state} value={state}>
                                {state}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="presentPincode"
                    render={({ field }) => (
                      <FormItem className="space-y-1 md:col-span-3">
                        <FormLabel className="text-sm">Pincode <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            className="h-9"
                            pattern="[0-9]{6}"
                            title="Enter valid 6 digit pincode"
                            maxLength="6"
                            required
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                </CardContent>
              </Card>

              {/* Permanent Address */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Permanent Address</CardTitle>
                </CardHeader>

                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3">

                  <FormField
                    control={form.control}
                    name="permanentDoorNo"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-sm">Door / Flat Number <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input {...field} className="h-9" required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="permanentStreet"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-sm">Street Name <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input {...field} className="h-9" required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="permanentArea"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-sm">Area <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input {...field} className="h-9" required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="permanentLocation"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-sm">Location <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input {...field} className="h-9" required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="permanentCity"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-sm">City <span className="text-red-500">*</span></FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          value={field.value ||""}
                          required
                        >
                          <FormControl>
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder="Select city" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-[200px]">
                            {indianCities.sort().map((city) => (
                              <SelectItem key={city} value={city}>
                                {city}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="permanentState"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-sm">State <span className="text-red-500">*</span></FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          value={field.value ||""}
                          required
                        >
                          <FormControl>
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-[200px]">
                            {indianStates.map((state) => (
                              <SelectItem key={state} value={state}>
                                {state}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="permanentPincode"
                    render={({ field }) => (
                      <FormItem className="space-y-1 md:col-span-3">
                        <FormLabel className="text-sm">Pincode <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            className="h-9"
                            pattern="[0-9]{6}"
                            title="Enter valid 6 digit pincode"
                            maxLength="6"
                            required
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                </CardContent>
              </Card>

              {/* Professional Details */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Professional Details</CardTitle>
                </CardHeader>

                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  
                  {/* Experience */}
                  <FormField
                    control={form.control}
                    name="experience"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-sm">Experience <span className="text-red-500">*</span></FormLabel>
                        <Select 
                          onValueChange={(value) => {
                            field.onChange(value)
                            setExperienceLevel(value)
                          }} 
                          value={field.value ||""}
                          required
                        >
                          <FormControl>
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder="Select experience" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {experienceOptions.map((exp) => (
                              <SelectItem key={exp} value={exp}>
                                {exp}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Experience Years (shown only when "More than 3 years" is selected) */}
                  {experienceLevel === "More than 3 years" && (
                    <FormField
                      control={form.control}
                      name="experienceYears"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-sm">Specify Years <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              className="h-9"
                              type="number"
                              min="4"
                              placeholder="Enter number of years"
                              required
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {/* Source of Hire */}
                  <FormField
                    control={form.control}
                    name="sourceOfHire"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-sm">Source of Hire <span className="text-red-500">*</span></FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          value={field.value||""}
                          required
                        >
                          <FormControl>
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder="Select source" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {sourceOfHireOptions.map((source) => (
                              <SelectItem key={source} value={source}>
                                {source}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Skill Set */}
{/* Skill Set */}
<FormField
  control={form.control}
  name="skillSet"
  render={({ field }) => (
    <FormItem className="space-y-1 relative">
      <FormLabel className="text-sm">
        Skill Set <span className="text-red-500">*</span>
      </FormLabel>
      
      {/* Selected Skills Display - looks like a normal dropdown */}
      <div 
        className="h-9 border rounded-md px-3 py-2 cursor-pointer bg-white hover:border-gray-400 transition flex items-center justify-between"
        onClick={() => setShowOtherSkill(!showOtherSkill)}
      >
        <div className="flex-1 overflow-hidden">
          {selectedSkills.length === 0 ? (
            <span className="text-gray-400 text-sm">Select skills</span>
          ) : (
            <div className="flex flex-wrap gap-1">
              {selectedSkills.map((skill) => (
                <span 
                  key={skill}
                  className="inline-flex items-center gap-1 bg-[#1C225B] text-white px-2 py-0.5 rounded text-xs"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      const updatedSkills = selectedSkills.filter(s => s !== skill)
                      setSelectedSkills(updatedSkills)
                      form.setValue("skillSet", updatedSkills)
                    }}
                    className="hover:bg-white/20 rounded-full w-3 h-3 flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
        <svg 
          className={`w-4 h-4 transition-transform ${showOtherSkill ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Dropdown Checkbox List - Absolute positioned overlay */}
      {showOtherSkill && (
        <>
          {/* Backdrop to close dropdown when clicking outside */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setShowOtherSkill(false)}
          />
          
          {/* Dropdown content */}
          <div className="absolute z-50 mt-1 w-full bg-white border rounded-md shadow-lg max-h-[300px] overflow-y-auto">
            <div className="grid grid-cols-2 gap-2 p-3">
              {skillSetOptions.map((skill) => (
                <label 
                  key={skill} 
                  className="flex items-center gap-2 text-sm hover:bg-gray-50 p-2 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    value={skill}
                    checked={selectedSkills.includes(skill)}
                    onChange={(e) => {
                      let updatedSkills
                      if (e.target.checked) {
                        updatedSkills = [...selectedSkills, skill]
                      } else {
                        updatedSkills = selectedSkills.filter(s => s !== skill)
                      }
                      setSelectedSkills(updatedSkills)
                      form.setValue("skillSet", updatedSkills)
                    }}
                    className="cursor-pointer w-4 h-4"
                  />
                  {skill}
                </label>
              ))}
            </div>
          </div>
        </>
      )}

      <FormMessage />
    </FormItem>
  )}
/>

{/* Other Skills - Always visible dropdown */}
<FormField
  control={form.control}
  name="otherSkillSet"
  render={({ field }) => (
    <FormItem className="space-y-1">
      <FormLabel className="text-sm">Other Skills</FormLabel>
      <Select 
        onValueChange={field.onChange} 
        value={field.value ||""}
      >
        <FormControl>
          <SelectTrigger className="h-9">
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          <SelectItem value="N/A">N/A</SelectItem>
          <SelectItem value="Other">Mention Other Skills</SelectItem>
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  )}
/>

{/* Text input for other skills - shown when "Other" is selected */}
{form.watch("otherSkillSet") === "Other" && (
  <FormField
    control={form.control}
    name="otherSkillSetText"
    render={({ field }) => (
      <FormItem className="space-y-1 md:col-span-2">
        <FormLabel className="text-sm">Specify Other Skills <span className="text-red-500">*</span></FormLabel>
        <FormControl>
          <Input 
            {...field} 
            className="h-9"
            placeholder="Enter your other skills"
            required
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
)}

                  {/* Department */}
                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-sm">Department <span className="text-red-500">*</span></FormLabel>
                        <Select 
                          onValueChange={(value) => {
                            field.onChange(value)
                            setShowOtherDepartment(value === "Others")
                          }} 
                          value={field.value ||""}
                          required
                        >
                          <FormControl>
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-[300px]">
                            {departmentOptions.map((dept) => (
                              <SelectItem key={dept} value={dept}>
                                {dept}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Other Department (shown when "Others" is selected) */}
                  {showOtherDepartment && (
                    <FormField
                      control={form.control}
                      name="otherDepartment"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-sm">Specify Other Department <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              className="h-9"
                              placeholder="Enter department name"
                              required
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {/* Title */}
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-sm">Title <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input {...field} className="h-9" required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                </CardContent>
              </Card>

              {/* Bank Details */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Bank Details</CardTitle>
                </CardHeader>

                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">

                  <FormField
                    control={form.control}
                    name="accountNumber"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-sm">
                          Account Number <span className="text-red-500">*</span>
                          {showViewOnly && (
                            <span className="text-xs text-gray-500 ml-1">(View Only)</span>
                          )}
                        </FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            className={`h-9 ${showViewOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
                            disabled={showViewOnly}
                            pattern="[0-9]{9,18}"
                            title="Enter valid account number"
                            required
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bankName"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-sm">
                          Bank Name <span className="text-red-500">*</span>
                          {showViewOnly && (
                            <span className="text-xs text-gray-500 ml-1">(View Only)</span>
                          )}
                        </FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            className={`h-9 ${showViewOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
                            disabled={showViewOnly}
                            required
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="branch"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-sm">
                          Branch <span className="text-red-500">*</span>
                          {showViewOnly && (
                            <span className="text-xs text-gray-500 ml-1">(View Only)</span>
                          )}
                        </FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            className={`h-9 ${showViewOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
                            disabled={showViewOnly}
                            required
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ifscCode"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-sm">
                          IFSC Code <span className="text-red-500">*</span>
                          {showViewOnly && (
                            <span className="text-xs text-gray-500 ml-1">(View Only)</span>
                          )}
                        </FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            className={`h-9 ${showViewOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
                            disabled={showViewOnly}
                            pattern="^[A-Z]{4}0[A-Z0-9]{6}$"
                            title="Enter valid IFSC code (e.g., SBIN0001234)"
                            maxLength="11"
                            style={{ textTransform: 'uppercase' }}
                            required
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                </CardContent>
              </Card>

              {/* Identification Details */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Identification Details</CardTitle>
                </CardHeader>

                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">

                  <FormField
                    control={form.control}
                    name="uanNumber"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-sm">
                          UAN Number <span className="text-red-500">*</span>
                          {showViewOnly && (
                            <span className="text-xs text-gray-500 ml-1">(View Only)</span>
                          )}
                        </FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            className={`h-9 ${showViewOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
                            disabled={showViewOnly}
                            pattern="[0-9]{12}"
                            title="Enter valid 12 digit UAN number"
                            maxLength="12"
                            required
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="panNumber"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-sm">
                          PAN Number <span className="text-red-500">*</span>
                          {showViewOnly && (
                            <span className="text-xs text-gray-500 ml-1">(View Only)</span>
                          )}
                        </FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            className={`h-9 ${showViewOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
                            disabled={showViewOnly}
                            pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                            title="Enter valid PAN number (e.g., ABCDE1234F)"
                            maxLength="10"
                            style={{ textTransform: 'uppercase' }}
                            required
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="aadharNumber"
                    render={({ field }) => (
                      <FormItem className="space-y-1 md:col-span-2">
                        <FormLabel className="text-sm">
                          Aadhar Number <span className="text-red-500">*</span>
                          {showViewOnly && (
                            <span className="text-xs text-gray-500 ml-1">(View Only)</span>
                          )}
                        </FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            className={`h-9 ${showViewOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
                            disabled={showViewOnly}
                            pattern="[0-9]{12}"
                            title="Enter valid 12 digit Aadhar number"
                            maxLength="12"
                            required
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                </CardContent>
              </Card>

              {/* Education Details */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Education Details</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  {educationList.map((item, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-3 border p-3 rounded-lg">

                      <FormField
                        control={form.control}
                        name={`qualification_${index}`}
                        render={({ field }) => (
                          <FormItem className="space-y-1">
                            <FormLabel className="text-sm">Qualification <span className="text-red-500">*</span></FormLabel>
                            <Select 
                              onValueChange={(value) => {
                                field.onChange(value)
                                setEducationOtherQualification({
                                  ...educationOtherQualification,
                                  [index]: value === "Others"
                                })
                              }} 
                              value={field.value||""}
                              required
                            >
                              <FormControl>
                                <SelectTrigger className="h-9">
                                  <SelectValue placeholder="Select qualification" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="max-h-[300px]">
                                {qualificationOptions.map((qual) => (
                                  <SelectItem key={qual} value={qual}>
                                    {qual}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {educationOtherQualification[index] && (
                        <FormField
                          control={form.control}
                          name={`otherQualification_${index}`}
                          render={({ field }) => (
                            <FormItem className="space-y-1">
                              <FormLabel className="text-sm">Specify Other Qualification <span className="text-red-500">*</span></FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  className="h-9"
                                  placeholder="Enter qualification"
                                  required
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      <FormField
                        control={form.control}
                        name={`degree_${index}`}
                        render={({ field }) => (
                          <FormItem className="space-y-1">
                            <FormLabel className="text-sm">Degree / Course <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <Input {...field} className="h-9" required />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`institution_${index}`}
                        render={({ field }) => (
                          <FormItem className="space-y-1">
                            <FormLabel className="text-sm">Institution <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <Input {...field} className="h-9" required />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`fieldOfStudy_${index}`}
                        render={({ field }) => (
                          <FormItem className="space-y-1">
                            <FormLabel className="text-sm">Field of Study <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <Input {...field} className="h-9" required />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`yearOfPassing_${index}`}
                        render={({ field }) => (
                          <FormItem className="space-y-1">
                            <FormLabel className="text-sm">Year of Passing <span className="text-red-500">*</span></FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              value={field.value ||""}
                              required
                            >
                              <FormControl>
                                <SelectTrigger className="h-9">
                                  <SelectValue placeholder="Select year" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="max-h-[300px]">
                                {generateYearOptions().map((year) => (
                                  <SelectItem key={year} value={year}>
                                    {year}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`grade_${index}`}
                        render={({ field }) => (
                          <FormItem className="space-y-1 md:col-span-2">
                            <FormLabel className="text-sm">CGPA / Percentage <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <Input {...field} className="h-9" required />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEducationList([...educationList, educationList.length])}
                    className="h-9"
                  >
                    + Add More Education
                  </Button>

                </CardContent>
              </Card>

              <Button 
                type="submit" 
                className="w-full text-lg bg-[#1C225B] hover:bg-[#141a47] text-white h-11"
              >
                Save Profile
              </Button>

            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}