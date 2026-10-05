import { useSyncExternalStore } from 'react';
import { SUBJECT_CATALOG } from './academics';
import { withComputed, emptySubjectRows } from './resultCard';

const STORAGE_KEY = 'crea8orz_portal_v3';
const STATE_VERSION = 3;

const EMPTY_SESSION = { scores: {}, committed: {} };
const EMPTY_STATE = { version: STATE_VERSION, sessions: {}, meta: {} };

export function sessionKey(academicYear, term) {
  return `${academicYear} | ${term}`;
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_STATE;
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.version !== STATE_VERSION) return EMPTY_STATE;
    return { ...EMPTY_STATE, ...parsed, sessions: { ...(parsed.sessions || {}) } };
  } catch (error) {
    return EMPTY_STATE;
  }
}

let state = load();
const listeners = new Set();

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    return undefined;
  }
  return undefined;
}

function emit() {
  persist();
  listeners.forEach((listener) => listener());
}

function setState(next) {
  state = next;
  emit();
}

// Keep other tabs (e.g. teacher gradebook + student portal side by side) in sync.
if (typeof window !== 'undefined' && window.addEventListener) {
  window.addEventListener('storage', (event) => {
    if (event.key !== null && event.key !== STORAGE_KEY) return;
    state = load();
    listeners.forEach((listener) => listener());
  });
}

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getState() {
  return state;
}

export function usePortalState() {
  return useSyncExternalStore(subscribe, getState, getState);
}

function sessionBucket(stateSnapshot, session) {
  return (stateSnapshot && stateSnapshot.sessions && stateSnapshot.sessions[session]) || EMPTY_SESSION;
}

function classBucket(source, classKey) {
  return (source && source[classKey]) || {};
}

export function getScores(stateSnapshot, session, classKey, studentId) {
  return classBucket(sessionBucket(stateSnapshot, session).scores, classKey)[studentId] || {};
}

export function setScore(session, classKey, studentId, subject, field, value) {
  const sessionData = sessionBucket(state, session);
  const classScores = { ...(sessionData.scores[classKey] || {}) };
  const studentScores = { ...(classScores[studentId] || {}) };
  const subjectScores = { ...(studentScores[subject] || { classWork: 0, homeWork: 0, test: 0, exam: 0 }) };

  subjectScores[field] = value;
  studentScores[subject] = subjectScores;
  classScores[studentId] = studentScores;

  setState({
    ...state,
    sessions: {
      ...state.sessions,
      [session]: { ...sessionData, scores: { ...sessionData.scores, [classKey]: classScores } }
    }
  });
}

export function commitSubject(session, classKey, subject) {
  const sessionData = sessionBucket(state, session);
  const classCommitted = { ...(sessionData.committed[classKey] || {}) };
  const classScores = sessionData.scores[classKey] || {};
  const committedAt = new Date().toISOString();
  let touched = 0;

  Object.keys(classScores).forEach((studentId) => {
    const subjectScores = (classScores[studentId] || {})[subject];
    if (!subjectScores) return;
    classCommitted[studentId] = {
      ...(classCommitted[studentId] || {}),
      [subject]: { ...withComputed(subjectScores), committedAt }
    };
    touched += 1;
  });

  setState({
    ...state,
    sessions: {
      ...state.sessions,
      [session]: { ...sessionData, committed: { ...sessionData.committed, [classKey]: classCommitted } }
    }
  });

  return touched;
}

export function clearCommittedSubject(session, classKey, subject) {
  const sessionData = sessionBucket(state, session);
  const classCommitted = { ...(sessionData.committed[classKey] || {}) };
  let touched = 0;

  Object.keys(classCommitted).forEach((studentId) => {
    if (!classCommitted[studentId] || !classCommitted[studentId][subject]) return;
    const next = { ...classCommitted[studentId] };
    delete next[subject];
    classCommitted[studentId] = next;
    touched += 1;
  });

  setState({
    ...state,
    sessions: {
      ...state.sessions,
      [session]: { ...sessionData, committed: { ...sessionData.committed, [classKey]: classCommitted } }
    }
  });

  return touched;
}

