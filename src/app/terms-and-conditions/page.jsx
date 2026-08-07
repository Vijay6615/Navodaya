"use client";

import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";

function PlusIcon({ open }) {
  return (
    <span
      className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-orange-100 bg-orange-50 text-[#6a3b20] transition-all duration-300 ${
        open ? "rotate-45 bg-orange-100" : ""
      }`}
      aria-hidden="true"
    >
      <span className="absolute h-[2px] w-4 rounded-full bg-current" />
      <span className="absolute h-4 w-[2px] rounded-full bg-current" />
    </span>
  );
}

export default function TermsAndConditionsPage() {
  const { language } = useLanguage();

  const isHindi = language === "hi";
  const [openIndex, setOpenIndex] = useState(null);

  const content = {
    en: {
      badge: "Please Read Carefully",
      title: "Terms & Conditions",
      subtitle:
        "These Terms & Conditions explain the rules that apply when you use Puja Dham, browse Puja services, create bookings, make payments, or use other features available on our website.",

      updated: "Last Updated: August 2026",

      sections: [
        {
          title: "1. Acceptance of Terms",
          paragraphs: [
            "By accessing or using Puja Dham, you agree to follow these Terms & Conditions.",
            "If you do not agree with these terms, you should not use the website, booking services, account features, or other services provided through Puja Dham.",
          ],
        },

        {
          title: "2. About Puja Dham",
          paragraphs: [
            "Puja Dham is a digital platform that helps devotees explore and book Vedic Puja services, access devotional information, connect with Pandit Ji, and use other religious services made available through the website.",
            "The availability of a particular Puja, Pandit Ji, location, package, timing, or service may vary.",
          ],
        },

        {
          title: "3. Eligibility to Use the Website",
          paragraphs: [
            "You should provide accurate information while using Puja Dham.",
            "If you are using the website on behalf of another person, family member, organization, or group, you should have the authority or permission to provide the required booking information.",
          ],
        },

        {
          title: "4. Account Information",
          paragraphs: [
            "Some features of Puja Dham may require an account or login.",
            "You are responsible for maintaining the confidentiality of your login credentials and for activities performed through your account.",
            "You should notify Puja Dham if you believe your account has been accessed or used without permission.",
          ],
        },

        {
          title: "5. Puja Bookings",
          paragraphs: [
            "When booking a Puja, you must provide accurate information including your name, contact details, location, preferred Puja date, selected package, and any other required details.",
            "A booking request does not always guarantee final confirmation until availability, payment status, Pandit Ji availability, location, and other required conditions are verified.",
          ],
        },

        {
          title: "6. Booking Confirmation",
          paragraphs: [
            "A booking may be considered confirmed only after the required booking process has been completed and confirmation has been communicated through the website, phone, email, message, or another official Puja Dham communication channel.",
            "Puja Dham may contact the customer if additional information is required to complete or confirm the booking.",
          ],
        },

        {
          title: "7. Puja Packages",
          paragraphs: [
            "Different Puja services may have different packages, inclusions, prices, durations, and requirements.",
            "Users should carefully review the selected Puja package before completing a booking.",
            "Items such as Puja samagri, travel arrangements, additional rituals, extra Pandit Ji, or other services may depend on the selected package.",
          ],
        },

        {
          title: "8. Prices and Charges",
          paragraphs: [
            "Prices displayed on Puja Dham may vary depending on the Puja, package, location, date, required samagri, additional services, or other booking conditions.",
            "Puja Dham may update prices from time to time.",
            "The applicable amount for a booking will be the amount communicated or displayed during the relevant booking process.",
          ],
        },

        {
          title: "9. Payments",
          paragraphs: [
            "Payments may be accepted through UPI or other supported payment methods.",
            "Users are responsible for entering correct payment information and verifying the amount before making a payment.",
            "Puja Dham does not ask users to share sensitive banking credentials such as UPI PIN, debit card PIN, CVV, OTP, or internet banking password.",
          ],
        },

        {
          title: "10. Payment Verification",
          paragraphs: [
            "In some cases, payment confirmation may require verification.",
            "Users may be asked to provide appropriate transaction information such as payment reference details where reasonably required for booking verification.",
            "A successful payment attempt does not automatically guarantee a confirmed booking if the transaction cannot be verified or if the selected service is unavailable.",
          ],
        },

        {
          title: "11. Cancellations and Refunds",
          paragraphs: [
            "Cancellation and refund eligibility may depend on the Puja, booking status, scheduled date, expenses already incurred, Pandit Ji arrangements, samagri preparation, travel arrangements, and other circumstances.",
            "Where a separate Refund or Cancellation Policy is available, that policy will apply together with these Terms & Conditions.",
          ],
        },

        {
          title: "12. Rescheduling",
          paragraphs: [
            "Requests to change the date or time of a Puja are subject to availability.",
            "Puja Dham cannot guarantee that the same Pandit Ji, package, location arrangement, or time slot will remain available after rescheduling.",
          ],
        },

        {
          title: "13. Pandit Ji Availability",
          paragraphs: [
            "Puja Dham may coordinate Puja services with suitable Pandit Ji based on availability, Puja requirements, location, language preference, and other relevant factors.",
            "In exceptional circumstances, Puja Dham may arrange an alternative suitable Pandit Ji when the originally expected Pandit Ji becomes unavailable.",
          ],
        },

        {
          title: "14. Puja Timing",
          paragraphs: [
            "Puja timing may depend on Muhurat, customer preference, Pandit Ji availability, travel conditions, and the nature of the ceremony.",
            "Minor delays may occur due to traffic, weather, previous ceremonies, religious requirements, or other circumstances beyond reasonable control.",
          ],
        },

        {
          title: "15. Customer Responsibilities",
          list: [
            "Provide correct contact and booking information",
            "Provide an accurate Puja location",
            "Remain reachable for booking coordination",
            "Follow reasonable instructions shared for Puja preparation",
            "Ensure suitable space is available for the ceremony",
            "Inform Puja Dham about relevant special requirements in advance",
            "Complete required payment or booking formalities on time",
          ],
        },

        {
          title: "16. Puja Samagri",
          paragraphs: [
            "The inclusion of Puja samagri depends on the selected package.",
            "Where the customer is responsible for arranging certain items, Puja Dham or Pandit Ji may provide guidance regarding required materials.",
            "Availability of specific traditional items may vary by location.",
          ],
        },

        {
          title: "17. Religious and Spiritual Nature of Services",
          paragraphs: [
            "Puja Dham provides access to religious and devotional services based on traditional practices and beliefs.",
            "Religious ceremonies are spiritual in nature, and Puja Dham does not guarantee specific financial, medical, professional, personal, or other material outcomes from performing any Puja.",
          ],
        },

        {
          title: "18. No Medical, Legal or Financial Advice",
          paragraphs: [
            "Religious content, spiritual information, Puja descriptions, or devotional guidance available on Puja Dham should not be treated as professional medical, legal, financial, or other regulated advice.",
            "Users should consult an appropriate qualified professional where professional advice is required.",
          ],
        },

        {
          title: "19. Website Content",
          paragraphs: [
            "Puja Dham may provide information about Pujas, traditions, rituals, festivals, religious practices, benefits, procedures, and related subjects.",
            "We aim to keep this information useful and accurate, but religious practices may differ by region, tradition, family custom, or Pandit Ji.",
          ],
        },

        {
          title: "20. Images and Media",
          paragraphs: [
            "Images, graphics, icons, videos, photographs, text, logos, and other content displayed on Puja Dham may be owned by Puja Dham, used with permission, or sourced through licensed or permitted services.",
            "Users may not copy, reproduce, republish, commercially distribute, or misuse protected website content without appropriate permission.",
          ],
        },

        {
          title: "21. Intellectual Property",
          paragraphs: [
            "The Puja Dham name, branding, website design, original text, graphics, software, and other original website materials may be protected by applicable intellectual property laws.",
            "Access to the website does not give users ownership rights over Puja Dham intellectual property.",
          ],
        },

        {
          title: "22. Prohibited Use",
          list: [
            "Using the website for unlawful activities",
            "Submitting false or misleading booking information",
            "Attempting unauthorized access to accounts, servers, APIs, or administrative systems",
            "Interfering with website operation or security",
            "Introducing malicious code, malware, automated attacks, or harmful scripts",
            "Copying protected content for unauthorized commercial use",
            "Harassing Pandit Ji, customers, staff, or service providers",
            "Misusing payment or booking systems",
          ],
        },

        {
          title: "23. Third-Party Services",
          paragraphs: [
            "Puja Dham may use third-party services for payments, analytics, hosting, maps, messaging, social media, cloud infrastructure, or other technical functions.",
            "Use of those services may also be subject to the terms and policies of the relevant third-party provider.",
          ],
        },

        {
          title: "24. External Links",
          paragraphs: [
            "Puja Dham may contain links to third-party websites or services.",
            "We do not control independent external websites and are not responsible for their content, availability, security, or practices.",
          ],
        },

        {
          title: "25. Website Availability",
          paragraphs: [
            "We aim to keep Puja Dham available and functional, but uninterrupted access cannot be guaranteed.",
            "The website may occasionally be unavailable due to maintenance, updates, technical problems, hosting issues, internet disruptions, or circumstances beyond our control.",
          ],
        },

        {
          title: "26. Service Modification",
          paragraphs: [
            "Puja Dham may add, modify, suspend, or discontinue website features, Puja services, packages, pricing, or service areas when reasonably necessary.",
          ],
        },

        {
          title: "27. Limitation of Liability",
          paragraphs: [
            "To the extent permitted by applicable law, Puja Dham will not be responsible for indirect, incidental, or consequential losses arising from circumstances beyond its reasonable control.",
            "Nothing in these Terms & Conditions excludes or limits liability where such exclusion or limitation is not permitted by applicable law.",
          ],
        },

        {
          title: "28. Force Majeure",
          paragraphs: [
            "Puja Dham will not be responsible for delays, cancellations, or inability to provide services caused by events beyond reasonable control.",
          ],
          list: [
            "Severe weather",
            "Natural disasters",
            "Government restrictions",
            "Transport disruptions",
            "Public emergencies",
            "Internet or infrastructure failures",
            "Unexpected illness or emergency",
            "Other unavoidable circumstances",
          ],
        },

        {
          title: "29. Privacy",
          paragraphs: [
            "The collection and use of personal information through Puja Dham is also governed by our Privacy Policy.",
            "Users are encouraged to read the Privacy Policy before submitting personal or booking information.",
          ],
        },

        {
          title: "30. Changes to These Terms",
          paragraphs: [
            "Puja Dham may update these Terms & Conditions from time to time.",
            "Updated terms will be published on this page with the latest revision date.",
            "Continued use of Puja Dham after an update indicates acceptance of the revised terms to the extent permitted by law.",
          ],
        },

        {
          title: "31. Governing Law",
          paragraphs: [
            "These Terms & Conditions are intended to operate in accordance with applicable laws of India.",
            "Any dispute will be subject to applicable legal procedures and jurisdiction as determined under relevant law.",
          ],
        },

        {
          title: "32. Contact Us",
          paragraphs: [
            "For questions regarding bookings, payments, cancellations, these Terms & Conditions, or other Puja Dham services, please contact us through the official Contact page available on the website.",
          ],
        },
      ],
    },

    hi: {
      badge: "कृपया ध्यानपूर्वक पढ़ें",
      title: "नियम एवं शर्तें",
      subtitle:
        "ये नियम एवं शर्तें Puja Dham वेबसाइट, पूजा सेवाओं, बुकिंग, भुगतान और अन्य उपलब्ध सुविधाओं के उपयोग से संबंधित नियमों को समझाती हैं।",

      updated: "अंतिम अपडेट: अगस्त 2026",

      sections: [
        {
          title: "1. नियमों की स्वीकृति",
          paragraphs: [
            "Puja Dham वेबसाइट का उपयोग करके आप इन नियम एवं शर्तों का पालन करने के लिए सहमत होते हैं।",
            "यदि आप इन नियमों से सहमत नहीं हैं, तो आपको वेबसाइट, पूजा बुकिंग, अकाउंट या अन्य Puja Dham सेवाओं का उपयोग नहीं करना चाहिए।",
          ],
        },

        {
          title: "2. Puja Dham के बारे में",
          paragraphs: [
            "Puja Dham एक डिजिटल प्लेटफॉर्म है जो भक्तों को वैदिक पूजा सेवाओं की जानकारी प्राप्त करने, पूजा बुक करने, पंडित जी से जुड़ने और अन्य धार्मिक सेवाओं का उपयोग करने में सहायता करता है।",
            "किसी विशेष पूजा, पंडित जी, स्थान, पैकेज, समय या सेवा की उपलब्धता अलग-अलग हो सकती है।",
          ],
        },

        {
          title: "3. वेबसाइट उपयोग करने की पात्रता",
          paragraphs: [
            "Puja Dham का उपयोग करते समय आपको सही और सटीक जानकारी प्रदान करनी चाहिए।",
            "यदि आप किसी अन्य व्यक्ति, परिवार के सदस्य, संस्था या समूह की ओर से बुकिंग कर रहे हैं, तो आवश्यक जानकारी देने की उचित अनुमति आपके पास होनी चाहिए।",
          ],
        },

        {
          title: "4. अकाउंट संबंधी जानकारी",
          paragraphs: [
            "Puja Dham की कुछ सुविधाओं के लिए अकाउंट या लॉगिन की आवश्यकता हो सकती है।",
            "अपने login credentials को सुरक्षित रखना और अपने अकाउंट से होने वाली गतिविधियों की जिम्मेदारी आपकी है।",
            "यदि आपको लगता है कि आपके अकाउंट का बिना अनुमति उपयोग हुआ है, तो Puja Dham को सूचित करें।",
          ],
        },

        {
          title: "5. पूजा बुकिंग",
          paragraphs: [
            "पूजा बुक करते समय आपको नाम, संपर्क विवरण, स्थान, पसंदीदा पूजा तारीख, चुना गया पैकेज और अन्य आवश्यक जानकारी सही प्रदान करनी चाहिए।",
            "केवल booking request भेजने से booking की अंतिम पुष्टि आवश्यक रूप से नहीं होती। पुष्टि availability, payment status, Pandit Ji availability, location और अन्य आवश्यक conditions पर निर्भर हो सकती है।",
          ],
        },

        {
          title: "6. बुकिंग की पुष्टि",
          paragraphs: [
            "Booking को तभी confirmed माना जा सकता है जब आवश्यक प्रक्रिया पूरी हो जाए और Puja Dham की ओर से website, phone, email, message या किसी अन्य आधिकारिक माध्यम से confirmation प्राप्त हो।",
            "Booking पूरी करने के लिए अतिरिक्त जानकारी की आवश्यकता होने पर Puja Dham ग्राहक से संपर्क कर सकता है।",
          ],
        },

        {
          title: "7. पूजा पैकेज",
          paragraphs: [
            "अलग-अलग पूजा सेवाओं के पैकेज, शामिल सुविधाएं, कीमत, अवधि और आवश्यकताएं अलग हो सकती हैं।",
            "बुकिंग करने से पहले चुने गए पूजा पैकेज की जानकारी ध्यानपूर्वक पढ़ें।",
            "पूजा सामग्री, यात्रा व्यवस्था, अतिरिक्त अनुष्ठान, अतिरिक्त पंडित जी या अन्य सेवाएं चुने गए पैकेज पर निर्भर कर सकती हैं।",
          ],
        },

        {
          title: "8. कीमत और शुल्क",
          paragraphs: [
            "Puja Dham पर दिखाई गई कीमत पूजा, पैकेज, स्थान, तारीख, पूजा सामग्री, अतिरिक्त सेवाओं या अन्य booking conditions के आधार पर अलग हो सकती है।",
            "Puja Dham समय-समय पर कीमतों में बदलाव कर सकता है।",
            "किसी booking पर वही राशि लागू होगी जो संबंधित booking process के दौरान दिखाई या बताई गई हो।",
          ],
        },

        {
          title: "9. भुगतान",
          paragraphs: [
            "भुगतान UPI या अन्य उपलब्ध payment methods के माध्यम से किया जा सकता है।",
            "भुगतान से पहले सही payment information और राशि की जांच करना उपयोगकर्ता की जिम्मेदारी है।",
            "Puja Dham आपसे UPI PIN, debit card PIN, CVV, OTP या internet banking password जैसी संवेदनशील banking information साझा करने के लिए नहीं कहता है।",
          ],
        },

        {
          title: "10. भुगतान की पुष्टि",
          paragraphs: [
            "कुछ परिस्थितियों में payment verification की आवश्यकता हो सकती है।",
            "Booking verification के लिए आवश्यकता होने पर transaction reference जैसी उचित payment information मांगी जा सकती है।",
            "Payment successful दिखाई देने का अर्थ हमेशा confirmed booking नहीं है, विशेष रूप से जब transaction verify न हो पाए या selected service उपलब्ध न हो।",
          ],
        },

        {
          title: "11. Cancellation और Refund",
          paragraphs: [
            "Cancellation और refund की eligibility पूजा, booking status, निर्धारित तारीख, पहले से हुए खर्च, Pandit Ji arrangement, Puja samagri preparation, travel arrangement और अन्य परिस्थितियों पर निर्भर कर सकती है।",
            "जहां अलग Refund या Cancellation Policy उपलब्ध हो, वहां वह policy इन Terms & Conditions के साथ लागू होगी।",
          ],
        },

        {
          title: "12. पूजा की तारीख या समय बदलना",
          paragraphs: [
            "पूजा की तारीख या समय बदलने का अनुरोध availability पर निर्भर करेगा।",
            "Rescheduling के बाद वही Pandit Ji, package, location arrangement या time slot उपलब्ध रहेगा इसकी गारंटी नहीं दी जा सकती।",
          ],
        },

        {
          title: "13. पंडित जी की उपलब्धता",
          paragraphs: [
            "Puja Dham पूजा की आवश्यकता, उपलब्धता, स्थान, भाषा और अन्य संबंधित factors के आधार पर उपयुक्त Pandit Ji के साथ सेवा coordinate कर सकता है।",
            "विशेष परिस्थितियों में निर्धारित Pandit Ji उपलब्ध न होने पर किसी अन्य उपयुक्त Pandit Ji की व्यवस्था की जा सकती है।",
          ],
        },

        {
          title: "14. पूजा का समय",
          paragraphs: [
            "पूजा का समय मुहूर्त, ग्राहक की पसंद, Pandit Ji availability, यात्रा की स्थिति और पूजा के प्रकार पर निर्भर कर सकता है।",
            "Traffic, weather, previous ceremony, धार्मिक आवश्यकता या अन्य परिस्थितियों के कारण थोड़ी देरी हो सकती है।",
          ],
        },

        {
          title: "15. ग्राहक की जिम्मेदारियां",
          list: [
            "सही संपर्क और booking information देना",
            "पूजा का सही स्थान बताना",
            "Booking coordination के लिए संपर्क में रहना",
            "पूजा की तैयारी से संबंधित उचित निर्देशों का पालन करना",
            "पूजा के लिए उचित स्थान उपलब्ध कराना",
            "विशेष आवश्यकताओं की जानकारी पहले से देना",
            "आवश्यक booking या payment formalities समय पर पूरी करना",
          ],
        },

        {
          title: "16. पूजा सामग्री",
          paragraphs: [
            "पूजा सामग्री का शामिल होना चुने गए package पर निर्भर करेगा।",
            "जहां कुछ सामग्री ग्राहक को स्वयं व्यवस्थित करनी हो, वहां Puja Dham या Pandit Ji आवश्यक वस्तुओं के बारे में guidance दे सकते हैं।",
            "कुछ पारंपरिक वस्तुओं की उपलब्धता स्थान के अनुसार अलग हो सकती है।",
          ],
        },

        {
          title: "17. धार्मिक एवं आध्यात्मिक सेवाएं",
          paragraphs: [
            "Puja Dham पारंपरिक धार्मिक मान्यताओं और विधियों पर आधारित पूजा एवं devotional services उपलब्ध कराता है।",
            "पूजा आध्यात्मिक प्रकृति की होती है। Puja Dham किसी पूजा से निश्चित आर्थिक, चिकित्सीय, व्यावसायिक, व्यक्तिगत या अन्य भौतिक परिणाम की गारंटी नहीं देता।",
          ],
        },

        {
          title: "18. चिकित्सा, कानूनी या वित्तीय सलाह नहीं",
          paragraphs: [
            "Puja Dham पर उपलब्ध धार्मिक जानकारी, spiritual guidance, पूजा विवरण या devotional content को medical, legal, financial या अन्य professional advice नहीं माना जाना चाहिए।",
            "जहां professional advice की आवश्यकता हो वहां संबंधित qualified professional से सलाह लें।",
          ],
        },

        {
          title: "19. वेबसाइट की जानकारी",
          paragraphs: [
            "Puja Dham पूजा, परंपरा, अनुष्ठान, त्योहार, धार्मिक विधियों, लाभ, प्रक्रिया और संबंधित विषयों के बारे में जानकारी उपलब्ध करा सकता है।",
            "हम जानकारी को उपयोगी और सही रखने का प्रयास करते हैं, लेकिन धार्मिक विधियां क्षेत्र, परंपरा, परिवार या Pandit Ji के अनुसार अलग हो सकती हैं।",
          ],
        },

        {
          title: "20. चित्र और मीडिया",
          paragraphs: [
            "Puja Dham पर उपलब्ध images, graphics, icons, videos, photographs, text, logos और अन्य content Puja Dham के हो सकते हैं, अनुमति से उपयोग किए जा सकते हैं या licensed sources से प्राप्त किए जा सकते हैं।",
            "उचित अनुमति के बिना protected website content की copying, republication, commercial distribution या misuse की अनुमति नहीं है।",
          ],
        },

        {
          title: "21. बौद्धिक संपदा",
          paragraphs: [
            "Puja Dham का नाम, branding, website design, original text, graphics, software और अन्य original website materials लागू intellectual property laws द्वारा सुरक्षित हो सकते हैं।",
            "Website access मिलने से Puja Dham intellectual property पर ownership rights प्राप्त नहीं होते।",
          ],
        },

        {
          title: "22. निषिद्ध उपयोग",
          list: [
            "वेबसाइट का गैरकानूनी उपयोग",
            "गलत या भ्रामक booking information देना",
            "Accounts, servers, APIs या admin systems में unauthorized access का प्रयास",
            "Website operation या security में बाधा डालना",
            "Malware, malicious code, automated attacks या harmful scripts का उपयोग",
            "Protected content का unauthorized commercial use",
            "Pandit Ji, customers, staff या service providers को परेशान करना",
            "Payment या booking system का misuse करना",
          ],
        },

        {
          title: "23. Third-Party Services",
          paragraphs: [
            "Puja Dham payment, analytics, hosting, maps, messaging, social media, cloud infrastructure या अन्य technical functions के लिए third-party services का उपयोग कर सकता है।",
            "इन सेवाओं के उपयोग पर संबंधित third-party provider की terms और policies भी लागू हो सकती हैं।",
          ],
        },

        {
          title: "24. बाहरी लिंक",
          paragraphs: [
            "Puja Dham पर third-party websites या services के links हो सकते हैं।",
            "स्वतंत्र बाहरी websites के content, availability, security या practices पर हमारा नियंत्रण नहीं है।",
          ],
        },

        {
          title: "25. वेबसाइट की उपलब्धता",
          paragraphs: [
            "हम Puja Dham को उपलब्ध और functional रखने का प्रयास करते हैं, लेकिन uninterrupted access की गारंटी नहीं दी जा सकती।",
            "Maintenance, updates, technical problems, hosting issues, internet disruption या हमारे नियंत्रण से बाहर की परिस्थितियों के कारण website अस्थायी रूप से unavailable हो सकती है।",
          ],
        },

        {
          title: "26. सेवाओं में बदलाव",
          paragraphs: [
            "आवश्यकता होने पर Puja Dham website features, Puja services, packages, pricing या service areas को जोड़, बदल, अस्थायी रूप से रोक या बंद कर सकता है।",
          ],
        },

        {
          title: "27. जिम्मेदारी की सीमा",
          paragraphs: [
            "लागू कानून द्वारा अनुमत सीमा तक Puja Dham ऐसी परिस्थितियों से उत्पन्न indirect, incidental या consequential loss के लिए जिम्मेदार नहीं होगा जो उसके उचित नियंत्रण से बाहर हों।",
            "इन नियमों में ऐसा कोई प्रावधान लागू नहीं होगा जो कानून द्वारा प्रतिबंधित liability को अनुचित रूप से exclude या limit करता हो।",
          ],
        },

        {
          title: "28. नियंत्रण से बाहर की परिस्थितियां",
          paragraphs: [
            "Puja Dham उन delays, cancellations या service interruptions के लिए जिम्मेदार नहीं होगा जो उचित नियंत्रण से बाहर की परिस्थितियों के कारण हों।",
          ],
          list: [
            "गंभीर मौसम",
            "प्राकृतिक आपदा",
            "सरकारी प्रतिबंध",
            "यातायात या परिवहन में बाधा",
            "सार्वजनिक आपात स्थिति",
            "Internet या infrastructure failure",
            "अचानक बीमारी या emergency",
            "अन्य अपरिहार्य परिस्थितियां",
          ],
        },

        {
          title: "29. गोपनीयता",
          paragraphs: [
            "Puja Dham के माध्यम से व्यक्तिगत जानकारी के collection और use पर हमारी Privacy Policy भी लागू होती है।",
            "Personal या booking information देने से पहले Privacy Policy पढ़ने की सलाह दी जाती है।",
          ],
        },

        {
          title: "30. इन नियमों में बदलाव",
          paragraphs: [
            "Puja Dham समय-समय पर इन Terms & Conditions को अपडेट कर सकता है।",
            "Updated terms इसी page पर नई revision date के साथ प्रकाशित किए जाएंगे।",
            "Update के बाद Puja Dham का उपयोग जारी रखने पर लागू कानून की सीमा तक revised terms की स्वीकृति मानी जा सकती है।",
          ],
        },

        {
          title: "31. लागू कानून",
          paragraphs: [
            "ये Terms & Conditions भारत के लागू कानूनों के अनुसार संचालित होने के उद्देश्य से तैयार की गई हैं।",
            "किसी विवाद की स्थिति में लागू कानून के अनुसार संबंधित legal procedure और jurisdiction लागू होंगे।",
          ],
        },

        {
          title: "32. हमसे संपर्क करें",
          paragraphs: [
            "Booking, payment, cancellation, इन Terms & Conditions या Puja Dham की अन्य सेवाओं से संबंधित प्रश्नों के लिए website के official Contact page के माध्यम से हमसे संपर्क करें।",
          ],
        },
      ],
    },
  };

  const page = isHindi ? content.hi : content.en;

  const toggleItem = (index) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <main className="min-h-screen bg-[#fffaf5]">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-orange-100 bg-gradient-to-b from-orange-50 to-[#fffaf5]">
        <div className="absolute -left-16 top-10 h-56 w-56 rounded-full bg-orange-200/20 blur-3xl" />
        <div className="absolute -right-16 top-20 h-64 w-64 rounded-full bg-yellow-200/20 blur-3xl" />

        <div className="relative mx-auto max-w-5xl px-5 pb-12 pt-28 text-center sm:px-8 sm:pb-16 sm:pt-32">
          <span className="inline-flex rounded-full border border-orange-200 bg-white/80 px-4 py-2 text-xs font-semibold tracking-wide text-orange-700 shadow-sm">
            {page.badge}
          </span>

          <h1
            className={`mt-5 text-3xl font-bold leading-tight text-[#402313] sm:text-4xl md:text-5xl ${
              isHindi ? "font-display-hi" : "font-display-en"
            }`}
          >
            {page.title}
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-sm leading-7 text-gray-600 sm:text-base">
            {page.subtitle}
          </p>

          <p className="mt-5 text-xs font-medium text-gray-400">
            {page.updated}
          </p>
        </div>
      </section>

      {/* FAQ-STYLE TERMS CONTENT */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="mb-6">
          <h2
            className={`border-l-4 border-orange-500 pl-4 text-2xl font-bold text-[#402313] sm:text-3xl md:text-4xl ${
              isHindi ? "font-display-hi" : "font-display-en"
            }`}
          >
            {isHindi ? "नियम एवं शर्तों की जानकारी" : "Terms & Conditions Details"}
          </h2>
        </div>

        <div className="overflow-hidden border-y border-orange-100 bg-transparent">
          {page.sections.map((section, index) => {
            const open = openIndex === index;

            return (
              <div
                key={section.title}
                className="border-b border-orange-100 last:border-b-0"
              >
                <button
                  type="button"
                  onClick={() => toggleItem(index)}
                  className="flex w-full items-center justify-between gap-5 px-1 py-6 text-left sm:px-4 sm:py-7"
                  aria-expanded={open}
                >
                  <span
                    className={`text-[15px] font-semibold leading-6 text-[#2f3338] sm:text-lg ${
                      isHindi ? "font-display-hi" : ""
                    }`}
                  >
                    {section.title}
                  </span>

                  <PlusIcon open={open} />
                </button>

                <div
                  className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
                    open
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-1 pb-7 pr-12 sm:px-4 sm:pb-8 sm:pr-20">
                      {section.paragraphs && (
                        <div className="space-y-3">
                          {section.paragraphs.map((paragraph) => (
                            <p
                              key={paragraph}
                              className="text-sm leading-7 text-gray-600 sm:text-[15px]"
                            >
                              {paragraph}
                            </p>
                          ))}
                        </div>
                      )}

                      {section.list && (
                        <ul
                          className={`space-y-3 ${
                            section.paragraphs ? "mt-5" : ""
                          }`}
                        >
                          {section.list.map((item) => (
                            <li
                              key={item}
                              className="flex gap-3 text-sm leading-6 text-gray-600 sm:text-[15px]"
                            >
                              <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 rounded-2xl border border-orange-100 bg-orange-50/70 px-5 py-5 text-center">
          <p className="text-sm leading-6 text-[#6a3b20]">
            {isHindi
              ? "Puja Dham का उपयोग जारी रखने पर आप इन नियम एवं शर्तों से सहमत होते हैं।"
              : "By continuing to use Puja Dham, you agree to these Terms & Conditions."}
          </p>
        </div>
      </section>
    </main>
  );
}