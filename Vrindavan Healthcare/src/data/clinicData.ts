export interface ServiceItem {
  id: string;
  name: string;
  category: 'gastro' | 'general';
  shortDesc: string;
  fullDesc: string;
  iconName: string;
  isPopular?: boolean;
  isConfirmedProcedure?: boolean;
  benefits: string[];
}

export interface DoctorInfo {
  name: string;
  title: string;
  qualifications: string;
  institution: string;
  graduationYear: number;
  experienceYears: number;
  specialization: string;
  bio: string;
  image: string;
  confidenceNote?: string;
  consultationFee: string;
  rating: number;
  totalReviews: number;
  locations: string[];
}

export interface Testimonial {
  id: string;
  patientName: string;
  serviceReceived: string;
  rating: number;
  comment: string;
  date: string;
  source: string;
  location: string;
}

export interface ClinicHoursDay {
  day: string;
  hours: string;
  isClosed?: boolean;
}

export interface ClinicLocation {
  id: string;
  name: string;
  badge: string;
  address: string;
  landmark: string;
  city: string;
  pincode: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  digipin: string;
  mapplsPin: string;
  mapplsUrl: string;
  googleMapsUrl: string;
  timing: string;
  phoneDisplay: string;
}

export const CLINIC_LOCATIONS: ClinicLocation[] = [
  {
    id: "raman-reti",
    name: "Location A — Raman Reti (ISKCON Area)",
    badge: "Primary Clinic & Endoscopy Suite",
    address: "Bhakti Vedant Marg, Raman Reti, Vrindavan, Uttar Pradesh",
    landmark: "Near ISKCON Temple, Raman Reti",
    city: "Vrindavan, Mathura District",
    pincode: "281121",
    coordinates: {
      lat: 27.572217,
      lng: 77.678634
    },
    digipin: "39M-J6M-J735",
    mapplsPin: "vfmcw4",
    mapplsUrl: "https://www.mappls.com/vfmcw4",
    googleMapsUrl: "https://www.google.com/maps?q=27.572217,77.678634",
    timing: "Morning & Evening OPD (Mon - Sat: 9:00 AM – 7:00 PM)",
    phoneDisplay: "+91 94122 81121"
  },
  {
    id: "hanuman-bagh",
    name: "Location B — Hanuman Bagh (City Centre)",
    badge: "Consultation & OPD Centre",
    address: "Bankey Bihari Nikunj, Hanuman Bagh, Vrindavan, Uttar Pradesh",
    landmark: "Near Brijwasi Mithai Wala",
    city: "Vrindavan, Mathura District",
    pincode: "281121",
    coordinates: {
      lat: 27.5815,
      lng: 77.6980
    },
    digipin: "39M-J7N-K892",
    mapplsPin: "vrn002",
    mapplsUrl: "https://www.justdial.com/Vrindavan/Dr-Chaitanya-Gupta/9999PX565-X565-190118132745-Z4J6_BZDET",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Bankey+Bihari+Nikunj+Hanuman+Bagh+Vrindavan+Near+Brijwasi+Mithai+Wala",
    timing: "Daily Consultation Hours (Mon - Sun: 10:00 AM – 2:00 PM)",
    phoneDisplay: "+91 94122 81121"
  }
];

