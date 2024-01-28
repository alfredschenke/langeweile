const COUNT = [
  'null',
  'eins',
  'zwei',
  'drei',
  'vier',
  'fünf',
  'sechs',
  'sieben',
  'acht',
  'neun',
  'zehn',
  'elf',
  'zwölf',
  'dreizehn',
  'vierzehn',
  'fünfzehn',
  'sechszehn',
  'siebzehn',
  'achtzehn',
  'neunzehn',
  'zwanzig',
  'einundzwanzig',
  'zweiundzwanzig',
  'dreiundzwanzig',
  'vierundzwanzig',
  'fünfundzwanzig',
  'sechsundzwanzig',
  'siebenundzwanzig',
  'achtundzwanzig',
  'neunundzwanzig',
  'dreißig',
];

export function readableTime(date: Date): string {
  const h = date.getHours() % 12 || 12;
  const n = h === 12 ? 1 : h + 1;
  const m = date.getMinutes();

  switch (m) {
    case 0:
      return `um ${COUNT[h]}`;
    case 15:
      return `viertel ${COUNT[n]}`;
    case 30:
      return `halb ${COUNT[n]}`;
    case 45:
      return `dreiviertel ${COUNT[n]}`;
    default: {
      if (m < 15) {
        return `${COUNT[m]} nach ${COUNT[h]}`;
      }
      if (m > 15 && m < 30) {
        return `${COUNT[30 - m]} vor halb ${COUNT[n]}`;
      }
      if (m > 30 && m < 45) {
        return `${COUNT[m - 30]} nach halb ${COUNT[n]}`;
      }
      if (m > 45) {
        return `${COUNT[60 - m]} vor ${COUNT[n]}`;
      }
    }
  }

  return '';
}
