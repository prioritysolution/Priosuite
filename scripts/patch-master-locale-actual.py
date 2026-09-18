# -*- coding: utf-8 -*-
"""Align master locale keys with actual UI labels (no field changes)."""
from pathlib import Path

root = Path(__file__).resolve().parents[1] / "i18n" / "locales"

# Replacements: (start_marker, end_marker exclusive next sibling key at same indent)
# We'll replace whole feature objects by unique start strings.

PATCHES = {
    "en": {
        "demandMaster": '''      demandMaster: {
        title: "Demand Master",
        fields: {
          loanProduct: "Loan Product",
          depositProduct: "Deposit Product",
        },
        placeholders: {
          loanProduct: "Select loan product",
          searchLoanProduct: "Search loan product...",
          depositProduct: "Select deposit product",
          searchDepositProduct: "Search deposit product...",
        },
        buttons: {
          add: "Add",
        },
      },''',
        "depositAgent": '''      depositAgent: {
        title: "Deposit Agent",
        fields: {
          agentName: "Agent Name",
          address: "Address",
          mobileNo: "Mobile No.",
          email: "Email",
          depositAmount: "Deposit Amount",
          maximumDays: "Maximum Days",
          maximumDeposit: "Maximum Deposit",
          paymentType: "Payment Type",
          payoutAmount: "Payout Amount",
        },
        placeholders: {
          agentName: "Enter agent name",
          address: "Enter address",
          mobileNo: "Enter mobile no.",
          email: "Enter email",
          depositAmount: "Enter deposit amount",
          maximumDays: "Enter maximum days",
          maximumDeposit: "Enter maximum deposit",
          paymentType: "Select payment type",
          searchPaymentType: "Search payment type...",
          payoutAmount: "Enter payout amount",
        },
        buttons: {
          add: "Add",
        },
      },''',
        "depositInterestSetup": '''      depositInterestSetup: {
        title: "Deposit Interest Setup",
        fields: {
          productName: "Product",
          effectFrom: "Effect From Date",
          minimumDuration: "Minimum Duration",
          maximumDuration: "Maximum Duration",
          durationUnit: "Duration Unit",
          rateOfInterest: "Rate Of Interest",
        },
        placeholders: {
          productName: "Select product",
          searchProductName: "Search product...",
          effectFrom: "Pick a date",
          minimumDuration: "Enter minimum duration",
          maximumDuration: "Enter maximum duration",
          durationUnit: "Select duration unit",
          searchDurationUnit: "Search duration unit...",
          rateOfInterest: "Enter rate of interest",
        },
        table: {
          caption: "A list of your deposit interest of product.",
          productName: "Product Name",
          effectFrom: "Effect From",
          rateOfInterest: "Rate Of Interest",
          noData: "No data found.",
        },
        buttons: {
          add: "Add",
          submit: "Submit",
        },
      },''',
        "shareProduct": '''      shareProduct: {
        title: "Share Product",
        fields: {
          memberType: "Member Type",
          admissionFees: "Admission Fees",
          ratePerShare: "Rate Per Share",
        },
        placeholders: {
          memberType: "Select member type",
          searchMemberType: "Search member type...",
          admissionFees: "Enter admission fees",
          ratePerShare: "Enter rate per share",
        },
        buttons: {
          add: "Add",
        },
      },''',
        "subLedger": '''      subLedger: {
        title: "Sub Ledger",
        addNew: "Add New Sub Ledger",
        fields: {
          ledgerName: "Ledger Name",
          underHead: "Under Head",
          openingBalance: "Opening Balance",
        },
        placeholders: {
          ledgerName: "Enter ledger name",
          underHead: "Select under head",
          searchUnderHead: "Search under head...",
          openingBalance: "Enter opening balance",
        },
        table: {
          subLedgerName: "Sub Ledger Name",
          headName: "Head Name",
          openingBalance: "Opening Balance",
        },
      },''',
    },
    "hi": {
        "demandMaster": '''      demandMaster: {
        title: "डिमांड मास्टर",
        fields: {
          loanProduct: "ऋण उत्पाद",
          depositProduct: "जमा उत्पाद",
        },
        placeholders: {
          loanProduct: "ऋण उत्पाद चुनें",
          searchLoanProduct: "ऋण उत्पाद खोजें...",
          depositProduct: "जमा उत्पाद चुनें",
          searchDepositProduct: "जमा उत्पाद खोजें...",
        },
        buttons: {
          add: "जोड़ें",
        },
      },''',
        "depositAgent": '''      depositAgent: {
        title: "जमा एजेंट",
        fields: {
          agentName: "एजेंट नाम",
          address: "पता",
          mobileNo: "मोबाइल नंबर",
          email: "ईमेल",
          depositAmount: "जमा राशि",
          maximumDays: "अधिकतम दिन",
          maximumDeposit: "अधिकतम जमा",
          paymentType: "भुगतान प्रकार",
          payoutAmount: "पेआउट राशि",
        },
        placeholders: {
          agentName: "एजेंट नाम दर्ज करें",
          address: "पता दर्ज करें",
          mobileNo: "मोबाइल नंबर दर्ज करें",
          email: "ईमेल दर्ज करें",
          depositAmount: "जमा राशि दर्ज करें",
          maximumDays: "अधिकतम दिन दर्ज करें",
          maximumDeposit: "अधिकतम जमा दर्ज करें",
          paymentType: "भुगतान प्रकार चुनें",
          searchPaymentType: "भुगतान प्रकार खोजें...",
          payoutAmount: "पेआउट राशि दर्ज करें",
        },
        buttons: {
          add: "जोड़ें",
        },
      },''',
        "depositInterestSetup": '''      depositInterestSetup: {
        title: "जमा ब्याज सेटअप",
        fields: {
          productName: "उत्पाद",
          effectFrom: "प्रभाव तिथि से",
          minimumDuration: "न्यूनतम अवधि",
          maximumDuration: "अधिकतम अवधि",
          durationUnit: "अवधि इकाई",
          rateOfInterest: "ब्याज दर",
        },
        placeholders: {
          productName: "उत्पाद चुनें",
          searchProductName: "उत्पाद खोजें...",
          effectFrom: "तारीख चुनें",
          minimumDuration: "न्यूनतम अवधि दर्ज करें",
          maximumDuration: "अधिकतम अवधि दर्ज करें",
          durationUnit: "अवधि इकाई चुनें",
          searchDurationUnit: "अवधि इकाई खोजें...",
          rateOfInterest: "ब्याज दर दर्ज करें",
        },
        table: {
          caption: "आपके जमा ब्याज उत्पाद की सूची।",
          productName: "उत्पाद नाम",
          effectFrom: "प्रभाव से",
          rateOfInterest: "ब्याज दर",
          noData: "कोई डेटा नहीं मिला।",
        },
        buttons: {
          add: "जोड़ें",
          submit: "सबमिट करें",
        },
      },''',
        "shareProduct": '''      shareProduct: {
        title: "शेयर उत्पाद",
        fields: {
          memberType: "सदस्य प्रकार",
          admissionFees: "प्रवेश शुल्क",
          ratePerShare: "प्रति शेयर दर",
        },
        placeholders: {
          memberType: "सदस्य प्रकार चुनें",
          searchMemberType: "सदस्य प्रकार खोजें...",
          admissionFees: "प्रवेश शुल्क दर्ज करें",
          ratePerShare: "प्रति शेयर दर दर्ज करें",
        },
        buttons: {
          add: "जोड़ें",
        },
      },''',
        "subLedger": '''      subLedger: {
        title: "उप लेजर",
        addNew: "नया उप लेजर जोड़ें",
        fields: {
          ledgerName: "लेजर नाम",
          underHead: "अंडर हेड",
          openingBalance: "प्रारंभिक शेष",
        },
        placeholders: {
          ledgerName: "लेजर नाम दर्ज करें",
          underHead: "अंडर हेड चुनें",
          searchUnderHead: "अंडर हेड खोजें...",
          openingBalance: "प्रारंभिक शेष दर्ज करें",
        },
        table: {
          subLedgerName: "उप लेजर नाम",
          headName: "हेड नाम",
          openingBalance: "प्रारंभिक शेष",
        },
      },''',
    },
    "bn": {
        "demandMaster": '''      demandMaster: {
        title: "ডিমান্ড মাস্টার",
        fields: {
          loanProduct: "ঋণ পণ্য",
          depositProduct: "ডিপোজিট পণ্য",
        },
        placeholders: {
          loanProduct: "ঋণ পণ্য নির্বাচন করুন",
          searchLoanProduct: "ঋণ পণ্য অনুসন্ধান করুন...",
          depositProduct: "ডিপোজিট পণ্য নির্বাচন করুন",
          searchDepositProduct: "ডিপোজিট পণ্য অনুসন্ধান করুন...",
        },
        buttons: {
          add: "যোগ করুন",
        },
      },''',
        "depositAgent": '''      depositAgent: {
        title: "ডিপোজিট এজেন্ট",
        fields: {
          agentName: "এজেন্টের নাম",
          address: "ঠিকানা",
          mobileNo: "মোবাইল নম্বর",
          email: "ইমেইল",
          depositAmount: "ডিপোজিট পরিমাণ",
          maximumDays: "সর্বোচ্চ দিন",
          maximumDeposit: "সর্বোচ্চ ডিপোজিট",
          paymentType: "পেমেন্টের ধরন",
          payoutAmount: "পেআউট পরিমাণ",
        },
        placeholders: {
          agentName: "এজেন্টের নাম লিখুন",
          address: "ঠিকানা লিখুন",
          mobileNo: "মোবাইল নম্বর লিখুন",
          email: "ইমেইল লিখুন",
          depositAmount: "ডিপোজিট পরিমাণ লিখুন",
          maximumDays: "সর্বোচ্চ দিন লিখুন",
          maximumDeposit: "সর্বোচ্চ ডিপোজিট লিখুন",
          paymentType: "পেমেন্টের ধরন নির্বাচন করুন",
          searchPaymentType: "পেমেন্টের ধরন অনুসন্ধান করুন...",
          payoutAmount: "পেআউট পরিমাণ লিখুন",
        },
        buttons: {
          add: "যোগ করুন",
        },
      },''',
        "depositInterestSetup": '''      depositInterestSetup: {
        title: "ডিপোজিট সুদ সেটআপ",
        fields: {
          productName: "পণ্য",
          effectFrom: "কার্যকর তারিখ",
          minimumDuration: "সর্বনিম্ন সময়কাল",
          maximumDuration: "সর্বোচ্চ সময়কাল",
          durationUnit: "সময়কালের একক",
          rateOfInterest: "সুদের হার",
        },
        placeholders: {
          productName: "পণ্য নির্বাচন করুন",
          searchProductName: "পণ্য অনুসন্ধান করুন...",
          effectFrom: "তারিখ নির্বাচন করুন",
          minimumDuration: "সর্বনিম্ন সময়কাল লিখুন",
          maximumDuration: "সর্বোচ্চ সময়কাল লিখুন",
          durationUnit: "সময়কালের একক নির্বাচন করুন",
          searchDurationUnit: "সময়কালের একক অনুসন্ধান করুন...",
          rateOfInterest: "সুদের হার লিখুন",
        },
        table: {
          caption: "আপনার ডিপোজিট সুদ পণ্যের তালিকা।",
          productName: "পণ্যের নাম",
          effectFrom: "কার্যকর তারিখ",
          rateOfInterest: "সুদের হার",
          noData: "কোনো তথ্য পাওয়া যায়নি।",
        },
        buttons: {
          add: "যোগ করুন",
          submit: "জমা দিন",
        },
      },''',
        "shareProduct": '''      shareProduct: {
        title: "শেয়ার পণ্য",
        fields: {
          memberType: "সদস্যের ধরন",
          admissionFees: "ভর্তি ফি",
          ratePerShare: "প্রতি শেয়ার হার",
        },
        placeholders: {
          memberType: "সদস্যের ধরন নির্বাচন করুন",
          searchMemberType: "সদস্যের ধরন অনুসন্ধান করুন...",
          admissionFees: "ভর্তি ফি লিখুন",
          ratePerShare: "প্রতি শেয়ার হার লিখুন",
        },
        buttons: {
          add: "যোগ করুন",
        },
      },''',
        "subLedger": '''      subLedger: {
        title: "সাব লেজার",
        addNew: "নতুন সাব লেজার যোগ করুন",
        fields: {
          ledgerName: "লেজারের নাম",
          underHead: "আন্ডার হেড",
          openingBalance: "প্রারম্ভিক ব্যালেন্স",
        },
        placeholders: {
          ledgerName: "লেজারের নাম লিখুন",
          underHead: "আন্ডার হেড নির্বাচন করুন",
          searchUnderHead: "আন্ডার হেড অনুসন্ধান করুন...",
          openingBalance: "প্রারম্ভিক ব্যালেন্স লিখুন",
        },
        table: {
          subLedgerName: "সাব লেজারের নাম",
          headName: "হেডের নাম",
          openingBalance: "প্রারম্ভিক ব্যালেন্স",
        },
      },''',
    },
    "or": {
        "demandMaster": '''      demandMaster: {
        title: "ଡିମାଣ୍ଡ ମାଷ୍ଟର",
        fields: {
          loanProduct: "ଋଣ ଉତ୍ପାଦ",
          depositProduct: "ଜମା ଉତ୍ପାଦ",
        },
        placeholders: {
          loanProduct: "ଋଣ ଉତ୍ପାଦ ଚୟନ କରନ୍ତୁ",
          searchLoanProduct: "ଋଣ ଉତ୍ପାଦ ଖୋଜନ୍ତୁ...",
          depositProduct: "ଜମା ଉତ୍ପାଦ ଚୟନ କରନ୍ତୁ",
          searchDepositProduct: "ଜମା ଉତ୍ପାଦ ଖୋଜନ୍ତୁ...",
        },
        buttons: {
          add: "ଯୋଡନ୍ତୁ",
        },
      },''',
        "depositAgent": '''      depositAgent: {
        title: "ଜମା ଏଜେଣ୍ଟ",
        fields: {
          agentName: "ଏଜେଣ୍ଟ ନାମ",
          address: "ଠିକଣା",
          mobileNo: "ମୋବାଇଲ୍ ନମ୍ବର",
          email: "ଇମେଲ୍",
          depositAmount: "ଜମା ରାଶି",
          maximumDays: "ସର୍ବାଧିକ ଦିନ",
          maximumDeposit: "ସର୍ବାଧିକ ଜମା",
          paymentType: "ପେମେଣ୍ଟ ପ୍ରକାର",
          payoutAmount: "ପେଆଉଟ୍ ରାଶି",
        },
        placeholders: {
          agentName: "ଏଜେଣ୍ଟ ନାମ ଲେଖନ୍ତୁ",
          address: "ଠିକଣା ଲେଖନ୍ତୁ",
          mobileNo: "ମୋବାଇଲ୍ ନମ୍ବର ଲେଖନ୍ତୁ",
          email: "ଇମେଲ୍ ଲେଖନ୍ତୁ",
          depositAmount: "ଜମା ରାଶି ଲେଖନ୍ତୁ",
          maximumDays: "ସର୍ବାଧିକ ଦିନ ଲେଖନ୍ତୁ",
          maximumDeposit: "ସର୍ବାଧିକ ଜମା ଲେଖନ୍ତୁ",
          paymentType: "ପେମେଣ୍ଟ ପ୍ରକାର ଚୟନ କରନ୍ତୁ",
          searchPaymentType: "ପେମେଣ୍ଟ ପ୍ରକାର ଖୋଜନ୍ତୁ...",
          payoutAmount: "ପେଆଉଟ୍ ରାଶି ଲେଖନ୍ତୁ",
        },
        buttons: {
          add: "ଯୋଡନ୍ତୁ",
        },
      },''',
        "depositInterestSetup": '''      depositInterestSetup: {
        title: "ଜମା ସୁଧ ସେଟଅପ୍",
        fields: {
          productName: "ଉତ୍ପାଦ",
          effectFrom: "ପ୍ରଭାବିତ ତାରିଖ",
          minimumDuration: "ସର୍ବନିମ୍ନ ଅବଧି",
          maximumDuration: "ସର୍ବାଧିକ ଅବଧି",
          durationUnit: "ଅବଧି ଏକକ",
          rateOfInterest: "ସୁଧ ହାର",
        },
        placeholders: {
          productName: "ଉତ୍ପାଦ ଚୟନ କରନ୍ତୁ",
          searchProductName: "ଉତ୍ପାଦ ଖୋଜନ୍ତୁ...",
          effectFrom: "ତାରିଖ ଚୟନ କରନ୍ତୁ",
          minimumDuration: "ସର୍ବନିମ୍ନ ଅବଧି ଲେଖନ୍ତୁ",
          maximumDuration: "ସର୍ବାଧିକ ଅବଧି ଲେଖନ୍ତୁ",
          durationUnit: "ଅବଧି ଏକକ ଚୟନ କରନ୍ତୁ",
          searchDurationUnit: "ଅବଧି ଏକକ ଖୋଜନ୍ତୁ...",
          rateOfInterest: "ସୁଧ ହାର ଲେଖନ୍ତୁ",
        },
        table: {
          caption: "ଆପଣଙ୍କ ଜମା ସୁଧ ଉତ୍ପାଦର ତାଲିକା।",
          productName: "ଉତ୍ପାଦ ନାମ",
          effectFrom: "ପ୍ରଭାବିତ ତାରିଖ",
          rateOfInterest: "ସୁଧ ହାର",
          noData: "କୌଣସି ତଥ୍ୟ ମିଳିଲା ନାହିଁ।",
        },
        buttons: {
          add: "ଯୋଡନ୍ତୁ",
          submit: "ଦାଖଲ କରନ୍ତୁ",
        },
      },''',
        "shareProduct": '''      shareProduct: {
        title: "ସେୟାର ଉତ୍ପାଦ",
        fields: {
          memberType: "ସଦସ୍ୟ ପ୍ରକାର",
          admissionFees: "ଭର୍ତ୍ତି ଫି",
          ratePerShare: "ପ୍ରତି ସେୟାର ହାର",
        },
        placeholders: {
          memberType: "ସଦସ୍ୟ ପ୍ରକାର ଚୟନ କରନ୍ତୁ",
          searchMemberType: "ସଦସ୍ୟ ପ୍ରକାର ଖୋଜନ୍ତୁ...",
          admissionFees: "ଭର୍ତ୍ତି ଫି ଲେଖନ୍ତୁ",
          ratePerShare: "ପ୍ରତି ସେୟାର ହାର ଲେଖନ୍ତୁ",
        },
        buttons: {
          add: "ଯୋଡନ୍ତୁ",
        },
      },''',
        "subLedger": '''      subLedger: {
        title: "ସବ୍ ଲେଜର",
        addNew: "ନୂଆ ସବ୍ ଲେଜର ଯୋଡନ୍ତୁ",
        fields: {
          ledgerName: "ଲେଜର ନାମ",
          underHead: "ଅଣ୍ଡର ହେଡ୍",
          openingBalance: "ପ୍ରାରମ୍ଭିକ ବାଲାନ୍ସ",
        },
        placeholders: {
          ledgerName: "ଲେଜର ନାମ ଲେଖନ୍ତୁ",
          underHead: "ଅଣ୍ଡର ହେଡ୍ ଚୟନ କରନ୍ତୁ",
          searchUnderHead: "ଅଣ୍ଡର ହେଡ୍ ଖୋଜନ୍ତୁ...",
          openingBalance: "ପ୍ରାରମ୍ଭିକ ବାଲାନ୍ସ ଲେଖନ୍ତୁ",
        },
        table: {
          subLedgerName: "ସବ୍ ଲେଜର ନାମ",
          headName: "ହେଡ୍ ନାମ",
          openingBalance: "ପ୍ରାରମ୍ଭିକ ବାଲାନ୍ସ",
        },
      },''',
    },
}

