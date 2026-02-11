"use client";

import { useMemo, useState } from "react";

const formatNumber = (value: number, digits = 0) =>
  new Intl.NumberFormat("en-US", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits
  }).format(value);

const formatCurrency = (value: number, digits = 0) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: digits,
    minimumFractionDigits: digits
  }).format(value);

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export default function Home() {
  const [targetArr, setTargetArr] = useState(800000);
  const [acvMin, setAcvMin] = useState(10000);
  const [acvMax, setAcvMax] = useState(25000);
  const [useMidpoint, setUseMidpoint] = useState(true);
  const [avgAcv, setAvgAcv] = useState(17500);

  const [proposalCloseRate, setProposalCloseRate] = useState(40);
  const [demoToProposalRate, setDemoToProposalRate] = useState(50);
  const [meetingToDemoRate, setMeetingToDemoRate] = useState(30);

  const [timeframeMonths, setTimeframeMonths] = useState(4);
  const [salesCycleMinWeeks, setSalesCycleMinWeeks] = useState(2);
  const [salesCycleMaxWeeks, setSalesCycleMaxWeeks] = useState(4);

  const [warmContacts, setWarmContacts] = useState(100);
  const [warmResponseRate, setWarmResponseRate] = useState(60);

  const midpoint = useMemo(() => (acvMin + acvMax) / 2, [acvMin, acvMax]);

  const effectiveAvgAcv = useMemo(() => {
    if (useMidpoint) {
      return midpoint;
    }
    return avgAcv;
  }, [avgAcv, midpoint, useMidpoint]);

  const pipeline = useMemo(() => {
    const deals = targetArr / effectiveAvgAcv;
    const proposals = deals / (proposalCloseRate / 100);
    const demos = proposals / (demoToProposalRate / 100);
    const meetings = demos / (meetingToDemoRate / 100);

    return {
      deals,
      proposals,
      demos,
      meetings
    };
  }, [targetArr, effectiveAvgAcv, proposalCloseRate, demoToProposalRate, meetingToDemoRate]);

  const warmProjection = useMemo(() => {
    const warmDemos = warmContacts * (warmResponseRate / 100);
    const warmProposals = warmDemos * (demoToProposalRate / 100);
    const warmClosed = warmProposals * (proposalCloseRate / 100);
    const warmArr = warmClosed * effectiveAvgAcv;

    return {
      warmDemos,
      warmProposals,
      warmClosed,
      warmArr
    };
  }, [warmContacts, warmResponseRate, demoToProposalRate, proposalCloseRate, effectiveAvgAcv]);

  const weeksPerMonth = 4.345;
  const timeframeWeeks = timeframeMonths * weeksPerMonth;
  const cyclesMin = timeframeWeeks / salesCycleMaxWeeks;
  const cyclesMax = timeframeWeeks / salesCycleMinWeeks;

  return (
    <main className="page">
      <section className="hero">
        <div className="hero__content">
          <p className="eyebrow">Revenue calculator</p>
          <h1>Backsolve the pipeline you need to hit ARR goals.</h1>
          <p className="lead">
            Dial the assumptions. The calculator instantly maps your revenue target
            to closed-won deals, proposals, demos with Saharsh, and meetings booked.
          </p>
          <div className="hero__meta">
            <div>
              <span className="label">Goal window</span>
              <strong>{formatNumber(timeframeMonths)} months</strong>
            </div>
            <div>
              <span className="label">Sales cycles in window</span>
              <strong>
                {formatNumber(cyclesMin, 1)}–{formatNumber(cyclesMax, 1)} cycles
              </strong>
            </div>
          </div>
        </div>
        <div className="hero__panel">
          <div className="panel__header">
            <span>Pipeline needed</span>
            <h2>{formatCurrency(targetArr)} ARR</h2>
          </div>
          <div className="panel__grid">
            <div>
              <p>Closed-won deals</p>
              <strong>{formatNumber(Math.ceil(pipeline.deals))}</strong>
            </div>
            <div>
              <p>Proposals sent</p>
              <strong>{formatNumber(Math.ceil(pipeline.proposals))}</strong>
            </div>
            <div>
              <p>Demos with Saharsh</p>
              <strong>{formatNumber(Math.ceil(pipeline.demos))}</strong>
            </div>
            <div>
              <p>Meetings booked</p>
              <strong>{formatNumber(Math.ceil(pipeline.meetings))}</strong>
            </div>
          </div>
          <p className="panel__note">
            Based on {formatNumber(proposalCloseRate)}% close rate, {formatNumber(demoToProposalRate)}% demo → proposal, and
            {formatNumber(meetingToDemoRate)}% meeting → demo.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="section__grid">
          <div className="card">
            <h3>Revenue goal</h3>
            <div className="field">
              <label>Target ARR</label>
              <input
                type="number"
                value={targetArr}
                onChange={(event) => setTargetArr(Math.max(0, Number(event.target.value)))}
              />
              <span className="suffix">USD</span>
            </div>
            <div className="field-row">
              <div className="field">
                <label>ACV min</label>
                <input
                  type="number"
                  value={acvMin}
                  onChange={(event) => setAcvMin(Math.max(0, Number(event.target.value)))}
                />
              </div>
              <div className="field">
                <label>ACV max</label>
                <input
                  type="number"
                  value={acvMax}
                  onChange={(event) => setAcvMax(Math.max(0, Number(event.target.value)))}
                />
              </div>
            </div>
            <div className="field">
              <label>Average ACV</label>
              <input
                type="number"
                value={useMidpoint ? Math.round(midpoint) : avgAcv}
                onChange={(event) => {
                  setUseMidpoint(false);
                  setAvgAcv(Math.max(0, Number(event.target.value)));
                }}
              />
              <span className="suffix">midpoint {formatCurrency(midpoint)}</span>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={useMidpoint}
                onChange={(event) => setUseMidpoint(event.target.checked)}
              />
              Use midpoint as average ACV
            </label>
          </div>

          <div className="card">
            <h3>Conversion rates</h3>
            <div className="field">
              <label>Proposal close rate</label>
              <input
                type="number"
                value={proposalCloseRate}
                onChange={(event) =>
                  setProposalCloseRate(clamp(Number(event.target.value), 1, 100))
                }
              />
              <span className="suffix">%</span>
            </div>
            <div className="field">
              <label>Demo → proposal rate</label>
              <input
                type="number"
                value={demoToProposalRate}
                onChange={(event) =>
                  setDemoToProposalRate(clamp(Number(event.target.value), 1, 100))
                }
              />
              <span className="suffix">%</span>
            </div>
            <div className="field">
              <label>Meeting → demo rate</label>
              <input
                type="number"
                value={meetingToDemoRate}
                onChange={(event) =>
                  setMeetingToDemoRate(clamp(Number(event.target.value), 1, 100))
                }
              />
              <span className="suffix">%</span>
            </div>
          </div>

          <div className="card">
            <h3>Sales cycle</h3>
            <div className="field">
              <label>Goal window</label>
              <input
                type="number"
                value={timeframeMonths}
                onChange={(event) =>
                  setTimeframeMonths(Math.max(1, Number(event.target.value)))
                }
              />
              <span className="suffix">months</span>
            </div>
            <div className="field-row">
              <div className="field">
                <label>Sales cycle min</label>
                <input
                  type="number"
                  value={salesCycleMinWeeks}
                  onChange={(event) =>
                    setSalesCycleMinWeeks(Math.max(1, Number(event.target.value)))
                  }
                />
                <span className="suffix">weeks</span>
              </div>
              <div className="field">
                <label>Sales cycle max</label>
                <input
                  type="number"
                  value={salesCycleMaxWeeks}
                  onChange={(event) =>
                    setSalesCycleMaxWeeks(Math.max(1, Number(event.target.value)))
                  }
                />
                <span className="suffix">weeks</span>
              </div>
            </div>
            <div className="callout">
              <span>Estimated cycles in window</span>
              <strong>
                {formatNumber(cyclesMin, 1)}–{formatNumber(cyclesMax, 1)} cycles
              </strong>
            </div>
          </div>

          <div className="card">
            <h3>Warm network projection</h3>
            <div className="field">
              <label>Warm contacts</label>
              <input
                type="number"
                value={warmContacts}
                onChange={(event) =>
                  setWarmContacts(Math.max(0, Number(event.target.value)))
                }
              />
            </div>
            <div className="field">
              <label>Warm response → demo rate</label>
              <input
                type="number"
                value={warmResponseRate}
                onChange={(event) =>
                  setWarmResponseRate(clamp(Number(event.target.value), 1, 100))
                }
              />
              <span className="suffix">%</span>
            </div>
            <div className="callout">
              <span>Projected warm ARR</span>
              <strong>{formatCurrency(warmProjection.warmArr)}</strong>
            </div>
            <div className="mini-grid">
              <div>
                <span>Demos</span>
                <strong>{formatNumber(Math.floor(warmProjection.warmDemos))}</strong>
              </div>
              <div>
                <span>Proposals</span>
                <strong>{formatNumber(Math.floor(warmProjection.warmProposals))}</strong>
              </div>
              <div>
                <span>Closed-won</span>
                <strong>{formatNumber(Math.floor(warmProjection.warmClosed))}</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--table">
        <div className="table">
          <div className="table__row header">
            <span>Stage</span>
            <span>Conversion rate</span>
            <span>Count needed</span>
          </div>
          <div className="table__row">
            <span>Closed-won deals</span>
            <span>—</span>
            <strong>{formatNumber(Math.ceil(pipeline.deals))}</strong>
          </div>
          <div className="table__row">
            <span>Proposals sent</span>
            <span>{formatNumber(proposalCloseRate)}%</span>
            <strong>{formatNumber(Math.ceil(pipeline.proposals))}</strong>
          </div>
          <div className="table__row">
            <span>Demos with Saharsh</span>
            <span>{formatNumber(demoToProposalRate)}%</span>
            <strong>{formatNumber(Math.ceil(pipeline.demos))}</strong>
          </div>
          <div className="table__row">
            <span>Meetings booked / replies</span>
            <span>{formatNumber(meetingToDemoRate)}%</span>
            <strong>{formatNumber(Math.ceil(pipeline.meetings))}</strong>
          </div>
        </div>
      </section>
    </main>
  );
}
