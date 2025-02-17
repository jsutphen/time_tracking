import { useEffect, useState } from 'react';
import './App.css';
import { Pause, Play, Square, Trash } from 'lucide-react';

function App() {
  const [timers, setTimers] = useState<Array<Timer>>(() => {
    const savedTimers = localStorage.getItem('timers');
    return savedTimers ?
      JSON.parse(savedTimers) :
      []
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prevTimers) =>
        prevTimers.map((timer) =>
          timer.running
            ? { 
                ...timer, 
                seconds: timer.seconds + Math.round(Date.now() / 1000) - timer.lastUpdated,
                lastUpdated: Math.round(Date.now() / 1000)
              }
            : {...timer, lastUpdated: Math.round(Date.now() / 1000)}
        )
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem('timers', JSON.stringify(timers));
  }, [timers])

  function toggleTimer(idx: number) {
    setTimers((prevTimers) =>
      prevTimers.map((item, index) =>
        index === idx
          ? { ...item, running: !item.running }
          : item
      )
    );
  }

  function resetTimer(idx: number) {
    setTimers((prevTimers) =>
      prevTimers.map((item, index) =>
        index === idx
          ? { ...item, running: false, seconds: 0 }
          : item
      )
    );
  }

  function updateTimerName(idx: number, name: string) {
    setTimers((prevTimers) =>
      prevTimers.map((item, index) =>
        index === idx
          ? { ...item, name }
          : item
      )
    );
  }

  function addTimer() {
    setTimers([
      ...timers, 
      {
        name: '', 
        seconds: 0, 
        running: false,
        lastUpdated: Math.round(Date.now() / 1000)
      }
    ])
  }

  function removeTimer(idx: number) {
    setTimers((prevTimers) => 
      prevTimers.filter((_, index) => index != idx))
  }

  function formatSecondsAsTime(inputSeconds: number): string {
    const seconds = inputSeconds % 60;
    const minutes = Math.floor((inputSeconds % 3600) / 60);
    const hours = Math.floor((inputSeconds % (24 * 3600)) / 3600);
    return `${hours<10?'0'+hours:hours}:${minutes<10?'0'+minutes:minutes}:${seconds<10?'0'+seconds:seconds}`
  }

  interface Timer {
    seconds: number;
    name: string;
    running: boolean;
    lastUpdated: number; 
  }

  return (
    <>
      <h1 className='text-4xl my-4'>
        Private Time Tracking
      </h1>

      <p className='my-4'>
        Keep track of your work time. 
        <br />
        Time is kept in sync after closing reopening the tab / browser.
      </p>
      
      {timers.map((timer, idx) => (
        <div
          className="w-full items-stretch flex justify-between my-4"
          key={idx}
        >
          <input
            type="text"
            placeholder="Unnamed Timer"
            value={timer.name}
            onChange={(e) => updateTimerName(idx, e.target.value)}
            className='px-2 w-32 grow'
          />
          <p className="self-center w-20 px-2">{formatSecondsAsTime(timer.seconds)}</p>
          <div>
            <button
              onClick={() => toggleTimer(idx)}
            >
              {timer.running ? <Pause size={16} /> : <Play size={16} />}
            </button>
            <button onClick={() => resetTimer(idx)}><Square size={16} /></button>
            <button onClick={() => removeTimer(idx)}><Trash size={16} /></button>
          </div>
        </div>
      ))}
      <button 
        className='my-4'
        onClick={() => addTimer()}>
        Add Timer
      </button>
    </>
  );
}

export default App;
