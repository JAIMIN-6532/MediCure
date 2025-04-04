export const convertTo24HourFormat = (timeSlot) => {
  const [time, period] = timeSlot.split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  return hours * 100 + minutes;
};
