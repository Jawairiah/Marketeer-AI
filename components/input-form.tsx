"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import type { FormData } from "@/types/form-data"

interface InputFormProps {
  onSubmit: (data: FormData) => void
}

export function InputForm({ onSubmit }: InputFormProps) {
  const [formData, setFormData] = useState<FormData>({
    productDescription: "",
    businessType: "",
    budgetAmount: "",
    budgetPeriod: "daily",
    campaignGoal: "",
    targetAudience: {
      ageMin: 18,
      ageMax: 65,
      location: "",
      gender: "all",
      interests: [],
    },
  })

  const [selectedInterests, setSelectedInterests] = useState<string[]>([])

  const businessTypes = [
    "E-commerce/Online Store",
    "Beauty & Wellness",
    "Fashion & Apparel",
    "Food & Restaurants",
    "Health & Fitness",
    "Education & Training",
    "Real Estate",
    "Technology & Software",
    "Professional Services",
    "Home & Garden",
    "Travel & Tourism",
    "Other",
  ]

  const campaignGoals = [
    "Brand Awareness",
    "Lead Generation",
    "Sales/Conversions",
    "Website Traffic",
    "App Installs",
    "Engagement",
    "Video Views",
  ]

  const commonInterests = [
    "Fashion",
    "Beauty",
    "Fitness",
    "Technology",
    "Food",
    "Travel",
    "Business",
    "Education",
    "Health",
    "Shopping",
    "Entertainment",
    "Sports",
    "Music",
    "Art",
    "Photography",
    "Cooking",
  ]

  const handleInterestToggle = (interest: string) => {
    const updated = selectedInterests.includes(interest)
      ? selectedInterests.filter((i) => i !== interest)
      : [...selectedInterests, interest]

    setSelectedInterests(updated)
    setFormData((prev) => ({
      ...prev,
      targetAudience: {
        ...prev.targetAudience,
        interests: updated,
      },
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Business Information */}
      <Card>
        <CardHeader>
          <CardTitle>Business Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="product">Product or Service Description *</Label>
            <Textarea
              id="product"
              placeholder="Describe what you're selling (e.g., Organic skincare products for sensitive skin)"
              value={formData.productDescription}
              onChange={(e) => setFormData((prev) => ({ ...prev, productDescription: e.target.value }))}
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="business-type">Business Type/Industry *</Label>
            <Select
              value={formData.businessType}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, businessType: value }))}
              required
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select your industry" />
              </SelectTrigger>
              <SelectContent>
                {businessTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Budget & Goals */}
      <Card>
        <CardHeader>
          <CardTitle>Budget & Campaign Goals</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="budget">Budget Amount (PKR) *</Label>
              <Input
                id="budget"
                type="number"
                placeholder="1000"
                value={formData.budgetAmount}
                onChange={(e) => setFormData((prev) => ({ ...prev, budgetAmount: e.target.value }))}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="budget-period">Budget Period *</Label>
              <Select
                value={formData.budgetPeriod}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, budgetPeriod: value as "daily" | "weekly" | "monthly" }))
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="goal">Primary Campaign Goal *</Label>
            <Select
              value={formData.campaignGoal}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, campaignGoal: value }))}
              required
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="What's your main objective?" />
              </SelectTrigger>
              <SelectContent>
                {campaignGoals.map((goal) => (
                  <SelectItem key={goal} value={goal}>
                    {goal}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Target Audience */}
      <Card>
        <CardHeader>
          <CardTitle>Target Audience</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="age-min">Age Range *</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  id="age-min"
                  type="number"
                  min="13"
                  max="65"
                  value={formData.targetAudience.ageMin}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      targetAudience: { ...prev.targetAudience, ageMin: Number.parseInt(e.target.value) },
                    }))
                  }
                  className="w-20"
                />
                <span>to</span>
                <Input
                  type="number"
                  min="18"
                  max="65"
                  value={formData.targetAudience.ageMax}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      targetAudience: { ...prev.targetAudience, ageMax: Number.parseInt(e.target.value) },
                    }))
                  }
                  className="w-20"
                />
                <span className="text-sm text-gray-500">years</span>
              </div>
            </div>
            <div>
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={formData.targetAudience.gender}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    targetAudience: { ...prev.targetAudience, gender: value as "all" | "male" | "female" },
                  }))
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="location">Location (City/Region/Country) *</Label>
            <Input
              id="location"
              placeholder="e.g., Karachi, Lahore, Pakistan"
              value={formData.targetAudience.location}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  targetAudience: { ...prev.targetAudience, location: e.target.value },
                }))
              }
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label>Interests (Select all that apply)</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
              {commonInterests.map((interest) => (
                <div key={interest} className="flex items-center space-x-2">
                  <Checkbox
                    id={interest}
                    checked={selectedInterests.includes(interest)}
                    onCheckedChange={() => handleInterestToggle(interest)}
                  />
                  <Label htmlFor={interest} className="text-sm">
                    {interest}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button type="submit" size="lg" className="px-8">
          Generate My Marketing Strategy
        </Button>
      </div>
    </form>
  )
}
