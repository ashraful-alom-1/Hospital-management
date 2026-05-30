export const dutyDayOptions = [
  { value: "monday", label: "Monday", short: "Mon" },
  { value: "tuesday", label: "Tuesday", short: "Tue" },
  { value: "wednesday", label: "Wednesday", short: "Wed" },
  { value: "thursday", label: "Thursday", short: "Thu" },
  { value: "friday", label: "Friday", short: "Fri" },
  { value: "saturday", label: "Saturday", short: "Sat" },
  { value: "sunday", label: "Sunday", short: "Sun" },
];

export const availabilityOverrides = [
  { value: "auto", label: "Auto" },
  { value: "available", label: "Available" },
  { value: "unavailable", label: "Unavailable" },
  { value: "on_leave", label: "On Leave" },
];

const dayOrder = dutyDayOptions.map((day) => day.value);

export function getTodayKey(date = new Date()) {
  return dayOrder[(date.getDay() + 6) % 7];
}

export function normalizeDutyDays(days) {
  if (Array.isArray(days)) {
    return days
      .map((day) => String(day || "").toLowerCase().trim())
      .map((day) => {
        const numberMap = {
          "1": "monday",
          "2": "tuesday",
          "3": "wednesday",
          "4": "thursday",
          "5": "friday",
          "6": "saturday",
          "0": "sunday",
        };
        return numberMap[day] || day;
      })
      .filter((day) => dayOrder.includes(day));
  }

  return String(days || "")
    .split(",")
    .map((day) => day.trim().toLowerCase())
    .filter((day) => dayOrder.includes(day));
}

export function minutesFromTime(value) {
  if (!value) return null;
  const [hours, minutes] = String(value).split(":").map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;
  return hours * 60 + minutes;
}

export function formatTime(value) {
  if (!value) return "Not set";
  const [hoursRaw, minutesRaw = "0"] = String(value).split(":");
  const date = new Date();
  date.setHours(Number(hoursRaw), Number(minutesRaw), 0, 0);
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatShift(roster) {
  if (!roster?.shift_start || !roster?.shift_end) return "Shift not set";
  return `${formatTime(roster.shift_start)} - ${formatTime(roster.shift_end)}`;
}

export function getAvailability(profile, roster, now = new Date()) {
  const override = profile?.availability_override || "auto";

  if (override === "available") {
    return {
      status: "on_duty",
      label: "ON DUTY NOW",
      tone: "green",
      reason: "Marked available by admin",
    };
  }

  if (override === "unavailable") {
    return {
      status: "off_duty",
      label: "OFF DUTY",
      tone: "slate",
      reason: "Marked unavailable by admin",
    };
  }

  if (override === "on_leave") {
    return {
      status: "on_leave",
      label: "ON LEAVE",
      tone: "amber",
      reason: "Marked on leave by admin",
    };
  }

  if (profile?.status !== "active") {
    return {
      status: "off_duty",
      label: "OFF DUTY",
      tone: "slate",
      reason: "Profile inactive",
    };
  }

  const dutyDays = normalizeDutyDays(roster?.duty_days);
  const today = getTodayKey(now);
  const shiftStart = minutesFromTime(roster?.shift_start);
  const shiftEnd = minutesFromTime(roster?.shift_end);
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  if (!dutyDays.includes(today) || shiftStart === null || shiftEnd === null) {
    return {
      status: "off_duty",
      label: "OFF DUTY",
      tone: "slate",
      reason: "No active shift right now",
    };
  }

  const inNormalShift = shiftStart <= shiftEnd && currentMinutes >= shiftStart && currentMinutes <= shiftEnd;
  const inOvernightShift = shiftStart > shiftEnd && (currentMinutes >= shiftStart || currentMinutes <= shiftEnd);

  if (inNormalShift || inOvernightShift) {
    return {
      status: "on_duty",
      label: "ON DUTY NOW",
      tone: "green",
      reason: "Current time is inside roster shift",
    };
  }

  return {
    status: "off_duty",
    label: "OFF DUTY",
    tone: "slate",
    reason: "Outside shift time",
  };
}

export function getTodayShift(roster, now = new Date()) {
  const dutyDays = normalizeDutyDays(roster?.duty_days);
  return dutyDays.includes(getTodayKey(now)) ? formatShift(roster) : "No shift today";
}

export function getNextAvailableShift(roster, now = new Date()) {
  const dutyDays = normalizeDutyDays(roster?.duty_days);
  if (!dutyDays.length || !roster?.shift_start || !roster?.shift_end) return "Not scheduled";

  const todayIndex = dayOrder.indexOf(getTodayKey(now));
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const shiftEnd = minutesFromTime(roster.shift_end);

  for (let offset = 0; offset < 7; offset += 1) {
    const day = dayOrder[(todayIndex + offset) % 7];
    if (!dutyDays.includes(day)) continue;
    if (offset === 0 && shiftEnd !== null && currentMinutes <= shiftEnd) continue;

    const dayLabel = dutyDayOptions.find((item) => item.value === day)?.label || day;
    return `${dayLabel}, ${formatShift(roster)}`;
  }

  const firstDay = dutyDays[0];
  const dayLabel = dutyDayOptions.find((item) => item.value === firstDay)?.label || firstDay;
  return `${dayLabel}, ${formatShift(roster)}`;
}

export function buildRosterMap(rosters = []) {
  return rosters.reduce((map, roster) => {
    const key = roster.doctor_id || roster.staff_id;
    if (key && !map[key]) map[key] = roster;
    return map;
  }, {});
}