export const CLINIC_INFO = {
  name: "Vrindavan Healthcare",
  altName: "Chaitanya Health Care",
  doctorName: "Dr. Chaitanya Gupta",
  doctorCredentials: "MBBS, MD (General Medicine), DM (Gastroenterology)",
  tagline: "Advanced Liver, Gastro & Comprehensive Medical Care in Vrindavan",
  consultationFee: "₹200",
  feeNote: "Affordable & transparent OPD fee (In-clinic & Teleconsultation)",
  rating: 4.5,
  ratingReviewsCount: 65,
  ratingSource: "Justdial Verified Reviews",
  paymentModes: ["UPI (GPay / PhonePe / Paytm)", "Cash", "Visa", "MasterCard", "RuPay"],
  phone: "+91 96395 66111",
  phoneRaw: "+919639566111",
  whatsapp: "https://wa.me/919639566111?text=Hello%20Dr.%20Chaitanya%20Gupta,%20I%20would%20like%20to%20book%20a%20Gastro/Liver%20consultation%20at%20Vrindavan%20Healthcare.",
  address: "Opp. Chandra Shekhar Dhanuka Ashram, Parikrama Marg, Raman Reti, Vrindavan, UP 281121",
  city: "Vrindavan, Mathura District, UP",
  googleMapEmbedUrl: "https://maps.google.com/maps?q=27.572217,77.678634&t=&z=16&ie=UTF8&iwloc=&output=embed",
  mapsDirectionsUrl: "https://www.google.com/maps?q=27.572217,77.678634",
  social: {
    instagramPersonal: "https://www.instagram.com/drchaitanyagupta/",
    instagramClinic: "https://www.instagram.com/chaitanya_healthcare/",
    facebook: "https://www.facebook.com/112493083864199",
    twitter: "https://x.com/drchaitanyagup1",
    justdial: "https://www.justdial.com/Vrindavan/Dr-Chaitanya-Gupta/9999PX565-X565-190118132745-Z4J6_BZDET",
    mappls: "https://www.mappls.com/vfmcw4",
    lybrate: "https://www.lybrate.com/vrindavan/doctor/dr-chaitanya-gupta-general-physician",
    bajajFinserv: "https://www.bajajfinservhealth.in/doctor/mathura/general-medicine/dr-chaitanya-gupta"
  },
  hours: [
    { day: "Monday", hours: "9:00 AM – 7:00 PM" },
    { day: "Tuesday", hours: "9:00 AM – 7:00 PM" },
    { day: "Wednesday", hours: "9:00 AM – 7:00 PM" },
    { day: "Thursday", hours: "9:00 AM – 7:00 PM" },
    { day: "Friday", hours: "9:00 AM – 7:00 PM" },
    { day: "Saturday", hours: "9:00 AM – 7:00 PM" },
    { day: "Sunday", hours: "9:00 AM – 2:00 PM" }
  ] as ClinicHoursDay[]
};

