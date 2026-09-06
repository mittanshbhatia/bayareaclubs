# Analytics Metrics Definitions

BayAreaClubs Insights uses **database-derived operational metrics only**.
These metrics describe club operations. They are **not** student academic
performance, grades, or rankings of children.

Rollups live in `analytics_daily_club`, `analytics_daily_school`, and
`analytics_daily_platform`, refreshed by `refresh_analytics_for_date(date)`
(cron + idempotent backfill). Pacific time (`America/Los_Angeles`) defines
calendar days.

---

## Platform / admin metrics

### Active Clubs
- **Definition:** Count of clubs with `status = active` as of the latest rollup day in range (point-in-time from daily club/school rollups).
- **Numerator:** `sum(active_clubs)` on latest school/platform row or distinct active clubs after filters.
- **Denominator:** n/a (count).
- **Time window:** Snapshot on end date of selected range.
- **Edge cases:** Inactive/archived clubs excluded. Filters by school, category, and grade band apply to the club set before counting.

### New Clubs
- **Definition:** Clubs created on days inside the selected range.
- **Numerator:** `sum(new_clubs)` across platform/school daily rows in range (or count of clubs with `created_at` date in range after filters).
- **Denominator:** n/a.
- **Time window:** Inclusive start–end dates.
- **Edge cases:** Re-activated clubs are not “new”; only `created_at` day counts.

### Active Members
- **Definition:** Active club memberships (`club_memberships.status = active`) on the latest rollup day.
- **Numerator:** Latest `active_members` (platform/school/club).
- **Denominator:** n/a.
- **Time window:** Snapshot on end date.
- **Edge cases:** One person in two clubs counts twice at platform level (memberships, not unique people).

### Member Growth
- **Definition:** Net new active memberships recorded during the range.
- **Numerator:** `sum(new_members)` in range.
- **Denominator:** Active members at range start (for percentage growth); absolute growth is numerator alone.
- **Time window:** Inclusive range.
- **Edge cases:** If start membership is 0, percentage growth is omitted (absolute still shown).

### Events Held
- **Definition:** Events with start date in range and status in published/completed/cancelled.
- **Numerator:** `sum(events)` in daily rollups.
- **Denominator:** n/a.
- **Time window:** Event local start date.
- **Edge cases:** Draft events excluded. Cancelled events still count as “held/scheduled on day” for operational load.

### Average Attendance
- **Definition:** Present-like marks ÷ recorded marks across the range.
- **Numerator:** `sum(attendance_present)` (present + late).
- **Denominator:** `sum(attendance_recorded)`.
- **Time window:** Session local start date.
- **Edge cases:** If denominator is 0, metric is `null` (not 0%). Excused/absent count in denominator when recorded.

### Renewals Due
- **Definition:** Open renewal packets (draft/submitted/under_review/changes_requested) as of latest day.
- **Numerator:** Latest `renewals_due`.
- **Denominator:** n/a.
- **Time window:** Snapshot.
- **Edge cases:** Approved/rejected/withdrawn excluded from “due”.

### Renewal Completion
- **Definition:** Renewals approved during the range ÷ (approvals in range + still-open due at end).
- **Numerator:** `sum(renewals_completed)` in range.
- **Denominator:** numerator + latest `renewals_due` (open pipeline).
- **Time window:** Range for completions; end snapshot for open due.
- **Edge cases:** If denominator is 0, metric is `null`.

### Resource Subscriptions
- **Definition:** New `course_subscriptions` started in range by users who hold an active membership in the filtered club set (club attribution via membership).
- **Numerator:** `sum(resource_subscriptions)` in rollups.
- **Denominator:** n/a.
- **Time window:** `subscribed_at` local date.
- **Edge cases:** A user in multiple clubs can increment multiple club rows on the same day.

---

## Club officer metrics

### Members
- Latest `active_members` for the club.

### New Members
- `sum(new_members)` in selected range.

### Meetings
- `sum(meetings)` (events with `event_type = club_meeting`) in range.

### Attendance
- Average attendance rate for the club in range (same formula as Average Attendance).

### Events
- `sum(events)` in range.

### Event RSVP Rate
- **Numerator:** `sum(rsvps)` (going + waitlisted) in range.
- **Denominator:** `sum(events)` in range (RSVPs per event-day average when shown as rate: rsvps/events).
- **Edge cases:** Null when no events.

### Active Participants
- Distinct members with ≥1 present/late mark in range (live query for drilldown; rollup uses present marks as proxy volume).

### Member Retention
- **Definition:** Share of members active at range start who remain active at range end.
- **Numerator:** Members active on both start and end snapshots.
- **Denominator:** Members active on start snapshot.
- **Edge cases:** Null when start roster empty. Not a student ranking.

### Resource Subscriptions (club)
- Same as platform resource subscriptions scoped to the club.

---

## Charts (admin)

| Chart | Series definition |
|-------|-------------------|
| Club growth over time | Daily `new_clubs` and/or cumulative active clubs from platform/school rollups |
| Membership growth over time | Daily `new_members` / latest `active_members` |
| Attendance trend | Daily attendance rate = present/recorded |
| Clubs by category | Count of active clubs grouped by `clubs.category` |
| Clubs by school | Count of active clubs grouped by school |
| Event participation | Daily `rsvps` vs `events` |
| Club lifecycle funnel | Ideas submitted → ideas approved → clubs created (launched) → renewals approved (deterministic counts in range) |
| Renewal status | Open due vs completed in range |
| Resource engagement | Daily `resource_subscriptions` |
| Most active clubs | Clubs ranked by operational activity score = meetings + events + activities + attendance_sessions in range (not student rankings) |

---

## Club Momentum (operational insight)

Momentum is an **explainable operational framework**, not an AI score and not student performance.

### Component scores (0–100 each, then weighted)

| Component | Weight | Score idea |
|-----------|--------|------------|
| Recent Activity | 15% | Activities in last 30 days vs target of 2 (capped at 100; small clubs not docked for low absolute membership) |
| Meeting Consistency | 20% | Meetings in last 30 days vs target of 2 |
| Attendance Participation | 20% | Attendance rate in last 30 days; **neutral 50** if no sessions (do not penalize for missing data the same as poor attendance) |
| Member Growth | 10% | New members / max(active_members, 1) in 30 days, capped; uses rate so small clubs are not punished for small absolute growth |
| Event Activity | 10% | Non-meeting events in 30 days vs target of 1 |
| Leadership Completeness | 15% | Officers present + advisor present |
| Charter/Renewal Readiness | 10% | Approved charter and not inside urgent expiry window without renewal progress |

**Combined score** = weighted average of component scores.

### Status labels
- **Healthy:** combined ≥ 70 and no urgent renewal/charter risk reason
- **Needs Attention:** combined 40–69, or specific operational gaps without urgent renewal risk
- **Renewal Risk:** charter expires within 30 days without approved renewal, or open renewal past expected cadence with incomplete leadership

Every status includes **human-readable reasons** derived from thresholds (e.g. “No recorded meeting in 42 days.”).

---

## Member insights (personal only)

| Metric | Definition |
|--------|------------|
| Clubs joined | Active memberships for the signed-in user |
| Upcoming events | Published future events for those clubs |
| Attendance summary | Personal present/late/excused/absent counts when the member may view their own records |
| Course progress | Own `course_subscriptions` + completed lesson counts |

No leaderboards or participation rankings of minors.
