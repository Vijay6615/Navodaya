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

export default function RefundPolicyPage() {
  const { language } = useLanguage();

  const isHindi = language === "hi";
  const [openIndex, setOpenIndex] = useState(null);

  const content = {
    en: {
      badge: "Booking, Cancellation & Refund Information",
      title: "Refund & Cancellation Policy",
      subtitle:
        "This policy explains the cancellation, refund, rescheduling, payment verification, and service-related rules that may apply to Puja bookings made through Puja Dham.",

      updated: "Last Updated: August 2026",

      sections: [
        {
          title: "1. General Policy",
          paragraphs: [
            "Puja Dham aims to provide a transparent and fair booking experience for devotees using our Puja services.",
            "Refund, cancellation, and rescheduling eligibility may depend on the booking status, Puja date, selected package, Pandit Ji arrangements, Puja samagri preparation, travel arrangements, and other costs already incurred for the booking.",
          ],
        },

        {
          title: "2. Booking Cancellation by the Customer",
          paragraphs: [
            "Customers may request cancellation of a Puja booking by contacting Puja Dham through the official contact methods available on the website.",
            "A cancellation request is not considered complete until it has been received and acknowledged by Puja Dham.",
            "Customers should provide their booking details while requesting cancellation so that the booking can be identified and reviewed.",
          ],
        },

        {
          title: "3. Cancellation Before Puja Arrangements Begin",
          paragraphs: [
            "Where a booking is cancelled sufficiently before Puja-related arrangements have started, Puja Dham may consider a full or partial refund depending on the circumstances.",
            "Any payment processing charges, non-refundable transaction charges, or other unavoidable costs already incurred may be deducted where applicable.",
          ],
        },

        {
          title: "4. Cancellation After Arrangements Have Started",
          paragraphs: [
            "If cancellation is requested after arrangements have already started, the refund amount may be reduced.",
            "This may include situations where Pandit Ji has been reserved, travel has been arranged, Puja samagri has been purchased or prepared, or other booking-related expenses have already been incurred.",
          ],
        },

        {
          title: "5. Same-Day or Last-Minute Cancellation",
          paragraphs: [
            "Same-day or last-minute cancellations may not be eligible for a full refund.",
            "Where significant arrangements have already been completed, the booking may be partially refundable or non-refundable depending on the actual costs incurred.",
          ],
        },

        {
          title: "6. Cancellation After Puja Has Started",
          paragraphs: [
            "Once the Puja ceremony has started, the booking will generally not be eligible for a refund.",
            "Any exceptional concern will be reviewed individually based on the circumstances.",
          ],
        },

        {
          title: "7. Cancellation by Puja Dham",
          paragraphs: [
            "In rare situations, Puja Dham may need to cancel or modify a confirmed booking because of circumstances such as Pandit Ji unavailability, emergency, severe weather, transportation disruption, or another unavoidable reason.",
            "Where Puja Dham is unable to provide the booked service and no suitable alternative or rescheduling option is accepted, the eligible booking amount may be refunded.",
          ],
        },

        {
          title: "8. Pandit Ji Unavailability",
          paragraphs: [
            "If the originally planned Pandit Ji becomes unavailable, Puja Dham may attempt to arrange another suitable Pandit Ji.",
            "Where an appropriate replacement cannot be arranged, Puja Dham may offer rescheduling or an eligible refund based on the booking circumstances.",
          ],
        },

        {
          title: "9. Rescheduling",
          paragraphs: [
            "Customers may request a change in Puja date or time before the scheduled ceremony.",
            "Rescheduling is subject to Pandit Ji availability, Puja requirements, location, Muhurat, and other booking conditions.",
            "Additional charges may apply if the rescheduled booking results in higher travel costs, special arrangements, or other additional expenses.",
          ],
        },

        {
          title: "10. Puja Samagri and Preparation Costs",
          paragraphs: [
            "If Puja samagri has already been purchased, prepared, packed, customized, or otherwise arranged for a booking, the related cost may be deducted from any eligible refund.",
            "Perishable, specially prepared, or booking-specific items may not be refundable once purchased or prepared.",
          ],
        },

        {
          title: "11. Travel and Location-Related Costs",
          paragraphs: [
            "Where travel, transport, accommodation, or location-related arrangements have already been made for Pandit Ji or the Puja service, those costs may be deducted from an eligible refund.",
          ],
        },

        {
          title: "12. Online Puja Bookings",
          paragraphs: [
            "For online Puja services, refund eligibility may depend on whether preparation has started, materials have been arranged, Sankalp details have been processed, or the ceremony has already begun.",
          ],
        },

        {
          title: "13. Failed Payment but Amount Debited",
          paragraphs: [
            "If a payment appears unsuccessful on Puja Dham but the amount has been debited from the customer's bank account, customers should first check the payment status with their bank or payment provider.",
            "In many cases, failed or incomplete transactions may be automatically reversed by the bank or payment service provider.",
            "Customers may contact Puja Dham with relevant transaction details if assistance is required in verifying the booking payment.",
          ],
        },

        {
          title: "14. Duplicate Payment",
          paragraphs: [
            "If the same booking is accidentally paid more than once and both payments are successfully received and verified, the duplicate amount may be refunded after verification.",
          ],
        },

        {
          title: "15. Incorrect Payment Amount",
          paragraphs: [
            "If an incorrect amount is transferred, customers should contact Puja Dham as soon as possible.",
            "Any refund or adjustment will be reviewed after the transaction and booking details have been verified.",
          ],
        },

        {
          title: "16. Payment Made to an Incorrect Account",
          paragraphs: [
            "Customers are responsible for verifying the official payment information before transferring money.",
            "Puja Dham cannot guarantee recovery of payments accidentally sent to an incorrect or unauthorized account.",
          ],
        },

        {
          title: "17. Refund Method",
          paragraphs: [
            "Where a refund is approved, Puja Dham may process the refund through the original payment method or another appropriate method after verification.",
            "Additional information may be requested where reasonably required to complete the refund.",
          ],
        },

        {
          title: "18. Refund Processing Time",
          paragraphs: [
            "Approved refunds will be initiated within a reasonable period after the refund has been reviewed and approved.",
            "The time required for the refunded amount to appear in the customer's account may depend on the bank, UPI service, payment provider, holidays, and other financial processing timelines.",
          ],
        },

        {
          title: "19. Refund Verification",
          paragraphs: [
            "Before processing a refund, Puja Dham may verify the booking, payment status, transaction reference, cancellation reason, and expenses already incurred.",
            "This verification helps ensure that refunds are processed accurately and securely.",
          ],
        },

        {
          title: "20. Booking Charges and Transaction Fees",
          paragraphs: [
            "Certain transaction fees, payment processing fees, convenience charges, or other non-recoverable third-party charges may not be refundable where such costs have already been incurred.",
          ],
        },

        {
          title: "21. No Refund for Completed Services",
          paragraphs: [
            "A refund will generally not be available after a Puja service has been successfully completed.",
            "If a customer has a genuine concern regarding the completed service, the matter may be reviewed individually.",
          ],
        },

        {
          title: "22. Customer Not Available",
          paragraphs: [
            "If the customer is unavailable, unreachable, provides an incorrect location, or fails to make required arrangements at the scheduled time, the booking may not be eligible for a full refund.",
            "Any refund will depend on expenses already incurred and the specific circumstances.",
          ],
        },

        {
          title: "23. Incorrect Information Provided by Customer",
          paragraphs: [
            "Customers are responsible for providing accurate booking information.",
            "Puja Dham may not be responsible for service disruption caused by incorrect contact details, wrong address, incorrect date, or other inaccurate information provided by the customer.",
          ],
        },

        {
          title: "24. Force Majeure and Unavoidable Circumstances",
          paragraphs: [
            "Refund or rescheduling decisions involving circumstances beyond reasonable control will be reviewed fairly based on the situation.",
          ],
          list: [
            "Severe weather",
            "Natural disaster",
            "Government restrictions",
            "Public emergency",
            "Transportation disruption",
            "Unexpected illness or emergency",
            "Internet or communication failure",
            "Other unavoidable circumstances",
          ],
        },

        {
          title: "25. Promotional or Special Bookings",
          paragraphs: [
            "Some promotional, discounted, festival, special-event, or limited-availability bookings may have specific cancellation or refund conditions.",
            "Where special conditions apply, they should be reviewed at the time of booking.",
          ],
        },

        {
          title: "26. Refund Disputes",
          paragraphs: [
            "If you believe a refund has been incorrectly calculated or rejected, you may contact Puja Dham with your booking and payment details.",
            "The matter will be reviewed based on available records, payment status, booking arrangements, and relevant circumstances.",
          ],
        },

        {
          title: "27. Fraudulent or Abusive Claims",
          paragraphs: [
            "Puja Dham may refuse refund requests involving suspected fraud, false information, duplicate claims, payment manipulation, abuse of the booking system, or other improper activity.",
          ],
        },

        {
          title: "28. Changes to This Policy",
          paragraphs: [
            "Puja Dham may update this Refund & Cancellation Policy from time to time to reflect changes in services, booking procedures, payment systems, or applicable requirements.",
            "The latest version will be published on this page with the updated date.",
          ],
        },

        {
          title: "29. Contact for Cancellation or Refund",
          paragraphs: [
            "To request a cancellation, rescheduling, refund review, or payment verification, please contact Puja Dham using the official Contact page or other verified contact information available on the website.",
            "Please provide sufficient booking and payment details so that your request can be reviewed.",
          ],
        },
      ],
    },

    hi: {
      badge: "बुकिंग, रद्दीकरण और रिफंड की जानकारी",
      title: "रिफंड एवं रद्दीकरण नीति",
      subtitle:
        "यह नीति Puja Dham के माध्यम से की गई पूजा बुकिंग से संबंधित cancellation, refund, rescheduling, payment verification और service-related नियमों को समझाती है।",

      updated: "अंतिम अपडेट: अगस्त 2026",

      sections: [
        {
          title: "1. सामान्य नीति",
          paragraphs: [
            "Puja Dham भक्तों को पूजा सेवाओं के लिए पारदर्शी और उचित booking experience देने का प्रयास करता है।",
            "Refund, cancellation और rescheduling की eligibility booking status, पूजा की तारीख, चुने गए package, Pandit Ji arrangement, Puja samagri preparation, travel arrangement और booking के लिए पहले से किए गए अन्य खर्चों पर निर्भर कर सकती है।",
          ],
        },

        {
          title: "2. ग्राहक द्वारा बुकिंग रद्द करना",
          paragraphs: [
            "ग्राहक Puja Dham वेबसाइट पर उपलब्ध आधिकारिक contact methods के माध्यम से पूजा booking cancel करने का अनुरोध कर सकता है।",
            "Cancellation request को तब तक complete नहीं माना जाएगा जब तक Puja Dham उसे receive और acknowledge न कर दे।",
            "Cancellation request करते समय booking details देना आवश्यक है ताकि booking को identify और review किया जा सके।",
          ],
        },

        {
          title: "3. पूजा की तैयारी शुरू होने से पहले Cancellation",
          paragraphs: [
            "यदि Puja-related arrangements शुरू होने से पर्याप्त समय पहले booking cancel की जाती है, तो परिस्थितियों के अनुसार full या partial refund पर विचार किया जा सकता है।",
            "जहां लागू हो, पहले से लगे payment processing charges, non-refundable transaction charges या unavoidable costs को refund से deduct किया जा सकता है।",
          ],
        },

        {
          title: "4. तैयारी शुरू होने के बाद Cancellation",
          paragraphs: [
            "यदि booking-related arrangements शुरू होने के बाद cancellation मांगा जाता है, तो refund amount कम हो सकता है।",
            "इसमें ऐसी स्थिति शामिल हो सकती है जहां Pandit Ji reserve कर दिए गए हों, travel arrange किया गया हो, Puja samagri खरीदी या तैयार की गई हो, या अन्य booking expenses हो चुके हों।",
          ],
        },

        {
          title: "5. Same-Day या Last-Minute Cancellation",
          paragraphs: [
            "उसी दिन या बहुत कम समय पहले की गई cancellation पर full refund उपलब्ध न भी हो सकता है।",
            "यदि महत्वपूर्ण arrangements पहले से पूरे हो चुके हैं, तो booking actual costs के आधार पर partially refundable या non-refundable हो सकती है।",
          ],
        },

        {
          title: "6. पूजा शुरू होने के बाद Cancellation",
          paragraphs: [
            "पूजा ceremony शुरू हो जाने के बाद booking सामान्यतः refund के लिए eligible नहीं होगी।",
            "किसी exceptional issue को परिस्थितियों के आधार पर अलग से review किया जा सकता है।",
          ],
        },

        {
          title: "7. Puja Dham द्वारा Booking Cancel करना",
          paragraphs: [
            "कुछ दुर्लभ परिस्थितियों में Pandit Ji unavailability, emergency, severe weather, transport disruption या अन्य unavoidable reason के कारण Puja Dham को confirmed booking cancel या modify करनी पड़ सकती है।",
            "यदि Puja Dham booked service प्रदान नहीं कर पाता और suitable alternative या rescheduling option स्वीकार नहीं किया जाता, तो eligible booking amount refund किया जा सकता है।",
          ],
        },

        {
          title: "8. Pandit Ji उपलब्ध न होना",
          paragraphs: [
            "यदि पहले तय किए गए Pandit Ji उपलब्ध नहीं होते, तो Puja Dham किसी अन्य suitable Pandit Ji की व्यवस्था करने का प्रयास कर सकता है।",
            "यदि उचित replacement संभव न हो, तो circumstances के आधार पर rescheduling या eligible refund दिया जा सकता है।",
          ],
        },

        {
          title: "9. Rescheduling",
          paragraphs: [
            "ग्राहक scheduled Puja से पहले तारीख या समय बदलने का अनुरोध कर सकता है।",
            "Rescheduling Pandit Ji availability, Puja requirements, location, Muhurat और अन्य booking conditions पर निर्भर करेगी।",
            "यदि नई booking date या arrangement के कारण अधिक travel cost, special arrangement या अन्य additional expense आता है तो extra charges लागू हो सकते हैं।",
          ],
        },

        {
          title: "10. पूजा सामग्री और तैयारी का खर्च",
          paragraphs: [
            "यदि Puja samagri पहले से खरीदी, तैयार, packed, customized या booking के लिए arrange की जा चुकी है, तो संबंधित खर्च eligible refund से deduct किया जा सकता है।",
            "Perishable, specially prepared या booking-specific items purchase या preparation के बाद refundable नहीं भी हो सकते हैं।",
          ],
        },

        {
          title: "11. यात्रा और Location से संबंधित खर्च",
          paragraphs: [
            "यदि Pandit Ji या Puja service के लिए travel, transport, accommodation या location-related arrangement पहले से किया जा चुका है, तो उसका खर्च eligible refund से deduct किया जा सकता है।",
          ],
        },

        {
          title: "12. Online Puja Booking",
          paragraphs: [
            "Online Puja services के लिए refund eligibility इस बात पर निर्भर कर सकती है कि preparation शुरू हुई है या नहीं, सामग्री arrange की गई है या नहीं, Sankalp details process हुई हैं या ceremony शुरू हो चुकी है।",
          ],
        },

        {
          title: "13. Payment Failed लेकिन Amount Debit हो गया",
          paragraphs: [
            "यदि Puja Dham पर payment unsuccessful दिखाई देता है लेकिन customer के bank account से राशि debit हो गई है, तो पहले bank या payment provider के साथ transaction status check करना चाहिए।",
            "कई मामलों में failed या incomplete transaction की राशि bank या payment provider द्वारा automatically reverse हो सकती है।",
            "Booking payment verification के लिए customer relevant transaction details के साथ Puja Dham से संपर्क कर सकता है।",
          ],
        },

        {
          title: "14. Duplicate Payment",
          paragraphs: [
            "यदि एक ही booking के लिए गलती से एक से अधिक बार payment हो जाता है और दोनों payments successfully receive तथा verify होते हैं, तो duplicate amount verification के बाद refund किया जा सकता है।",
          ],
        },

        {
          title: "15. गलत Payment Amount",
          paragraphs: [
            "यदि गलत amount transfer हो जाता है, तो customer को जल्द से जल्द Puja Dham से संपर्क करना चाहिए।",
            "Transaction और booking details verify होने के बाद refund या adjustment पर विचार किया जाएगा।",
          ],
        },

        {
          title: "16. गलत Account में Payment",
          paragraphs: [
            "Payment करने से पहले official payment details verify करना customer की जिम्मेदारी है।",
            "गलती से गलत या unauthorized account में भेजे गए payment को recover करने की Puja Dham guarantee नहीं दे सकता।",
          ],
        },

        {
          title: "17. Refund का तरीका",
          paragraphs: [
            "Refund approve होने पर Puja Dham verification के बाद original payment method या किसी अन्य उचित method से refund process कर सकता है।",
            "Refund पूरा करने के लिए आवश्यकता होने पर अतिरिक्त जानकारी मांगी जा सकती है।",
          ],
        },

        {
          title: "18. Refund Processing Time",
          paragraphs: [
            "Approved refund review और approval के बाद उचित समय के भीतर initiate किया जाएगा।",
            "Refund amount customer के account में दिखाई देने में लगने वाला समय bank, UPI service, payment provider, holidays और अन्य financial processing timelines पर निर्भर कर सकता है।",
          ],
        },

        {
          title: "19. Refund Verification",
          paragraphs: [
            "Refund process करने से पहले Puja Dham booking, payment status, transaction reference, cancellation reason और पहले से हुए खर्चों को verify कर सकता है।",
            "यह verification refund को सही और सुरक्षित तरीके से process करने में मदद करता है।",
          ],
        },

        {
          title: "20. Booking Charges और Transaction Fees",
          paragraphs: [
            "कुछ transaction fees, payment processing fees, convenience charges या अन्य non-recoverable third-party charges पहले ही लग चुके हों तो वे refundable नहीं भी हो सकते हैं।",
          ],
        },

        {
          title: "21. Complete हो चुकी Service पर Refund",
          paragraphs: [
            "Puja service सफलतापूर्वक complete हो जाने के बाद सामान्यतः refund उपलब्ध नहीं होगा।",
            "यदि customer को completed service से संबंधित कोई genuine concern है तो matter को अलग से review किया जा सकता है।",
          ],
        },

        {
          title: "22. Customer उपलब्ध न होना",
          paragraphs: [
            "यदि customer निर्धारित समय पर unavailable, unreachable हो, गलत location दे या आवश्यक arrangement पूरा न करे, तो booking full refund के लिए eligible नहीं भी हो सकती है।",
            "Refund का निर्णय पहले से हुए खर्च और specific circumstances पर निर्भर करेगा।",
          ],
        },

        {
          title: "23. Customer द्वारा गलत जानकारी देना",
          paragraphs: [
            "सही booking information देना customer की जिम्मेदारी है।",
            "गलत contact details, गलत address, गलत date या customer द्वारा दी गई अन्य inaccurate information के कारण service disruption होने पर Puja Dham जिम्मेदार नहीं हो सकता।",
          ],
        },

        {
          title: "24. नियंत्रण से बाहर की परिस्थितियां",
          paragraphs: [
            "Reasonable control से बाहर की परिस्थितियों में refund या rescheduling decision situation को देखकर fair basis पर किया जाएगा।",
          ],
          list: [
            "गंभीर मौसम",
            "प्राकृतिक आपदा",
            "सरकारी प्रतिबंध",
            "सार्वजनिक आपात स्थिति",
            "Transport disruption",
            "अचानक बीमारी या emergency",
            "Internet या communication failure",
            "अन्य unavoidable circumstances",
          ],
        },

        {
          title: "25. Promotional या Special Booking",
          paragraphs: [
            "कुछ promotional, discounted, festival, special-event या limited-availability bookings पर अलग cancellation या refund conditions लागू हो सकती हैं।",
            "जहां special conditions लागू हों, उन्हें booking के समय review करना चाहिए।",
          ],
        },

        {
          title: "26. Refund से संबंधित Dispute",
          paragraphs: [
            "यदि आपको लगता है कि refund गलत calculate किया गया है या गलत reject किया गया है, तो booking और payment details के साथ Puja Dham से संपर्क करें।",
            "Matter को available records, payment status, booking arrangements और relevant circumstances के आधार पर review किया जाएगा।",
          ],
        },

        {
          title: "27. Fraudulent या गलत Refund Claim",
          paragraphs: [
            "Suspected fraud, false information, duplicate claims, payment manipulation, booking system abuse या अन्य improper activity से जुड़े refund requests को Puja Dham reject कर सकता है।",
          ],
        },

        {
          title: "28. Policy में बदलाव",
          paragraphs: [
            "Puja Dham services, booking procedures, payment systems या applicable requirements में बदलाव के अनुसार समय-समय पर इस Refund & Cancellation Policy को update कर सकता है।",
            "Latest version इसी page पर updated date के साथ publish किया जाएगा।",
          ],
        },

        {
          title: "29. Cancellation या Refund के लिए Contact",
          paragraphs: [
            "Cancellation, rescheduling, refund review या payment verification request के लिए Puja Dham website के official Contact page या website पर उपलब्ध verified contact information का उपयोग करें।",
            "Request review करने के लिए पर्याप्त booking और payment details provide करें।",
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

      {/* FAQ-STYLE REFUND POLICY */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="mb-6">
          <h2
            className={`border-l-4 border-orange-500 pl-4 text-2xl font-bold text-[#402313] sm:text-3xl md:text-4xl ${
              isHindi ? "font-display-hi" : "font-display-en"
            }`}
          >
            {isHindi
              ? "रिफंड एवं रद्दीकरण नीति की जानकारी"
              : "Refund & Cancellation Policy Details"}
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
              ? "Refund या cancellation का final decision booking की स्थिति, पहले से हुए खर्च और उपलब्ध records के आधार पर किया जाएगा।"
              : "Final refund or cancellation decisions will depend on the booking status, expenses already incurred, and available records."}
          </p>
        </div>
      </section>
    </main>
  );
}