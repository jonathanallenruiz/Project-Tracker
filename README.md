# ProjectFlow — Jira-style Project Tracker

A standalone browser app populated from `Example .xlsx`.

## Included workbook data

- Four Friendswood GENCO Expansion work items
- Client, line of business, managers, assignee, reviewer, contract type, status, budget, dates, BQE project number, region, technology, project source, and notes
- Continuation rows from the spreadsheet are preserved as each issue's scope/description

## Features

- Jira-style Kanban board with drag-and-drop status changes
- Full issue list
- Dashboard for budget, deadlines, assignments, and reviews
- Search and filters
- Create, edit, and delete issues
- Browser persistence using `localStorage`
- CSV export of the current filtered view
- Responsive desktop/mobile layout

## Run locally

Open `index.html` in a modern browser. No server or installation is required.

For GitHub Pages, upload all three files to the same repository folder and publish that folder as the Pages source.

## Reset

Use **Reset workbook data** in the lower-left sidebar to restore the original imported tracker records.
