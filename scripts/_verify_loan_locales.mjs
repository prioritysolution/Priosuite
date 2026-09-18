import en from './i18n/locales/en.js';
import hi from './i18n/locales/hi.js';
import bn from './i18n/locales/bn.js';
import or from './i18n/locales/or.js';

const langs = { en, hi, bn, or };
const keys = [
  'loanReport',
  'fromDate',
  'selectLoanProduct',
  'nothingToDownload',
  'pdfDownloaded',
  'addDot',
  'accountStatementFrom',
  'memberNameColon',
];
for (const [name, loc] of Object.entries(langs)) {
  if (!loc.loan) throw new Error(name + ' missing loan');
  if (!loc.loan.print) throw new Error(name + ' missing loan.print');
  for (const k of keys) {
    if (!(k in loc.loan)) console.warn(name, 'missing', k);
  }
  console.log(name, 'loanReport=', loc.loan.loanReport, 'print.slNo=', loc.loan.print.slNo, 'addDot=', loc.loan.addDot);
}
console.log('OK');