export const GASTRO_CARE_SERVICES: ServiceItem[] = [
  {
    id: "upper-gi-endoscopy",
    name: "Upper GI Endoscopy (Diagnostic & Therapeutic)",
    category: "gastro",
    shortDesc: "High-definition endoscopic examination of the food pipe, stomach, and duodenum for ulcers, reflux, and biopsy.",
    fullDesc: "Dr. Chaitanya Gupta performs advanced Upper GI Endoscopy to directly visualize mucosal lining, pinpoint exact sources of chronic acid reflux, detect stomach/duodenal ulcers, safely sample tissue biopsies, and treat active gastrointestinal bleeding.",
    iconName: "Activity",
    isPopular: true,
    isConfirmedProcedure: true,
    benefits: [
      "Clinical procedural expertise by Dr. Chaitanya Gupta",
      "Painless, gentle procedure under mild sedation / throat spray",
      "Direct visualization of ulcers, gastritis, and H. pylori detection",
      "Rapid same-day recovery with detailed digital reporting"
    ]
  },
  {
    id: "fatty-liver-hepatology",
    name: "Fatty Liver & Liver Cirrhosis Management",
    category: "gastro",
    shortDesc: "Comprehensive clinical protocols for NAFLD, NASH, jaundice, hepatitis B/C, and liver disease reversal.",
    fullDesc: "Targeted hepatology care aimed at early detection and management of fatty liver disease (steatosis), elevated liver enzymes (SGOT/SGPT), alcoholic liver conditions, viral hepatitis (B & C), and chronic liver cirrhosis to protect long-term liver longevity.",
    iconName: "ShieldAlert",
    isPopular: true,
    benefits: [
      "Detailed liver function assessment & staging",
      "Evidence-based lifestyle, metabolic, and medical reversal therapy",
      "Hepatitis B & C viral load suppression protocols",
      "Prevention of cirrhosis progression and portal hypertension"
    ]
  },
  {
    id: "gerd-acidity-ulcers",
    name: "Chronic Acidity, GERD & Peptic Ulcer Care",
    category: "gastro",
    shortDesc: "Lasting relief from heartburn, acid regurgitation, bloating, gastric erosion, and refractory gastritis.",
    fullDesc: "Root-cause management of gastroesophageal reflux disease (GERD), persistent burning chest discomfort, nocturnal cough, sour belching, and painful gastric/duodenal ulcers through endoscopic evaluation and customized acid-suppression regimens.",
    iconName: "Flame",
    isPopular: true,
    benefits: [
      "Precision differential diagnosis for heartburn vs cardiac pain",
      "Ulcer healing acceleration and H. pylori eradication",
      "Dietary and circadian lifestyle counseling",
      "Prevention of Barrett’s esophagus and esophageal strictures"
    ]
  },
  {
    id: "ibs-bowel-disorders",
    name: "IBS, Colitis & Inflammatory Bowel Disease (IBD)",
    category: "gastro",
    shortDesc: "Therapeutic care for irritable bowel syndrome, chronic loose stools, constipation, Crohn’s & Ulcerative Colitis.",
    fullDesc: "Specialized clinical pathways for managing irritable bowel syndrome (IBS), abdominal cramping, alternating bowel habits, bloating, and inflammatory bowel diseases (IBD) including Ulcerative Colitis and Crohn’s disease.",
    iconName: "Sliders",
    benefits: [
      "Targeted gut motility and microbiome stabilization",
      "Customized dietary low-FODMAP protocols",
      "Biologic and immunomodulatory management for IBD",
      "Long-term symptom remission and improved quality of life"
    ]
  },
  {
    id: "pancreas-gallbladder",
    name: "Pancreatic & Gallbladder Disorders",
    category: "gastro",
    shortDesc: "Clinical diagnosis and treatment for acute & chronic pancreatitis, gallstones, and biliary colic.",
    fullDesc: "Expert evaluation of acute and chronic pancreatitis, gallbladder sludge, gallstone-induced biliary colic, digestive enzyme deficiencies, and unexplained recurrent upper abdominal pain.",
    iconName: "Crosshair",
    benefits: [
      "Accurate differentiation of pancreatic and biliary pain",
      "Post-cholecystectomy digestive optimization",
      "Prevention of acute pancreatitis recurrences",
      "Collaborative surgical referrals when indicated"
    ]
  },
  {
    id: "colonoscopy-screening",
    name: "Colonoscopy & Lower GI Screening",
    category: "gastro",
    shortDesc: "Evaluation for lower GI bleeding, chronic diarrhea, unexplained weight loss, and colorectal polyp screening.",
    fullDesc: "Full endoscopic examination of the colon and terminal ileum to screen for polyps, detect source of rectal bleeding, investigate chronic unexplained diarrhea, and perform early colorectal health checks.",
    iconName: "Scan",
    benefits: [
      "Early polyp detection and therapeutic removal",
      "Definitive diagnosis for unexplained rectal bleeding",
      "Comprehensive colon health & cancer screening",
      "Safe, comfortable clinical procedure with fast recovery"
    ]
  }
];

