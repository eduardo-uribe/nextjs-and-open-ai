'use client';

import { updateEntry } from '@/utils/api';
import { useState } from 'react';
import { useAutosave } from 'react-autosave';

export default function Editor({ entry }) {
  const [value, setValue] = useState(entry.content);
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState(entry.analysis);

  const { mood, summary, color, subject, negative } = analysis;
  const analysisData = [
    { name: 'Summary', value: summary },
    { name: 'Subject', value: subject },
    { name: 'Mood', value: mood },
    { name: 'Negative', value: `${negative ? 'True' : 'False'}` },
  ];

  useAutosave({
    data: value,
    onSave: async function (updatedValue) {
      setIsLoading(true);
      const data = await updateEntry(entry._id, updatedValue);
      setAnalysis(data.analysis);
      setIsLoading(false);
    },
  });

  return (
    <div className='w-full h-full grid grid-cols-3'>
      <div className='col-span-2'>
        {isLoading && <div>...loading</div>}
        <textarea
          className='w-full h-full p-8 text-xl outline-none'
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
      </div>
      <div className='border-l border-black/10'>
        <div className='px-6 py-10' style={{ backgroundColor: color }}>
          <h2 className='text-2xl'>Analysis</h2>
        </div>
        <div>
          <ul>
            {analysisData.map(function (item) {
              return (
                <li
                  key={item.name}
                  className='flex items-center justify-between px-2 py-4 border-b border-t border-black/10'
                >
                  <span className='text-lg font-semibold'>{item.name}</span>
                  <span>{item.value}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
