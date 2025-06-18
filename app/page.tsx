"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Sparkles, Target, TrendingUp } from "lucide-react"
import { InputForm } from "@/components/input-form"
import { StrategyResults } from "@/components/strategy-results"
import type { FormData } from "@/types/form-data"

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData | null>(null)
  const [strategy, setStrategy] = useState<any>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleFormSubmit = async (data: FormData) => {
    setFormData(data)
    setIsGenerating(true)
    setCurrentStep(2)

    try {
      const response = await fetch("/api/generate-strategy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to generate strategy")
      }

      const result = await response.json()
      setStrategy(result)
      setCurrentStep(3)
    } catch (error) {
      console.error("Error generating strategy:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const resetForm = () => {
    setCurrentStep(1)
    setFormData(null)
    setStrategy(null)
    setIsGenerating(false)
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Tell us about your business"
      case 2:
        return "Generating your strategy..."
      case 3:
        return "Your marketing strategy is ready!"
      default:
        return ""
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Marketeer AI
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            AI-powered Meta Ads strategist for small businesses, solopreneurs, and freelancers
          </p>
        </div>

        {/* Progress Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Step {currentStep} of 3</span>
            <span className="text-sm text-gray-500">{Math.round((currentStep / 3) * 100)}% Complete</span>
          </div>
          <Progress value={(currentStep / 3) * 100} className="h-2" />
        </div>

        {/* Step Title */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-800">{getStepTitle()}</h2>
        </div>

        {/* Content */}
        {currentStep === 1 && (
          <div className="max-w-4xl mx-auto">
            <InputForm onSubmit={handleFormSubmit} />
          </div>
        )}

        {currentStep === 2 && (
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="p-8 text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <h3 className="text-xl font-semibold mb-2">Creating your personalized strategy...</h3>
                <p className="text-gray-600">
                  Our AI is analyzing your business and generating a comprehensive Meta Ads campaign strategy.
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {currentStep === 3 && strategy && (
          <div className="max-w-6xl mx-auto">
            <StrategyResults strategy={strategy} formData={formData} onReset={resetForm} />
          </div>
        )}

        {/* Features Preview (only show on step 1) */}
        {currentStep === 1 && (
          <div className="max-w-4xl mx-auto mt-16">
            <h3 className="text-2xl font-bold text-center mb-8">What you'll get:</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <Target className="h-8 w-8 text-blue-600 mb-2" />
                  <CardTitle>Complete Funnel Strategy</CardTitle>
                  <CardDescription>TOFU, MOFU, BOFU breakdown with specific objectives for each stage</CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <Sparkles className="h-8 w-8 text-purple-600 mb-2" />
                  <CardTitle>Ready-to-Use Ad Copy</CardTitle>
                  <CardDescription>Professional ad copy in English and Urdu for all campaign stages</CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <TrendingUp className="h-8 w-8 text-green-600 mb-2" />
                  <CardTitle>7-Day Action Plan</CardTitle>
                  <CardDescription>Day-by-day campaign schedule with budget allocation and targeting</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
