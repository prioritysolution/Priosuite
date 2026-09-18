# -*- coding: utf-8 -*-
"""Insert master.loanProduct locales and wire loanProduct components."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
LOC = ROOT / "i18n" / "locales"
COMP = ROOT / "components" / "master" / "loanProduct"

EN = {
    "title": "Loan Product",
    "addNew": "Add New",
    "addTitle": "Add Loan Product",
    "editTitle": "Edit Loan Product",
    "addDesc": "Fill in the details to add a new loan product.",
    "editDesc": "Update the selected loan product details below.",
    "fields": {
        "productType": "Product Type",
        "loanType": "Loan Type",
        "productName": "Product Name",
        "shortName": "Short Name",
        "minAmount": "Minimum Amount",
        "maxAmount": "Maximum Amount",
        "minDuration": "Minimum Duration",
        "maxDuration": "Maximum Duration",
        "durationUnit": "Duration Unit",
        "roi": "Rate of Interest",
        "principalCurrentGl": "Principal Current GL",
        "principalOverdueGl": "Principal Overdue GL",
        "interestCurrentGl": "Interest Current GL",
        "interestOverdueGl": "Interest Overdue GL",
        "overdueApplicable": "Overdue Applicable",
        "overdueOn": "Overdue On",
        "overdueCount": "Overdue Count",
        "overdueRate": "Overdue Rate",
        "graceDays": "Grace Days",
        "graceOn": "Grace On",
        "npaApplicable": "NPA Applicable",
        "npaAfter": "NPA After (Months)",
        "securedDepositProduct": "Secured Deposit Product",
        "maxAllowed": "Max Allowed",
        "memberType": "Member Type",
        "financeType": "Finance Type",
        "projectLoan": "Project Loan",
        "mortgageRequired": "Mortgage Required",
        "guarantorRequired": "Guarantor Required",
        "provisionCurrentGl": "Provision Current GL",
        "provisionOverdueGl": "Provision Overdue GL",
    },
    "placeholders": {
        "productType": "Select product type",
        "searchProductType": "Search product type...",
        "loanType": "Select loan type",
        "searchLoanType": "Search loan type...",
        "productName": "Enter product name",
        "shortName": "Enter short name",
        "minAmount": "Enter minimum amount",
        "maxAmount": "Enter maximum amount",
        "minDuration": "Enter minimum duration",
        "maxDuration": "Enter maximum duration",
        "durationUnit": "Select duration unit",
        "searchDurationUnit": "Search duration unit...",
        "roi": "Enter ROI",
        "principalCurrentGl": "Select principal current GL",
        "principalOverdueGl": "Select principal overdue GL",
        "interestCurrentGl": "Select interest current GL",
        "interestOverdueGl": "Select interest overdue GL",
        "searchLedger": "Search ledger...",
        "overdueApplicable": "Select overdue applicable",
        "search": "Search...",
        "overdueOn": "Select overdue on",
        "searchOverdueOn": "Search overdue on...",
        "overdueCount": "Enter overdue count",
        "overdueRate": "Enter overdue rate",
        "graceDays": "Enter grace days",
        "graceOn": "Select grace on",
        "searchGraceOn": "Search grace on...",
        "npaApplicable": "Select NPA applicable",
        "npaAfter": "Enter NPA after months",
        "securedProduct": "Select secured product",
        "searchProduct": "Search product...",
        "maxAllowed": "Enter max allowed",
        "memberType": "Select member type",
        "searchMemberType": "Search member type...",
        "financeType": "Select finance type",
        "searchFinanceType": "Search finance type...",
        "projectLoan": "Select project loan",
        "mortgageRequired": "Select mortgage required",
        "guarantorRequired": "Select guarantor required",
        "provisionCurrentGl": "Select provision current GL",
        "provisionOverdueGl": "Select provision overdue GL",
    },
    "table": {
        "productName": "Product Name",
        "shortName": "Short Name",
        "productType": "Product Type",
        "loanType": "Loan Type",
        "minAmt": "Min Amt",
        "maxAmt": "Max Amt",
        "roi": "ROI",
        "durationUnit": "Duration Unit",
        "status": "Status",
    },
}

HI_FIELDS = {
    "productType": "उत्पाद प्रकार",
    "loanType": "ऋण प्रकार",
    "productName": "उत्पाद का नाम",
    "shortName": "संक्षिप्त नाम",
    "minAmount": "न्यूनतम राशि",
    "maxAmount": "अधिकतम राशि",
    "minDuration": "न्यूनतम अवधि",
    "maxDuration": "अधिकतम अवधि",
    "durationUnit": "अवधि इकाई",
    "roi": "ब्याज दर",
    "principalCurrentGl": "मूल चालू GL",
    "principalOverdueGl": "मूल अतिदेय GL",
    "interestCurrentGl": "ब्याज चालू GL",
    "interestOverdueGl": "ब्याज अतिदेय GL",
    "overdueApplicable": "अतिदेय लागू",
    "overdueOn": "अतिदेय पर",
    "overdueCount": "अतिदेय संख्या",
    "overdueRate": "अतिदेय दर",
    "graceDays": "छूट दिन",
    "graceOn": "छूट पर",
    "npaApplicable": "NPA लागू",
    "npaAfter": "NPA के बाद (महीने)",
    "securedDepositProduct": "सुरक्षित जमा उत्पाद",
    "maxAllowed": "अधिकतम अनुमत",
    "memberType": "सदस्य प्रकार",
    "financeType": "वित्त प्रकार",
    "projectLoan": "परियोजना ऋण",
    "mortgageRequired": "बंधक आवश्यक",
    "guarantorRequired": "गारंटर आवश्यक",
    "provisionCurrentGl": "प्रावधान चालू GL",
    "provisionOverdueGl": "प्रावधान अतिदेय GL",
}

HI_PH = {
    "productType": "उत्पाद प्रकार चुनें",
    "searchProductType": "उत्पाद प्रकार खोजें...",
    "loanType": "ऋण प्रकार चुनें",
    "searchLoanType": "ऋण प्रकार खोजें...",
    "productName": "उत्पाद का नाम दर्ज करें",
    "shortName": "संक्षिप्त नाम दर्ज करें",
    "minAmount": "न्यूनतम राशि दर्ज करें",
    "maxAmount": "अधिकतम राशि दर्ज करें",
    "minDuration": "न्यूनतम अवधि दर्ज करें",
    "maxDuration": "अधिकतम अवधि दर्ज करें",
    "durationUnit": "अवधि इकाई चुनें",
    "searchDurationUnit": "अवधि इकाई खोजें...",
    "roi": "ROI दर्ज करें",
    "principalCurrentGl": "मूल चालू GL चुनें",
    "principalOverdueGl": "मूल अतिदेय GL चुनें",
    "interestCurrentGl": "ब्याज चालू GL चुनें",
    "interestOverdueGl": "ब्याज अतिदेय GL चुनें",
    "searchLedger": "लेजर खोजें...",
    "overdueApplicable": "अतिदेय लागू चुनें",
    "search": "खोजें...",
    "overdueOn": "अतिदेय पर चुनें",
    "searchOverdueOn": "अतिदेय पर खोजें...",
    "overdueCount": "अतिदेय संख्या दर्ज करें",
    "overdueRate": "अतिदेय दर दर्ज करें",
    "graceDays": "छूट दिन दर्ज करें",
    "graceOn": "छूट पर चुनें",
    "searchGraceOn": "छूट पर खोजें...",
    "npaApplicable": "NPA लागू चुनें",
    "npaAfter": "NPA के बाद महीने दर्ज करें",
    "securedProduct": "सुरक्षित उत्पाद चुनें",
    "searchProduct": "उत्पाद खोजें...",
    "maxAllowed": "अधिकतम अनुमत दर्ज करें",
    "memberType": "सदस्य प्रकार चुनें",
    "searchMemberType": "सदस्य प्रकार खोजें...",
    "financeType": "वित्त प्रकार चुनें",
    "searchFinanceType": "वित्त प्रकार खोजें...",
    "projectLoan": "परियोजना ऋण चुनें",
    "mortgageRequired": "बंधक आवश्यक चुनें",
    "guarantorRequired": "गारंटर आवश्यक चुनें",
    "provisionCurrentGl": "प्रावधान चालू GL चुनें",
    "provisionOverdueGl": "प्रावधान अतिदेय GL चुनें",
}

HI = {
    **EN,
    "title": "ऋण उत्पाद",
    "addNew": "नया जोड़ें",
    "addTitle": "ऋण उत्पाद जोड़ें",
    "editTitle": "ऋण उत्पाद संपादित करें",
    "addDesc": "नया ऋण उत्पाद जोड़ने के लिए विवरण भरें।",
    "editDesc": "नीचे चयनित ऋण उत्पाद विवरण अपडेट करें।",
    "fields": {**EN["fields"], **HI_FIELDS},
    "placeholders": {**EN["placeholders"], **HI_PH},
    "table": {
        "productName": "उत्पाद का नाम",
        "shortName": "संक्षिप्त नाम",
        "productType": "उत्पाद प्रकार",
        "loanType": "ऋण प्रकार",
        "minAmt": "न्यून. राशि",
        "maxAmt": "अधि. राशि",
        "roi": "ROI",
        "durationUnit": "अवधि इकाई",
        "status": "स्थिति",
    },
}

BN_FIELDS = {
    "productType": "পণ্যের ধরন",
    "loanType": "ঋণের ধরন",
    "productName": "পণ্যের নাম",
    "shortName": "সংক্ষিপ্ত নাম",
    "minAmount": "সর্বনিম্ন পরিমাণ",
    "maxAmount": "সর্বোচ্চ পরিমাণ",
    "minDuration": "সর্বনিম্ন মেয়াদ",
    "maxDuration": "সর্বোচ্চ মেয়াদ",
    "durationUnit": "মেয়াদের একক",
    "roi": "সুদের হার",
    "principalCurrentGl": "মূল চলতি GL",
    "principalOverdueGl": "মূল বকেয়া GL",
    "interestCurrentGl": "সুদ চলতি GL",
    "interestOverdueGl": "সুদ বকেয়া GL",
    "overdueApplicable": "বকেয়া প্রযোজ্য",
    "overdueOn": "বকেয়া উপর",
    "overdueCount": "বকেয়া সংখ্যা",
    "overdueRate": "বকেয়া হার",
    "graceDays": "গ্রেস দিন",
    "graceOn": "গ্রেস উপর",
    "npaApplicable": "NPA প্রযোজ্য",
    "npaAfter": "NPA পরে (মাস)",
    "securedDepositProduct": "সুরক্ষিত আমানত পণ্য",
    "maxAllowed": "সর্বোচ্চ অনুমোদিত",
    "memberType": "সদস্যের ধরন",
    "financeType": "অর্থায়নের ধরন",
    "projectLoan": "প্রকল্প ঋণ",
    "mortgageRequired": "বন্ধক প্রয়োজন",
    "guarantorRequired": "গ্যারান্টর প্রয়োজন",
    "provisionCurrentGl": "প্রভিশন চলতি GL",
    "provisionOverdueGl": "প্রভিশন বকেয়া GL",
}

BN_PH = {
    "productType": "পণ্যের ধরন নির্বাচন করুন",
    "searchProductType": "পণ্যের ধরন খুঁজুন...",
    "loanType": "ঋণের ধরন নির্বাচন করুন",
    "searchLoanType": "ঋণের ধরন খুঁজুন...",
    "productName": "পণ্যের নাম লিখুন",
    "shortName": "সংক্ষিপ্ত নাম লিখুন",
    "minAmount": "সর্বনিম্ন পরিমাণ লিখুন",
    "maxAmount": "সর্বোচ্চ পরিমাণ লিখুন",
    "minDuration": "সর্বনিম্ন মেয়াদ লিখুন",
    "maxDuration": "সর্বোচ্চ মেয়াদ লিখুন",
    "durationUnit": "মেয়াদের একক নির্বাচন করুন",
    "searchDurationUnit": "মেয়াদের একক খুঁজুন...",
    "roi": "ROI লিখুন",
    "principalCurrentGl": "মূল চলতি GL নির্বাচন করুন",
    "principalOverdueGl": "মূল বকেয়া GL নির্বাচন করুন",
    "interestCurrentGl": "সুদ চলতি GL নির্বাচন করুন",
    "interestOverdueGl": "সুদ বকেয়া GL নির্বাচন করুন",
    "searchLedger": "লেজার খুঁজুন...",
    "overdueApplicable": "বকেয়া প্রযোজ্য নির্বাচন করুন",
    "search": "খুঁজুন...",
    "overdueOn": "বকেয়া উপর নির্বাচন করুন",
    "searchOverdueOn": "বকেয়া উপর খুঁজুন...",
    "overdueCount": "বকেয়া সংখ্যা লিখুন",
    "overdueRate": "বকেয়া হার লিখুন",
    "graceDays": "গ্রেস দিন লিখুন",
    "graceOn": "গ্রেস উপর নির্বাচন করুন",
    "searchGraceOn": "গ্রেস উপর খুঁজুন...",
    "npaApplicable": "NPA প্রযোজ্য নির্বাচন করুন",
    "npaAfter": "NPA পরে মাস লিখুন",
    "securedProduct": "সুরক্ষিত পণ্য নির্বাচন করুন",
    "searchProduct": "পণ্য খুঁজুন...",
    "maxAllowed": "সর্বোচ্চ অনুমোদিত লিখুন",
    "memberType": "সদস্যের ধরন নির্বাচন করুন",
    "searchMemberType": "সদস্যের ধরন খুঁজুন...",
    "financeType": "অর্থায়নের ধরন নির্বাচন করুন",
    "searchFinanceType": "অর্থায়নের ধরন খুঁজুন...",
    "projectLoan": "প্রকল্প ঋণ নির্বাচন করুন",
    "mortgageRequired": "বন্ধক প্রয়োজন নির্বাচন করুন",
    "guarantorRequired": "গ্যারান্টর প্রয়োজন নির্বাচন করুন",
    "provisionCurrentGl": "প্রভিশন চলতি GL নির্বাচন করুন",
    "provisionOverdueGl": "প্রভিশন বকেয়া GL নির্বাচন করুন",
}

BN = {
    **EN,
    "title": "ঋণ পণ্য",
    "addNew": "নতুন যোগ করুন",
    "addTitle": "ঋণ পণ্য যোগ করুন",
    "editTitle": "ঋণ পণ্য সম্পাদনা",
    "addDesc": "নতুন ঋণ পণ্য যোগ করতে বিবরণ পূরণ করুন।",
    "editDesc": "নিচে নির্বাচিত ঋণ পণ্যের বিবরণ আপডেট করুন।",
    "fields": {**EN["fields"], **BN_FIELDS},
    "placeholders": {**EN["placeholders"], **BN_PH},
    "table": {
        "productName": "পণ্যের নাম",
        "shortName": "সংক্ষিপ্ত নাম",
        "productType": "পণ্যের ধরন",
        "loanType": "ঋণের ধরন",
        "minAmt": "সর্বনিম্ন",
        "maxAmt": "সর্বোচ্চ",
        "roi": "ROI",
        "durationUnit": "মেয়াদের একক",
        "status": "স্থিতি",
    },
}

OR_FIELDS = {
    "productType": "ଉତ୍ପାଦ ପ୍ରକାର",
    "loanType": "ଋଣ ପ୍ରକାର",
    "productName": "ଉତ୍ପାଦ ନାମ",
    "shortName": "ସଂକ୍ଷିପ୍ତ ନାମ",
    "minAmount": "ସର୍ବନିମ୍ନ ରାଶି",
    "maxAmount": "ସର୍ବାଧିକ ରାଶି",
    "minDuration": "ସର୍ବନିମ୍ନ ଅବଧି",
    "maxDuration": "ସର୍ବାଧିକ ଅବଧି",
    "durationUnit": "ଅବଧି ଏକକ",
    "roi": "ସୁଧ ହାର",
    "principalCurrentGl": "ମୂଳ ଚାଲୁ GL",
    "principalOverdueGl": "ମୂଳ ବକେୟା GL",
    "interestCurrentGl": "ସୁଧ ଚାଲୁ GL",
    "interestOverdueGl": "ସୁଧ ବକେୟା GL",
    "overdueApplicable": "ବକେୟା ପ୍ରଯୁଜ୍ୟ",
    "overdueOn": "ବକେୟା ଉପରେ",
    "overdueCount": "ବକେୟା ସଂଖ୍ୟା",
    "overdueRate": "ବକେୟା ହାର",
    "graceDays": "ଗ୍ରେସ୍ ଦିନ",
    "graceOn": "ଗ୍ରେସ୍ ଉପରେ",
    "npaApplicable": "NPA ପ୍ରଯୁଜ୍ୟ",
    "npaAfter": "NPA ପରେ (ମାସ)",
    "securedDepositProduct": "ସୁରକ୍ଷିତ ଜମା ଉତ୍ପାଦ",
    "maxAllowed": "ସର୍ବାଧିକ ଅନୁମୋଦିତ",
    "memberType": "ସଦସ୍ୟ ପ୍ରକାର",
    "financeType": "ଅର୍ଥାୟନ ପ୍ରକାର",
    "projectLoan": "ପ୍ରକଳ୍ପ ଋଣ",
    "mortgageRequired": "ବନ୍ଧକ ଆବଶ୍ୟକ",
    "guarantorRequired": "ଗ୍ୟାରେଣ୍ଟର୍ ଆବଶ୍ୟକ",
    "provisionCurrentGl": "ପ୍ରଭିଜନ୍ ଚାଲୁ GL",
    "provisionOverdueGl": "ପ୍ରଭିଜନ୍ ବକେୟା GL",
}

OR_PH = {
    "productType": "ଉତ୍ପାଦ ପ୍ରକାର ବାଛନ୍ତୁ",
    "searchProductType": "ଉତ୍ପାଦ ପ୍ରକାର ଖୋଜନ୍ତୁ...",
    "loanType": "ଋଣ ପ୍ରକାର ବାଛନ୍ତୁ",
    "searchLoanType": "ଋଣ ପ୍ରକାର ଖୋଜନ୍ତୁ...",
    "productName": "ଉତ୍ପାଦ ନାମ ଲେଖନ୍ତୁ",
    "shortName": "ସଂକ୍ଷିପ୍ତ ନାମ ଲେଖନ୍ତୁ",
    "minAmount": "ସର୍ବନିମ୍ନ ରାଶି ଲେଖନ୍ତୁ",
    "maxAmount": "ସର୍ବାଧିକ ରାଶି ଲେଖନ୍ତୁ",
    "minDuration": "ସର୍ବନିମ୍ନ ଅବଧି ଲେଖନ୍ତୁ",
    "maxDuration": "ସର୍ବାଧିକ ଅବଧି ଲେଖନ୍ତୁ",
    "durationUnit": "ଅବଧି ଏକକ ବାଛନ୍ତୁ",
    "searchDurationUnit": "ଅବଧି ଏକକ ଖୋଜନ୍ତୁ...",
    "roi": "ROI ଲେଖନ୍ତୁ",
    "principalCurrentGl": "ମୂଳ ଚାଲୁ GL ବାଛନ୍ତୁ",
    "principalOverdueGl": "ମୂଳ ବକେୟା GL ବାଛନ୍ତୁ",
    "interestCurrentGl": "ସୁଧ ଚାଲୁ GL ବାଛନ୍ତୁ",
    "interestOverdueGl": "ସୁଧ ବକେୟା GL ବାଛନ୍ତୁ",
    "searchLedger": "ଲେଜର୍ ଖୋଜନ୍ତୁ...",
    "overdueApplicable": "ବକେୟା ପ୍ରଯୁଜ୍ୟ ବାଛନ୍ତୁ",
    "search": "ଖୋଜନ୍ତୁ...",
    "overdueOn": "ବକେୟା ଉପରେ ବାଛନ୍ତୁ",
    "searchOverdueOn": "ବକେୟା ଉପରେ ଖୋଜନ୍ତୁ...",
    "overdueCount": "ବକେୟା ସଂଖ୍ୟା ଲେଖନ୍ତୁ",
    "overdueRate": "ବକେୟା ହାର ଲେଖନ୍ତୁ",
    "graceDays": "ଗ୍ରେସ୍ ଦିନ ଲେଖନ୍ତୁ",
    "graceOn": "ଗ୍ରେସ୍ ଉପରେ ବାଛନ୍ତୁ",
    "searchGraceOn": "ଗ୍ରେସ୍ ଉପରେ ଖୋଜନ୍ତୁ...",
    "npaApplicable": "NPA ପ୍ରଯୁଜ୍ୟ ବାଛନ୍ତୁ",
    "npaAfter": "NPA ପରେ ମାସ ଲେଖନ୍ତୁ",
    "securedProduct": "ସୁରକ୍ଷିତ ଉତ୍ପାଦ ବାଛନ୍ତୁ",
    "searchProduct": "ଉତ୍ପାଦ ଖୋଜନ୍ତୁ...",
    "maxAllowed": "ସର୍ବାଧିକ ଅନୁମୋଦିତ ଲେଖନ୍ତୁ",
    "memberType": "ସଦସ୍ୟ ପ୍ରକାର ବାଛନ୍ତୁ",
    "searchMemberType": "ସଦସ୍ୟ ପ୍ରକାର ଖୋଜନ୍ତୁ...",
    "financeType": "ଅର୍ଥାୟନ ପ୍ରକାର ବାଛନ୍ତୁ",
    "searchFinanceType": "ଅର୍ଥାୟନ ପ୍ରକାର ଖୋଜନ୍ତୁ...",
    "projectLoan": "ପ୍ରକଳ୍ପ ଋଣ ବାଛନ୍ତୁ",
    "mortgageRequired": "ବନ୍ଧକ ଆବଶ୍ୟକ ବାଛନ୍ତୁ",
    "guarantorRequired": "ଗ୍ୟାରେଣ୍ଟର୍ ଆବଶ୍ୟକ ବାଛନ୍ତୁ",
    "provisionCurrentGl": "ପ୍ରଭିଜନ୍ ଚାଲୁ GL ବାଛନ୍ତୁ",
    "provisionOverdueGl": "ପ୍ରଭିଜନ୍ ବକେୟା GL ବାଛନ୍ତୁ",
}

OR_ = {
    **EN,
    "title": "ଋଣ ଉତ୍ପାଦ",
    "addNew": "ନୂଆ ଯୋଡନ୍ତୁ",
    "addTitle": "ଋଣ ଉତ୍ପାଦ ଯୋଡନ୍ତୁ",
    "editTitle": "ଋଣ ଉତ୍ପାଦ ସମ୍ପାଦନା",
    "addDesc": "ନୂଆ ଋଣ ଉତ୍ପାଦ ଯୋଡିବା ପାଇଁ ବିବରଣୀ ପୂରଣ କରନ୍ତୁ।",
    "editDesc": "ନିମ୍ନରେ ବଛା ଋଣ ଉତ୍ପାଦ ବିବରଣୀ ଅପଡେଟ୍ କରନ୍ତୁ।",
    "fields": {**EN["fields"], **OR_FIELDS},
    "placeholders": {**EN["placeholders"], **OR_PH},
    "table": {
        "productName": "ଉତ୍ପାଦ ନାମ",
        "shortName": "ସଂକ୍ଷିପ୍ତ ନାମ",
        "productType": "ଉତ୍ପାଦ ପ୍ରକାର",
        "loanType": "ଋଣ ପ୍ରକାର",
        "minAmt": "ସର୍ବନିମ୍ନ",
        "maxAmt": "ସର୍ବାଧିକ",
        "roi": "ROI",
        "durationUnit": "ଅବଧି ଏକକ",
        "status": "ସ୍ଥିତି",
    },
}

LOCALES = {"en": EN, "hi": HI, "bn": BN, "or": OR_}


def to_js(obj, indent=6):
    pad = " " * indent
    if isinstance(obj, dict):
        items = list(obj.items())
        lines = ["{"]
        for i, (k, v) in enumerate(items):
            comma = "," if i < len(items) - 1 else ""
            if isinstance(v, dict):
                nested = to_js(v, indent + 2)
                lines.append(f"{pad}{k}: {nested}{comma}")
            else:
                esc = str(v).replace("\\", "\\\\").replace('"', '\\"')
                lines.append(f'{pad}{k}: "{esc}"{comma}')
        lines.append(" " * (indent - 2) + "}")
        return "\n".join(lines)
    raise TypeError(type(obj))


def find_block_end(text, brace_idx):
    depth = 0
    i = brace_idx
    while i < len(text):
        if text[i] == "{":
            depth += 1
        elif text[i] == "}":
            depth -= 1
            if depth == 0:
                return i
        i += 1
    raise SystemExit("unclosed")


def insert_locale(lang):
    path = LOC / f"{lang}.js"
    text = path.read_text(encoding="utf-8")
    m_master = re.search(r"\n    master:\s*\{", text)
    if not m_master:
        raise SystemExit(f"{lang}: no master")
    mend = find_block_end(text, m_master.end() - 1)
    master = text[m_master.start() : mend + 1]
    if re.search(r"\n      loanProduct:\s*\{", master):
        print(f"{lang}: master.loanProduct already present")
        return

    # Prefer after depositProduct; fallback passbookSettings
    m = re.search(r"\n      depositProduct:\s*\{", text)
    if not m:
        m = re.search(r"\n      passbookSettings:\s*\{", text)
    if not m:
        raise SystemExit(f"{lang}: no insert anchor")
    end = find_block_end(text, m.end() - 1)
    j = end + 1
    if j < len(text) and text[j] == ",":
        j += 1
    block = "\n      loanProduct: " + to_js(LOCALES[lang], indent=8) + ","
    text = text[:j] + block + text[j:]
    path.write_text(text, encoding="utf-8")
    print(f"{lang}: inserted master.loanProduct")


def ensure_t_import(text):
    if "useTranslation" in text:
        return text
    if text.startswith('"use client"'):
        return text.replace(
            '"use client";\n',
            '"use client";\n\nimport { useTranslation } from "react-i18next";\n',
            1,
        )
    return 'import { useTranslation } from "react-i18next";\n' + text


def write_index():
    path = COMP / "index.jsx"
    text = path.read_text(encoding="utf-8")
    text = ensure_t_import(text)
    if "const { t } = useTranslation();" not in text:
        text = text.replace(
            "}) => {\n  const loanProductList = useSelector(",
            "}) => {\n  const { t } = useTranslation();\n  const loanProductList = useSelector(",
        )
    repls = [
        ("Loan Product\n          </h2>", '{t("master.loanProduct.title")}\n          </h2>'),
        (">\n            Add New\n          </Button>", '>\n            {t("master.loanProduct.addNew")}\n          </Button>'),
        (
            '{isEdit ? "Edit" : "Add"} Loan Product',
            '{isEdit ? t("master.loanProduct.editTitle") : t("master.loanProduct.addTitle")}',
        ),
        (
            """{isEdit
                  ? "Update the selected loan product details below."
                  : "Fill in the details to add a new loan product."}""",
            """{isEdit
                  ? t("master.loanProduct.editDesc")
                  : t("master.loanProduct.addDesc")}""",
        ),
    ]
    for old, new in repls:
        if old not in text:
            print(f"  MISS index: {old[:60]!r}")
        else:
            text = text.replace(old, new, 1)
            print(f"  OK index: {old[:40]!r}")
    path.write_text(text, encoding="utf-8")


def write_form():
    path = COMP / "LoanProductForm.jsx"
    text = path.read_text(encoding="utf-8")
    text = ensure_t_import(text)
    if "const { t } = useTranslation();" not in text:
        text = text.replace(
            "}) => {\n  const productTypeData = useSelector(",
            "}) => {\n  const { t } = useTranslation();\n  const productTypeData = useSelector(",
        )
    repls = [
        ('label="Product Type"', 'label={t("master.loanProduct.fields.productType")}'),
        ('placeholder="Select product type"', 'placeholder={t("master.loanProduct.placeholders.productType")}'),
        ('searchPlaceholder="Search product type..."', 'searchPlaceholder={t("master.loanProduct.placeholders.searchProductType")}'),
        ('label="Loan Type"', 'label={t("master.loanProduct.fields.loanType")}'),
        ('placeholder="Select loan type"', 'placeholder={t("master.loanProduct.placeholders.loanType")}'),
        ('searchPlaceholder="Search loan type..."', 'searchPlaceholder={t("master.loanProduct.placeholders.searchLoanType")}'),
        ('label="Product Name"', 'label={t("master.loanProduct.fields.productName")}'),
        ('placeholder="Enter product name"', 'placeholder={t("master.loanProduct.placeholders.productName")}'),
        ('label="Short Name"', 'label={t("master.loanProduct.fields.shortName")}'),
        ('placeholder="Enter short name"', 'placeholder={t("master.loanProduct.placeholders.shortName")}'),
        ('label="Minimum Amount"', 'label={t("master.loanProduct.fields.minAmount")}'),
        ('placeholder="Enter minimum amount"', 'placeholder={t("master.loanProduct.placeholders.minAmount")}'),
        ('label="Maximum Amount"', 'label={t("master.loanProduct.fields.maxAmount")}'),
        ('placeholder="Enter maximum amount"', 'placeholder={t("master.loanProduct.placeholders.maxAmount")}'),
        ('label="Minimum Duration"', 'label={t("master.loanProduct.fields.minDuration")}'),
        ('placeholder="Enter minimum duration"', 'placeholder={t("master.loanProduct.placeholders.minDuration")}'),
        ('label="Maximum Duration"', 'label={t("master.loanProduct.fields.maxDuration")}'),
        ('placeholder="Enter maximum duration"', 'placeholder={t("master.loanProduct.placeholders.maxDuration")}'),
        ('label="Duration Unit"', 'label={t("master.loanProduct.fields.durationUnit")}'),
        ('placeholder="Select duration unit"', 'placeholder={t("master.loanProduct.placeholders.durationUnit")}'),
        ('searchPlaceholder="Search duration unit..."', 'searchPlaceholder={t("master.loanProduct.placeholders.searchDurationUnit")}'),
        ('label="Rate of Interest"', 'label={t("master.loanProduct.fields.roi")}'),
        ('placeholder="Enter ROI"', 'placeholder={t("master.loanProduct.placeholders.roi")}'),
        ('label="Principal Current GL"', 'label={t("master.loanProduct.fields.principalCurrentGl")}'),
        ('placeholder="Select principal current GL"', 'placeholder={t("master.loanProduct.placeholders.principalCurrentGl")}'),
        ('label="Principal Overdue GL"', 'label={t("master.loanProduct.fields.principalOverdueGl")}'),
        ('placeholder="Select principal overdue GL"', 'placeholder={t("master.loanProduct.placeholders.principalOverdueGl")}'),
        ('label="Interest Current GL"', 'label={t("master.loanProduct.fields.interestCurrentGl")}'),
        ('placeholder="Select interest current GL"', 'placeholder={t("master.loanProduct.placeholders.interestCurrentGl")}'),
        ('label="Interest Overdue GL"', 'label={t("master.loanProduct.fields.interestOverdueGl")}'),
        ('placeholder="Select interest overdue GL"', 'placeholder={t("master.loanProduct.placeholders.interestOverdueGl")}'),
        ('searchPlaceholder="Search ledger..."', 'searchPlaceholder={t("master.loanProduct.placeholders.searchLedger")}'),
        ('label="Overdue Applicable"', 'label={t("master.loanProduct.fields.overdueApplicable")}'),
        ('placeholder="Select overdue applicable"', 'placeholder={t("master.loanProduct.placeholders.overdueApplicable")}'),
        ('label="Overdue On"', 'label={t("master.loanProduct.fields.overdueOn")}'),
        ('placeholder="Select overdue on"', 'placeholder={t("master.loanProduct.placeholders.overdueOn")}'),
        ('searchPlaceholder="Search overdue on..."', 'searchPlaceholder={t("master.loanProduct.placeholders.searchOverdueOn")}'),
        ('label="Overdue Count"', 'label={t("master.loanProduct.fields.overdueCount")}'),
        ('placeholder="Enter overdue count"', 'placeholder={t("master.loanProduct.placeholders.overdueCount")}'),
        ('label="Overdue Rate"', 'label={t("master.loanProduct.fields.overdueRate")}'),
        ('placeholder="Enter overdue rate"', 'placeholder={t("master.loanProduct.placeholders.overdueRate")}'),
        ('label="Grace Days"', 'label={t("master.loanProduct.fields.graceDays")}'),
        ('placeholder="Enter grace days"', 'placeholder={t("master.loanProduct.placeholders.graceDays")}'),
        ('label="Grace On"', 'label={t("master.loanProduct.fields.graceOn")}'),
        ('placeholder="Select grace on"', 'placeholder={t("master.loanProduct.placeholders.graceOn")}'),
        ('searchPlaceholder="Search grace on..."', 'searchPlaceholder={t("master.loanProduct.placeholders.searchGraceOn")}'),
        ('label="NPA Applicable"', 'label={t("master.loanProduct.fields.npaApplicable")}'),
        ('placeholder="Select NPA applicable"', 'placeholder={t("master.loanProduct.placeholders.npaApplicable")}'),
        ('label="NPA After (Months)"', 'label={t("master.loanProduct.fields.npaAfter")}'),
        ('placeholder="Enter NPA after months"', 'placeholder={t("master.loanProduct.placeholders.npaAfter")}'),
        ('label="Secured Deposit Product"', 'label={t("master.loanProduct.fields.securedDepositProduct")}'),
        ('placeholder="Select secured product"', 'placeholder={t("master.loanProduct.placeholders.securedProduct")}'),
        ('searchPlaceholder="Search product..."', 'searchPlaceholder={t("master.loanProduct.placeholders.searchProduct")}'),
        ('label="Max Allowed"', 'label={t("master.loanProduct.fields.maxAllowed")}'),
        ('placeholder="Enter max allowed"', 'placeholder={t("master.loanProduct.placeholders.maxAllowed")}'),
        ('label="Member Type"', 'label={t("master.loanProduct.fields.memberType")}'),
        ('placeholder="Select member type"', 'placeholder={t("master.loanProduct.placeholders.memberType")}'),
        ('searchPlaceholder="Search member type..."', 'searchPlaceholder={t("master.loanProduct.placeholders.searchMemberType")}'),
        ('label="Finance Type"', 'label={t("master.loanProduct.fields.financeType")}'),
        ('placeholder="Select finance type"', 'placeholder={t("master.loanProduct.placeholders.financeType")}'),
        ('searchPlaceholder="Search finance type..."', 'searchPlaceholder={t("master.loanProduct.placeholders.searchFinanceType")}'),
        ('label="Project Loan"', 'label={t("master.loanProduct.fields.projectLoan")}'),
        ('placeholder="Select project loan"', 'placeholder={t("master.loanProduct.placeholders.projectLoan")}'),
        ('label="Mortgage Required"', 'label={t("master.loanProduct.fields.mortgageRequired")}'),
        ('placeholder="Select mortgage required"', 'placeholder={t("master.loanProduct.placeholders.mortgageRequired")}'),
        ('label="Guarantor Required"', 'label={t("master.loanProduct.fields.guarantorRequired")}'),
        ('placeholder="Select guarantor required"', 'placeholder={t("master.loanProduct.placeholders.guarantorRequired")}'),
        ('label="Provision Current GL"', 'label={t("master.loanProduct.fields.provisionCurrentGl")}'),
        ('placeholder="Select provision current GL"', 'placeholder={t("master.loanProduct.placeholders.provisionCurrentGl")}'),
        ('label="Provision Overdue GL"', 'label={t("master.loanProduct.fields.provisionOverdueGl")}'),
        ('placeholder="Select provision overdue GL"', 'placeholder={t("master.loanProduct.placeholders.provisionOverdueGl")}'),
        ('searchPlaceholder="Search..."', 'searchPlaceholder={t("master.loanProduct.placeholders.search")}'),
        (">\n            Cancel\n          </Button>", '>\n            {t("common.buttons.cancel")}\n          </Button>'),
        (
            """) : isEdit ? (
              "Update"
            ) : (
              "Add"
            )}""",
            """) : isEdit ? (
              t("common.buttons.update")
            ) : (
              t("common.buttons.add")
            )}""",
        ),
    ]
    for old, new in repls:
        count = text.count(old)
        if count == 0:
            print(f"  MISS form: {old[:60]!r}")
        else:
            text = text.replace(old, new)
            print(f"  OK form x{count}: {old[:40]!r}")
    path.write_text(text, encoding="utf-8")


def write_table():
    path = COMP / "LoanProductTable.jsx"
    text = path.read_text(encoding="utf-8")
    text = ensure_t_import(text)
    if "const { t } = useTranslation();" not in text:
        text = text.replace(
            "}) => {\n  const [sorting, setSorting] = useState([]);",
            "}) => {\n  const { t } = useTranslation();\n  const [sorting, setSorting] = useState([]);",
        )
    repls = [
        ('<div className="text-left">Serial No</div>', '<div className="text-left">{t("common.serialNo")}</div>'),
        (">\n          Product Name\n          <ArrowUpDown", '>\n          {t("master.loanProduct.table.productName")}\n          <ArrowUpDown'),
        ('<div className="text-left">Short Name</div>', '<div className="text-left">{t("master.loanProduct.table.shortName")}</div>'),
        ('<div className="text-left">Product Type</div>', '<div className="text-left">{t("master.loanProduct.table.productType")}</div>'),
        ('<div className="text-left">Loan Type</div>', '<div className="text-left">{t("master.loanProduct.table.loanType")}</div>'),
        ('<div className="text-left">Min Amt</div>', '<div className="text-left">{t("master.loanProduct.table.minAmt")}</div>'),
        ('<div className="text-left">Max Amt</div>', '<div className="text-left">{t("master.loanProduct.table.maxAmt")}</div>'),
        ('<div className="text-left">ROI</div>', '<div className="text-left">{t("master.loanProduct.table.roi")}</div>'),
        ('<div className="text-left">Duration Unit</div>', '<div className="text-left">{t("master.loanProduct.table.durationUnit")}</div>'),
        ('<div className="text-left">Status</div>', '<div className="text-left">{t("master.loanProduct.table.status")}</div>'),
        ('<div className="text-center">Actions</div>', '<div className="text-center">{t("common.action")}</div>'),
        (">\n            Edit\n            <FaRegEdit", '>\n            {t("common.buttons.edit")}\n            <FaRegEdit'),
        ("No results.", '{t("forms.noResults")}'),
        (">\n                  Previous\n                </Button>", '>\n                  {t("forms.previous")}\n                </Button>'),
        (">\n                  Next\n                </Button>", '>\n                  {t("forms.next")}\n                </Button>'),
    ]
    for old, new in repls:
        if old not in text:
            print(f"  MISS table: {old[:60]!r}")
        else:
            text = text.replace(old, new, 1)
            print(f"  OK table: {old[:40]!r}")
    path.write_text(text, encoding="utf-8")


if __name__ == "__main__":
    for lang in ("en", "hi", "bn", "or"):
        insert_locale(lang)
    print("--- wire ---")
    write_index()
    write_form()
    write_table()
    print("done")
