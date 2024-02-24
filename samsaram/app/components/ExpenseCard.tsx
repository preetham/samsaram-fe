'use client';

import { ArrowUpRightIcon } from '@heroicons/react/24/outline';
import { Budget } from '../types/Budget';
import { formatNumber, calculatePercentage, setProgressBarColour } from '../util/common';

export default function ExpenseCard({ title, budget }: { title: string, budget: Budget }) {
  return (
    <div className='p-5 max-w-sm mx-auto bg-white rounded-xl shadow-lg flex flex-col items-center space-x-4'>
      <div className='flex flex-row space-x-44'>
        <div className='text-sm'>{title}</div>
        <button className=''><ArrowUpRightIcon className='h-3 w-3' /></button>
      </div>
      <div className='flex flex-col w-full p-4'>
        <div className='flex justify-end mb-3'>
          <span className='flex text-base' id='currency'>₹</span>
          <span className='flex text-3xl'>{formatNumber(budget.spend)}</span>
          <span className="text-sm font-medium dark:text-white self-end">/₹{formatNumber(budget.total)}</span>
        </div>
        <div className='w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700'>
          <div className={`bg-gradient-to-r from-transparent ${setProgressBarColour(budget.spend, budget.total)} h-2.5 rounded-full`} style={{ width: `${calculatePercentage(budget.spend, budget.total)}%` }}></div>
        </div>
      </div>
    </div>
  );
};