import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const Calendar = ({ onDateSelect, selectedDate, activities, holidays, onMonthYearChange, dateColors }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const handleDateClick = (date) => {
    onDateSelect(date);
  };
  useEffect(() => {
    onMonthYearChange(`${selectedYear || 0}-${selectedMonth || 1900}`, {
      month: selectedMonth,
      year: selectedYear
    })
  },[selectedMonth,selectedYear])


  const handleMonthChange = (event) => {
    setSelectedMonth(parseInt(event.target.value));
  };

  const handleYearChange = (event) => {
    setSelectedYear(parseInt(event.target.value));
  };

  const getDaysInMonth = (year, month) => {
    return new Date(year, month, 0).getDate();
  };

  const getMonthDates = () => {
    const firstDay = new Date(selectedYear, selectedMonth - 1, 1).getDay();
    const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);

    const dates = Array.from({ length: firstDay }, (_, index) => null).concat(
      Array.from({ length: daysInMonth }, (_, index) => index + 1)
    );

    return dates.map((day) => {
      if (day === null) {
        return <div key={Math.random()} className="text-center" />;
      }

      const date = `${selectedYear}-${selectedMonth?.toString()?.padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      const hasActivity = activities?.some((activity) => activity?.date === date);
      const isHoliday = holidays?.includes(date);

      return (
        <div
          key={date}
          onClick={() => handleDateClick(date)}
          className={`cursor-pointer hover:opacity-50 text-center p-2 ${
            selectedDate === date ? 'border-2 border-black' : 'border border-gray-300'
          } ${hasActivity ? 'bg-yellow-300' : ''} ${isHoliday ? 'bg-zinc-500 text-white' : ''}`}
          style={{
            backgroundColor: !isHoliday ? dateColors?.[date] || 'white' : 'gray'
          }}
        >
          {day}

          {selectedDate === date && (
            <div className='text-xs'>
              {hasActivity && (
                <ul>
                  {activities
                    ?.filter((activity) => activity?.date === date)
                    ?.map((activity) => (
                      <li key={activity?.id}>
                        {activity?.description} {activity?.value}
                      </li>
                    ))}
                </ul>
              )}
            </div>
          )}
        </div>
      );
    });
  };

  const generateYearRange = (start, end) => {
    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  };

  const currentYear = new Date().getFullYear();
  const yearRange = generateYearRange(currentYear - 10, currentYear + 10);

  return (
    <div className="p-4">
      <div className="flex justify-center mb-4">
        <select
          value={selectedMonth}
          onChange={handleMonthChange}
          className="p-2 border border-gray-300 rounded"
        >
          <option value={1}>January</option>
          <option value={2}>February</option>
          <option value={3}>March</option>
          <option value={4}>April</option>
          <option value={5}>May</option>
          <option value={6}>June</option>
          <option value={7}>July</option>
          <option value={8}>August</option>
          <option value={9}>September</option>
          <option value={10}>October</option>
          <option value={11}>November</option>
          <option value={12}>December</option>
        </select>
        <select
          value={selectedYear}
          onChange={handleYearChange}
          className="p-2 border border-gray-300 rounded ml-2"
        >
          {yearRange.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-7 gap-2" style={{
        aspectRatio: '1.5/1'
      }}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center">
            {day}
          </div>
        ))}

        {getMonthDates()}
      </div>
    </div>
  );
};

Calendar.propTypes = {
  onDateSelect: PropTypes.func.isRequired,
  selectedDate: PropTypes.string,
  activities: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    })
  ).isRequired,
  holidays: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Calendar;
