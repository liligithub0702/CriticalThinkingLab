/*
 * ---------------------------------------------------------------------------
 * SHARED AGGREGATION - one implementation, used by both sides.
 * ---------------------------------------------------------------------------
 * The browser loads this with a plain <script> tag; the API imports it for its
 * side effect and reads globalThis.CTPAgg. Keeping it in one file means the
 * figures the learner filters to and the figures the coach is given can never
 * disagree.
 *
 * Averaging follows the workbook by default: team, week and tenure figures are
 * the UNWEIGHTED mean of agent-week rates, exactly as its pivot tables compute
 * them. The weighted alternative is available through the same functions so the
 * app can show both - the gap between them is one of the things this dashboard
 * is meant to make visible.
 * ---------------------------------------------------------------------------
 */

(function (root) {
  'use strict';

  /* Which raw column each filter reads. QA audit rows carry no week and no
     call reason, so those two filters cannot narrow the audit sample. */
  var ROW_KEYS = { team: 'team', week: 'week', ten: 'ten', name: 'name', reason: 'reason' };
  var QA_KEYS = { team: 'team', ten: 'ten', name: 'name' };

  var EMPTY = { team: [], week: [], ten: [], name: [], reason: [] };

  function emptyFilters() {
    return { team: [], week: [], ten: [], name: [], reason: [] };
  }

  function activeCount(filters) {
    var n = 0;
    Object.keys(EMPTY).forEach(function (k) {
      if (filters && filters[k] && filters[k].length) n += 1;
    });
    return n;
  }

  function matches(row, filters, keys) {
    if (!filters) return true;
    for (var key in keys) {
      var picked = filters[key];
      if (!picked || !picked.length) continue;
      if (!Object.prototype.hasOwnProperty.call(keys, key)) continue;
      if (picked.indexOf(row[keys[key]]) === -1) return false;
    }
    return true;
  }

  function filterRows(rows, filters) {
    return rows.filter(function (r) { return matches(r, filters, ROW_KEYS); });
  }

  /* Week and reason are dropped here on purpose - the audit sample has neither. */
  function filterQa(qaRows, filters) {
    return qaRows.filter(function (r) { return matches(r, filters, QA_KEYS); });
  }

  function qaFiltersIgnored(filters) {
    var out = [];
    if (filters && filters.week && filters.week.length) out.push('week');
    if (filters && filters.reason && filters.reason.length) out.push('reason for the call');
    return out;
  }

  var RATES = ['csat', 'nps', 'fcr', 'qa'];

  /*
   * Summarise a set of agent-week rows.
   *   csat/nps/fcr/qa/aht  unweighted mean of the rows, as the workbook computes it
   *   csatW/npsW/fcrW      weighted by surveys returned
   *   qaW/ahtW             weighted by calls handled
   */
  function summarise(rows) {
    var out = {
      n: rows.length, agents: 0, surveys: 0, calls: 0, pos: 0, neg: 0,
      csat: 0, nps: 0, fcr: 0, qa: 0, aht: 0,
      csatW: 0, npsW: 0, fcrW: 0, qaW: 0, ahtW: 0
    };
    if (!rows.length) return out;

    var seen = Object.create(null);
    var wSurvey = { csat: 0, nps: 0, fcr: 0 };
    var wCall = { qa: 0, aht: 0 };

    rows.forEach(function (r) {
      seen[r.name] = 1;
      out.surveys += r.surveys;
      out.calls += r.calls;
      out.pos += r.pos;
      out.neg += r.neg;
      RATES.forEach(function (f) { out[f] += r[f]; });
      out.aht += r.aht;
      wSurvey.csat += r.csat * r.surveys;
      wSurvey.nps += r.nps * r.surveys;
      wSurvey.fcr += r.fcr * r.surveys;
      wCall.qa += r.qa * r.calls;
      wCall.aht += r.aht * r.calls;
    });

    out.agents = Object.keys(seen).length;
    RATES.forEach(function (f) { out[f] = out[f] / rows.length; });
    out.aht = out.aht / rows.length;
    out.csatW = out.surveys ? out.pos / out.surveys : 0;
    out.npsW = out.surveys ? wSurvey.nps / out.surveys : 0;
    out.fcrW = out.surveys ? wSurvey.fcr / out.surveys : 0;
    out.qaW = out.calls ? wCall.qa / out.calls : 0;
    out.ahtW = out.calls ? wCall.aht / out.calls : 0;
    return out;
  }

  /* Pick a metric off a summary, honouring the chosen averaging. */
  function value(summary, metric, weighted) {
    if (!weighted) return summary[metric];
    var w = summary[metric + 'W'];
    return typeof w === 'number' ? w : summary[metric];
  }

  /* Group rows by a field and summarise each group. `order` fixes the order. */
  function groupBy(rows, field, order) {
    var buckets = Object.create(null);
    rows.forEach(function (r) {
      var k = r[field];
      (buckets[k] || (buckets[k] = [])).push(r);
    });
    var keys = order
      ? order.filter(function (k) { return buckets[k]; })
      : Object.keys(buckets).sort();
    return keys.map(function (k) {
      var s = summarise(buckets[k]);
      s.key = k;
      return s;
    });
  }

  /* Distinct values of a field, in the order given or alphabetical. */
  function distinct(rows, field, order) {
    var seen = Object.create(null);
    rows.forEach(function (r) { seen[r[field]] = 1; });
    var keys = Object.keys(seen);
    if (order) {
      var ranked = order.filter(function (k) { return seen[k]; });
      keys.forEach(function (k) { if (ranked.indexOf(k) === -1) ranked.push(k); });
      return ranked;
    }
    return keys.sort();
  }

  function counted(list) {
    var c = Object.create(null);
    list.forEach(function (v) { c[v] = (c[v] || 0) + 1; });
    return Object.keys(c)
      .map(function (k) { return { label: k, count: c[k] }; })
      .sort(function (a, b) { return b.count - a.count; });
  }

  /* Summarise a set of QA audit rows. */
  function qaSummarise(qaRows, passMark) {
    var mark = passMark || 90;
    var out = {
      audits: qaRows.length, passMark: mark, passing: 0, meanScore: 0,
      minScore: null, maxScore: null, agentRelated: 0, notAgentRelated: 0,
      drivers: [], causes: [], byTeam: [], histogram: []
    };
    if (!qaRows.length) return out;

    var total = 0;
    qaRows.forEach(function (q) {
      total += q.score;
      if (q.pass) out.passing += 1;
      if (q.agent) out.agentRelated += 1; else out.notAgentRelated += 1;
      if (out.minScore === null || q.score < out.minScore) out.minScore = q.score;
      if (out.maxScore === null || q.score > out.maxScore) out.maxScore = q.score;
    });
    out.meanScore = total / qaRows.length;
    out.drivers = counted(qaRows.map(function (q) { return q.l1; }));
    out.causes = counted(qaRows.map(function (q) { return q.l2; })).slice(0, 10);

    var teams = Object.create(null);
    qaRows.forEach(function (q) {
      var t = teams[q.team] || (teams[q.team] = { key: q.team, audits: 0, total: 0, passing: 0, agentRelated: 0 });
      t.audits += 1;
      t.total += q.score;
      if (q.pass) t.passing += 1;
      if (q.agent) t.agentRelated += 1;
    });
    out.byTeam = Object.keys(teams).sort().map(function (k) {
      var t = teams[k];
      t.meanScore = t.total / t.audits;
      return t;
    });

    /* 5-point buckets across the observed range, so the shape is visible. */
    var lo = Math.floor(out.minScore / 5) * 5;
    var hi = Math.ceil((out.maxScore + 1) / 5) * 5;
    for (var b = lo; b < hi; b += 5) {
      out.histogram.push({ from: b, to: b + 5, label: b + '-' + (b + 4), count: 0, passing: b >= mark });
    }
    qaRows.forEach(function (q) {
      var i = Math.floor((q.score - lo) / 5);
      if (out.histogram[i]) out.histogram[i].count += 1;
    });
    return out;
  }

  root.CTPAgg = {
    emptyFilters: emptyFilters,
    activeCount: activeCount,
    filterRows: filterRows,
    filterQa: filterQa,
    qaFiltersIgnored: qaFiltersIgnored,
    summarise: summarise,
    value: value,
    groupBy: groupBy,
    distinct: distinct,
    counted: counted,
    qaSummarise: qaSummarise
  };
})(typeof globalThis !== 'undefined' ? globalThis : this);
