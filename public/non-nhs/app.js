const TAX_YEARS = {
  "2026/27": { label: "2026/27", personal_allowance: 12570, basic_rate_ceiling: 50270, higher_rate_ceiling: 125140, income_tax_basic: 0.20, income_tax_higher: 0.40, income_tax_additional: 0.45, ni_primary_threshold: 12570, ni_rate_standard: 0.08, ni_upper_earnings_limit: 50270, ni_rate_above_uel: 0.02, employer_ni_rate: 0.15 },
  "2025/26": { label: "2025/26", personal_allowance: 12570, basic_rate_ceiling: 50270, higher_rate_ceiling: 125140, income_tax_basic: 0.20, income_tax_higher: 0.40, income_tax_additional: 0.45, ni_primary_threshold: 12570, ni_rate_standard: 0.08, ni_upper_earnings_limit: 50270, ni_rate_above_uel: 0.02, employer_ni_rate: 0.15 },
  "2024/25": { label: "2024/25", personal_allowance: 12570, basic_rate_ceiling: 50270, higher_rate_ceiling: 125140, income_tax_basic: 0.20, income_tax_higher: 0.40, income_tax_additional: 0.45, ni_primary_threshold: 12570, ni_rate_standard: 0.08, ni_upper_earnings_limit: 50270, ni_rate_above_uel: 0.02, employer_ni_rate: 0.138 },
  "2023/24": { label: "2023/24", personal_allowance: 12570, basic_rate_ceiling: 50270, higher_rate_ceiling: 125140, income_tax_basic: 0.20, income_tax_higher: 0.40, income_tax_additional: 0.45, ni_primary_threshold: 12570, ni_rate_standard: 0.12, ni_upper_earnings_limit: 50270, ni_rate_above_uel: 0.02, employer_ni_rate: 0.138 }
};

const $ = (id) => document.getElementById(id);
const value = (id) => Number($(id).value || 0);
const pct = (id) => value(id) / 100;

function currency(amount, decimals = 0) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(amount || 0);
}

function displayMoney(annual, period) {
  if (period === "Per Month") return currency(annual / 12);
  if (period === "Per Week") return currency(annual / 52);
  return currency(annual);
}

function workingWeeks(daysPerWeek, leaveDays, bankHolidays) {
  return daysPerWeek > 0 ? Math.round((52 - ((leaveDays + bankHolidays) / daysPerWeek)) * 10) / 10 : 0;
}

function taxAndNi(grossTaxable, assumptions, niablePay = grossTaxable) {
  const taxableIncome = Math.max(0, grossTaxable - assumptions.personal_allowance);
  const basicBand = Math.max(0, assumptions.basic_rate_ceiling - assumptions.personal_allowance);
  const higherBand = Math.max(0, assumptions.higher_rate_ceiling - assumptions.basic_rate_ceiling);
  const incomeTaxBasic = Math.min(taxableIncome, basicBand) * assumptions.income_tax_basic;
  const incomeTaxHigher = Math.min(Math.max(0, taxableIncome - basicBand), higherBand) * assumptions.income_tax_higher;
  const incomeTaxAdditional = Math.max(0, taxableIncome - basicBand - higherBand) * assumptions.income_tax_additional;
  const employeeNiStandard = Math.min(
    Math.max(0, niablePay - assumptions.ni_primary_threshold),
    assumptions.ni_upper_earnings_limit - assumptions.ni_primary_threshold
  ) * assumptions.ni_rate_standard;
  const employeeNiAbove = Math.max(0, niablePay - assumptions.ni_upper_earnings_limit) * assumptions.ni_rate_above_uel;
  return {
    taxableIncome,
    incomeTaxBasic,
    incomeTaxHigher,
    incomeTaxAdditional,
    totalIncomeTax: incomeTaxBasic + incomeTaxHigher + incomeTaxAdditional,
    employeeNiStandard,
    employeeNiAbove,
    totalEmployeeNi: employeeNiStandard + employeeNiAbove
  };
}

