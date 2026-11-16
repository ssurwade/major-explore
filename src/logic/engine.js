import { AREAS, AREA_KEYWORDS, ANSWERS, CONFIDENCE, MAJORS, PRIORITIES, areaById, majorById } from '../data/catalog.js';

const lower = (s) => (/^I\b/.test(s) ? s : s.charAt(0).toLowerCase() + s.slice(1));
const bare = (s) => (s || '').trim().replace(/[.!?]+$/, '');
const areaName = (id) => lower(areaById[id]?.label ?? id);
const listJoin = (xs) => (xs.length <= 1 ? xs.join('') : xs.slice(0, -1).join(', ') + ' and ' + xs[xs.length - 1]);

function sentences(text) {
  return (text || '')
    .split(/(?<=[.!?])\s+|\n+|,\s+(?:and\s+)?(?=I\s)|\s+and\s+(?=I\s)/)
    .map((s) => s.trim().replace(/[.!?]+$/, ''))
    .filter(Boolean);
}

function matches(text, words) {
  const t = text.toLowerCase();
  return words.some((w) => t.includes(w));
}

/** Pieces of the student's own free text that mention an area. */
export function quotesFor(state, areaId, extraWords = []) {
  const words = [...(AREA_KEYWORDS[areaId] || []), ...extraWords];
  return sentences(state.freeText).filter((s) => matches(s, words));
}

export function answersBy(state, value) {
  return AREAS.filter((a) => state.answers[a.id] === value);
}

function score(state, major) {
  const a = state.answers;
  let s = 0;
  if (a[major.area] === 'like') s += 4;
  if (a[major.area] === 'not_sure') s += 1;
  if (a[major.area] === 'dislike') s -= 6;
  for (const n of major.needs) if (a[n] === 'dislike') s -= 1;
  for (const p of major.priorities) if (state.priorities.includes(p)) s += 1;
  if (matches(state.freeText || '', [...(AREA_KEYWORDS[major.area] || []), ...major.keywords])) s += 2;
  return s;
}

function bridgeFor(state, major) {
  const liked = answersBy(state, 'like').map((x) => x.id);
  const to = liked.find((id) => major.bridges[id]);
  return to ? { to, text: major.bridges[to] } : null;
}

function override(state, key, text) {
  const r = state.review[key];
  return r && r.decision === 'edit' && r.text ? r.text : text;
}

/** One option card's content, phrased from the student's answers. */
export function buildItem(state, id, slot) {
  const major = majorById[id];
  const a = state.answers;
  const reasons = [];
  if (a[major.area] === 'like') reasons.push(`I like ${areaName(major.area)}`);
  for (const q of quotesFor(state, major.area, major.keywords)) if (reasons.length < 3) reasons.push(q);
  const pr = PRIORITIES.filter((p) => major.priorities.includes(p.id) && state.priorities.includes(p.id));
  if (reasons.length < 2 && pr[0]) reasons.push(`${pr[0].label} matters to me`);
  if (reasons.length === 0 && a[major.area] === 'not_sure') reasons.push(`I’m not sure about ${areaName(major.area)} yet`);

  const disliked = major.needs.filter((n) => a[n] === 'dislike');
  let headsUp = major.headsUp;
  if (disliked.length) headsUp = headsUp.replace(/\.$/, '') + `, and you said ${listJoin(disliked.map(areaName))} isn’t your thing.`;

  let tryReason = null;
  if (slot === 'try') {
    const b = bridgeFor(state, major);
    tryReason = b
      ? `You haven’t tried ${areaName(major.area)} yet. We included it because ${b.text}, and you like ${areaName(b.to)}.`
      : `You haven’t tried ${areaName(major.area)} yet, so it’s worth a small test before you rule it out.`;
  }

  const fitText =
    'Because you said ' + listJoin(reasons.map((r) => `“${r}”`)) + '.';

  return {
    id,
    major,
    slot,
    reasons,
    fitText: override(state, `${id}.fit`, fitText),
    fitEdited: state.review[`${id}.fit`]?.decision === 'edit',
    headsUp: override(state, `${id}.headsUp`, headsUp),
    findOut: major.findOut,
    tryReason: tryReason && override(state, `${id}.try`, tryReason),
  };
}