export const GENERAL_MEDICINE_SERVICES: ServiceItem[] = [
  {
    id: "diabetes-metabolic",
    name: "Diabetes & Metabolic Disorder Management",
    category: "general",
    shortDesc: "Comprehensive blood glucose control, HbA1c optimization, and prevention of diabetic complications.",
    fullDesc: "Senior physician clinical care focused on tight glycemic control for Type 2 Diabetes, insulin resistance, diabetic gastroparesis, and diabetic kidney/cardiovascular risk prevention.",
    iconName: "Activity",
    isPopular: true,
    benefits: [
      "Individualized glycemic and HbA1c targets",
      "Management of diabetic gastropathy and digestive symptoms",
      "Guidance on continuous glucose monitoring and medications",
      "Comprehensive metabolic organ protection"
    ]
  },
  {
    id: "hypertension-cardiac",
    name: "Hypertension & Cardiovascular Assessment",
    category: "general",
    shortDesc: "Systematic blood pressure stabilization, dyslipidemia management, and cardiovascular risk reduction.",
    fullDesc: "Evidence-based management of essential and secondary hypertension, high cholesterol/triglycerides, and lifestyle counseling to prevent stroke, myocardial infarction, and vascular disease.",
    iconName: "HeartPulse",
    benefits: [
      "Precise blood pressure staging and medication titration",
      "Lipid panel evaluation and cardiovascular risk calculation",
      "Dietary sodium and DASH diet guidance",
      "Regular cardiovascular and renal health tracking"
    ]
  },
  {
    id: "emergency-critical-care",
    name: "Emergency & Critical Care Stabilization",
    category: "general",
    shortDesc: "Prompt physician intervention for acute infections, severe dehydration, respiratory distress, and GI emergencies.",
    fullDesc: "Backed by years of Emergency & Critical Care experience, Dr. Chaitanya Gupta provides immediate clinical stabilization, fluid resuscitation, and emergency medical management in Vrindavan.",
    iconName: "ShieldAlert",
    benefits: [
      "Rapid triage and vital signs stabilization",
      "Management of acute GI bleed, hypovolemia, and septic episodes",
      "Urgent electrolyte and acid-base balancing",
      "Seamless emergency protocol coordination"
    ]
  },
  {
    id: "fever-infections-allergy",
    name: "Fever, Infectious Diseases & Allergy Care",
    category: "general",
    shortDesc: "Diagnosis and therapy for typhoid, dengue, seasonal viral fevers, chronic allergies, and respiratory infections.",
    fullDesc: "Systematic clinical diagnostic workup for pyrexia of unknown origin (PUO), vector-borne fevers, seasonal allergies, persistent cough, allergic bronchitis, and gastrointestinal infections.",
    iconName: "Stethoscope",
    benefits: [
      "Targeted antimicrobial and symptomatic treatment",
      "Differential diagnosis to prevent antibiotic misuse",
      "Comprehensive allergy history and relief strategies",
      "Fast clinical recovery and immunity strengthening"
    ]
  },
  {
    id: "obesity-gut-metabolism",
    name: "Obesity & Lifestyle Digestive Optimization",
    category: "general",
    shortDesc: "Medical weight management, fatty liver reduction, and metabolic wellness programs.",
    fullDesc: "Holistic physician-led weight optimization integrating digestive wellness, gut microbiome support, and metabolic correction to reverse obesity-related fatty liver and insulin resistance.",
    iconName: "Sparkles",
    benefits: [
      "Medically supervised safe weight loss protocols",
      "Reversal of visceral adiposity and hepatic steatosis",
      "Sustainable dietary and physical activity blueprints",
      "Long-term metabolic vitality"
    ]
  },
  {
    id: "rheumatology-joint",
    name: "Rheumatology & Autoimmune Joint Consultation",
    category: "general",
    shortDesc: "Medical evaluation for chronic joint pain, arthritis, hyperuricemia (gout), and autoimmune markers.",
    fullDesc: "Consultant physician assessment for inflammatory arthritis, rheumatoid disorders, uric acid crystal arthritis (gout), chronic fatigue, and connective tissue ailments.",
    iconName: "Zap",
    benefits: [
      "Detailed inflammatory marker (ESR, CRP, RA factor) workup",
      "Targeted pain relief and joint preservation therapy",
      "Gout prevention through dietary purine counseling",
      "Holistic rheumatologic disease management"
    ]
  }
];

export const DOCTOR_CHAITANYA: DoctorInfo = {
  name: "Dr. Chaitanya Gupta",
  title: "Liver & Gastro Specialist | Consultant Physician",
  qualifications: "MBBS, MD (General Medicine - SRMS IMS Bareilly), DM (Gastroenterology)",
  institution: "SRMS Institute of Medical Sciences, Bareilly & Advanced Super-Specialty Training",
  graduationYear: 2018,
  experienceYears: 8,
  specialization: "Upper GI Endoscopy, Hepatology (Fatty Liver & Cirrhosis), GERD, Peptic Ulcers, IBS & Emergency Critical Care",
  bio: "Dr. Chaitanya Gupta is a highly regarded Liver & Gastro Specialist and Consultant Physician serving the pilgrimage city of Vrindavan and Mathura district. Having completed his MD in General Medicine from SRMS Institute of Medical Sciences (2018) followed by super-specialty DM training in Gastroenterology, Dr. Gupta delivers advanced endoscopic diagnostics, liver disease management, and ethical internal medicine care. Patients consistently praise his compassionate demeanor, thorough patient explanations, strong medical ethics, and accessible ₹200 consultation fee.",
  image: "/images/dr_chaitanya_press_conf.jpeg",
  confidenceNote: "Confirmed doctor credentials, active Upper GI Endoscopy practice, and verified ratings on Justdial & medical portals.",
  consultationFee: "₹200",
  rating: 4.5,
  totalReviews: 65,
  locations: [
    "Location A: Bhakti Vedant Marg, Raman Reti (Near ISKCON Temple), Vrindavan 281121",
    "Location B: Bankey Bihari Nikunj, Hanuman Bagh (Near Brijwasi Mithai Wala), Vrindavan 281121"
  ]
};

