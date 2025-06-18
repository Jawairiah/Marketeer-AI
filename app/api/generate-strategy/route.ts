import { type NextRequest, NextResponse } from "next/server"
import { generateObject } from "ai"
import { google } from "@ai-sdk/google"
import { z } from "zod"

// Configuration constants - Easy to modify
const CONFIG = {
  // Budget allocation percentages
  BUDGET_ALLOCATION: {
    TOFU: 0.5, // 50% for awareness
    MOFU: 0.3, // 30% for consideration
    BOFU: 0.2, // 20% for conversion
  },

  // Default discount for BOFU ads
  DEFAULT_DISCOUNT: "20%",

  // Mock strategy templates by business type
  BUSINESS_TEMPLATES: {
    "Beauty & Wellness": {
      productFocus: "skincare and beauty products",
      mainBenefit: "Transform your skin with natural ingredients",
      urgencyPhrase: "Limited time beauty offer",
    },
    "E-commerce/Online Store": {
      productFocus: "online shopping experience",
      mainBenefit: "Shop premium products with fast delivery",
      urgencyPhrase: "Exclusive online deal",
    },
    "Food & Restaurants": {
      productFocus: "delicious food and dining",
      mainBenefit: "Taste authentic flavors made fresh daily",
      urgencyPhrase: "Today's special offer",
    },
    "Fashion & Apparel": {
      productFocus: "trendy fashion and style",
      mainBenefit: "Look amazing with our latest collection",
      urgencyPhrase: "Fashion sale ending soon",
    },
  },
}

const strategySchema = z.object({
  funnelStrategy: z.array(
    z.object({
      stage: z.string(),
      phase: z.string(),
      description: z.string(),
      actions: z.array(z.string()),
    }),
  ),
  campaignObjectives: z.array(
    z.object({
      stage: z.string(),
      objective: z.string(),
      description: z.string(),
      expectedOutcome: z.string(),
    }),
  ),
  adFormats: z.object({
    formats: z.array(
      z.object({
        type: z.string(),
        description: z.string(),
        priority: z.string(),
      }),
    ),
    platforms: z.array(
      z.object({
        name: z.string(),
        reason: z.string(),
        priority: z.string(),
      }),
    ),
  }),
  adCopy: z.array(
    z.object({
      stage: z.string(),
      english: z.object({
        headline: z.string(),
        description: z.string(),
        cta: z.string(),
      }),
      urdu: z.object({
        headline: z.string(),
        description: z.string(),
        cta: z.string(),
      }),
    }),
  ),
  budgetPlan: z.object({
    total: z.string(),
    weekly: z.string(),
    monthly: z.string(),
    breakdown: z.array(
      z.object({
        stage: z.string(),
        amount: z.string(),
        percentage: z.string(),
        description: z.string(),
      }),
    ),
  }),
  campaignSchedule: z.array(
    z.object({
      day: z.number(),
      focus: z.string(),
      stage: z.string(),
      actions: z.array(z.string()),
      targeting: z.string(),
      retargeting: z.string().optional(),
    }),
  ),
})

