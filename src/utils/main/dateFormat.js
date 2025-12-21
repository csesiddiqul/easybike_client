import { format } from "date-fns";
import { enUS } from "date-fns/locale";

// Function to convert English numerals to Bangla numerals
const convertToBanglaNumerals = (numberString) => {
  const banglaNumerals = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return numberString.replace(/\d/g, (digit) => banglaNumerals[digit]);
};
import dayjs from "dayjs";

const bnLocale = {
  ...enUS,
  code: "bn",
  formatDistance: (token, count, options) => {
    const formatDistanceLocale = {
      lessThanXSeconds: "কম 1 সেকেন্ড",
      xSeconds: `${count} সেকেন্ড`,
      halfAMinute: "আধ মিনিট",
      lessThanXMinutes: "কম 1 মিনিট",
      xMinutes: `${count} মিনিট`,
      aboutXHours: "প্রায় 1 ঘন্টা",
      xHours: `${count} ঘন্টা`,
      xDays: `${count} দিন`,
      aboutXMonths: "প্রায় 1 মাস",
      xMonths: `${count} মাস`,
      aboutXYears: "প্রায় 1 বছর",
      xYears: `${count} বছর`,
      overXYears: "1 বছরেরও বেশি",
      almostXYears: "প্রায় 1 বছর",
    };
    return formatDistanceLocale[token];
  },
  formatLong: {
    date: () => "dd-MM-yyyy",
    time: () => "hh:mm aa",
    dateTime: () => "dd-MM-yyyy hh:mm aa",
  },
  localize: {
    ...enUS.localize,
    month: (n, { width }) =>
      [
        "জানুয়ারী",
        "ফেব্রুয়ারী",
        "মার্চ",
        "এপ্রিল",
        "মে",
        "জুন",
        "জুলাই",
        "আগস্ট",
        "সেপ্টেম্বর",
        "অক্টোবর",
        "নভেম্বর",
        "ডিসেম্বর",
      ][n],
    day: (n, { width }) =>
      [
        "রবিবার",
        "সোমবার",
        "মঙ্গলবার",
        "বুধবার",
        "বৃহস্পতিবার",
        "শুক্রবার",
        "শনিবার",
      ][n],
  },
};

const bnLocaleName = {
  ...enUS,
  code: "bn",
  formatDistance: (token, count, options) => {
    const formatDistanceLocale = {
      lessThanXSeconds: "কম ১ সেকেন্ড",
      xSeconds: `${count} সেকেন্ড`,
      halfAMinute: "আধ মিনিট",
      lessThanXMinutes: "কম ১ মিনিট",
      xMinutes: `${count} মিনিট`,
      aboutXHours: "প্রায় ১ ঘন্টা",
      xHours: `${count} ঘন্টা`,
      xDays: `${count} দিন`,
      aboutXMonths: "প্রায় ১ মাস",
      xMonths: `${count} মাস`,
      aboutXYears: "প্রায় ১ বছর",
      xYears: `${count} বছর`,
      overXYears: "১ বছরেরও বেশি",
      almostXYears: "প্রায় ১ বছর",
    };
    return formatDistanceLocale[token];
  },
  formatLong: {
    date: () => "dd-MM-yyyy",
    time: () => "hh:mm aa",
    dateTime: () => "dd-MM-yyyy hh:mm aa",
  },
  localize: {
    ...enUS.localize,
    month: (n, { width }) =>
      [
        "বৈশাখ",
        "জ্যৈষ্ঠ",
        "আষাঢ়",
        "শ্রাবণ",
        "ভাদ্র",
        "আশ্বিন",
        "কার্তিক",
        "অগ্রহায়ণ",
        "পৌষ",
        "মাঘ",
        "ফাল্গুন",
        "চৈত্র",
      ][n],
    day: (n, { width }) =>
      [
        "রবিবার",
        "সোমবার",
        "মঙ্গলবার",
        "বুধবার",
        "বৃহস্পতিবার",
        "শুক্রবার",
        "শনিবার",
      ][n],
  },
};

const formatWithBanglaNumerals = (date, formatString, locale) => {
  if (!date) {
    return date;
  }
  const formattedDate = format(date, formatString, { locale });
  return convertToBanglaNumerals(formattedDate);
};

export const localDateTimeFormat = (dateString) => {
  if (!dateString) {
    return dateString;
  }
  const date = new Date(dateString);
  return formatWithBanglaNumerals(date, "dd-MM-yyyy hh:mm aa", bnLocale);
};
export const localTimeFormat = (dateString) => {
  if (!dateString) {
    return dateString;
  }
  const date = new Date(dateString);
  return formatWithBanglaNumerals(date, "hh:mm aa", bnLocale);
};

export const localDateFormat = (dateString) => {
  if (!dateString) {
    return dateString;
  }
  const date = dateString ? new Date(dateString) : new Date();
  return formatWithBanglaNumerals(date, "dd-MM-yyyy", bnLocale);
};

export const localDateFormatName = (dateString) => {
  if (!dateString) {
    return dateString;
  }
  const date = new Date(dateString);
  return formatWithBanglaNumerals(date, "d MMM, yyyy", bnLocale);
};

export const enLocalDateFormatName = (dateString) => {
  if (!dateString) {
    return dateString;
  }
  const date = new Date(dateString);
  return format(date, "d MMM, yyyy", bnLocale);
};

export const enLocalDateTimeFormat = (dateString) => {
  if (!dateString) {
    return dateString;
  }
  const date = new Date(dateString);
  return format(date, "dd-MM-yyyy hh:mm aa");
};

export const enLocalDateFormat = (dateString) => {
  if (!dateString) {
    return dateString;
  }
  const date = new Date(dateString);
  return format(date, "dd-MM-yyyy");
};
export const enlocalDateFormat = (dateString) => {
  if (!dateString) {
    return dateString;
  }
  const date = new Date();
  return format(date, "MMMM d, yyyy");
};

export const globalDateFormat = (dateString) => {
  if (!dateString) {
    return dateString;
  }
  const date = new Date(dateString);
  return format(date, "yyyy-MM-dd");
};

// dateUtils.js
export const mergeDateValues = ({ year, month, day }) => {
  let dateString = "";
  if (year) {
    dateString += `${year}`;
  }
  if (month) {
    const formattedMonth = month < 10 ? `0${month}` : month;
    dateString += `-${formattedMonth}`;
  }
  if (day) {
    const formattedDay = day < 10 ? `0${day}` : day;
    dateString += `-${formattedDay}`;
  }

  return dateString;
};

export const formatDateAntDesign = (date) => (date ? format(date.toDate(), "yyyy-MM-dd") : null);

export const parseDateAntDesign = (dateString) => (dateString ? dayjs(new Date(dateString)) : null);