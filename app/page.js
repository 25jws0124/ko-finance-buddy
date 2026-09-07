'use client';

import { useMemo, useState } from 'react';
import { evaluate, getScamPatterns, getDbStatus } from '@/lib/engine';
import { t } from '@/lib/i18n';

import Home from './screens/Home';
import Result from './screens/Result';
import Prep from './screens/Prep';
import Confirm from './screens/Confirm';
import Done from './screens/Done';

// 상태는 useState 만 사용한다. 데이터베이스도, 외부 상태관리 라이브러리도 쓰지 않는다.
// 사용자가 고른 내용은 이 브라우저 메모리에만 존재한다.
export default function Page() {
  const [screen, setScreen] = useState('home'); // home | result | prep | confirm | done
  const [lang, setLang] = useState('ko');
  const [visa, setVisa] = useState(null);
  const [task, setTask] = useState(null);
  const [checks, setChecks] = useState([]);

  const s = t(lang);
  const db = useMemo(() => getDbStatus(), []);
  const verdict = useMemo(() => (visa && task ? evaluate(visa, task) : null), [visa, task]);
  const scams = useMemo(() => (task ? getScamPatterns(task) : []), [task]);

  const toggleVisa = (v) => setVisa((cur) => (cur === v ? null : v));
  const toggleTask = (k) => setTask((cur) => (cur === k ? null : k));

  function goResult() {
    const v = evaluate(visa, task);
    setChecks(v.status === 'ok' ? new Array(v.required_docs.length).fill(false) : []);
    setScreen('result');
  }

  function goHome() {
    setScreen('home');
    setVisa(null);
    setTask(null);
    setChecks([]);
  }

  return (
    <main className="app">
      {/* key={screen} 이 바뀔 때마다 래퍼가 새로 마운트되어 전환 애니메이션이 재생된다 */}
      <div key={screen} className="screen">
      {screen === 'home' ? (
        <Home
          s={s}
          lang={lang}
          setLang={setLang}
          visa={visa}
          task={task}
          toggleVisa={toggleVisa}
          toggleTask={toggleTask}
          db={db}
          onNext={goResult}
        />
      ) : null}

      {screen === 'result' && verdict ? (
        <Result
          s={s}
          lang={lang}
          visa={visa}
          task={task}
          verdict={verdict}
          db={db}
          onBack={() => setScreen('home')}
          onNext={() => setScreen('prep')}
        />
      ) : null}

      {screen === 'prep' && verdict?.status === 'ok' ? (
        <Prep
          s={s}
          lang={lang}
          visa={visa}
          task={task}
          verdict={verdict}
          checks={checks}
          setChecks={setChecks}
          onBack={() => setScreen('result')}
          onNext={() => setScreen('confirm')}
        />
      ) : null}

      {screen === 'confirm' && verdict?.status === 'ok' ? (
        <Confirm
          s={s}
          lang={lang}
          visa={visa}
          task={task}
          verdict={verdict}
          checks={checks}
          scams={scams}
          db={db}
          onBack={() => setScreen('prep')}
          onNext={() => setScreen('done')}
        />
      ) : null}

      {screen === 'done' && verdict?.status === 'ok' ? (
        <Done s={s} lang={lang} task={task} verdict={verdict} checks={checks} onHome={goHome} />
      ) : null}
      </div>
    </main>
  );
}
