import { useAppInitialization } from './hooks/useAppInitialization';
import CurrencySwitcher from './components/CurrencySwitcher';
import ExchangeRateFooter from './components/ExchangeRateFooter';
import HoursSettingsFields from './components/HoursSettingsFields';
import SalaryFields from './components/SalaryFields';

function App() {
  useAppInitialization();

  return (
    <main className="mx-auto flex w-full max-w-6xl items-start justify-center px-4 py-8 sm:px-6 lg:px-8">
      <section className="w-full max-w-4xl rounded-3xl border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-300/50 backdrop-blur-sm sm:p-8">
        <header className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">
              Salary Rate Calculator
            </p>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Online Salary Calculator
            </h1>
            <p className="mt-2 max-w-xl text-sm text-slate-600">
              Edit any salary or working hours field and all related values will recalculate
              automatically.
            </p>
          </div>

          <CurrencySwitcher />
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          <SalaryFields />
          <HoursSettingsFields />
        </div>

        <ExchangeRateFooter />
      </section>
    </main>
  );
}

export default App;
