import React, { useState, useMemo, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { ParticleIcon } from "./ParticleIcon";

export const Services: React.FC = () => {
  const wordGroups = [
    {  adaptability: "Telecom", desiredOutcome: "Increasing Revenue", function: "Marketing", system: "Targeted Stimulation via Behavioral Triggers", outcome: "+15% Revenue"},
    {  adaptability: "Telecom", desiredOutcome: "Key Insights", function: "Customer Analytics", system: "Behavioral Cluster Evolution", outcome: "+22% Targeted Campaign Effectiveness"},
    {  adaptability: "Telecom", desiredOutcome: "Customer Retention", function: "Customer Analytics", system: "Behavioral Churn Prediction & Intervetion", outcome: "-25% Attrition"},
    {  adaptability: "Telecom", desiredOutcome: "Decreasing Costs", function: "Process Analytics", system: "Behavioral Process Flow Optimization", outcome: "-20% Operational Inefficiencies"},
    {  adaptability: "Banking", desiredOutcome: "Increasing Revenue", function: "Sales", system: "Targeted Investment Stimulation", outcome: "+20% AUM Growth"},
    {  adaptability: "Banking", desiredOutcome: "Improving Engagement", function: "Marketing", system: "Behavioral Personalization Engines", outcome: "+15% Customer Interaction"},
    {  adaptability: "Banking", desiredOutcome: "Improving Customer Experience", function: "Customer Service", system: "Behavioral Experience Monitoring", outcome: "+18% Customer Satisfaction"},
    {  adaptability: "Banking", desiredOutcome: "Key Insights", function: "Customer Analytics", system: "Credit Card Behavioural Stimulation", outcome: "+20% Risk Assessment Accuracy"},
    {  adaptability: "Banking", desiredOutcome: "Customer Retention", function: "Customer Analytics", system: "Behavioral Churn Prediction & Intervetion", outcome: "-30% Attrition"},
    {  adaptability: "Banking", desiredOutcome: "Improve Loyalty", function: "Marketing", system: "Behavioral Engagement Optimization", outcome: "+12% Loyalty Program Engagement"},
    {  adaptability: "Banking", desiredOutcome: "Decreasing Costs", function: "Marketing", system: "Targeted New Product Offering", outcome: "-35% Fraud-Related Losses"},
    {  adaptability: "Consumer Goods", desiredOutcome: "Increasing Revenue", function: "Sales", system: "Price Elasticity via Behavioral Modeling", outcome: "+14% Margin Optimization"},
    {  adaptability: "Consumer Goods", desiredOutcome: "Improving Customer Experience", function: "Marketing", system: "Behavioral Consumer Insights", outcome: "+18% Customer Satisfaction"},
    {  adaptability: "Consumer Goods", desiredOutcome: "Key Insights", function: "Customer Analytics", system: "Behavioral Segmentation Analytics", outcome: "+25% Campaign Effectiveness"},
    {  adaptability: "Consumer Goods", desiredOutcome: "Customer Retention", function: "Marketing", system: "Loyalty Stimulation", outcome: "-20% Attrition"},
    {  adaptability: "Consumer Goods", desiredOutcome: "Improve Loyalty", function: "Marketing", system: "Targeted Customer Bliss Moments", outcome: "+15% Loyalty Program Participation"},
    {  adaptability: "Consumer Goods", desiredOutcome: "Key Insights", function: "Product Analytics", system: "Behavioral Consumption Analytics", outcome: "+15% Innovation Speed"},
    {  adaptability: "Transportation", desiredOutcome: "Increasing Revenue", function: "Sales", system: "Usage Stimulation", outcome: "+15% Load Factor"},
    {  adaptability: "Transportation", desiredOutcome: "Improving Customer Experience", function: "Customer Service", system: "Behavioral Journey Feedback Analytics", outcome: "+18% Passenger Satisfaction"},
    {  adaptability: "Transportation", desiredOutcome: "Key Insights", function: "Customer Analytics", system: "Behavioral Travel Pattern Clustering", outcome: "+20% Service Personalization"},
    {  adaptability: "Transportation", desiredOutcome: "Customer Retention", function: "Operations", system: "Behavioral Retention Analytics", outcome: "-15% Attrition"},
    {  adaptability: "Transportation", desiredOutcome: "Improve Loyalty", function: "Marketing", system: "Behavioral Loyalty Program Analytics", outcome: "+10% Loyalty Retention"},
    {  adaptability: "Transportation", desiredOutcome: "Decreasing Costs", function: "Process Analytics", system: "Behavioral Operational Flow Analytics", outcome: "-20% Operational Delays"},
    {  adaptability: "Insurance", desiredOutcome: "Increasing Revenue", function: "Sales", system: "Behavioral Policy Recommendation Systems", outcome: "+25% Conversion Rates"},
    {  adaptability: "Insurance", desiredOutcome: "Improving Engagement", function: "Marketing", system: "Behavioral Customer Engagement Scoring", outcome: "+15% Policyholder Interaction"},
    {  adaptability: "Insurance", desiredOutcome: "Improving Customer Experience", function: "Experience", system: "Behavioral Bliss Moment Targeting", outcome: "+18% Customer Satisfaction"},
    {  adaptability: "Insurance", desiredOutcome: "Customer Retention", function: "CRM", system: "Behavioral Churn Prevention Models", outcome: "-15% Attrition"},
    {  adaptability: "Insurance", desiredOutcome: "Key Insights", function: "Product Analytics", system: "Behavioral Policy Usage Analytics", outcome: "+15% Product Optimization"},
    {  adaptability: "Insurance", desiredOutcome: "Decreasing Costs", function: "Process Analytics", system: "Behavioral Claims Flow Analytics", outcome: "-20% Processing Inefficiencies"}];

  /** ---- State ---- **/
  const [adaptabilityIndex, setAdaptabilityIndex] = useState(0);
  const [entryIndex, setEntryIndex] = useState(0);

  /** ---- Unique list of industries ---- **/
  const industries = useMemo(
    () => Array.from(new Set(wordGroups.map(w => w.adaptability))),
    [wordGroups]
  );
  const currentIndustry = industries[adaptabilityIndex];

  /** ---- All entries for selected industry ---- **/
  const entriesForIndustry = useMemo(
    () => wordGroups.filter(w => w.adaptability === currentIndustry),
    [currentIndustry, wordGroups]
  );

  const currentEntry = entriesForIndustry[entryIndex % entriesForIndustry.length];

  /** ---- Industry to icon mapping ---- **/
  const industryIconMap = useMemo(() => ({
    Telecom: 'network_nodes',
    Banking: 'value_growth',
    'Consumer Goods': 'target',
    Transportation: 'refresh',
    Insurance: 'settings'
  }), []);

  /** ---- Auto-rotate entries ---- **/
  useEffect(() => {
    setEntryIndex(0); // reset when industry changes
  }, [currentIndustry]);

  useEffect(() => {
    const timer = setInterval(() => {
      setEntryIndex(prev => (prev + 1) % entriesForIndustry.length);
    }, 10000); // change every 4s
    return () => clearInterval(timer);
  }, [entriesForIndustry.length]);

  /** ---- Handlers ---- **/
  const handlePrevAdaptability = () => {
    setAdaptabilityIndex(prev => (prev - 1 + industries.length) % industries.length);
  };
  const handleNextAdaptability = () => {
    setAdaptabilityIndex(prev => (prev + 1) % industries.length);
  };

  return (
    <section id="services" className="py-20 lg:py-10 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-16 lg:mb-2">
          <h2 className="font-space-grotesk font-bold text-3xl lg:text-5xl text-black mb-8">
            The BHVRL Approach
          </h2>
          <p className="text-lg lg:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            We don’t offer a set menu of services, we build outcome-focused systems using behavioural engines — designed to move the needle.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-center lg:gap-8">
          {/* Industry carousel and title */}
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-center mb-16 lg:mb-0 lg:gap-6">
            <h3 className="font-space-grotesk font-semibold text-xl lg:text-2xl text-gray-800 lg:mb-0">
              Industry
            </h3>
            <div className="flex items-center justify-center">
              <button onClick={handlePrevAdaptability} className="p-2 bg-gray-200 rounded-full hover:bg-gray-300">
                <ChevronLeft size={24} />
              </button>
              <div className="mx-4 text-xl lg:text-2xl font-semibold text-gray-800 w-48 text-center">
                {currentIndustry}
              </div>
              <button onClick={handleNextAdaptability} className="p-2 bg-gray-200 rounded-full hover:bg-gray-300">
                <ChevronRight size={24} />
              </button>
            </div>
          </div>

          {/* Industry icon for current adaptability */}
          <div className="flex items-center justify-center">
            <ParticleIcon
              type={industryIconMap[currentIndustry as keyof typeof industryIconMap] as any}
              size={120}
              color="#4DAAE9"
            />
          </div>
        </div>

        {/* Dynamic info rows with fading */}
        {currentEntry && (
          <div className="space-y-10 mt-4">
            {/* Outcome */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 lg:gap-60">
              <div className="lg:w-1/2">
                <h3 className="font-space-grotesk font-bold text-2xl lg:text-3xl text-black mb-2">
                  Outcome-Based Solutioning
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Every system is designed to a desired impact
                </p>
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${entryIndex}-outcome`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 2.2 }}
                  className="lg:w-1/2 text-xl lg:text-2xl font-light text-gray-800 text-center"
                >
                  {currentEntry.function} — {currentEntry.desiredOutcome}
                </motion.div>
              </AnimatePresence>
            </div>
            {/* Function + Desired Outcome */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 lg:gap-60">
              <div className="lg:w-1/2">
                <h3 className="font-space-grotesk font-bold text-2xl lg:text-3xl text-black mb-2">
                  Infinite Possibilities
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Our behavioural engines flex across industries, markets, and challenges
                </p>
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${entryIndex}-function`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 2.2 }}
                  className="lg:w-1/2 text-xl lg:text-2xl font-light text-gray-800 text-center"
                >
                  {currentEntry.system}
                </motion.div>
              </AnimatePresence>
            </div>
            {/* System */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 lg:gap-60">
              <div className="lg:w-1/2">
                <h3 className="font-space-grotesk font-bold text-2xl lg:text-3xl text-black mb-2">
                  Living Systems, Not Projects
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  We build evolving architectures that deliver sustained impact across defined KPI's
                </p>
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${entryIndex}-system`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 2.2 }}
                  className="lg:w-1/2 text-xl lg:text-2xl font-light text-gray-800 text-center"
                >
                  {currentEntry.outcome}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};