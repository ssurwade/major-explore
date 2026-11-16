import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';

const KEY = 'major-explore:v1';

export const initialState = {
  studentId: null,
  name: '',
  grade: '11',
  intakeIdx: 0,
  answers: {},
  freeText: '',
  priorities: [],
  notes: '',
  confidenceBefore: null,
  submitted: false,
  released: false,
  excluded: [],
  rerollsLeft: 3,
  dismissed: {},
  takes: {},
  credibility: null,
  compareNote: '',
  tried: {},
  reminders: {},
  activityIdx: {},
  reflections: {},
  confidenceNow: null,
  revision: 'pending',
  revisedIds: null,
  broughtBack: [],
  history: [],
  include: { dir: true, cmp: true, exp: true, q: true, next: true },
  use: null,
  review: {},
};

function newStudentId() {
  return 'S-' + String(Math.floor(1000 + Math.random() * 9000));
}

function reducer(state, action) {
  switch (action.type) {
    case 'set':
      return { ...state, ...action.patch };
    case 'merge':
      return { ...state, [action.key]: { ...state[action.key], ...action.patch } };
    case 'reset':
      return { ...initialState, studentId: newStudentId() };
    default:
      return state;
  }
}

function load() {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) return { ...initialState, ...JSON.parse(raw) };
  } catch {
    // Storage blocked or corrupt: start fresh.
  }
  return { ...initialState, studentId: newStudentId() };
}

const Ctx = createContext(null);

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, load);

  useEffect(() => {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      // Not persisted; the session still works.
    }
  }, [state]);

  const api = useMemo(
    () => ({
      set: (patch) => dispatch({ type: 'set', patch }),
      merge: (key, patch) => dispatch({ type: 'merge', key, patch }),
      reset: () => dispatch({ type: 'reset' }),
    }),
    []
  );

  return <Ctx.Provider value={[state, api]}>{children}</Ctx.Provider>;
}

export function useStore() {
  return useContext(Ctx);
}