// Mock data generator for when API key is not available
function generateMockStrategy(formData: any) {
  const dailyBudget = Number.parseInt(formData.budgetAmount)
  const budgetMultiplier = formData.budgetPeriod === "weekly" ? 7 : formData.budgetPeriod === "monthly" ? 30 : 1
  const totalBudget = dailyBudget * budgetMultiplier

  // Get business-specific template or use default
  const template = CONFIG.BUSINESS_TEMPLATES[formData.businessType as keyof typeof CONFIG.BUSINESS_TEMPLATES] || {
    productFocus: formData.productDescription,
    mainBenefit: `Experience the best ${formData.productDescription}`,
    urgencyPhrase: "Special limited offer",
  }

  return {
    funnelStrategy: [
      {
        stage: "TOFU (Top of Funnel)",
        phase: "Awareness",
        description: "Build brand awareness and reach new potential customers who don't know about your product yet.",
        actions: [
          "Create engaging video content showcasing your product benefits",
          "Use broad targeting to reach new audiences",
          "Focus on brand storytelling and value proposition",
          "Implement reach and brand awareness campaigns",
        ],
      },
      {
        stage: "MOFU (Middle of Funnel)",
        phase: "Consideration",
        description: "Engage with people who have shown interest and nurture them towards making a purchase decision.",
        actions: [
          "Retarget website visitors with detailed product information",
          "Share customer testimonials and social proof",
          "Offer free trials, samples, or consultations",
          "Create comparison content and educational materials",
        ],
      },
      {
        stage: "BOFU (Bottom of Funnel)",
        phase: "Conversion",
        description:
          "Convert interested prospects into paying customers with compelling offers and clear calls-to-action.",
        actions: [
          "Retarget cart abandoners with special offers",
          "Use dynamic product ads for e-commerce",
          "Create urgency with limited-time offers",
          "Implement conversion-focused campaigns with clear CTAs",
        ],
      },
    ],
    campaignObjectives: [
      {
        stage: "TOFU",
        objective: "Reach",
        description: "Maximize the number of people who see your ads to build brand awareness",
        expectedOutcome: "Increased brand recognition and expanded audience reach",
      },
      {
        stage: "MOFU",
        objective: "Engagement",
        description: "Encourage interactions with your content to build relationships",
        expectedOutcome: "Higher engagement rates and qualified leads",
      },
      {
        stage: "BOFU",
        objective: "Conversions",
        description: "Drive specific actions like purchases, sign-ups, or inquiries",
        expectedOutcome: "Direct sales and measurable ROI",
      },
    ],
    adFormats: {
      formats: [
        {
          type: "Video Ads",
          description: "Engaging video content that tells your brand story effectively",
          priority: "High",
        },
        {
          type: "Carousel Ads",
          description: "Showcase multiple products or features in a single ad",
          priority: "High",
        },
        {
          type: "Single Image Ads",
          description: "Simple, cost-effective ads with strong visual impact",
          priority: "Medium",
        },
        {
          type: "Click-to-WhatsApp Ads",
          description: "Direct customers to WhatsApp for instant communication",
          priority: "High",
        },
      ],
      platforms: [
        {
          name: "Facebook Feed",
          reason: "Largest user base in Pakistan with diverse demographics",
          priority: "High",
        },
        {
          name: "Instagram Stories",
          reason: "High engagement rates among younger demographics",
          priority: "High",
        },
        {
          name: "WhatsApp",
          reason: "Most popular messaging platform in Pakistan",
          priority: "High",
        },
        {
          name: "Facebook Marketplace",
          reason: "Great for local businesses and e-commerce",
          priority: "Medium",
        },
      ],
    },
    adCopy: [
      {
        stage: "TOFU",
        english: {
          headline: `Discover Amazing ${formData.businessType} Solutions!`,
          description: `Transform your experience with our premium ${formData.productDescription}. Join thousands of satisfied customers who trust our quality.`,
          cta: "Learn More",
        },
        urdu: {
          headline: `بہترین ${formData.businessType} حل دریافت کریں!`,
          description: `ہماری پریمیم ${formData.productDescription} کے ساتھ اپنا تجربہ بہتر بنائیں۔ ہزاروں مطمئن گاہکوں کے ساتھ شامل ہوں۔`,
          cta: "مزید جانیں",
        },
      },
      {
        stage: "MOFU",
        english: {
          headline: `Why Choose Our ${formData.businessType}?`,
          description: `See what makes us different. Real results, proven quality, and exceptional customer service. Get your free consultation today!`,
          cta: "Get Free Consultation",
        },
        urdu: {
          headline: `ہماری ${formData.businessType} کیوں منتخب کریں؟`,
          description: `دیکھیں کہ ہم کیا مختلف ہیں۔ حقیقی نتائج، ثابت شدہ معیار، اور بہترین کسٹمر سروس۔ آج ہی مفت مشاورت حاصل کریں!`,
          cta: "مفت مشاورت حاصل کریں",
        },
      },
      {
        stage: "BOFU",
        english: {
          headline: `${template.urgencyPhrase}: Special Offer on ${formData.productDescription}`,
          description: `Don't miss out! Get ${CONFIG.DEFAULT_DISCOUNT} off your first order. Premium quality, fast delivery, and 100% satisfaction guaranteed.`,
          cta: "Order Now",
        },
        urdu: {
          headline: `محدود وقت: ${formData.productDescription} پر خصوصی پیشکش`,
          description: `چھوٹ نہ جانے دیں! اپنے پہلے آرڈر پر ${CONFIG.DEFAULT_DISCOUNT} رعایت حاصل کریں۔ پریمیم کوالٹی، تیز ڈیلیوری، اور 100% اطمینان کی ضمانت۔`,
          cta: "ابھی آرڈر کریں",
        },
      },
    ],
    budgetPlan: {
      total: totalBudget.toString(),
      weekly: (dailyBudget * 7).toString(),
      monthly: (dailyBudget * 30).toString(),
      breakdown: [
        {
          stage: "TOFU (Awareness)",
          amount: Math.round(totalBudget * CONFIG.BUDGET_ALLOCATION.TOFU).toString(),
          percentage: (CONFIG.BUDGET_ALLOCATION.TOFU * 100).toString(),
          description: "Build brand awareness and reach new audiences",
        },
        {
          stage: "MOFU (Consideration)",
          amount: Math.round(totalBudget * CONFIG.BUDGET_ALLOCATION.MOFU).toString(),
          percentage: (CONFIG.BUDGET_ALLOCATION.MOFU * 100).toString(),
          description: "Engage interested prospects and build trust",
        },
        {
          stage: "BOFU (Conversion)",
          amount: Math.round(totalBudget * CONFIG.BUDGET_ALLOCATION.BOFU).toString(),
          percentage: (CONFIG.BUDGET_ALLOCATION.BOFU * 100).toString(),
          description: "Convert qualified leads into customers",
        },
      ],
    },
    campaignSchedule: [
      {
        day: 1,
        focus: "Campaign Launch & Awareness",
        stage: "TOFU",
        actions: [
          "Launch brand awareness campaigns",
          "Set up Facebook and Instagram ads",
          "Monitor initial performance metrics",
        ],
        targeting: `${formData.targetAudience.gender} audience, age ${formData.targetAudience.ageMin}-${formData.targetAudience.ageMax} in ${formData.targetAudience.location}`,
        retargeting: "Set up website visitor tracking pixel",
      },
      {
        day: 2,
        focus: "Content Engagement",
        stage: "TOFU",
        actions: ["Share engaging video content", "Post customer testimonials", "Engage with comments and messages"],
        targeting: "Lookalike audiences based on existing customers",
        retargeting: "Create custom audience from video viewers",
      },
      {
        day: 3,
        focus: "Lead Generation",
        stage: "MOFU",
        actions: [
          "Launch lead generation campaigns",
          "Offer free consultations or samples",
          "Set up WhatsApp Business integration",
        ],
        targeting: "Website visitors and engaged users",
        retargeting: "Target people who engaged with previous ads",
      },
      {
        day: 4,
        focus: "Social Proof & Trust Building",
        stage: "MOFU",
        actions: ["Share case studies and success stories", "Highlight customer reviews", "Create educational content"],
        targeting: "Custom audiences from lead forms",
        retargeting: "Re-engage people who downloaded content",
      },
      {
        day: 5,
        focus: "Conversion Push",
        stage: "BOFU",
        actions: ["Launch conversion campaigns", "Create urgency with limited offers", "Set up dynamic product ads"],
        targeting: "Warm audiences and cart abandoners",
        retargeting: "Target people who visited product pages",
      },
      {
        day: 6,
        focus: "Optimization & Scaling",
        stage: "All Stages",
        actions: ["Analyze performance data", "Optimize underperforming ads", "Scale successful campaigns"],
        targeting: "Best performing audience segments",
        retargeting: "Expand successful retargeting campaigns",
      },
      {
        day: 7,
        focus: "Review & Planning",
        stage: "All Stages",
        actions: ["Comprehensive performance review", "Plan next week's strategy", "Adjust budgets based on results"],
        targeting: "Refined audience based on week's data",
        retargeting: "Set up advanced retargeting sequences",
      },
    ],
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json()

    // Check if Google API key is available
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY

    if (!apiKey) {
      console.log("Google API key not found, using mock data for preview")
      // Return mock data when API key is not available
      const mockStrategy = generateMockStrategy(formData)
      return NextResponse.json(mockStrategy)
    }

    const prompt = `You're an expert Meta Ads strategist specializing in small businesses in Pakistan and South Asia.

Input Details:
- Product/Service: ${formData.productDescription}
- Industry: ${formData.businessType}
- Budget: PKR ${formData.budgetAmount}/${formData.budgetPeriod}
- Goal: ${formData.campaignGoal}
- Target Audience: ${formData.targetAudience.gender} audience, age ${formData.targetAudience.ageMin}-${formData.targetAudience.ageMax}, located in ${formData.targetAudience.location}, interested in ${formData.targetAudience.interests.join(", ")}

Create a comprehensive Meta Ads strategy with:

1. FUNNEL STRATEGY: 3-stage breakdown (TOFU-MOFU-BOFU) with specific actions for each stage
2. CAMPAIGN OBJECTIVES: Recommend Meta objectives per funnel stage (Reach → Engagement → Leads → Sales)
3. AD FORMATS & PLATFORMS: Suggest ad types (Image, Video, Carousel, Reels, Stories, Click-to-WhatsApp) and platform priorities
4. AD COPY: Create compelling ad copy for each funnel stage in both English and Urdu
5. BUDGET PLANNER: Break down the budget across funnel stages with percentages
6. 7-DAY SCHEDULE: Day-by-day campaign plan with targeting and retargeting strategies

Focus on:
- Low-budget tactics suitable for Pakistani market
- WhatsApp-first funnels where appropriate
- Local cultural context and language preferences
- Practical, actionable recommendations
- ROI-focused approach

Make it comprehensive yet easy to understand for non-marketers.`

    const { object } = await generateObject({
      model: google("gemini-1.5-pro", {
        apiKey: apiKey,
      }),
      schema: strategySchema,
      prompt: prompt,
    })

    return NextResponse.json(object)
  } catch (error) {
    console.error("Error generating strategy:", error)

    // Fallback to mock data if AI generation fails
    console.log("AI generation failed, using mock data as fallback")
    const formData = await request.json()
    const mockStrategy = generateMockStrategy(formData)
    return NextResponse.json(mockStrategy)
  }
}
