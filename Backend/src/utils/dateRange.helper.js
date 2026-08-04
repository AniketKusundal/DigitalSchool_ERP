const getDateRange = (query) => {
  const { period, month, year, half } = query;

  if (!period) {
    throw new Error("Period Is Required");
  }

  let startDate;
  let endDate;

  // MONTHLY DATE RANGE
  if (period === "monthly") {
    if (!month || !year) {
      throw new Error("Month And Year Are Required");
    }

    const monthNumber = Number(month);
    const yearNumber = Number(year);

    if (monthNumber < 1 || monthNumber > 12 || Number.isNaN(monthNumber) || Number.isNaN(yearNumber)) 
    {
      throw new Error("Invalid Month Or Year");
    }

    startDate = new Date(yearNumber, monthNumber - 1, 1);

    endDate = new Date(yearNumber, monthNumber, 0);

    startDate.setHours(0, 0, 0, 0);

    endDate.setHours(23, 59, 59, 999);
  }


  // Weekly Date range
  if(period === "weekly")
  {
    // Current date
    const today = new Date()

    // Day of week
    const day = today.getDay()

    // Calculate Monday
    const mondayOffset  = day === 0 ? -6 : 1 - day;

    startDate = new Date(today)
    startDate.setDate(today.getDate() + mondayOffset )
    startDate.setHours(0 , 0 , 0 , 0)

    endDate = new Date(startDate)
    endDate.setDate(startDate.getDate() + 6)
    endDate.setHours(23 , 59 , 59 , 999)
  }


  // Half-Yearly Report

  if (period === "half-yearly") 
  {
    if (!half || !year) {
      throw new Error("Half Year And Year Required")
    }

    const halfNumber = Number(half)
    const yearNumber = Number(year)

    //  validation for half Year

    if (![1 , 2].includes(halfNumber) || Number.isNaN(yearNumber)) {
      throw new Error("Invalid Half Or Year")
    }

  
      // JANUARY → JUNE
    if (halfNumber === 1) 
    {
      startDate = new Date(yearNumber , 0 , 1);
      endDate = new Date(yearNumber , 5 , 30);
    }

    // JULY → DECEMBER

    if (halfNumber === 2) 
    {
      startDate = new Date(yearNumber , 6 , 1);
      endDate = new Date(yearNumber , 11, 31 );
    }

    startDate.setHours(0 , 0 , 0 , 0);

    endDate.setHours(23 , 59 , 59 , 999);
}

  //  Coustom Date Range Reports
  if (period === "custom") {
    const { startDate: start, endDate: end } = query;

    if (!start || !end) {
      throw new Error("Start Date And End Date Are Required");
    }

    startDate = new Date(start);
    endDate = new Date(end);

    if (
      isNaN(startDate.getTime()) ||
      isNaN(endDate.getTime())
    ) {
      throw new Error("Invalid Start Date Or End Date");
    }

    if (startDate > endDate) {
      throw new Error("Start Date Cannot Be After End Date");
    }

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);
  }


      // YEARLY DATE RANGE
    if (period === "yearly") {
      if (!year) {
        throw new Error("Year Is Required");
      }

      const yearNumber = Number(year);

      if (Number.isNaN(yearNumber)) {
        throw new Error("Invalid Year");
      }

      startDate = new Date(yearNumber, 0, 1);

      endDate = new Date(yearNumber, 11, 31);

      startDate.setHours(0, 0, 0, 0);

      endDate.setHours(23, 59, 59, 999);
    }


  if (!startDate || !endDate) {
    throw new Error("Invalid Attendance Period");
  }

  return {
    startDate,
    endDate,
  };
};

module.exports = getDateRange;