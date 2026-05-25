import type { Metadata } from "next";
import "../assessment.css";

export const metadata: Metadata = {
  title: "Athletic Assessment - Tyson | Ambition Sports Performance",
  description:
    "Tyson's athletic assessment report — sprint data, elite comparison, and development plan.",
};

export default function TysonAssessment() {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Inter:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />
      <div className="assessment-page">
        <div className="assessment-container" id="top">
          {/* HEADER */}
          <header className="page-header fade-section">
            <div
              style={{
                position: "relative",
                width: 220,
                height: 173,
                overflow: "hidden",
                borderRadius: 8,
              }}
            >
              <iframe
                loading="lazy"
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  top: 0,
                  left: 0,
                  border: "none",
                  padding: 0,
                  margin: 0,
                }}
                src="https://www.canva.com/design/DAG2a_N00HI/MCb1a3SkyjhfsUZZtpdwhw/view?embed"
                allowFullScreen
                allow="fullscreen"
              />
            </div>
            <div className="header-meta">
              <span>Athletic Assessment</span>
              <span>29/03/2026</span>
            </div>
          </header>

          {/* ATHLETE HERO */}
          <div className="athlete-hero fade-section">
            <div className="athlete-avatar">T</div>
            <div className="athlete-info">
              <h1>Tyson</h1>
              <div className="athlete-meta">
                <span>Sport: General Athletics</span>
                <span>Assessment: Sprint &amp; Power Profile</span>
              </div>
            </div>
            <div className="tag">Assessment Complete</div>
          </div>

          {/* PERFORMANCE RINGS */}
          {/* Top Speed: 24.3/27.7 = 87.7% => offset = 264 * (1-0.877) = 32.5 */}
          {/* Acceleration: 1.85/2.04 = 90.7% => offset = 264 * (1-0.907) = 24.6 */}
          <div className="rings-section fade-section">
            <div className="rings-grid">
              <div className="ring-card">
                <div className="ring-container">
                  <svg className="ring-svg" viewBox="0 0 100 100">
                    <circle className="ring-bg" cx="50" cy="50" r="42" />
                    <circle
                      className="ring-progress orange"
                      cx="50"
                      cy="50"
                      r="42"
                      strokeDasharray="264"
                      strokeDashoffset="32"
                    />
                  </svg>
                  <div className="ring-value">
                    <div className="number" style={{ color: "var(--orange)" }}>
                      88%
                    </div>
                    <div className="unit">of elite</div>
                  </div>
                </div>
                <div className="ring-label">Top Speed</div>
                <div className="ring-desc">
                  24.3 km/h &mdash; Target: 27.7 km/h
                </div>
              </div>
              <div className="ring-card">
                <div className="ring-container">
                  <svg className="ring-svg" viewBox="0 0 100 100">
                    <circle className="ring-bg" cx="50" cy="50" r="42" />
                    <circle
                      className="ring-progress teal"
                      cx="50"
                      cy="50"
                      r="42"
                      strokeDasharray="264"
                      strokeDashoffset="25"
                    />
                  </svg>
                  <div className="ring-value">
                    <div className="number" style={{ color: "var(--teal)" }}>
                      91%
                    </div>
                    <div className="unit">of elite</div>
                  </div>
                </div>
                <div className="ring-label">Acceleration</div>
                <div className="ring-desc">2.04s vs 1.85s elite 0-10m</div>
              </div>
              <div className="explainer-panel">
                <div className="title">What These Rings Mean</div>
                <div className="desc">
                  These two rings represent Tyson&rsquo;s current performance
                  relative to{" "}
                  <strong>elite youth benchmarks</strong>.{" "}
                  <strong>Top Speed</strong> measures peak velocity (24.3 km/h
                  vs 27.7 km/h target &mdash; a strong foundation with room to
                  grow through improved mechanics and coordination).{" "}
                  <strong>Acceleration</strong> tracks 0-10m sprint capacity
                  relative to elite standards (~1.85s target). Both metrics show
                  Tyson is already{" "}
                  <strong>
                    operating at 88-91% of elite level
                  </strong>{" "}
                  &mdash; meaning targeted training can unlock significant
                  improvements.
                </div>
              </div>
            </div>
          </div>

          {/* QUICK STATS */}
          <div className="stats-grid fade-section">
            <div className="stat-card orange">
              <div className="icon">&#x23F1;</div>
              <div className="value">2.04s</div>
              <div className="label">0-10m Sprint</div>
              <div className="sub">5m split: 1.16s</div>
            </div>
            <div className="stat-card teal">
              <div className="icon">&#x1F3C3;</div>
              <div className="value">3.70s</div>
              <div className="label">0-20m Sprint</div>
              <div className="sub">
                1st 10m: 2.04 / 2nd 10m: 1.66
              </div>
            </div>
            <div className="stat-card blue">
              <div className="icon">&#x26A1;</div>
              <div className="value">1.48s</div>
              <div className="label">10m Fly (Max V)</div>
              <div className="sub">Peak velocity zone</div>
            </div>
            <div className="stat-card blue">
              <div className="icon">&#x1F680;</div>
              <div className="value">24.3</div>
              <div className="label">Top Speed (km/h)</div>
              <div className="sub">10m / 1.48s &times; 3.6</div>
            </div>
            <div className="stat-card yellow">
              <div className="icon">&#x1F9B6;</div>
              <div className="value">19.3m</div>
              <div className="label">10-Bound Distance</div>
              <div className="sub">Avg 1.93m per bound</div>
            </div>
          </div>

          {/* ELITE COMPARISON TABLE */}
          <div className="section-divider fade-section">
            <span className="section-num">1</span>
            <span className="section-div-title">Elite Comparison</span>
            <span className="section-div-line"></span>
          </div>
          <div className="comparison-section fade-section">
            <div className="comparison-table-wrapper">
              <div className="comparison-table-header">
                <div className="title">Tyson vs Youth Benchmarks</div>
                <div className="comparison-legend">
                  <span>
                    <div className="legend-dot athlete"></div> Tyson
                  </span>
                  <span>
                    <div className="legend-dot age-elite"></div> Above Average
                  </span>
                  <span>
                    <div className="legend-dot senior-elite"></div> Elite Youth
                  </span>
                </div>
              </div>
              <table className="comp-table">
                <thead>
                  <tr>
                    <th>Metric</th>
                    <th>Tyson</th>
                    <th>Above Avg</th>
                    <th>Elite Youth</th>
                    <th>Gap to Above Avg</th>
                    <th>Gap to Elite</th>
                    <th className="comp-bar-cell">Visual</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>0-10m Sprint</td>
                    <td>
                      <span className="comp-val athlete">2.04s</span>
                    </td>
                    <td>
                      <span className="comp-val age-elite">2.00s</span>
                    </td>
                    <td>
                      <span className="comp-val senior-elite">1.85s</span>
                    </td>
                    <td>
                      <span className="comp-gap close">-2.0%</span>
                    </td>
                    <td>
                      <span className="comp-gap moderate">-10.3%</span>
                    </td>
                    <td className="comp-bar-cell">
                      <div className="comp-bar-bg">
                        <div
                          className="comp-bar-fill senior-elite"
                          style={{ width: "100%" }}
                        ></div>
                        <div
                          className="comp-bar-fill age-elite"
                          style={{ width: "93%" }}
                        ></div>
                        <div
                          className="comp-bar-fill athlete"
                          style={{ width: "91%" }}
                        ></div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>0-20m Sprint</td>
                    <td>
                      <span className="comp-val athlete">3.70s</span>
                    </td>
                    <td>
                      <span className="comp-val age-elite">3.48s</span>
                    </td>
                    <td>
                      <span className="comp-val senior-elite">3.25s</span>
                    </td>
                    <td>
                      <span className="comp-gap moderate">-6.3%</span>
                    </td>
                    <td>
                      <span className="comp-gap far">-13.8%</span>
                    </td>
                    <td className="comp-bar-cell">
                      <div className="comp-bar-bg">
                        <div
                          className="comp-bar-fill senior-elite"
                          style={{ width: "100%" }}
                        ></div>
                        <div
                          className="comp-bar-fill age-elite"
                          style={{ width: "93%" }}
                        ></div>
                        <div
                          className="comp-bar-fill athlete"
                          style={{ width: "88%" }}
                        ></div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>10m Fly</td>
                    <td>
                      <span className="comp-val athlete">1.48s</span>
                    </td>
                    <td>
                      <span className="comp-val age-elite">1.45s</span>
                    </td>
                    <td>
                      <span className="comp-val senior-elite">1.30s</span>
                    </td>
                    <td>
                      <span className="comp-gap close">-2.1%</span>
                    </td>
                    <td>
                      <span className="comp-gap far">-13.8%</span>
                    </td>
                    <td className="comp-bar-cell">
                      <div className="comp-bar-bg">
                        <div
                          className="comp-bar-fill senior-elite"
                          style={{ width: "100%" }}
                        ></div>
                        <div
                          className="comp-bar-fill age-elite"
                          style={{ width: "90%" }}
                        ></div>
                        <div
                          className="comp-bar-fill athlete"
                          style={{ width: "88%" }}
                        ></div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>Top Speed</td>
                    <td>
                      <span className="comp-val athlete">24.3 km/h</span>
                    </td>
                    <td>
                      <span className="comp-val age-elite">~24.8 km/h</span>
                    </td>
                    <td>
                      <span className="comp-val senior-elite">~27.7 km/h</span>
                    </td>
                    <td>
                      <span className="comp-gap close">-2.0%</span>
                    </td>
                    <td>
                      <span className="comp-gap moderate">-12.3%</span>
                    </td>
                    <td className="comp-bar-cell">
                      <div className="comp-bar-bg">
                        <div
                          className="comp-bar-fill senior-elite"
                          style={{ width: "100%" }}
                        ></div>
                        <div
                          className="comp-bar-fill age-elite"
                          style={{ width: "90%" }}
                        ></div>
                        <div
                          className="comp-bar-fill athlete"
                          style={{ width: "88%" }}
                        ></div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>10-Bound Distance</td>
                    <td>
                      <span className="comp-val athlete">19.3m</span>
                    </td>
                    <td>
                      <span className="comp-val age-elite">~22m</span>
                    </td>
                    <td>
                      <span className="comp-val senior-elite">~25m</span>
                    </td>
                    <td>
                      <span className="comp-gap far">-12.3%</span>
                    </td>
                    <td>
                      <span className="comp-gap far">-22.8%</span>
                    </td>
                    <td className="comp-bar-cell">
                      <div className="comp-bar-bg">
                        <div
                          className="comp-bar-fill senior-elite"
                          style={{ width: "100%" }}
                        ></div>
                        <div
                          className="comp-bar-fill age-elite"
                          style={{ width: "88%" }}
                        ></div>
                        <div
                          className="comp-bar-fill athlete"
                          style={{ width: "77%" }}
                        ></div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div
              style={{
                marginTop: 16,
                padding: "20px 24px",
                background: "var(--bg-elevated)",
                borderRadius: 16,
                border: "1px solid var(--border)",
              }}
            >
              <div
                style={{
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  textTransform: "uppercase" as const,
                  letterSpacing: "0.5px",
                  color: "var(--text-muted)",
                  marginBottom: 10,
                }}
              >
                Reading This Table
              </div>
              <div
                style={{
                  fontSize: "0.88rem",
                  color: "var(--text-secondary)",
                  lineHeight: 1.7,
                }}
              >
                <strong style={{ color: "var(--teal)" }}>Above Average</strong>{" "}
                = top 25% of athletic youth in the age group.{" "}
                <strong style={{ color: "var(--blue)" }}>Elite Youth</strong> =
                top-tier youth academy-level athletes. The{" "}
                <strong>gap percentages</strong> show how far Tyson is from each
                benchmark &mdash;{" "}
                <span
                  className="comp-gap close"
                  style={{ display: "inline", fontSize: "0.78rem" }}
                >
                  green = within range
                </span>
                ,{" "}
                <span
                  className="comp-gap moderate"
                  style={{ display: "inline", fontSize: "0.78rem" }}
                >
                  yellow = moderate gap
                </span>
                ,{" "}
                <span
                  className="comp-gap far"
                  style={{ display: "inline", fontSize: "0.78rem" }}
                >
                  red = significant gap
                </span>
                . Tyson&rsquo;s{" "}
                <strong>
                  0-10m and 10m fly are very close to above-average benchmarks
                </strong>
                , and his{" "}
                <strong>
                  bounding at 19.3m is the main area needing development
                </strong>{" "}
                &mdash; improving single-leg power will unlock faster times
                across all sprint distances.
              </div>
            </div>
          </div>

          {/* SPRINT SPLIT ANALYSIS */}
          <div className="section-divider fade-section">
            <span className="section-num">2</span>
            <span className="section-div-title">Sprint Split Analysis</span>
            <span className="section-div-line"></span>
          </div>
          <div
            className="split-grid fade-section"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 18,
              marginBottom: 36,
            }}
          >
            <div className="split-card teal-border">
              <div className="split-label" style={{ color: "var(--teal)" }}>
                &#x26A1; Acceleration Phase (0-10m)
              </div>
              <div className="split-values">
                <div>
                  <div className="split-stat-label">0-5m Split</div>
                  <div
                    className="split-stat-value"
                    style={{ color: "var(--teal)" }}
                  >
                    1.16s
                  </div>
                </div>
                <div>
                  <div className="split-stat-label">0-10m Total</div>
                  <div
                    className="split-stat-value"
                    style={{ color: "var(--teal)" }}
                  >
                    2.04s
                  </div>
                </div>
                <div>
                  <div className="split-stat-label">5-10m Split</div>
                  <div
                    className="split-stat-value"
                    style={{ color: "var(--orange)" }}
                  >
                    0.88s
                  </div>
                </div>
              </div>
              <div className="split-desc">
                Tyson&rsquo;s{" "}
                <strong style={{ color: "var(--teal)" }}>
                  0-10m of 2.04s is a solid result
                </strong>
                , just 2% off the above-average benchmark. His{" "}
                <strong>5-10m split of 0.88s</strong> shows excellent speed
                buildup after the initial push. The 0-5m of 1.16s indicates
                there&rsquo;s room to improve his{" "}
                <strong>
                  first-step explosiveness and starting mechanics
                </strong>
                .
              </div>
            </div>
            <div className="split-card orange-border">
              <div className="split-label" style={{ color: "var(--orange)" }}>
                &#x1F3C3; Speed Maintenance (0-20m)
              </div>
              <div className="split-values">
                <div>
                  <div className="split-stat-label">1st 10m</div>
                  <div
                    className="split-stat-value"
                    style={{ color: "var(--teal)" }}
                  >
                    2.04s
                  </div>
                </div>
                <div>
                  <div className="split-stat-label">2nd 10m</div>
                  <div
                    className="split-stat-value"
                    style={{ color: "var(--teal)" }}
                  >
                    1.66s
                  </div>
                </div>
                <div>
                  <div className="split-stat-label">Total 0-20m</div>
                  <div
                    className="split-stat-value"
                    style={{ color: "var(--orange)" }}
                  >
                    3.70s
                  </div>
                </div>
              </div>
              <div className="split-desc">
                Tyson&rsquo;s{" "}
                <strong style={{ color: "var(--teal)" }}>
                  2nd 10m of 1.66s is significantly faster than his 1st 10m
                  (2.04s)
                </strong>{" "}
                &mdash; showing he builds speed well through the acceleration
                phase. His 0-20m total of{" "}
                <strong>3.70s has room to close the gap to the above-average benchmark of 3.48s</strong>
                . The speed buildup from 2.04s to 1.66s demonstrates{" "}
                <strong>
                  good mechanics transition from drive phase to upright running
                </strong>
                , but the 0-20m gap suggests improving his{" "}
                <strong>top-end speed and speed maintenance</strong> will be key.
              </div>
            </div>
          </div>

          {/* BOUNDING TEST */}
          <div
            className="split-grid fade-section"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: 18,
              marginBottom: 36,
            }}
          >
            <div className="split-card yellow-border">
              <div className="split-label" style={{ color: "var(--yellow)" }}>
                &#x1F4AA; Bounding Test (10 Bounds)
              </div>
              <div className="split-values">
                <div>
                  <div className="split-stat-label">Distance</div>
                  <div
                    className="split-stat-value"
                    style={{ color: "var(--yellow)" }}
                  >
                    19.3m
                  </div>
                </div>
                <div>
                  <div className="split-stat-label">Per Bound</div>
                  <div
                    className="split-stat-value"
                    style={{ color: "var(--yellow)" }}
                  >
                    1.93m
                  </div>
                </div>
                <div>
                  <div className="split-stat-label">Elite Target</div>
                  <div
                    className="split-stat-value"
                    style={{ color: "var(--blue)" }}
                  >
                    25m
                  </div>
                </div>
              </div>
              <div className="split-desc">
                Tyson covers{" "}
                <strong style={{ color: "var(--yellow)" }}>
                  19.3m in 10 bounds (1.93m per bound)
                </strong>
                . Elite youth athletes cover ~25m in 10 bounds (2.5m per bound).
                This is{" "}
                <strong>
                  Tyson&rsquo;s biggest area for development
                </strong>{" "}
                &mdash; indicating significant room for improvement in{" "}
                <strong>
                  single-leg power, hip extension, and horizontal force
                  production
                </strong>
                . Bounding distance directly correlates with acceleration and
                stride length in sprinting &mdash; improving this will unlock
                faster 0-10m and 0-20m times across the board.
              </div>
            </div>
          </div>

          {/* VIDEO ANALYSIS */}
          <div className="section-divider fade-section">
            <span className="section-num">3</span>
            <span className="section-div-title">Video Analysis</span>
            <span className="section-div-line"></span>
          </div>
          <div className="video-grid fade-section">
            <div className="video-card">
              <div className="video-embed">
                <iframe
                  src="https://www.youtube.com/embed/tYslQirB8Pg?si=iaLItbU8RcZos2lA"
                  title="Acceleration Mechanics Analysis"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="video-info">
                <div className="video-label">Analysis 1</div>
                <div className="video-title">Acceleration Mechanics</div>
                <div className="video-desc">
                  Breakdown of Tyson&rsquo;s acceleration mechanics from a
                  standing start. Evaluating first-step, body angles, force
                  direction, and drive phase.
                </div>
                <div className="video-findings">
                  <div className="video-findings-title">Key Findings</div>
                  <ul className="video-findings-list">
                    <li>
                      <span className="finding-issue">
                        Lifts front leg to initiate &mdash; 130ms delay before
                        force creation
                      </span>
                    </li>
                    <li>
                      <span className="finding-issue">
                        200ms to get first step down &mdash; quarter of a second
                        lost
                      </span>
                    </li>
                    <li>
                      <span className="finding-issue">
                        Hip dominant &mdash; relies on swing/rotation instead of
                        quad push-off
                      </span>
                    </li>
                    <li>
                      <span className="finding-issue">
                        Lands in front of COM &mdash; braking force on every
                        stride
                      </span>
                    </li>
                    <li>
                      <span className="finding-issue">
                        Projects vertically instead of horizontally &mdash;
                        going up and down
                      </span>
                    </li>
                    <li>
                      <span className="finding-issue">
                        Head/chin elevated, skull shifts back &mdash; 4-6kg
                        shifted backward
                      </span>
                    </li>
                    <li>
                      <span className="finding-issue">
                        Excess facial/shoulder tension &mdash; hunches traps,
                        closes eyes
                      </span>
                    </li>
                    <li>
                      <span className="finding-issue">
                        No hip hyperextension at toe-off &mdash; shortened
                        stride
                      </span>
                    </li>
                    <li>
                      <span className="finding-good">
                        Knees bent in starting position &mdash; good base to
                        push from
                      </span>
                    </li>
                    <li>
                      <span className="finding-good">
                        Decent ankle/knee stiffness &mdash; doesn&rsquo;t
                        collapse or deform
                      </span>
                    </li>
                    <li>
                      <span className="finding-good">
                        Gets moving well after first 5m &mdash; hip dominant
                        athlete engages
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="coach-transcript">
                  <div className="coach-transcript-title">Coach Summary</div>
                  <div className="coach-transcript-text">
                    <strong>Key Issues:</strong> Tyson lifts his front leg to
                    initiate movement instead of pushing off it &mdash; creating
                    a <strong>130ms delay</strong> before any force is created,
                    and <strong>200ms before the first step lands</strong>. He
                    doesn&rsquo;t have the quad strength to push off the front
                    foot, so he relies on a hip-dominant swing pattern. He lands
                    in front of his centre of mass on every stride, creating
                    braking forces. His hunchback posture, elevated chin, and
                    shoulder tension shift 4-6kg of weight backward, killing
                    forward momentum. He projects{" "}
                    <strong>vertically instead of horizontally</strong> &mdash;
                    going up and down rather than forward. No hip hyperextension
                    at toe-off means shortened strides. High effort with tense
                    face, closed eyes, and raised traps when{" "}
                    <strong>relaxation is what creates speed</strong>.
                    <br />
                    <br />
                    <strong>Fix:</strong> Strengthen quads to enable front-foot
                    push-off. Get into a{" "}
                    <strong>forward lean position</strong> where he&rsquo;s about
                    to fall forward &mdash; shift sternum and shoulders ahead of
                    hips. <strong>Relax face, shoulders, and hands</strong>{" "}
                    &mdash; speed comes from delivering forces fast, not high
                    effort. Step forward and get moving immediately instead of
                    swinging through. Keep eye gaze straight (not up). Build hip
                    hyperextension through resistance work and proper mechanics
                    drills. Stay lower for the first 3-5 steps to project
                    horizontally.
                  </div>
                </div>
              </div>
            </div>
            <div className="video-card">
              <div className="video-embed">
                <iframe
                  src="https://www.youtube.com/embed/2bK0RKAm9XQ?si=DdhILvGXAMsuZTG3"
                  title="Top-End Speed Analysis"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="video-info">
                <div className="video-label">Analysis 2</div>
                <div className="video-title">Top-End Speed Mechanics</div>
                <div className="video-desc">
                  Analysis of Tyson&rsquo;s top-end sprint mechanics. Evaluating
                  stride length, ground contact time, frontside mechanics,
                  posture, and relaxation.
                </div>
                <div className="video-findings">
                  <div className="video-findings-title">Key Findings</div>
                  <ul className="video-findings-list">
                    <li>
                      <span className="finding-issue">
                        Ground contact time ~120ms &mdash; target is 90-100ms
                      </span>
                    </li>
                    <li>
                      <span className="finding-issue">
                        Collapsing at the leg on landing &mdash; not applying
                        force through ground
                      </span>
                    </li>
                    <li>
                      <span className="finding-issue">
                        Landing heel-first &mdash; creating braking forces and
                        slowing down
                      </span>
                    </li>
                    <li>
                      <span className="finding-issue">
                        Skull shifts back, eye gaze upward &mdash; 5-6kg shifted
                        backward
                      </span>
                    </li>
                    <li>
                      <span className="finding-issue">
                        Shoulder/trap lift from facial tension &mdash; restricting
                        arm extension
                      </span>
                    </li>
                    <li>
                      <span className="finding-issue">
                        Very upright posture &mdash; not aerodynamic, no forward
                        lean
                      </span>
                    </li>
                    <li>
                      <span className="finding-issue">
                        No hip hyperextension &mdash; toe-off too early,
                        shortened stride
                      </span>
                    </li>
                    <li>
                      <span className="finding-good">
                        ~6.2 strides per 10m &mdash; decent stride length to
                        build on
                      </span>
                    </li>
                    <li>
                      <span className="finding-good">
                        Some knee bend maintained &mdash; horizontal + vertical
                        projection present
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="coach-transcript">
                  <div className="coach-transcript-title">Coach Summary</div>
                  <div className="coach-transcript-text">
                    <strong>Key Issues:</strong> Tyson takes ~6.2 strides per
                    10m &mdash; not short, but definitely can be longer with
                    elasticity work. His{" "}
                    <strong>ground contact time of ~120ms</strong> is too long
                    (target: 90-100ms). He&rsquo;s collapsing at the leg on
                    landing instead of applying force through the ground &mdash;
                    landing heel-first which creates braking. Lots of{" "}
                    <strong>facial tension</strong> which lifts shoulders and
                    traps, and his skull shifts back with upward eye gaze,
                    shifting 5-6kg of weight backward. Very upright posture with
                    no forward lean &mdash; not aerodynamic. No hip
                    hyperextension means toe-off happens too early, shortening
                    each stride.
                    <br />
                    <br />
                    <strong>Fix:</strong> Develop{" "}
                    <strong>
                      frontside mechanic dominance
                    </strong>{" "}
                    &mdash; leg strikes through and comes down rather than
                    swinging through. Build{" "}
                    <strong>knee and ankle stiffness</strong> structurally so he
                    stabilises on landing instead of collapsing.{" "}
                    <strong>Relax the face</strong> to drop shoulders/traps and
                    keep skull neutral. Shift eye gaze forward (slightly
                    downward), move skull/sternum/shoulders 1-2 degrees forward.
                    These mechanical and relaxation changes alone can add{" "}
                    <strong>2-3 km/h instantly</strong> within 2-3 weeks of
                    practice. The rest comes from elasticity, structural
                    development, and neural coordination through maximal and
                    supramaximal exercises.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* COACH ASSESSMENT */}
          <div className="summary-banner fade-section">
            <div className="summary-icon">&#x1F3AF;</div>
            <div className="summary-content">
              <div className="title">Coach Assessment Summary</div>
              <div className="text">
                Tyson&rsquo;s assessment reveals{" "}
                <strong>
                  a young athlete with genuine speed ability and clear
                  mechanical fixes that will unlock significant gains
                </strong>
                . His{" "}
                <strong>0-10m of 2.04s</strong> is just 2% off the
                above-average benchmark, and his{" "}
                <strong>10m fly of 1.48s (24.3 km/h)</strong> shows real
                velocity. Video analysis reveals he is{" "}
                <strong>hip dominant</strong> &mdash; relying on swing/rotation
                rather than quad push-off, with a{" "}
                <strong>130ms delay on initiation</strong> from lifting his
                front foot instead of pushing off it. His{" "}
                <strong>ground contact time of ~120ms</strong> (target: 90-100ms)
                shows he&rsquo;s collapsing at the leg rather than applying force.
                Facial tension, skull shifting back, and elevated eye gaze are
                shifting 5-6kg of weight backward. His bounding (19.3m in 10
                bounds) confirms the single-leg power deficit. The good news:
                his knees are bent in start position, ankle stiffness is decent,
                and he builds speed well after 5m.{" "}
                <strong>
                  Mechanical and relaxation changes alone can add 2-3 km/h
                  instantly.
                </strong>{" "}
                Priority: <strong>relaxation and posture correction,
                quad strengthening, horizontal power development, and frontside
                mechanic dominance.</strong>
              </div>
            </div>
          </div>

          {/* PERFORMANCE METRICS */}
          <div className="section-divider fade-section">
            <span className="section-num">4</span>
            <span className="section-div-title">Performance Metrics</span>
            <span className="section-div-line"></span>
          </div>
          <div className="section fade-section">
            <div className="section-header">
              <div className="section-title">
                <span className="emoji-icon">&#x1F4CA;</span>Performance
                Metrics
              </div>
            </div>
            <div className="metrics-row">
              <div className="metric-card orange">
                <div className="metric-header">
                  <div className="metric-icon">&#x23F1;</div>
                  <div className="metric-info">
                    <div className="metric-name">0-10m Sprint</div>
                    <div className="metric-value-row">
                      <span className="metric-main">2.04s</span>
                      <span className="rating-badge good">
                        Near Above Average
                      </span>
                    </div>
                  </div>
                </div>
                <div className="progress-section">
                  <div className="progress-labels">
                    <span>Current: 2.04s</span>
                    <span>Elite Youth: ~1.85s</span>
                  </div>
                  <div className="progress-track">
                    <div
                      className="progress-fill orange"
                      style={{ width: "91%" }}
                    ></div>
                  </div>
                </div>
                <div className="explanation">
                  <div className="explanation-title">What This Means</div>
                  <div className="explanation-text">
                    Tyson&rsquo;s <strong>0-10m of 2.04s</strong> is just 0.04s
                    off the above-average benchmark of 2.00s. This is a strong
                    result showing good acceleration ability. The{" "}
                    <strong>5m split of 1.16s</strong> and subsequent 5-10m split
                    of 0.88s show solid speed buildup. With improved{" "}
                    <strong>
                      first-step mechanics, horizontal force production, and
                      starting technique
                    </strong>
                    , pushing to <strong>1.90s within 12 months</strong> is
                    realistic.
                  </div>
                </div>
              </div>
              <div className="metric-card teal">
                <div className="metric-header">
                  <div className="metric-icon">&#x1F680;</div>
                  <div className="metric-info">
                    <div className="metric-name">Top Speed (Max Velocity)</div>
                    <div className="metric-value-row">
                      <span className="metric-main">24.3 km/h</span>
                      <span className="rating-badge good">
                        Near Above Average
                      </span>
                    </div>
                  </div>
                </div>
                <div className="progress-section">
                  <div className="progress-labels">
                    <span>Current: 24.3 km/h</span>
                    <span>Elite Youth: 27.7 km/h</span>
                  </div>
                  <div className="progress-track">
                    <div
                      className="progress-fill teal"
                      style={{ width: "88%" }}
                    ></div>
                  </div>
                </div>
                <div className="explanation">
                  <div className="explanation-title">What This Means</div>
                  <div className="explanation-text">
                    Tyson&rsquo;s{" "}
                    <strong>peak speed of 24.3 km/h</strong> (1.48s per 10m fly)
                    puts him close to the above-average benchmark. There&rsquo;s
                    significant room for speed development as{" "}
                    <strong>
                      nervous system maturation, stride mechanics, and muscular
                      power
                    </strong>{" "}
                    all improve rapidly at this stage. With better{" "}
                    <strong>
                      foot strike positioning, fuller hip extension, and improved
                      arm drive
                    </strong>
                    , pushing toward{" "}
                    <strong>26+ km/h within 12 months</strong> is achievable.
                  </div>
                </div>
              </div>
            </div>
            <div className="metrics-row" style={{ marginTop: 24 }}>
              <div className="metric-card red">
                <div className="metric-header">
                  <div className="metric-icon">&#x23F3;</div>
                  <div className="metric-info">
                    <div className="metric-name">Speed Buildup (0-20m)</div>
                    <div className="metric-value-row">
                      <span className="metric-main">3.70s</span>
                      <span className="rating-badge average">Developing</span>
                    </div>
                  </div>
                </div>
                <div className="progress-section">
                  <div className="progress-labels">
                    <span>Current: 3.70s</span>
                    <span>Elite Youth: ~3.25s</span>
                  </div>
                  <div className="progress-track">
                    <div
                      className="progress-fill red"
                      style={{ width: "88%" }}
                    ></div>
                  </div>
                </div>
                <div className="explanation">
                  <div className="explanation-title">What This Means</div>
                  <div className="explanation-text">
                    Tyson&rsquo;s <strong>0-20m of 3.70s</strong> is 0.22s off
                    the above-average benchmark of 3.48s. His{" "}
                    <strong>
                      2nd 10m of 1.66s is significantly faster than his 1st 10m
                      (2.04s)
                    </strong>
                    , showing good speed buildup through the acceleration phase.
                    To close the gap to elite (3.25s), the focus is on{" "}
                    <strong>
                      improving first-step explosiveness (0-5m: 1.16s),
                      building horizontal power through bounding, and developing
                      top-end speed mechanics
                    </strong>
                    .
                  </div>
                </div>
              </div>
              <div className="metric-card yellow">
                <div className="metric-header">
                  <div className="metric-icon">&#x1F4CF;</div>
                  <div className="metric-info">
                    <div className="metric-name">10-Bound Distance</div>
                    <div className="metric-value-row">
                      <span className="metric-main">19.3m</span>
                      <span className="rating-badge needs-work">
                        Priority Area
                      </span>
                    </div>
                  </div>
                </div>
                <div className="progress-section">
                  <div className="progress-labels">
                    <span>Current: 19.3m (1.93m avg)</span>
                    <span>Elite: 25m (2.5m avg)</span>
                  </div>
                  <div className="progress-track">
                    <div
                      className="progress-fill yellow"
                      style={{ width: "77%" }}
                    ></div>
                  </div>
                </div>
                <div className="explanation">
                  <div className="explanation-title">What This Means</div>
                  <div className="explanation-text">
                    Tyson covers{" "}
                    <strong>
                      19.3m in 10 bounds (1.93m per bound)
                    </strong>
                    . Elite youth athletes cover ~25m in 10 bounds (2.5m per
                    bound). This is his{" "}
                    <strong>highest priority development area</strong>. Bounding
                    distance measures{" "}
                    <strong>
                      single-leg horizontal power &mdash; the engine behind
                      acceleration and stride length
                    </strong>
                    . Improving hip extension, glute power, and triple extension
                    mechanics will increase bound distance, which directly
                    translates to{" "}
                    <strong>
                      faster sprint times and longer, more powerful strides
                    </strong>
                    .
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* DEVELOPMENT PRIORITY PLAN */}
          <div className="section-divider fade-section">
            <span className="section-num">5</span>
            <span className="section-div-title">Development Priority Plan</span>
            <span className="section-div-line"></span>
          </div>
          <div className="priority-grid fade-section">
            <div className="priority-card high">
              <div className="priority-header">
                <div className="priority-num">1</div>
                <div className="priority-title">
                  Horizontal Power &amp; Bounding
                </div>
              </div>
              <div className="priority-desc">
                Tyson&rsquo;s bounding (19.3m) is the biggest limiter. Building
                single-leg power and horizontal force production will have the
                greatest transfer to sprint speed across all distances.
              </div>
              <div className="priority-items">
                <div className="priority-item">
                  <strong>Hip Extension Work</strong>Glute activation, hip thrust
                  progressions, and complete triple extension drills. Get hip
                  extension toward 175&deg; at toe-off for maximum power
                  transfer.
                </div>
                <div className="priority-item">
                  <strong>Bounding Progressions</strong>Progressive bounding work
                  &mdash; alternate leg bounds, single-leg hops, horizontal jump
                  variations. Build the elastic power that translates to stride
                  length and acceleration.
                </div>
                <div className="priority-item">
                  <strong>Plyometric Development</strong>Box jumps, depth jumps,
                  hurdle hops. Develop the stretch-shortening cycle for explosive
                  single-leg power output.
                </div>
              </div>
              <div className="priority-goal high">
                <strong style={{ color: "var(--red)", fontSize: "0.82rem" }}>
                  Target:
                </strong>{" "}
                22m+ in 10 bounds (2.2m avg), improved hip extension and
                ground-force production within 12 months
              </div>
            </div>
            <div className="priority-card medium">
              <div className="priority-header">
                <div className="priority-num">2</div>
                <div className="priority-title">
                  First-Step Explosiveness &amp; Sprint Mechanics
                </div>
              </div>
              <div className="priority-desc">
                Tyson&rsquo;s 0-5m (1.16s) and starting mechanics are where the
                next layer of gains lives. Sharpen the initial drive phase and
                clean up acceleration mechanics.
              </div>
              <div className="priority-items">
                <div className="priority-item">
                  <strong>Foot Strike Correction</strong>Transition from landing
                  ahead of centre of mass to striking under/slightly behind.
                  Teach &ldquo;pulling the ground&rdquo; rather than reaching
                  forward. This reduces braking forces every stride.
                </div>
                <div className="priority-item">
                  <strong>Drive Phase Mechanics</strong>Low body angle, aggressive
                  arm pump, full extension for the first 3-5 steps. Build the
                  neural patterns for a powerful start.
                </div>
                <div className="priority-item">
                  <strong>Arm Drive Development</strong>Increase arm swing
                  amplitude and coordination. Arms drive the legs &mdash; a
                  bigger, more coordinated arm swing directly increases stride
                  power and frequency.
                </div>
              </div>
              <div className="priority-goal medium">
                <strong style={{ color: "var(--yellow)", fontSize: "0.82rem" }}>
                  Target:
                </strong>{" "}
                0-5m under 1.05s, 0-10m under 1.90s within 12 months
              </div>
            </div>
            <div className="priority-card low">
              <div className="priority-header">
                <div className="priority-num">3</div>
                <div className="priority-title">
                  Top-End Speed &amp; Speed Endurance
                </div>
              </div>
              <div className="priority-desc">
                Push Tyson&rsquo;s max velocity from 24.3 km/h toward 26+ km/h
                and improve his ability to maintain speed through 20m+.
              </div>
              <div className="priority-items">
                <div className="priority-item">
                  <strong>Posture at Speed</strong>Build the structural strength
                  to maintain upright posture past 10m. Core bracing, pelvic
                  control, and thoracic stability so mechanics don&rsquo;t
                  collapse when speed increases.
                </div>
                <div className="priority-item">
                  <strong>Speed Endurance Reps</strong>Progressive exposure to
                  20-40m sprints with coaching cues at the 10m mark. Build the
                  neural patterns for maintaining form at higher velocities.
                  Quality over quantity &mdash; 3-5 reps per session.
                </div>
                <div className="priority-item">
                  <strong>Coordination Work</strong>Basic coordination drills for
                  max speed &mdash; teaching correct foot mechanics, knee lift,
                  and ground contact timing at full velocity.
                </div>
              </div>
              <div className="priority-goal low">
                <strong style={{ color: "var(--teal)", fontSize: "0.82rem" }}>
                  Target:
                </strong>{" "}
                Top speed 26+ km/h, 0-20m under 3.45s within 12 months
              </div>
            </div>
          </div>

          {/* 12 MONTH TARGETS */}
          <div className="whats-next-section fade-section">
            <div className="whats-next-header">
              <span className="section-num">6</span>
              <span className="section-div-title">
                What&rsquo;s Next &mdash; 12 Month Targets
              </span>
              <span className="section-div-line"></span>
            </div>
            <div className="whats-next-intro">
              Based on Tyson&rsquo;s current data, here are{" "}
              <strong>realistic 12 month targets</strong>. The biggest gains
              will come from{" "}
              <strong>
                horizontal power development, mechanics refinement, and
                first-step explosiveness
              </strong>
              . His 0-10m of 2.04s is solid and close to the above-average
              benchmark &mdash; the priority is{" "}
              <strong>
                building bounding power, sharpening the 0-5m, and pushing top
                speed higher
              </strong>
              .
            </div>
            <div className="projection-grid">
              <div className="projection-card">
                <div className="projection-label">0-10m Sprint</div>
                <div className="projection-values">
                  <span className="projection-current">2.04s</span>
                  <span className="projection-arrow">&rarr;</span>
                  <span className="projection-target">1.90s</span>
                </div>
                <div className="projection-bar-bg">
                  <div
                    className="projection-bar-fill"
                    style={{ width: "93%" }}
                  ></div>
                </div>
                <div className="projection-pct">
                  7% improvement &mdash; 12 month target
                </div>
              </div>
              <div className="projection-card">
                <div className="projection-label">0-20m Sprint</div>
                <div className="projection-values">
                  <span className="projection-current">3.70s</span>
                  <span className="projection-arrow">&rarr;</span>
                  <span className="projection-target">3.45s</span>
                </div>
                <div className="projection-bar-bg">
                  <div
                    className="projection-bar-fill"
                    style={{ width: "93%" }}
                  ></div>
                </div>
                <div className="projection-pct">
                  7% improvement &mdash; 12 month target
                </div>
              </div>
              <div className="projection-card">
                <div className="projection-label">10m Fly (Max Velocity)</div>
                <div className="projection-values">
                  <span className="projection-current">1.48s</span>
                  <span className="projection-arrow">&rarr;</span>
                  <span className="projection-target">1.35s</span>
                </div>
                <div className="projection-bar-bg">
                  <div
                    className="projection-bar-fill"
                    style={{ width: "91%" }}
                  ></div>
                </div>
                <div className="projection-pct">
                  9% improvement &mdash; 12 month target
                </div>
              </div>
              <div className="projection-card">
                <div className="projection-label">Top Speed</div>
                <div className="projection-values">
                  <span className="projection-current">24.3 km/h</span>
                  <span className="projection-arrow">&rarr;</span>
                  <span className="projection-target">26.7 km/h</span>
                </div>
                <div className="projection-bar-bg">
                  <div
                    className="projection-bar-fill"
                    style={{ width: "91%" }}
                  ></div>
                </div>
                <div className="projection-pct">
                  10% improvement &mdash; 12 month target
                </div>
              </div>
              <div className="projection-card">
                <div className="projection-label">10-Bound Distance</div>
                <div className="projection-values">
                  <span className="projection-current">19.3m</span>
                  <span className="projection-arrow">&rarr;</span>
                  <span className="projection-target">22m</span>
                </div>
                <div className="projection-bar-bg">
                  <div
                    className="projection-bar-fill"
                    style={{ width: "88%" }}
                  ></div>
                </div>
                <div className="projection-pct">
                  14% improvement &mdash; 12 month target
                </div>
              </div>
            </div>
          </div>

          {/* 2-3 YEAR VISION */}
          <div className="vision-section fade-section">
            <div className="whats-next-header">
              <span className="section-num">7</span>
              <span className="section-div-title">
                2-3 Year Athlete Development Vision
              </span>
              <span className="section-div-line"></span>
            </div>
            <div className="whats-next-intro">
              Tyson has a{" "}
              <strong>strong speed foundation to build upon</strong>. The nervous
              system is still highly trainable, pre-puberty strength gains come
              from coordination and neural efficiency, and the movement patterns
              built now will define his speed profile for years. The pathway:{" "}
              <strong>
                power and mechanics first, then speed expression, then
                sport-specific integration
              </strong>
              .
            </div>
            <div className="vision-timeline">
              <div className="vision-phase">
                <div className="vision-phase-label">
                  Year 1 &mdash; Power &amp; Mechanics Foundation
                </div>
                <div className="vision-phase-title">
                  Building the Engine
                </div>
                <div className="vision-metrics">
                  <div className="vision-metric">
                    <span className="vision-metric-label">Top Speed</span>
                    <span className="vision-metric-value">26-27 km/h</span>
                  </div>
                  <div className="vision-metric">
                    <span className="vision-metric-label">0-10m</span>
                    <span className="vision-metric-value">1.90s</span>
                  </div>
                  <div className="vision-metric">
                    <span className="vision-metric-label">0-20m</span>
                    <span className="vision-metric-value">3.45s</span>
                  </div>
                  <div className="vision-metric">
                    <span className="vision-metric-label">Bounding</span>
                    <span className="vision-metric-value">22m</span>
                  </div>
                </div>
                <div className="vision-phase-desc">
                  Focus on{" "}
                  <strong>
                    horizontal power development, bounding progressions, and
                    acceleration mechanics
                  </strong>
                  . Build single-leg strength through plyometrics and bounding
                  work. Refine first-step technique and arm drive coordination.
                  Tyson becomes a{" "}
                  <strong>
                    noticeably faster, more explosive athlete
                  </strong>{" "}
                  with a foundation of power that translates to every sprint.
                </div>
              </div>
              <div className="vision-phase">
                <div className="vision-phase-label">
                  Year 2 &mdash; Speed &amp; Power Expression
                </div>
                <div className="vision-phase-title">
                  Unlocking Top-End Speed
                </div>
                <div className="vision-metrics">
                  <div className="vision-metric">
                    <span className="vision-metric-label">Top Speed</span>
                    <span className="vision-metric-value">28-30 km/h</span>
                  </div>
                  <div className="vision-metric">
                    <span className="vision-metric-label">0-10m</span>
                    <span className="vision-metric-value">1.80s</span>
                  </div>
                  <div className="vision-metric">
                    <span className="vision-metric-label">0-20m</span>
                    <span className="vision-metric-value">3.25s</span>
                  </div>
                  <div className="vision-metric">
                    <span className="vision-metric-label">Bounding</span>
                    <span className="vision-metric-value">24m</span>
                  </div>
                </div>
                <div className="vision-phase-desc">
                  Layer on{" "}
                  <strong>
                    max velocity training, reactive power development, and
                    advanced plyometrics
                  </strong>
                  . The power foundation from Year 1 allows Tyson to train speed
                  properly without mechanics limiting him. Puberty begins to
                  amplify gains. He becomes{" "}
                  <strong>
                    one of the fastest athletes in his age group
                  </strong>{" "}
                  &mdash; speed starts to define his athletic profile.
                </div>
              </div>
              <div className="vision-phase phase-final">
                <div className="vision-phase-label">
                  Year 3 &mdash; Athletic Dominance
                </div>
                <div className="vision-phase-title">Speed as a Weapon</div>
                <div className="vision-metrics">
                  <div className="vision-metric">
                    <span className="vision-metric-label">Top Speed</span>
                    <span className="vision-metric-value">31+ km/h</span>
                  </div>
                  <div className="vision-metric">
                    <span className="vision-metric-label">0-10m</span>
                    <span className="vision-metric-value">1.70s</span>
                  </div>
                  <div className="vision-metric">
                    <span className="vision-metric-label">0-20m</span>
                    <span className="vision-metric-value">3.10s</span>
                  </div>
                  <div className="vision-metric">
                    <span className="vision-metric-label">Bounding</span>
                    <span className="vision-metric-value">25m+</span>
                  </div>
                </div>
                <div className="vision-phase-desc">
                  <strong>
                    Full speed expression with advanced plyometrics, reactive
                    agility, and sport-specific speed integration.
                  </strong>{" "}
                  At 31+ km/h with elite bounding distance (25m+), Tyson is a{" "}
                  <strong>physically dominant young athlete</strong>. His sprint
                  profile has evolved into{" "}
                  <strong>elite-level acceleration and top-end speed</strong>. He
                  combines{" "}
                  <strong>
                    explosive acceleration, genuine top-end speed, and the
                    single-leg power to change direction without losing velocity
                  </strong>
                  . Speed becomes his athletic identity &mdash;{" "}
                  <strong>
                    a weapon in any sport he chooses to pursue
                  </strong>
                  .
                </div>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <footer className="assessment-footer fade-section">
            <div
              style={{
                position: "relative",
                width: 180,
                height: 142,
                overflow: "hidden",
                borderRadius: 8,
                margin: "0 auto",
              }}
            >
              <iframe
                loading="lazy"
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  top: 0,
                  left: 0,
                  border: "none",
                  padding: 0,
                  margin: 0,
                }}
                src="https://www.canva.com/design/DAG2a_N00HI/MCb1a3SkyjhfsUZZtpdwhw/view?embed"
                allowFullScreen
                allow="fullscreen"
              />
            </div>
            <div className="footer-sub">Athletic Assessment Report</div>
            <div className="footer-links">
              <a
                href="https://www.ambitionsportsperformance.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Website
              </a>
              <a
                href="https://www.instagram.com/ambitionsportsperformance/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
              </a>
              <a
                href="https://www.ambitionsportsperformance.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Contact
              </a>
            </div>
            <div className="footer-tagline">
              Precision Coaching &bull; Data-Driven Results
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}
