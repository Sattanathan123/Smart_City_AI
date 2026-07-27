import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { translateWithGemini } from "./geminiTranslate";

export type Language = "en" | "ta" | "hi";

export interface Translations {
  appName: string;
  commandCenterOS: string;
  english: string;
  tamil: string;
  hindi: string;
  signIn: string;
  signOut: string;
  searchPlaceholder: string;
  selectLanguage: string;
  notifications: string;

  officerWorkspace: string;
  departmentDashboard: string;
  projectProposals: string;
  aiDecisionSupport: string;
  commandAndControl: string;
  municipalCommandCenter: string;
  gisSpatialMap: string;
  conflictHeatmap: string;
  executionAndResources: string;
  resourceOptimization: string;
  securityAndAudit: string;
  systemAuditLogs: string;
  citizenPortal: string;

  municipalOperationsOverview: string;
  executiveGovernanceCommand: string;
  exportExcel: string;
  printPdf: string;
  totalProjects: string;
  activeWorks: string;
  highPriority: string;
  conflictAlerts: string;
  pendingSanctions: string;
  budgetUtilization: string;
  pendingSanctionsClearance: string;
  approveSanction: string;
  rejectSanction: string;
  sanctionRemarkPlaceholder: string;

  aiDecisionSupportInsights: string;
  suggestedIntervention: string;
  reviewIntervention: string;
  criticalRisk: string;
  highRisk: string;
  mediumRisk: string;

  interDeptPerformance: string;
  activeDivisions: string;
  completionScore: string;

  citizenServiceIntake: string;
  submitGrievance: string;
  trackComplaint: string;
  viewPublicProjects: string;
  emergencyHelpline: string;
  projectClosed: string;

  sanctioned: string;
  active: string;
  pendingApproval: string;
  draft: string;
  completed: string;
  rejected: string;
}