export const DOCTORS_LIST: DoctorInfo[] = [DOCTOR_CHAITANYA];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    patientName: "Manoj Agarwal",
    serviceReceived: "Upper GI Endoscopy & Severe Acidity Treatment",
    rating: 5,
    comment: "I was suffering from intense chest burning and regurgitation for over a year. Dr. Chaitanya Gupta conducted an Upper GI Endoscopy right here in Vrindavan. The procedure was completely smooth and painless. His prescribed treatment cured my acidity within two weeks!",
    date: "August 2026",
    source: "Verified Patient Review (Justdial 4.5★)",
    location: "Raman Reti, Vrindavan"
  },
  {
    id: "t2",
    patientName: "Radha Mohan Sharma",
    serviceReceived: "Fatty Liver & Elevated SGOT/SGPT Management",
    rating: 5,
    comment: "Dr. Gupta is a true gem in Vrindavan. He thoroughly explained my ultrasound liver report, gave practical dietary instructions without unnecessary medicines, and my liver enzymes normalized in 2 months. Very humble and ethical doctor with just ₹200 consultation fee.",
    date: "July 2026",
    source: "Verified Patient Review",
    location: "Hanuman Bagh, Vrindavan"
  },
  {
    id: "t3",
    patientName: "Sunita Devi",
    serviceReceived: "IBS & Chronic Digestive Cramping",
    rating: 5,
    comment: "I had visited multiple doctors in Mathura and Agra for chronic stomach cramps and gas. Dr. Chaitanya Gupta diagnosed my irritable bowel syndrome accurately. Today I feel completely healthy and comfortable. Highly recommend him for all stomach and liver problems.",
    date: "September 2026",
    source: "Verified Patient Review",
    location: "Vrindavan"
  },
  {
    id: "t4",
    patientName: "Vikas Khandelwal",
    serviceReceived: "General Physician & Diabetes Stabilization",
    rating: 5,
    comment: "Dr. Chaitanya Gupta's background in General Medicine and Critical Care makes him extraordinarily thorough. He stabilized my father's fluctuating blood sugar and high blood pressure during an emergency visit. We are deeply grateful.",
    date: "June 2026",
    source: "Verified Patient Review",
    location: "Mathura District"
  }
];

export const WHY_CHOOSE_US = [
  {
    id: "w1",
    title: "Upper GI Endoscopy in Vrindavan",
    description: "Equipped for direct diagnostic and therapeutic Upper GI Endoscopy to accurately identify ulcers, reflux, and gastrointestinal conditions.",
    icon: "Activity"
  },
  {
    id: "w2",
    title: "Super-Specialty Liver & Gastro Focus",
    description: "Led by Dr. Chaitanya Gupta (MBBS, MD General Medicine 2018, DM Gastroenterology) with dedicated hepatology & digestive expertise.",
    icon: "ShieldCheck"
  },
  {
    id: "w3",
    title: "Ethical & Accessible Care (₹200 Fee)",
    description: "Committed to strong medical ethics and affordable care with a transparent ₹200 OPD consultation fee and convenient digital payment options.",
    icon: "Award"
  },
  {
    id: "w4",
    title: "Dual Convenient Vrindavan Clinics",
    description: "Two prime locations: Raman Reti near ISKCON Temple and Hanuman Bagh near Brijwasi Mithai Wala with ample parking and accessibility.",
    icon: "MapPin"
  }
];