export function getCommittedSubjects(stateSnapshot, session, classKey) {
  const classCommitted = classBucket(sessionBucket(stateSnapshot, session).committed, classKey);
  const found = new Set();
  Object.values(classCommitted).forEach((studentScores) => {
    Object.keys(studentScores || {}).forEach((subject) => found.add(subject));
  });
  return SUBJECT_CATALOG.filter((subject) => found.has(subject));
}

export function isSubjectCommitted(stateSnapshot, session, classKey, subject) {
  return getCommittedSubjects(stateSnapshot, session, classKey).includes(subject);
}

export function getCommittedRows(stateSnapshot, session, classKey, studentId, { includeDraft = false } = {}) {
  const sessionData = sessionBucket(stateSnapshot, session);
  const committed = classBucket(sessionData.committed, classKey)[studentId] || {};
  const draft = classBucket(sessionData.scores, classKey)[studentId] || {};

  return SUBJECT_CATALOG.map((subject) => {
    const source = committed[subject] || (includeDraft ? draft[subject] : null);
    if (!source) {
      return withComputed({ subject, classWork: 0, homeWork: 0, test: 0, exam: 0, pending: true, committed: false });
    }
    return withComputed({
      ...source,
      subject,
      pending: false,
      committed: Boolean(committed[subject])
    });
  });
}

export function committedCountForStudent(stateSnapshot, session, classKey, studentId) {
  return Object.keys(classBucket(sessionBucket(stateSnapshot, session).committed, classKey)[studentId] || {}).length;
}

// Builds one row per class + subject that has any teacher activity in the session,
// so the admin registry reflects real commits and real in-progress drafts.
export function getResultsRegistry(stateSnapshot, session) {
  const sessionData = sessionBucket(stateSnapshot, session);
  const scores = sessionData.scores || {};
  const committed = sessionData.committed || {};
  const rows = [];

  // Walk both buckets: a class can hold commits even with no draft scores left.
  const classKeys = [...new Set([...Object.keys(scores), ...Object.keys(committed)])];

  classKeys.forEach((classKey) => {
    const classScores = classBucket(scores, classKey);
    const classCommitted = classBucket(committed, classKey);
    const scoredIds = Object.keys(classScores);
    const committedIds = Object.keys(classCommitted);

    if (scoredIds.length === 0 && committedIds.length === 0) return;

    const subjects = new Set();
    scoredIds.forEach((id) => Object.keys(classScores[id] || {}).forEach((s) => subjects.add(s)));
    committedIds.forEach((id) => Object.keys(classCommitted[id] || {}).forEach((s) => subjects.add(s)));

    subjects.forEach((subject) => {
      let draftCount = 0;
      let publishedCount = 0;
      let committedAt = '';

      scoredIds.forEach((id) => {
        if ((classScores[id] || {})[subject]) draftCount += 1;
      });

      committedIds.forEach((id) => {
        const entry = (classCommitted[id] || {})[subject];
        if (!entry) return;
        publishedCount += 1;
        if ((entry.committedAt || '') > committedAt) committedAt = entry.committedAt || '';
      });

      rows.push({
        classKey,
        subject,
        draftCount,
        publishedCount,
        published: publishedCount > 0,
        committedAt,
        lastActivity: Date.parse(committedAt) || 0
      });
    });
  });

  return rows.sort(
    (a, b) =>
      b.lastActivity - a.lastActivity ||
      a.classKey.localeCompare(b.classKey) ||
      a.subject.localeCompare(b.subject)
  );
}

export function getMeta(key, fallback = '') {
  const value = state.meta ? state.meta[key] : undefined;
  return value === undefined ? fallback : value;
}

export function setMeta(key, value) {
  setState({ ...state, meta: { ...state.meta, [key]: value } });
}

export function clearAllResults() {
  setState({ ...EMPTY_STATE });
}

export function blankRows() {
  return emptySubjectRows();
}
