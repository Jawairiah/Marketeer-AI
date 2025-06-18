export interface FormData {
  productDescription: string
  businessType: string
  budgetAmount: string
  budgetPeriod: "daily" | "weekly" | "monthly"
  campaignGoal: string
  targetAudience: {
    ageMin: number
    ageMax: number
    location: string
    gender: "all" | "male" | "female"
    interests: string[]
  }
}