// Kept equivalent to the Non-NHS calculation in the original rate calculator.
function calculatePrivateEmployment(annualSalary, a) {
  const daysPerYear = a.days_per_week * a.weeks_per_year;
  const hoursPerYear = daysPerYear * a.hours_per_day;
  const bonus = Math.max(0, a.bonus);
  const bonusSacrifice = Math.min(bonus, Math.max(0, a.bonus_sacrifice));
  const cashBonus = bonus - bonusSacrifice;
  const allowanceExchange = a.car_type === "Car allowance exchanged for salary-sacrifice car";
  const carAllowanceEntitlement = ["Cash car allowance", "Car allowance exchanged for salary-sacrifice car"].includes(a.car_type) ? Math.max(0, a.car_allowance) : 0;
  const carAllowance = a.car_type === "Cash car allowance" ? carAllowanceEntitlement : 0;
  const allowanceSacrifice = allowanceExchange ? carAllowanceEntitlement : 0;
  const salarySacrificeCar = ["Salary sacrifice car", "Car allowance exchanged for salary-sacrifice car"].includes(a.car_type);
  const requestedSalarySacrifice = allowanceExchange ? a.extra_car_sacrifice : a.car_sacrifice;
  const carSacrifice = salarySacrificeCar ? Math.min(annualSalary, Math.max(0, requestedSalarySacrifice)) : 0;
  const totalCarForegone = allowanceSacrifice + carSacrifice;
  const postCarSalary = Math.max(0, annualSalary - carSacrifice);
  const hasCarBenefit = ["Company car", "Salary sacrifice car", "Car allowance exchanged for salary-sacrifice car"].includes(a.car_type);
  const normalCarBenefitBeforePayment = hasCarBenefit ? Math.max(0, a.car_list_price) * a.car_bik_rate : 0;
  const privateUsePayment = hasCarBenefit ? Math.max(0, a.private_use_payment) : 0;
  let carBenefit = 0;
  if (a.car_type === "Company car") carBenefit = Math.max(0, normalCarBenefitBeforePayment - privateUsePayment);
  if (salarySacrificeCar) {
    carBenefit = a.low_emission_car
      ? Math.max(0, normalCarBenefitBeforePayment - privateUsePayment)
      : Math.max(normalCarBenefitBeforePayment, totalCarForegone);
  }
  const fuelBenefit = hasCarBenefit ? Math.max(0, a.fuel_benefit) : 0;
  const taxableBenefits = carBenefit + fuelBenefit;
  const pensionableBonus = a.bonus_pensionable ? cashBonus : 0;
  const pensionableAllowance = a.allowance_pensionable ? carAllowance : 0;
  let pensionBase = postCarSalary;
  if (a.pension_basis === "Reference salary") pensionBase = annualSalary;
  if (a.pension_basis === "Total pensionable earnings") pensionBase = postCarSalary + pensionableBonus + pensionableAllowance;
  if (a.pension_basis === "Qualifying earnings") {
    pensionBase = Math.max(0, Math.min(postCarSalary + pensionableBonus + pensionableAllowance, a.qualifying_earnings_upper) - a.qualifying_earnings_lower);
  }
  const employeePensionGross = Math.max(0, pensionBase * a.employee_pension_rate);
  const employerPension = Math.max(0, pensionBase * a.employer_pension_rate);
  const employeePensionPretax = ["Net pay arrangement", "Salary sacrifice"].includes(a.pension_method) ? employeePensionGross : 0;
  const employeePensionPosttax = a.pension_method === "Relief at source" ? employeePensionGross * (1 - a.income_tax_basic) : 0;
  const hmrcTopup = a.pension_method === "Relief at source" ? employeePensionGross * a.income_tax_basic : 0;
  const cashPayBeforePension = postCarSalary + cashBonus + carAllowance;
  const grossTaxable = cashPayBeforePension - employeePensionPretax + taxableBenefits;
  const niablePay = a.pension_method === "Salary sacrifice" ? cashPayBeforePension - employeePensionPretax : cashPayBeforePension;
  const reliefAtSourceAdjustment = a.pension_method === "Relief at source" ? employeePensionGross : 0;
  const adjustedNetIncome = Math.max(0, grossTaxable - reliefAtSourceAdjustment);
  const taperedAllowance = Math.max(0, a.personal_allowance - Math.max(0, adjustedNetIncome - 100000) / 2);
  const taxAssumptions = {
    ...a,
    personal_allowance: taperedAllowance,
    basic_rate_ceiling: a.basic_rate_ceiling + reliefAtSourceAdjustment,
    higher_rate_ceiling: a.higher_rate_ceiling + reliefAtSourceAdjustment
  };
  const tax = taxAndNi(grossTaxable, taxAssumptions, niablePay);
  const employerNiSaving = a.pension_method === "Salary sacrifice" && a.employer_passes_ni_saving_to_pension
    ? (employeePensionPretax + bonusSacrifice) * a.employer_ni_rate
    : 0;
  const totalPension = employeePensionGross + employerPension + bonusSacrifice + employerNiSaving;
  const annualNet = cashPayBeforePension - employeePensionPretax - employeePensionPosttax - privateUsePayment - tax.totalIncomeTax - tax.totalEmployeeNi;
  const packageValue = annualSalary + bonus + carAllowanceEntitlement + employerPension;
  return {
    annualSalary, bonus, bonusSacrifice, cashBonus, allowanceExchange, carAllowanceEntitlement,
    carAllowance, allowanceSacrifice, carSacrifice, totalCarForegone, postCarSalary,
    normalCarBenefitBeforePayment, privateUsePayment, carBenefit, fuelBenefit, taxableBenefits, pensionBase,
    employeePensionGross, employeePensionPretax, employeePensionPosttax, hmrcTopup,
    employerPension, employerNiSaving, totalPension, cashPayBeforePension, grossTaxable,
    niablePay, taperedAllowance, ...tax, packageValue, daysPerYear, hoursPerYear, annualNet,
    monthlyNet: annualNet / 12,
    dailyNet: daysPerYear ? annualNet / daysPerYear : 0,
    hourlyNet: hoursPerYear ? annualNet / hoursPerYear : 0,
    effectiveTaxRate: cashPayBeforePension ? 1 - annualNet / cashPayBeforePension : 0
  };
}