/** First shortlist: two directions that fit, plus one "worth a try" from something not yet tried. */
export function computeShortlist(state) {
  const pool = MAJORS.filter((m) => !state.excluded.includes(m.id));
  const scored = pool.map((m) => ({ m, s: score(state, m) })).sort((x, y) => y.s - x.s);
  const a = state.answers;

  const fit = [];
  const usedAreas = new Set();
  for (const { m, s } of scored) {
    if (fit.length === 2) break;
    if (s <= 0 || a[m.area] === 'not_tried' || a[m.area] === 'dislike' || usedAreas.has(m.area)) continue;
    fit.push(m.id);
    usedAreas.add(m.area);
  }

  const tryCands = scored.filter(({ m }) => a[m.area] === 'not_tried' && !fit.includes(m.id));
  const bridged = tryCands.find(({ m }) => bridgeFor(state, m));
  const tryPick = (bridged || tryCands[0])?.m.id;

  const ids = [...fit];
  if (tryPick) ids.push(tryPick);
  for (const { m } of scored) {
    if (ids.length >= 3) break;
    if (!ids.includes(m.id) && a[m.area] !== 'dislike') ids.push(m.id);
  }

  return ids.map((id) => buildItem(state, id, id === tryPick ? 'try' : 'fit'));
}

/** Options as they stand now: the accepted revision if there is one, else the first shortlist. */
export function currentOptions(state) {
  if (state.revision === 'accepted' && state.revisedIds) {
    return state.revisedIds.map((id) => buildItem(state, id, 'fit'));
  }
  return computeShortlist(state).filter((it) => !state.dismissed[it.id]);
}

/** What the reflection changes, each change with its reason in the student's words. */
export function computeRevision(state) {
  const before = computeShortlist(state).filter((it) => !state.dismissed[it.id]);
  const changes = [];
  const keep = [];

  for (const it of before) {
    const r = state.reflections[it.id] || {};
    const take = state.takes[it.id];
    const name = it.major.name;
    if (state.broughtBack.includes(it.id)) {
      changes.push({ id: it.id, kind: 'kept', name, reason: 'You brought it back, so it stays on your list.' });
      keep.push(it.id);
    } else if (r.feel === 'no' || take === 'no') {
      const why = r.worst ? `the hardest part was “${bare(r.worst)}”` : r.note ? `“${bare(r.note)}”` : 'it’s not for you';
      changes.push({ id: it.id, kind: 'removed', name, reason: `You said ${why}. It can stay something you enjoy on the side.` });
    } else if (it.slot === 'try' && (r.feel === 'love' || r.feel === 'ok')) {
      const why = r.best ? `${r.feel === 'love' ? 'you loved it, and' : 'it was OK, and'} the best part was “${lower(bare(r.best))}”` : `it was ${r.feel === 'love' ? 'great' : 'OK'}`;
      changes.push({ id: it.id, kind: "moved", name, reason: `${why.charAt(0).toUpperCase() + why.slice(1)}. It’s now a real option, not just “worth a try.”` + (r.worst ? ` Hard parts like “${lower(bare(r.worst))}” are normal at the start.` : '') });
      keep.push(it.id);
    } else if (r.feel) {
      const felt = r.feel === 'love' ? 'loved the activity' : 'thought the activity was OK';
      changes.push({ id: it.id, kind: 'kept', name, reason: `You ${felt}.` + (r.wondering ? ` New thing to find out: ${lower(bare(r.wondering))}?` : '') });
      keep.push(it.id);
    } else {
      changes.push({ id: it.id, kind: 'kept', name, reason: 'You haven’t tried it yet, so it stays open.' + (r.note ? ` You noted: “${bare(r.note)}.”` : '') });
      keep.push(it.id);
    }
  }

  // Fill back to three, guided by what they're still wondering about and their priorities.
  const wonder = Object.values(state.reflections).map((r) => [r.wondering, r.best, r.note].filter(Boolean).join(' ')).join(' ');
  const taken = new Set([...before.map((b) => b.id), ...state.excluded]);
  const cands = MAJORS.filter((m) => !taken.has(m.id) && state.answers[m.area] !== 'dislike')
    .map((m) => {
      const hit = m.keywords.find((k) => wonder.toLowerCase().includes(k));
      const pr = PRIORITIES.find((p) => m.priorities.includes(p.id) && state.priorities.includes(p.id));
      return { m, hit, pr, s: score(state, m) + (hit ? 5 : 0) };
    })
    .sort((x, y) => y.s - x.s);

  let i = 0;
  while (keep.length < 3 && cands[i]) {
    const { m, hit, pr } = cands[i++];
    const phrase = Object.values(state.reflections).map((r) => r.wondering).find((w) => w && hit && w.toLowerCase().includes(hit));
    const reason = phrase
      ? `You asked “${phrase}”` + (pr ? `, and ${lower(pr.label)} is one of your priorities.` : '.') + ` A lot of this work happens ${m.setting}.`
      : pr
        ? `${pr.label} is one of your priorities, and this field fits it. Work happens ${m.setting}.`
        : state.answers[m.area] === 'not_sure'
          ? `You said you’re not sure about ${areaName(m.area)} yet, so it’s worth a small test.`
          : state.answers[m.area] === 'like'
            ? `You said you like ${areaName(m.area)}, and this is a different way into it.`
            : `It fills the open slot. Nothing you said rules it out, but it’s a long shot.`;
    changes.unshift({ id: m.id, kind: 'added', name: m.name, reason });
    keep.push(m.id);
  }

  const order = { added: 0, moved: 1, kept: 2, removed: 3 };
  changes.sort((x, y) => order[x.kind] - order[y.kind]);

  return { before, after: keep, changes };
}

