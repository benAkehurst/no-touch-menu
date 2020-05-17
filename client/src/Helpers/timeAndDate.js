export function getTimeOfDay() {
  let today = new Date();
  let curHr = today.getHours();

  if (curHr < 12) {
    return 'Morning';
  } else if (curHr > 12 || curHr < 18) {
    return 'Afternoon';
  } else {
    return 'Evening';
  }
}

export function dateFormatter(date) {
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  let data = new Date(date);
  let formatted = data.toLocaleDateString('en-GB', options);
  return formatted;
}

const timeDateHelpers = {
  formatDate: function formatDate(createdOn) {
    let date = new Date(createdOn);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let dt = date.getDate();
    if (dt < 10) {
      dt = '0' + dt;
    }
    if (month < 10) {
      month = '0' + month;
    }
    return `${dt}/${month}/${year}`;
  },
};

export default timeDateHelpers;
