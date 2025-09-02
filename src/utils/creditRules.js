function creditRules({ age, income, location }) {
  const loans = [];
  const livesInPOA_RS = typeof location === 'string' && location.trim().toUpperCase() === 'RS';

  // PERSONAL: 4%
  if (income <= 3000) {
    loans.push({ type: "PERSONAL", interest_rate: 4 });
  } else if (income > 3000 && income <= 5000 && age < 30 && livesInPOA_RS) {
    loans.push({ type: "PERSONAL", interest_rate: 4 });
  }

  // CONSIGNMENT: 2%
  if (income >= 5000) {
    loans.push({ type: "CONSIGNMENT", interest_rate: 2 });
  }

  // GUARANTEED: 3%
  if (income <= 3000) {
    loans.push({ type: "GUARANTEED", interest_rate: 3 });
  } else if (income > 3000 && income <= 5000 && age < 30 && livesInPOA_RS) {
    loans.push({ type: "GUARANTEED", interest_rate: 3 });
  }

  return loans;
}

export default creditRules;