export function confidenceLabel(id) {
  return CONFIDENCE.find((c) => c.id === id)?.label;
}

/** Playback rows: the student's answers grouped back for checking. */
export function playback(state) {
  const into = [...answersBy(state, 'like').map((a) => a.label)];
  for (const s of sentences(state.freeText)) if (into.length < 6) into.push(s.replace(/^I\s+/i, '').replace(/^\w/, (c) => c.toUpperCase()));
  return {
    into,
    not: answersBy(state, 'dislike').map((a) => a.label),
    open: [...answersBy(state, 'not_tried'), ...answersBy(state, 'not_sure')].map((a) => ({
      label: a.label,
      sure: state.answers[a.id] === 'not_sure',
    })),
    priorities: state.priorities.map((id) => PRIORITIES.find((p) => p.id === id)?.label),
    notes: state.notes,
  };
}

export function chosenActivity(state, major) {
  const idx = state.activityIdx[major.id] || 0;
  return major.activities[idx % major.activities.length];
}

/** The one-pager's sections, written from everything the student has done. */
export function summary(state) {
  const opts = currentOptions(state);
  const rf = state.reflections;
  const lines = opts.map((it) => {
    const r = rf[it.id] || {};
    const parts = [];
    if (it.reasons[0]) parts.push(it.reasons[0].replace(/^I /, '').replace(/^\w/, (c) => c.toUpperCase()) + '.');
    if (r.feel === 'love') parts.push('Tried it and loved it.');
    else if (r.feel === 'ok') parts.push('Tried it; it was OK.');
    else if (r.feel === 'no') parts.push('Tried it; not for me.');
    else parts.push('Haven’t tried it yet.');
    if (r.wondering) parts.push(`Wondering: ${lower(bare(r.wondering))}?`);
    else parts.push(`Watch out: ${lower(it.major.headsUp)}`);
    return { name: it.major.name, text: parts.join(' ') };
  });

  const diffs = [];
  const more = opts.filter((o) => o.major.facts.school.more);
  const less = opts.filter((o) => !o.major.facts.school.more);
  if (more.length && less.length)
    diffs.push({ text: `${listJoin(more.map((o) => o.major.name))} jobs can need extra years of school; ${listJoin(less.map((o) => o.major.name))} usually don’t.`, src: 'BLS' });
  const settings = opts.map((o) => `${o.major.name} is ${o.major.setting}`);
  if (settings.length) diffs.push({ text: settings.join('; ') + '.', src: 'O*NET' });
  if (state.compareNote) diffs.push({ text: `What I noticed: ${state.compareNote}`, src: null });

  const tried = opts
    .filter((o) => rf[o.id]?.feel)
    .map((o) => {
      const r = rf[o.id];
      const feel = { love: 'loved it', ok: 'it was OK', no: 'not for me' }[r.feel];
      return `${chosenActivity(state, o.major).title}: ${feel}.` + (r.worst ? ` Hard part: ${lower(bare(r.worst))}.` : '');
    });
  for (const [id, r] of Object.entries(rf)) {
    if (!opts.find((o) => o.id === id) && (r.feel || r.note) && majorById[id])
      tried.push(`${majorById[id].name}: ${r.note ? lower(bare(r.note)) : { love: 'loved it', ok: 'it was OK', no: 'not for me' }[r.feel]}.`);
  }

  const qs = [];
  for (const o of opts) {
    const w = rf[o.id]?.wondering;
    if (w) qs.push(bare(w) + '?');
  }
  if (opts.length >= 2) qs.push(`Can I combine ${opts[0].major.name.toLowerCase()} and ${opts[opts.length - 1].major.name.toLowerCase()}?`);
  if (state.notes) qs.push(`Which colleges fit this: “${bare(state.notes)}”?`);
  qs.push('What classes next year would help me test these?');

  const next = opts.map((o) => {
    const done = state.tried[o.id];
    const acts = o.major.activities;
    const idx = state.activityIdx[o.id] || 0;
    return (done ? acts[(idx + 1) % acts.length] : acts[idx % acts.length]).title + '.';
  });

  const priorities = state.priorities.map((id) => lower(PRIORITIES.find((p) => p.id === id)?.label || ''));

  return { opts, lines, diffs, tried, qs: qs.slice(0, 4), next, priorities };
}

