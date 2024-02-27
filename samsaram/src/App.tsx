import './App.css';
import ExpenseCard from './components/ExpenseCard';

function App() {

  return (
    <>
      <ExpenseCard title='Personal Expense' budget={{ total: 30000, spend: 15000 }} />
    </>
  )
}

export default App
