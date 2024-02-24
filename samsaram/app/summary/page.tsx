import ExpenseCard from "../components/ExpenseCard";

export default function Summary() {
  return (
    <div className="flex flex-col">
      <div className="flex flex-row flex-wrap p-5 space-x-4 space-y-4">
        <ExpenseCard title="Personal Spend" budget={{spend: 10750, total: 21000}}/>
        <ExpenseCard title="Personal Wants" budget={{ spend: 8750, total: 10000}} />
      </div>
      <div className="flex flex-col flex-wrap p-5 space-x-4 space-y-4">
        <ExpenseCard title="Shared Expenses" budget={{ spend: 193500, total: 200000 }} />
      </div>
    </div>
  );
};