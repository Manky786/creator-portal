// Convert numbers to words in Indian numbering system (Crores, Lakhs, Thousands)

const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

function convertTwoDigit(num: number): string {
  if (num === 0) return '';
  if (num < 10) return ones[num];
  if (num < 20) return teens[num - 10];

  const ten = Math.floor(num / 10);
  const one = num % 10;
  return tens[ten] + (one ? ' ' + ones[one] : '');
}

function convertThreeDigit(num: number): string {
  if (num === 0) return '';

  const hundred = Math.floor(num / 100);
  const remainder = num % 100;

  let result = '';
  if (hundred > 0) {
    result = ones[hundred] + ' Hundred';
  }

  if (remainder > 0) {
    if (result) result += ' ';
    result += convertTwoDigit(remainder);
  }

  return result;
}

export function numberToWordsIndian(num: number): string {
  if (num === 0) return 'Zero';
  if (num < 0) return 'Minus ' + numberToWordsIndian(-num);

  // Round to nearest integer
  num = Math.round(num);

  const crore = Math.floor(num / 10000000);
  const lakh = Math.floor((num % 10000000) / 100000);
  const thousand = Math.floor((num % 100000) / 1000);
  const remainder = num % 1000;

  let result = '';

  if (crore > 0) {
    result += convertThreeDigit(crore) + ' Crore ';
  }

  if (lakh > 0) {
    result += convertTwoDigit(lakh) + ' Lakh ';
  }

  if (thousand > 0) {
    result += convertTwoDigit(thousand) + ' Thousand ';
  }

  if (remainder > 0) {
    result += convertThreeDigit(remainder);
  }

  return result.trim();
}

// Format with "Only" suffix for currency display
export function amountInWords(amount: number): string {
  const words = numberToWordsIndian(amount);
  return words + ' Rupees Only';
}
