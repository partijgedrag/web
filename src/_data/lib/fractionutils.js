// Map raw fraction strings (as they appear in the data) to display names.
// Add entries here whenever you spot a fraction that needs normalising.
export const FRACTION_DISPLAY_NAMES = {
  "anders.": "Anders.",
  "cd&v": "cd&v",
  "défi": "DéFI",
  "ecolo-groen": "Ecolo-Groen",
  "les engagés": "Les Engagés",
  "mr": "MR",
  "n-va": "N-VA",
  "onafh": "ONAFH",
  "ps": "PS",
  "pvda-ptb": "PVDA-PTB",
  "vb": "VB",
  "vooruit": "Vooruit",
};

export const normaliseFraction = (raw) => FRACTION_DISPLAY_NAMES[raw] ?? raw;