function assumptions() {
  const tax = TAX_YEARS[$("taxYear").value];
  return {
    days_per_week: value("pDpw"),
    weeks_per_year: workingWeeks(value("pDpw"), value("pLeave"), value("pBh")),
    hours_per_day: value("pHpd"),
    bonus: value("pBonus"),
    bonus_sacrifice: value("pBonusSacrifice"),
    car_type: $("pCarType").value,
    car_allowance: value("pCarAllowance"),
    car_list_price: value("pCarListPrice"),
    car_bik_rate: pct("pCarBikRate"),
    private_use_payment: value("pPrivateUsePayment"),
    fuel_benefit: value("pFuelBenefit"),
    car_sacrifice: value("pCarSacrifice"),
    extra_car_sacrifice: value("pExtraCarSacrifice"),
    low_emission_car: $("pLowEmissionCar").checked,
    pension_method: $("pPensionMethod").value,
    pension_basis: $("pPensionBasis").value,
    employee_pension_rate: pct("pEePension"),
    employer_pension_rate: pct("pErPension"),
    bonus_pensionable: $("pBonusPensionable").checked,
    allowance_pensionable: $("pAllowancePensionable").checked,
    employer_passes_ni_saving_to_pension: $("pNiPassback").checked,
    qualifying_earnings_lower: 6240,
    qualifying_earnings_upper: 50270,
    ...tax
  };
}

function breakdownRows(result) {
  return [
    { section: "Cash package and sacrifice" },
    { label: "Contracted salary", value: result.annualSalary },
    { label: "Year-end bonus", value: result.bonus },
    { label: "Bonus sacrificed to pension", value: -result.bonusSacrifice, deduction: true },
    { label: "Car allowance entitlement", value: result.carAllowanceEntitlement },
    { label: "Car allowance exchanged", value: -result.allowanceSacrifice, deduction: true },
    { label: result.allowanceExchange ? "Extra salary sacrificed for car" : "Car salary sacrifice", value: -result.carSacrifice, deduction: true },
    { label: "Cash pay before pension", value: result.cashPayBeforePension, total: true },
    { section: "Pension" },
    { label: "Pension calculation base", value: result.pensionBase, note: $("pPensionBasis").value },
    { label: "Employee pension (gross)", value: result.employeePensionGross },
    { label: "Employer pension", value: result.employerPension },
    { label: "HMRC relief-at-source top-up", value: result.hmrcTopup },
    { label: "Employer NI saving added", value: result.employerNiSaving },
    { label: "Total pension funding", value: result.totalPension, total: true },
    { section: "Taxable pay and benefits" },
    { label: "Cash pay before pension", value: result.cashPayBeforePension },
    { label: "Employee pension (pre-tax)", value: -result.employeePensionPretax, deduction: true },
    { label: "Taxable car benefit", value: result.carBenefit },
    { label: "Taxable private fuel benefit", value: result.fuelBenefit },
    { label: "Gross taxable income", value: result.grossTaxable, total: true },
    { label: "NI-able cash pay", value: result.niablePay },
    { section: "Tax, NI and take-home" },
    { label: "Income Tax", value: -result.totalIncomeTax, deduction: true },
    { label: "Employee National Insurance", value: -result.totalEmployeeNi, deduction: true },
    { label: "Employee pension from net pay", value: -result.employeePensionPosttax, deduction: true },
    { label: "Private-use car payment", value: -result.privateUsePayment, deduction: true },
    { label: "Net take-home", value: result.annualNet, total: true }
  ];
}

