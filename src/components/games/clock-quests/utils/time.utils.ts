const COUNT = [
  ['null'],
  ['eins', 'ein'],
  ['zwei'],
  ['drei'],
  ['vier'],
  ['fünf'],
  ['sechs'],
  ['sieben'],
  ['acht'],
  ['neun'],
  ['zehn'],
  ['elf'],
  ['zwölf'],
  ['dreizehn'],
  ['vierzehn'],
  ['fünfzehn'],
  ['sechszehn'],
  ['siebzehn'],
  ['achtzehn'],
  ['neunzehn'],
  ['zwanzig'],
  ['einundzwanzig'],
  ['zweiundzwanzig'],
  ['dreiundzwanzig'],
  ['vierundzwanzig'],
  ['fünfundzwanzig'],
  ['sechsundzwanzig'],
  ['siebenundzwanzig'],
  ['achtundzwanzig'],
  ['neunundzwanzig'],
  ['dreißig'],
];

export function count(n: number, alt = false): string | undefined {
  return COUNT[n][alt ? 1 : 0] ?? count(n);
}

export function readableTime(date: Date): string {
  const h = date.getHours() % 12 || 12;
  const n = h === 12 ? 1 : h + 1;
  const m = date.getMinutes();

  switch (m) {
    case 0:
      return `${count(h, true)} Uhr`;
    case 15:
      return `viertel ${count(n)}`;
    case 30:
      return `halb ${count(n)}`;
    case 45:
      return `dreiviertel ${count(n)}`;
    default: {
      if (m < 15) {
        return `${count(m)} nach ${count(h)}`;
      }
      if (m > 15 && m < 30) {
        return `${count(30 - m)} vor halb ${count(n)}`;
      }
      if (m > 30 && m < 45) {
        return `${count(m - 30)} nach halb ${count(n)}`;
      }
      if (m > 45) {
        return `${count(60 - m)} vor ${count(n)}`;
      }
    }
  }

  return '';
}
