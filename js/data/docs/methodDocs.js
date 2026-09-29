// URL slugs discovered from https://docs.pagsmile.com/sitemap.md
// Per-country submission guides document every payment method available for
// that country, so linking by country is the closest we get to a
// method-specific reference page.
const PAYIN_COUNTRY_SLUGS = {
  ARG: "argentina", BHR: "bahrain", BGD: "bangladesh", BRA: "brazil", BOL: "bolivia",
  CHL: "chile", CHN: "china", COL: "colombia", CRI: "costa-rica", CZE: "czechrepublic",
  ECU: "ecuador", EGY: "egypt", GHA: "ghana", GTM: "guatemala", HKG: "hongkong",
  IND: "india", IDN: "indonesia", JPN: "japan", KAZ: "kazakhstan", KEN: "kenya",
  KWT: "kuwait", MYS: "malaysia", MEX: "mexico", NGA: "nigeria", OMN: "oman",
  PAK: "pakistan", PRY: "paraguay", PAN: "panama", PER: "peru", PHL: "philippines",
  POL: "poland", QAT: "qatar", SAU: "saudi-arabia", SGP: "singapore", KOR: "korea",
  TWN: "taiwan", TJK: "tajikistan", THA: "thailand", TUR: "turkiye", UGA: "uganda",
  ARE: "united-arab-emirates", URY: "uruguay", VNM: "vietnam",
  PRT: "europe", BEL: "europe", USA: "north-america", CAN: "north-america",
};

const PAYOUT_COUNTRY_SLUGS = {
  PRY: "paraguay", VNM: "vietnam", ARG: "argentina", BGD: "bangladesh", BOL: "bolivia",
  BRA: "brazil", COL: "colombia", CRI: "costa-rica", ECU: "ecuador", GTM: "guatemala",
  IND: "india", IDN: "indonesia", JOR: "jordan", KAZ: "kazakhstan", MEX: "mexico",
  NPL: "nepal", PAK: "pakistan", PAN: "panama", PER: "peru", PHL: "philippines",
  TJK: "tajikistan", TUR: "turkey", URY: "uruguay", YEM: "yemen", CHL: "chile",
};

export const REFERENCE_LINKS = {
  payinApiCode: "https://docs.pagsmile.com/reference/payin/api-code",
  payoutApiCode: "https://docs.pagsmile.com/reference/payout/api-code",
  payinStatus: "https://docs.pagsmile.com/reference/payin/data/payin-status",
  payoutStatus: "https://docs.pagsmile.com/reference/payout/payout-status",
  payoutRejectionReasons: "https://docs.pagsmile.com/reference/payout/payout-rejection-reasons",
  countryInfo: "https://docs.pagsmile.com/reference/country-info",
  payinCountryCode: "https://docs.pagsmile.com/reference/payin/data/country-code",
  payinTestData: "https://docs.pagsmile.com/reference/payin/data/data-for-test-sandbox",
  payoutTestData: "https://docs.pagsmile.com/reference/payout/data-for-test",
};

export function methodDocLink(flow, countryCode) {
  const slugs = flow === "payout" ? PAYOUT_COUNTRY_SLUGS : PAYIN_COUNTRY_SLUGS;
  const slug = slugs[countryCode];
  if (!slug) return null;
  return flow === "payout"
    ? `https://docs.pagsmile.com/reference/payout/submit-a-payout/${slug}`
    : `https://docs.pagsmile.com/reference/payin/submit-a-payin/${slug}`;
}