// Fallback dictionary for instant UI response
const DICTIONARY: Record<string, { ta: string; hi: string }> = {
  "Intelligent Smart City Infrastructure & Governance Platform": {
    ta: "புத்திசாலி ஸ்மார்ட் நகர உள்கட்டமைப்பு மற்றும் ஆளுமை தளம்",
    hi: "बुद्धिमान स्मार्ट सिटी अवसंरचना और शासन मंच",
  },
  "Empowering Urban Governance through AI-Based Predictive Analytics & Inter-Departmental Data Interoperability": {
    ta: "செயற்கை நுண்ணறிவு கணிப்பு மற்றும் துறைசார் தரவு பரிமாற்றம் மூலம் நகர ஆளுமையை மேம்படுத்துதல்",
    hi: "AI-आधारित पूर्वानुमान और अंतर-विभागीय डेटा इंटरऑपरेबिलिटी के माध्यम से शहरी शासन को सशक्त बनाना",
  },
  "Sign In to Access System": {
    ta: "அமைப்பை அணுக உள்நுழையவும்",
    hi: "सिस्टम तक पहुँचने के लिए साइन इन करें",
  },
  "Sign In / Login": {
    ta: "உள்நுழைவு / உள்நுழைக",
    hi: "साइन इन / लॉगिन",
  },
  "Municipal Infrastructure Command System": {
    ta: "நகராட்சி உள்கட்டமைப்பு கட்டளை அமைப்பு",
    hi: "नगर निगम अवसंरचना कमान प्रणाली",
  },
  "Home": { ta: "முகப்பு", hi: "मुख्य पृष्ठ" },
  "Services": { ta: "சேவைகள்", hi: "सेवाएं" },
  "Public Directory": { ta: "பொது கோப்பகம்", hi: "सार्वजनिक निर्देशिका" },
  "Contact": { ta: "தொடர்பு கொள்ள", hi: "संपर्क" },
  "System Impact": { ta: "அமைப்பின் தாக்கம்", hi: "சிஸ்டம் ప్రభావம்" },
  "Operational Impact Metrics": { ta: "செயல்பாட்டு தாக்க அளவீடுகள்", hi: "परिचालन प्रभाव मेट्रिक्स" },
  "Projects Managed": { ta: "மேலாண்மை செய்யப்பட்ட திட்டங்கள்", hi: "प्रबंधित परियोजनाएं" },
  "Government Departments": { ta: "அரசு துறைகள்", hi: "सरकारी विभाग" },
  "Citizens Served": { ta: "சேவையாற்றப்பட்ட குடிமக்கள்", hi: "सेवा प्राप्त नागरिक" },
  "Conflict Prevention Rate": { ta: "மோதல் தடுப்பு விகிதம்", hi: "टकराव रोकथाम दर" },
  "Conflicts Prevented": { ta: "தடுக்கப்பட்ட மோதல்கள்", hi: "रोके गए टकराव" },
  "Faster Execution": { ta: "வேகமான செயலாக்கம்", hi: "तेज़ कार्यान्वयन" },
  "Citizen & Department Services": { ta: "குடிமக்கள் மற்றும் துறை சேவைகள்", hi: "नागरिक और विभाग सेवाएं" },
  "Submit Grievance": { ta: "புகார் சமர்ப்பிக்கவும்", hi: "शिकायत दर्ज करें" },
  "Track Complaint": { ta: "புகாரைக் கண்காணிக்கவும்", hi: "शिकायत ट्रैक करें" },
  "View Public Projects": { ta: "பொது திட்டங்களைப் பார்க்கவும்", hi: "सार्वजनिक परियोजनाएं देखें" },
  "Infrastructure Proposals": { ta: "உள்கட்டமைப்பு முன்மொழிவுகள்", hi: "अवसंरचना प्रस्ताव" },
  "Emergency Helpline Portal": { ta: "அவசர உதவி மையம்", hi: "आपातकालीन हेल्पलाइन पोर्टल" },
  "Download Reports": { ta: "அறிக்கைகளை பதிவிறக்கவும்", hi: "रिपोर्ट डाउनलोड करें" },
  "Recent Infrastructure Works Directory": { ta: "சமீபத்திய உள்கட்டமைப்பு பணிகள் கோப்பகம்", hi: "हालिया अवसंरचना कार्य निर्देशिका" },
  "Login to View Directory": { ta: "கோப்பகத்தைப் பார்க்க உள்நுழையவும்", hi: "निर्देशिका देखने के लिए लॉगिन करें" },
  "Project Ref ID": { ta: "திட்ட குறிப்பு எண்", hi: "परियोजना संदर्भ आईडी" },
  "Infrastructure Work Title": { ta: "உள்கட்டமைப்பு பணி தலைப்பு", hi: "अवसंरचना कार्य का शीर्षक" },
  "Department Division": { ta: "துறை பிரிவு", hi: "विभाग प्रभाग" },
  "Status": { ta: "நிலை", hi: "स्थिति" },
  "Priority": { ta: "முன்னுரிமை", hi: "प्राथमिकता" },
  "Timeline": { ta: "காலக்கெடு", hi: "समय सीमा" },
  "Municipal Operations Overview": { ta: "நகராட்சி செயல்பாடுகள் மேலோட்டம்", hi: "नगर निगम संचालन का अवलोकन" },
  "Executive Governance Command": { ta: "நிர்வாக ஆளுமை கட்டளை", hi: "कार्यकारी शासन कमान" },
  "Export Excel CSV": { ta: "எக்செல் பதிவிறக்கம்", hi: "एक्सेल सीएसवी डाउनलोड" },
  "Print / PDF Executive Report": { ta: "அச்சிடு / PDF அறிக்கை", hi: "प्रिंट / पीडीएफ रिपोर्ट" },
  "Total Projects": { ta: "மொத்த திட்டங்கள்", hi: "कुल परियोजनाएं" },
  "Active Works": { ta: "செயலில் உள்ள பணிகள்", hi: "सक्रिय कार्य" },
  "High Priority": { ta: "உயர் முன்னுரிமை", hi: "उच्च प्राथमिकता" },
  "Conflict Alerts": { ta: "மோதல் எச்சரிக்கைகள்", hi: "टकराव चेतावनियां" },
  "Pending Sanctions": { ta: "நிறுத்தி வைக்கப்பட்டுள்ள ஒப்புதல்கள்", hi: "लंबित स्वीकृतियां" },
  "Budget Utilization": { ta: "பட்ஜெட் பயன்பாடு", hi: "बजट उपयोग" },
  "Pending Project Sanctions Clearance": { ta: "நிலுவையில் உள்ள திட்ட அனுமதி ஒப்புதல்கள்", hi: "लंबित परियोजना स्वीकृति क्लीयरेंस" },
  "Approve Sanction": { ta: "அனுமதி வழங்கு", hi: "स्वीकृति दें" },
  "Reject": { ta: "நிராகரி", hi: "अस्वीकार करें" },
  "Enter sanction remark...": { ta: "அனுமதி குறிப்பை உள்ளிடவும்...", hi: "स्वीकृति टिप्पणी दर्ज करें..." },
  "AI Decision Support Insights": { ta: "AI முடிவு ஆதரவு நுண்ணறிவுகள்", hi: "AI निर्णय सहायता अंतर्दृष्टि" },
  "Inter-Department Performance Overview": { ta: "துறை இடைப்பட்ட செயல்திறன் மேலோட்டம்", hi: "अंतर-विभागीय प्रदर्शन अवलोकन" },
  "Recent Municipal Activity Log": { ta: "சமீபத்திய நகராட்சி செயல்பாட்டு பதிவு", hi: "हालिया नगर निगम गतिविधि लॉग" },
  "Department Officer Dashboard": { ta: "துறை அதிகாரி டாஷ்போர்டு", hi: "विभाग अधिकारी डैशबोर्ड" },
  "Project Registration & Sanction Submission Workspace": { ta: "திட்ட பதிவு மற்றும் அனுமதி சமர்ப்பிப்பு பணி இடம்", hi: "परियोजना पंजीकरण और स्वीकृति कार्यक्षेत्र" },
  "Register New Project": { ta: "புதிய திட்டத்தைப் பதிவு செய்", hi: "नई परियोजना पंजीकृत करें" },
  "Submit for Sanction Approval": { ta: "அனுமதி ஒப்புதலுக்கு சமர்ப்பிக்கவும்", hi: "स्वीकृति के लिए जमा करें" },
  "Awaiting Admin Approval": { ta: "நிர்வாகி ஒப்புதலுக்கு காத்திருக்கிறது", hi: "प्रशासक की स्वीकृति की प्रतीक्षा है" },
  "Sanctioned": { ta: "ஒப்புதல் அளிக்கப்பட்டது", hi: "स्वीकृत" },
};

