// client/src/data/questionnaireData.js

export const questionnaireData = {
  title: "Comprehensive Venture Risk Assessment",
  categories: [
    {
      title: "Venture Profile",
      description: "General information about your startup for benchmarking purposes.",
      key: "profile",
      questions: [
        { 
          key: 'industry', 
          text: "What industry best describes your venture?", 
          options: [
            {value: 'saas', label: 'SaaS (Software-as-a-Service)'}, 
            {value: 'fintech', label: 'FinTech (Financial Technology)'}, 
            {value: 'healthtech', label: 'HealthTech'}, 
            {value: 'ecommerce', label: 'E-commerce / Marketplace'},
            {value: 'deeptech', label: 'Deep Tech / R&D Intensive'},
            {value: 'other', label: 'Other'},
          ] 
        },
      ]
    },
    {
      title: "Market Risk",
      description: "Assessing the viability and competitiveness of your target market.",
      key: "market",
      questions: [
        { key: 'marketNeed', text: "How validated is the market need for your product?", options: [{value: 'low', label: 'Strongly Validated'}, {value: 'medium', label: 'Somewhat Validated'}, {value: 'high', label: 'Purely Hypothetical'}] },
        { key: 'competition', text: "How would you describe the market competition?", options: [{value: 'low', label: 'Low / Niche Market'}, {value: 'medium', label: 'Medium / Some Competitors'}, {value: 'high', label: 'High / Saturated Market'}] },
        { key: 'marketTrends', text: "Are current market trends in your favor?", options: [{value: 'yes', label: 'Yes, trends are favorable'}, {value: 'no', label: 'No, we are against the trend'}] },
        { key: 'customerAcquisitionCost', text: "What is your projected Customer Acquisition Cost (CAC)?", options: [{value: 'low', label: 'Low (e.g., organic, viral)'}, {value: 'medium', label: 'Medium (e.g., requires ad spend)'}, {value: 'high', label: 'High (e.g., enterprise sales)'}] },
      ]
    },
    {
      title: "Financial Risk",
      description: "Evaluating your startup's financial health and sustainability.",
      key: "financial",
      questions: [
        { key: 'capital', text: "How much capital runway do you currently have?", options: [{value: 'low', label: 'Over 12 months'}, {value: 'medium', label: '6-12 months'}, {value: 'high', label: 'Less than 6 months'}] },
        { key: 'burnRate', text: "Is your monthly burn rate under control?", options: [{value: 'low', label: 'Yes, minimal and controlled'}, {value: 'medium', label: 'It is manageable but growing'}, {value: 'high', label: 'No, it is high and concerning'}] },
        { key: 'revenueModel', text: "How clear and proven is your revenue model?", options: [{value: 'low', label: 'Clear and generating revenue'}, {value: 'medium', label: 'Clear but not yet generating revenue'}, {value: 'high', label: 'Unclear or still exploring models'}] },
        { key: 'profitabilityTimeline', text: "What is the estimated timeline to profitability?", options: [{value: 'low', label: 'Less than 1 year'}, {value: 'medium', label: '1-3 years'}, {value: 'high', label: 'More than 3 years / Unclear'}] },
      ]
    },
    {
      title: "Product & Technology Risk",
      description: "Gauging the risks associated with your product development and tech stack.",
      key: "product",
      questions: [
        { key: 'productQuality', text: "How would you rate your current product quality?", options: [{value: 'high', label: 'High Quality / Production Ready'}, {value: 'medium', label: 'Functional MVP with some bugs'}, {value: 'low', label: 'Early Prototype / Unstable'}] },
        { key: 'devDelays', text: "Are you experiencing significant development delays?", options: [{value: 'no', label: 'No, we are on schedule'}, {value: 'yes', label: 'Yes, we are behind schedule'}] },
        { key: 'techObsolescence', text: "Is your core technology at risk of becoming obsolete?", options: [{value: 'low', label: 'Low risk, using stable tech'}, {value: 'medium', label: 'Some risk, using cutting-edge tech'}, {value: 'high', label: 'High risk, tech is unproven or fading'}] },
        { key: 'scalability', text: "Is your technical architecture built for scalability?", options: [{value: 'yes', label: 'Yes, designed for scale'}, {value: 'no', label: 'No, it will require a major rework'}] },
      ]
    },
    {
      title: "Team & Execution Risk",
      description: "Analyzing the strength, completeness, and cohesion of your founding team.",
      key: "team",
      questions: [
        { key: 'founderConflicts', text: "Is there a high potential for founder conflicts?", options: [{value: 'low', label: 'Low, clear roles and agreement'}, {value: 'medium', label: 'Medium, some overlapping roles'}, {value: 'high', label: 'High, no formal agreement in place'}] },
        { key: 'hiring', text: "How difficult is it to hire the talent you need?", options: [{value: 'low', label: 'Easy, strong talent pool'}, {value: 'medium', label: 'Challenging but possible'}, {value: 'high', label: 'Very difficult, niche skills required'}] },
        { key: 'skillGaps', text: "Does the core team have significant skill gaps?", options: [{value: 'low', label: 'No, all core competencies covered'}, {value: 'medium', label: 'Minor gaps in non-essential areas'}, {value: 'high', label: 'Yes, critical gaps (e.g., no tech co-founder)'}] },
        { key: 'founderExperience', text: "Does the founding team have prior startup experience?", options: [{value: 'yes', label: 'Yes, one or more have experience'}, {value: 'no', label: 'No, this is the first venture for all'}] },
      ]
    }
  ]
};