UNIT_EXTRA = {
    "en": ('unitName: "Unit Name",', 'unitName: "Unit Name",\n          unitNumber: "Unit Number",'),
    "hi": ('unitName: "यूनिट का नाम",', 'unitName: "यूनिट का नाम",\n          unitNumber: "यूनिट संख्या",'),
    "bn": ('unitName: "ইউনিটের নাম",', 'unitName: "ইউনিটের নাম",\n          unitNumber: "ইউনিট নম্বর",'),
    "or": ('unitName: "ୟୁନିଟ୍ ନାମ",', 'unitName: "ୟୁନିଟ୍ ନାମ",\n          unitNumber: "ୟୁନିଟ୍ ନମ୍ବର",'),
}
UNIT_PH = {
    "en": ('unitName: "Enter unit name",', 'unitName: "Enter unit name",\n          unitNumber: "Enter unit number",'),
    "hi": ('unitName: "यूनिट का नाम दर्ज करें",', 'unitName: "यूनिट का नाम दर्ज करें",\n          unitNumber: "यूनिट संख्या दर्ज करें",'),
    "bn": ('unitName: "ইউনিটের নাম লিখুন",', 'unitName: "ইউনিটের নাম লিখুন",\n          unitNumber: "ইউনিট নম্বর লিখুন",'),
    "or": ('unitName: "ୟୁନିଟ୍ ନାମ ଲେଖନ୍ତୁ",', 'unitName: "ୟୁନିଟ୍ ନାମ ଲେଖନ୍ତୁ",\n          unitNumber: "ୟୁନିଟ୍ ନମ୍ବର ଲେଖନ୍ତୁ",'),
}
UNIT_TBL = {
    "en": ('unitName: "Unit Name",\n          pinCode:', 'unitName: "Unit Name",\n          unitNumber: "Unit Number",\n          pinCode:'),
    "hi": ('unitName: "यूनिट का नाम",\n          pinCode:', 'unitName: "यूनिट का नाम",\n          unitNumber: "यूनिट संख्या",\n          pinCode:'),
    "bn": ('unitName: "ইউনিটের নাম",\n          pinCode:', 'unitName: "ইউনিটের নাম",\n          unitNumber: "ইউনিট নম্বর",\n          pinCode:'),
    "or": ('unitName: "ୟୁନିଟ୍ ନାମ",\n          pinCode:', 'unitName: "ୟୁନିଟ୍ ନାମ",\n          unitNumber: "ୟୁନିଟ୍ ନମ୍ବର",\n          pinCode:'),
}


