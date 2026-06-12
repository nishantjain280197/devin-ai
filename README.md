# BIC Entrance Exam Portal

A web-based onboarding portal for new employees to complete mandatory training and pass an entrance examination before being granted access to client systems.

## Overview

The portal guides new employees through a structured onboarding flow:

1. **Registration** — Employee provides their name, ID, email, and department.
2. **Training** — Five interactive training modules covering information security, data privacy, workstation security, professional conduct, and compliance. All modules must be completed before proceeding.
3. **Quiz** — A 10-question multiple-choice exam. All questions must be answered. A minimum score of 80% is required to pass.
4. **Results** — Displays pass/fail status with a completion certificate for successful candidates.

## Tech Stack

- **HTML5** — Semantic markup with accessibility attributes
- **CSS3** — Custom properties, Flexbox, responsive design
- **Vanilla JavaScript** — No external dependencies, IIFE module pattern

## Getting Started

Open `index.html` in a web browser. No build step or server required.

```bash
# Local development
open index.html
# or
python3 -m http.server 8080
```

## Project Structure

```
├── index.html          # Main entry point
├── css/
│   └── styles.css      # Application styles
├── js/
│   └── app.js          # Application logic
└── README.md           # This file
```

## Features

- Step-by-step progress indicator
- Expandable/collapsible training modules with completion tracking
- Progress bar showing training completion status
- Quiz with required-answer validation (cannot submit until all questions answered)
- Visual feedback for unanswered questions
- Pass/fail results with completion certificate
- Retry flow for failed attempts (returns to training)
- Fully responsive design
- No external dependencies — works offline

## Quiz Configuration

The quiz is defined in `js/app.js` within the `QUESTIONS` array. Each question object includes:

- `id` — Unique identifier
- `text` — Question text
- `options` — Array of answer choices
- `correct` — Zero-based index of the correct answer

The passing score threshold is defined by the `PASSING_SCORE` constant (default: 80%).
