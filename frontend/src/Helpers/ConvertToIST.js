import moment from 'moment-timezone';

const ConvertToIST = (date) => {
  if (!moment(date).isValid()) {
    // console.error("Invalid date:", date);
    return date;
  }

  const ISTdate = moment(date).tz("Asia/Kolkata").format("YYYY-MM-DD");
  // console.log("IST date From JS function : ", ISTdate);
  return ISTdate;
}

export default ConvertToIST;