def replace_block(text, key, new_block):
    start = text.find(f"      {key}: {{")
    if start < 0:
        raise SystemExit(f"missing {key}")
    # find matching closing at indent of 6 spaces + },
    i = start
    depth = 0
    while i < len(text):
        if text[i] == "{":
            depth += 1
        elif text[i] == "}":
            depth -= 1
            if depth == 0:
                # include trailing comma/newline
                end = i + 1
                if end < len(text) and text[end] == ",":
                    end += 1
                return text[:start] + new_block + text[end:]
        i += 1
    raise SystemExit(f"unclosed {key}")


def main():
    for lang in ("en", "hi", "bn", "or"):
        path = root / f"{lang}.js"
        text = path.read_text(encoding="utf-8")
        for key, block in PATCHES[lang].items():
            text = replace_block(text, key, block)
        # unit number extras (fields block inside operationalArea)
        old, new = UNIT_EXTRA[lang]
        if "unitNumber:" not in text.split("operationalArea:")[1].split("passbookSettings:")[0]:
            # only first fields occurrence of unitName in operationalArea
            oa_start = text.find("operationalArea:")
            oa_end = text.find("passbookSettings:", oa_start)
            oa = text[oa_start:oa_end]
            oa2 = oa.replace(UNIT_EXTRA[lang][0], UNIT_EXTRA[lang][1], 1)
            oa2 = oa2.replace(UNIT_PH[lang][0], UNIT_PH[lang][1], 1)
            oa2 = oa2.replace(UNIT_TBL[lang][0], UNIT_TBL[lang][1], 1)
            text = text[:oa_start] + oa2 + text[oa_end:]
        path.write_text(text, encoding="utf-8")
        print("patched", path.name)


if __name__ == "__main__":
    main()