const GUARDRAILS = [
  { re: /\b(strong|perfect|great|best|ideal|top)\s+(match|fit)\b/i, name: 'match-strength language' },
  { re: /\d+\s?%/, name: 'percent or score' },
  { re: /\b(guarantee|definitely|you will love|you should major)\b/i, name: 'certainty claim' },
  { re: /\b(salary|pay|earn)\b.*\b(best|highest|top)\b/i, name: 'pay as ranking' },
];

export function guardrail(text) {
  return GUARDRAILS.find((g) => g.re.test(text || ''))?.name || null;
}

/** Draft fields a reviewer must clear before the shortlist is released. */
export function reviewFields(state) {
  const items = computeShortlist(state);
  const fields = [];
  items.forEach((it, i) => {
    const n = `Direction ${i + 1} · ${it.major.name}`;
    const answerSrc = (area) => ({ id: `intake.q_${area} = ${state.answers[area] || 'skipped'}`, text: 'Student answer' });
    if (it.slot === 'try') {
      const b = bridgeFor(state, it.major);
      fields.push({
        key: `${it.id}.try`,
        label: `${n} · Worth a try reason`,
        text: it.tryReason,
        sources: [answerSrc(it.major.area), b ? { id: 'selector: adjacency rule', text: `Untried area adjacent to liked ${areaName(b.to)}` } : { id: 'selector: untried slot', text: 'No bridge found; untried area' }],
      });
    } else {
      const quoteSrc = quotesFor(state, it.major.area, it.major.keywords)[0];
      fields.push({
        key: `${it.id}.fit`,
        label: `${n} · why it may fit`,
        text: it.fitText,
        sources: [answerSrc(it.major.area), ...(quoteSrc ? [{ id: 'intake.free_text', text: `“${quoteSrc}”` }] : [])],
      });
    }
    fields.push({
      key: `${it.id}.headsUp`,
      label: `${n} · why it may not`,
      text: it.headsUp,
      sources: [{ id: `kb:major/${it.id} [v]`, text: 'Typical core requirements' }, ...it.major.needs.map(answerSrc)],
    });
  });
  return fields;
}

export const answerLabel = (v) => ANSWERS[v];
