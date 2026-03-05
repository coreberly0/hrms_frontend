"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl
} from "@/components/ui/form"

import Sidebar from "../Sidebar"

export default function EmployeeProfilePage() {

  const role = "employee" // change to "hr" if needed
  const [isProfileSaved, setIsProfileSaved] = useState(false)

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedProfile = localStorage.getItem("profileSaved")
    if (savedProfile === "true") {
      setIsProfileSaved(true)
    }
  }, [])

  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      alternativePhone: "",
      spouseDetails: "",

      presentAddress: "",
      permanentAddress: "",

      experience: "",
      sourceOfHire: "",
      skillSet: "",
      qualification: "",
      department: "",
      title: "",
      salary: "",

      educationDetails: "",

      accountNumber: ""
    }
  })

  const onSubmit = (data) => {
    console.log("PROFILE DATA:", data)
    localStorage.setItem("profileSaved", "true")
    setIsProfileSaved(true)
    alert("Profile saved successfully!")
  }

  if (!mounted) return null

  const professionalFields = [
    "experience",
    "sourceOfHire",
    "skillSet",
    "qualification",
    "department",
    "title",
    "salary"
  ]

  const showViewOnly = role === "employee" && isProfileSaved

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Profile Area */}
      <div className="flex-1  p-6">
        <div className="max-w-full space-y-4">

          <h1 className="text-2xl font-semibold text-[#1C225B] mb-4">
            Employee Profile
          </h1>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

              {/* ================= PERSONAL DETAILS ================= */}

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
                        <FormLabel className="text-sm">First Name</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-9" />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-sm">Last Name</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-9" />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-sm">Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} className="h-9" />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-sm">Phone</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-9" />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="alternativePhone"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-sm">
                          Alternative Phone
                          {showViewOnly && (
                            <span className="text-xs text-gray-500 ml-1">(View Only)</span>
                          )}
                        </FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            className={`h-9 ${showViewOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
                            disabled={showViewOnly}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="spouseDetails"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-sm">
                          Spouse Details
                          {showViewOnly && (
                            <span className="text-xs text-gray-500 ml-1">(View Only)</span>
                          )}
                        </FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            className={`h-9 ${showViewOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
                            disabled={showViewOnly}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="accountNumber"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2 space-y-1">
                        <FormLabel className="text-sm">
                          Account Number
                          {showViewOnly && (
                            <span className="text-xs text-gray-500 ml-1">(View Only)</span>
                          )}
                        </FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            className={`h-9 ${showViewOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
                            disabled={showViewOnly}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                </CardContent>
              </Card>

              {/* ================= ADDRESS ================= */}

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Address</CardTitle>
                </CardHeader>

                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">

                  <FormField
                    control={form.control}
                    name="presentAddress"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-sm">Present Address</FormLabel>
                        <FormControl>
                          <Textarea {...field} rows={3} className="resize-none" />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="permanentAddress"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-sm">Permanent Address</FormLabel>
                        <FormControl>
                          <Textarea {...field} rows={3} className="resize-none" />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                </CardContent>
              </Card>

              {/* ================= PROFESSIONAL ================= */}

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Professional Details</CardTitle>
                </CardHeader>

                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">

                  {professionalFields.map((item) => (
                    <FormField
                      key={item}
                      control={form.control}
                      name={item}
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-sm capitalize">
                            {item.replace(/([A-Z])/g, " $1")}
                          </FormLabel>
                          <FormControl>
                            <Input {...field} className="h-9" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  ))}

                </CardContent>
              </Card>

              {/* ================= EDUCATION ================= */}

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Education Details</CardTitle>
                </CardHeader>

                <CardContent>
                  <FormField
                    control={form.control}
                    name="educationDetails"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormControl>
                          <Textarea {...field} rows={4} className="resize-none" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
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