const translations: Record<Language, Translations> = {
  en: {
    appName: "URBAN PULSE",
    commandCenterOS: "Smart Infrastructure Governance OS",
    english: "English",
    tamil: "தமிழ்",
    hindi: "हिंदी",
    signIn: "Sign In / Login",
    signOut: "Sign Out",
    searchPlaceholder: "Search projects or complaints...",
    selectLanguage: "Select Language",
    notifications: "System Notifications",

    officerWorkspace: "Officer Workspace",
    departmentDashboard: "Department Dashboard",
    projectProposals: "Project Proposals",
    aiDecisionSupport: "AI Decision Support",
    commandAndControl: "Command & Control",
    municipalCommandCenter: "Municipal Command Center",
    gisSpatialMap: "GIS Spatial Map",
    conflictHeatmap: "Spatial Conflict Heatmap",
    executionAndResources: "Execution & Resources",
    resourceOptimization: "Resource Optimization",
    securityAndAudit: "Security & Audit",
    systemAuditLogs: "System Audit Logs",
    citizenPortal: "Citizen Portal",

    municipalOperationsOverview: "Municipal Operations Overview",
    executiveGovernanceCommand: "Executive Governance Command",
    exportExcel: "Export Excel CSV",
    printPdf: "Print / PDF Executive Report",
    totalProjects: "Total Projects",
    activeWorks: "Active Works",
    highPriority: "High Priority",
    conflictAlerts: "Conflict Alerts",
    pendingSanctions: "Pending Sanctions",
    budgetUtilization: "Budget Utilization",
    pendingSanctionsClearance: "Pending Project Sanctions Clearance",
    approveSanction: "Approve Sanction",
    rejectSanction: "Reject",
    sanctionRemarkPlaceholder: "Enter sanction remark...",

    aiDecisionSupportInsights: "AI Decision Support Insights",
    suggestedIntervention: "Suggested Intervention",
    reviewIntervention: "Review Intervention",
    criticalRisk: "CRITICAL RISK",
    highRisk: "HIGH RISK",
    mediumRisk: "MEDIUM RISK",

    interDeptPerformance: "Inter-Department Performance Overview",
    activeDivisions: "Active Municipal Divisions",
    completionScore: "Completion Score",

    citizenServiceIntake: "Citizen Service Intake & Grievances",
    submitGrievance: "Submit Grievance",
    trackComplaint: "Track Complaint",
    viewPublicProjects: "View Public Projects",
    emergencyHelpline: "Emergency Helpline Portal",
    projectClosed: "Project Closed",

    sanctioned: "SANCTIONED",
    active: "ACTIVE",
    pendingApproval: "PENDING APPROVAL",
    draft: "DRAFT",
    completed: "COMPLETED",
    rejected: "REJECTED",
  },
  ta: {
    appName: "அர்பன் பல்ஸ்",
    commandCenterOS: "ஸ்மார்ட் நகர்ப்புற ஆட்சி அமைப்பு",
    english: "English",
    tamil: "தமிழ்",
    hindi: "हिंदी",
    signIn: "உள்நுழைவு / உள்நுழைக",
    signOut: "வெளியேறு",
    searchPlaceholder: "திட்டங்கள் அல்லது புகார்களைத் தேடுங்கள்...",
    selectLanguage: "மொழியைத் தேர்ந்தெடுக்கவும்",
    notifications: "அமைப்பின் அறிவிப்புகள்",

    officerWorkspace: "அதிகாரி பணி இடம்",
    departmentDashboard: "துறை முகப்பு பலகை",
    projectProposals: "திட்ட யோசனைகள்",
    aiDecisionSupport: "AI முடிவு ஆதரவு",
    commandAndControl: "கட்டளை மற்றும் கட்டுப்பாடு",
    municipalCommandCenter: "நகராட்சி கட்டளை மையம்",
    gisSpatialMap: "GIS நிலப்பரப்பு வரைபடம்",
    conflictHeatmap: "இடஞ்சார்ந்த மோதல் வரைபடம்",
    executionAndResources: "செயலாக்கம் மற்றும் வளங்கள்",
    resourceOptimization: "வள உகப்பாக்கம்",
    securityAndAudit: "பாதுகாப்பு மற்றும் தணிக்கை",
    systemAuditLogs: "அமைப்பு தணிக்கைப் பதிவுகள்",
    citizenPortal: "குடிமக்கள் போர்டல்",

    municipalOperationsOverview: "நகராட்சி செயல்பாடுகள் மேலோட்டம்",
    executiveGovernanceCommand: "நிர்வாக ஆளுமை கட்டளை",
    exportExcel: "எக்செல் பதிவிறக்கம்",
    printPdf: "அச்சிடு / PDF அறிக்கை",
    totalProjects: "மொத்த திட்டங்கள்",
    activeWorks: "செயலில் உள்ள பணிகள்",
    highPriority: "உயர் முன்னுரிமை",
    conflictAlerts: "மோதல் எச்சரிக்கைகள்",
    pendingSanctions: "நிறுத்தி வைக்கப்பட்டுள்ள ஒப்புதல்கள்",
    budgetUtilization: "பட்ஜெட் பயன்பாடு",
    pendingSanctionsClearance: "நிலுவையில் உள்ள திட்ட அனுமதி ஒப்புதல்கள்",
    approveSanction: "அனுமதி வழங்கு",
    rejectSanction: "நிராகரி",
    sanctionRemarkPlaceholder: "அனுமதி குறிப்பை உள்ளிடவும்...",

    aiDecisionSupportInsights: "AI முடிவு ஆதரவு நுண்ணறிவுகள்",
    suggestedIntervention: "பரிந்துரைக்கப்பட்ட நடவடிக்கை",
    reviewIntervention: "நடவடிக்கையை மதிப்பாய்வு செய்",
    criticalRisk: "மிகவும் அவசர அபாயம்",
    highRisk: "உயர் அபாயம்",
    mediumRisk: "நடுத்தர அபாயம்",

    interDeptPerformance: "துறை இடைப்பட்ட செயல்திறன் மேலோட்டம்",
    activeDivisions: "செயலில் உள்ள நகராட்சி பிரிவுகள்",
    completionScore: "நிறைவு மதிப்பெண்",

    citizenServiceIntake: "குடிமக்கள் சேவை மற்றும் புகார்கள்",
    submitGrievance: "புகார் சமர்ப்பிக்கவும்",
    trackComplaint: "புகாரைக் கண்காணிக்கவும்",
    viewPublicProjects: "பொது திட்டங்களைப் பார்க்கவும்",
    emergencyHelpline: "அவசர உதவி மையம்",
    projectClosed: "திட்டம் நிறைவடைந்தது",

    sanctioned: "ஒப்புதல் அளிக்கப்பட்டது",
    active: "செயலில் உள்ளது",
    pendingApproval: "ஒப்புதலுக்கு நிலுவையில் உள்ளது",
    draft: "வரைவு",
    completed: "நிறைவடைந்தது",
    rejected: "நிராகரிக்கப்பட்டது",
  },
  hi: {
    appName: "अर्बन पल्स",
    commandCenterOS: "स्मार्ट इंफ्रास्ट्रक्चर गवर्नेंस प्लेटफॉर्म",
    english: "English",
    tamil: "தமிழ்",
    hindi: "हिंदी",
    signIn: "साइन इन / लॉगिन",
    signOut: "साइन आउट",
    searchPlaceholder: "परियोजनाएं या शिकायतें खोजें...",
    selectLanguage: "भाषा चुनें",
    notifications: "सिस्टम सूचनाएं",

    officerWorkspace: "अधिकारी कार्यक्षेत्र",
    departmentDashboard: "विभाग डैशबोर्ड",
    projectProposals: "परियोजना प्रस्ताव",
    aiDecisionSupport: "AI निर्णय सहायता",
    commandAndControl: "कमांड और नियंत्रण",
    municipalCommandCenter: "नगर निगम कमांड सेंटर",
    gisSpatialMap: "GIS स्थानिक मानचित्र",
    conflictHeatmap: "स्थानिक टकराव हीटमैप",
    executionAndResources: "कार्यान्वयन और संसाधन",
    resourceOptimization: "संसाधन अनुकूलन",
    securityAndAudit: "सुरक्षा एवं ऑडिट",
    systemAuditLogs: "सिस्टम ऑडिट लॉग",
    citizenPortal: "नागरिक पोर्टल",

    municipalOperationsOverview: "नगर निगम संचालन अवलोकन",
    executiveGovernanceCommand: "कार्यकारी शासन कमान",
    exportExcel: "एक्सेल डाउनलोड करें",
    printPdf: "प्रिंट / PDF रिपोर्ट",
    totalProjects: "कुल परियोजनाएं",
    activeWorks: "सक्रिय कार्य",
    highPriority: "उच्च प्राथमिकता",
    conflictAlerts: "टकराव चेतावनियां",
    pendingSanctions: "लंबित स्वीकृतियां",
    budgetUtilization: "बजट उपयोग",
    pendingSanctionsClearance: "लंबित परियोजना स्वीकृति क्लीयरेंस",
    approveSanction: "स्वीकृति दें",
    rejectSanction: "अस्वीकार करें",
    sanctionRemarkPlaceholder: "स्वीकृति टिप्पणी दर्ज करें...",

    aiDecisionSupportInsights: "AI निर्णय सहायता अंतर्दृष्टि",
    suggestedIntervention: "सुझाया गया हस्तक्षेप",
    reviewIntervention: "हस्तक्षेप की समीक्षा करें",
    criticalRisk: "गंभीर जोखिम",
    highRisk: "उच्च जोखिम",
    mediumRisk: "मध्यम जोखिम",

    interDeptPerformance: "अंतर-विभागीय प्रदर्शन अवलोकन",
    activeDivisions: "सक्रिय नगरपालिका प्रभाग",
    completionScore: "पूरा होने का स्कोर",

    citizenServiceIntake: "नागरिक सेवा एवं शिकायतें",
    submitGrievance: "शिकायत दर्ज करें",
    trackComplaint: "शिकायत ट्रैक करें",
    viewPublicProjects: "सार्वजनिक परियोजनाएं देखें",
    emergencyHelpline: "आपातकालीन हेल्पलाइन पोर्टल",
    projectClosed: "परियोजना बंद की गई",

    sanctioned: "स्वीकृत",
    active: "सक्रिय",
    pendingApproval: "स्वीकृति हेतु लंबित",
    draft: "प्रारूप",
    completed: "पूर्ण",
    rejected: "अस्वीकृत",
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  tText: (text: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Memory cache for Gemini translations so we don't re-query Gemini for identical strings
const geminiCache: Record<string, string> = {};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      const saved = localStorage.getItem("app_language") as Language;
      if (saved && (saved === "en" || saved === "ta" || saved === "hi")) {
        return saved;
      }
    }
    return "en";
  });

  const [asyncTranslations, setAsyncTranslations] = useState<Record<string, string>>({});

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      localStorage.setItem("app_language", lang);
    }
  };

  /**
   * Gemini AI Powered Translation Engine
   * Defaults to Gemini AI for all dynamic texts, with fallback to dictionary.
   */
  const tText = (text: string): string => {
    if (!text || language === "en") return text;

    const cacheKey = `${language}:${text}`;

    // 1. Static Dictionary Check
    const staticMatch = DICTIONARY[text]?.[language];
    if (staticMatch) return staticMatch;

    // 2. Gemini AI Cached Result Check
    if (asyncTranslations[cacheKey]) {
      return asyncTranslations[cacheKey];
    }

    // 3. Trigger Gemini AI Translation in Background
    if (!geminiCache[cacheKey]) {
      geminiCache[cacheKey] = text; // mark pending
      translateWithGemini(text, language).then((translated) => {
        if (translated && translated !== text) {
          setAsyncTranslations((prev) => ({
            ...prev,
            [cacheKey]: translated,
          }));
        }
      });
    }

    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language], tText }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { language, setLanguage } = useLanguage();

  return (
    <div className={`flex items-center gap-1 bg-[#F8FAFC] border border-[#E5E7EB] rounded-md p-1 ${className}`}>
      <button
        onClick={() => setLanguage("en")}
        className={`px-2.5 py-1 text-xs font-bold rounded transition-all cursor-pointer ${
          language === "en"
            ? "bg-[#1E3A8A] text-white shadow-xs"
            : "text-slate-700 hover:bg-[#E2E8F0] hover:text-[#111827]"
        }`}
        title="Switch to English"
      >
        🇬🇧 EN
      </button>
      <button
        onClick={() => setLanguage("ta")}
        className={`px-2.5 py-1 text-xs font-bold rounded transition-all cursor-pointer ${
          language === "ta"
            ? "bg-[#1E3A8A] text-white shadow-xs"
            : "text-slate-700 hover:bg-[#E2E8F0] hover:text-[#111827]"
        }`}
        title="தமிழ் மொழிக்கு மாறுங்கள்"
      >
        🇮🇳 தமிழ்
      </button>
      <button
        onClick={() => setLanguage("hi")}
        className={`px-2.5 py-1 text-xs font-bold rounded transition-all cursor-pointer ${
          language === "hi"
            ? "bg-[#1E3A8A] text-white shadow-xs"
            : "text-slate-700 hover:bg-[#E2E8F0] hover:text-[#111827]"
        }`}
        title="हिंदी भाषा पर जाएं"
      >
        🇮🇳 हिंदी
      </button>
    </div>
  );
}
