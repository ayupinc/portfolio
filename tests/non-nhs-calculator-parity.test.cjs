const fs = require("node:fs");
const vm = require("node:vm");
const assert = require("node:assert/strict");

const original = fs.readFileSync("public/rate-calculator.html", "utf8");
const app = fs.readFileSync("public/non-nhs/app.js", "utf8");

function functionBlock(source, start, end) {
  return source.slice(source.indexOf(start), source.indexOf(end));
}

function calculatorFrom(source, startMarker, endMarker) {
  const context = {};
  vm.createContext(context);
  vm.runInContext(
    functionBlock(source, startMarker, endMarker),
    context
  );
  return context.calculatePrivateEmployment;
}

const originalCalculator = calculatorFrom(original, "function calculatePrivateEmployment", "function renderMetrics");
const appCalculator = calculatorFrom(app, "function taxAndNi", "function assumptions");

const base = {
  days_per_week: 5,
  weeks_per_year: 45.4,
  hours_per_day: 7.5,
  bonus: 10000,
  bonus_sacrifice: 0,
  car_type: "No employer car",
  car_allowance: 6000,
  car_list_price: 45000,
  car_bik_rate: 0.04,
  private_use_payment: 0,
  fuel_benefit: 0,
  car_sacrifice: 6000,
  extra_car_sacrifice: 0,
  low_emission_car: true,
  pension_method: "Salary sacrifice",
  pension_basis: "Basic salary",
  employee_pension_rate: 0.05,
  employer_pension_rate: 0.05,
  bonus_pensionable: true,
  allowance_pensionable: false,
  employer_passes_ni_saving_to_pension: false,
  qualifying_earnings_lower: 6240,
  qualifying_earnings_upper: 50270,
  personal_allowance: 12570,
  basic_rate_ceiling: 50270,
  higher_rate_ceiling: 125140,
  income_tax_basic: 0.20,
  income_tax_higher: 0.40,
  income_tax_additional: 0.45,
  ni_primary_threshold: 12570,
  ni_rate_standard: 0.08,
  ni_upper_earnings_limit: 50270,
  ni_rate_above_uel: 0.02,
  employer_ni_rate: 0.15
};

const cases = [
  ["standard package", 98500, {}],
  ["cash allowance", 72000, { car_type: "Cash car allowance", pension_basis: "Total pensionable earnings", allowance_pensionable: true }],
  ["company EV", 85000, { car_type: "Company car", car_list_price: 52000, car_bik_rate: 0.04, private_use_payment: 300 }],
  ["salary sacrifice car", 110000, { car_type: "Salary sacrifice car", car_sacrifice: 8400, employer_passes_ni_saving_to_pension: true }],
  ["relief at source with bonus sacrifice", 130000, { pension_method: "Relief at source", pension_basis: "Qualifying earnings", bonus: 25000, bonus_sacrifice: 10000 }],
  ["allowance exchanged for car", 94000, { car_type: "Car allowance exchanged for salary-sacrifice car", extra_car_sacrifice: 2400, low_emission_car: false }]
];

for (const [name, salary, overrides] of cases) {
  const assumptions = { ...base, ...overrides };
  const expected = originalCalculator(salary, assumptions);
  const actual = appCalculator(salary, assumptions);
  for (const key of Object.keys(expected)) {
    if (typeof expected[key] !== "number") {
      assert.equal(actual[key], expected[key], `${name}: ${key}`);
      continue;
    }
    assert.ok(Math.abs(actual[key] - expected[key]) < 0.000001, `${name}: ${key}`);
  }
}

console.log(`Passed ${cases.length} parity scenarios against the original calculator.`);