function renderBreakdown(result) {
  const period = $("pDisplayPeriod").value;
  $("breakdown").innerHTML = breakdownRows(result).map((row) => {
    if (row.section) return `<div class="break-section">${row.section}</div>`;
    const classes = ["break-row", row.deduction ? "deduction" : "", row.total ? "total" : ""].filter(Boolean).join(" ");
    const note = row.note ? `<span class="break-note">${row.note}</span>` : "";
    return `<div class="${classes}"><span>${row.label}</span><strong>${displayMoney(row.value, period)}</strong>${note}</div>`;
  }).join("");
}

function syncConditionalFields() {
  const method = $("pPensionMethod").value;
  $("pNiPassbackRow").hidden = method !== "Salary sacrifice";
  const carType = $("pCarType").value;
  const allowanceExchange = carType === "Car allowance exchanged for salary-sacrifice car";
  const allowance = ["Cash car allowance", "Car allowance exchanged for salary-sacrifice car"].includes(carType);
  const benefit = ["Company car", "Salary sacrifice car", "Car allowance exchanged for salary-sacrifice car"].includes(carType);
  const sacrifice = ["Salary sacrifice car", "Car allowance exchanged for salary-sacrifice car"].includes(carType);
  document.querySelectorAll(".car-allowance").forEach((el) => { el.hidden = !allowance; });
  document.querySelectorAll(".car-benefit").forEach((el) => { el.hidden = !benefit; });
  document.querySelectorAll(".car-sacrifice").forEach((el) => { el.hidden = !sacrifice; });
  document.querySelectorAll(".car-direct-sacrifice").forEach((el) => { el.hidden = carType !== "Salary sacrifice car"; });
  document.querySelectorAll(".car-allowance-exchange").forEach((el) => { el.hidden = !allowanceExchange; });
}

function calculate() {
  syncConditionalFields();
  const weeks = workingWeeks(value("pDpw"), value("pLeave"), value("pBh"));
  const result = calculatePrivateEmployment(value("pSalary"), assumptions());
  $("pWeeksText").textContent = weeks.toFixed(1);
  $("monthlyNet").textContent = currency(result.monthlyNet);
  $("pensionValue").textContent = currency(result.totalPension);
  renderBreakdown(result);
  return result;
}

function persist(target) {
  if (!target.matches("[data-save]")) return;
  const saved = target.type === "checkbox" ? String(target.checked) : target.value;
  localStorage.setItem(`takeHome.${target.id}`, saved);
}

function restore() {
  document.querySelectorAll("[data-save]").forEach((element) => {
    const saved = localStorage.getItem(`takeHome.${element.id}`);
    if (saved === null) return;
    if (element.type === "checkbox") element.checked = saved === "true";
    else element.value = saved;
  });
}

function setupTabs() {
  document.querySelectorAll('[role="tab"]').forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll('[role="tab"]').forEach((button) => button.setAttribute("aria-selected", String(button === tab)));
      document.querySelectorAll(".option-panel").forEach((panel) => { panel.hidden = panel.id !== tab.getAttribute("aria-controls"); });
    });
  });
}

function init() {
  Object.entries(TAX_YEARS).forEach(([year, tax]) => $("taxYear").add(new Option(tax.label, year)));
  $("taxYear").value = "2026/27";
  restore();
  setupTabs();
  document.addEventListener("input", (event) => { persist(event.target); calculate(); });
  document.addEventListener("change", (event) => { persist(event.target); calculate(); });
  calculate();

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./service-worker.js").catch(() => {
        $("offlineStatus").textContent = "Online mode";
      });
    });
  } else {
    $("offlineStatus").textContent = "Online mode";
  }
}

init();
