# ProjectFlow – Jira-style workspace tracker

Open `index.html` in a browser. The app runs entirely in the browser and saves data to that browser's local storage.

## Features
- Create and switch between independent workspaces
- Optional workspace defaults for client, region, description, and issue-key prefix
- Start a workspace blank or copy the current workspace
- Import projects instantly from CSV using the uploaded Excel tracker's column format
- Automatic handling of continuation rows in the `Project` column as issue descriptions
- Multi-client Kanban board, issue list, dashboard, and client filters
- Team workload totals for assigned tasks, budget, and allocated hours
- Deadline risk indicators: red (0–3 days or overdue), orange (4–5), yellow (6–10), green (11–15)
- Due-date filters for overdue and within 3, 5, 10, 15, 30, or 90 days
- Per-issue T-drive and SharePoint links
- Documents & Links library for procedures, interconnection protocols, templates, report templates, references, and other resources
- Browser persistence and CSV export

## CSV import
Click **Import CSV** and select a file. Imports are added to the currently selected workspace.

The importer recognizes these original workbook headers: `Line of Business`, `Client`, `Project`, `Manager/Director`, `Project Manager`, `Contract Type`, `Status`, `Budget`, `Assigned To`, `Review`, `Internal Completion Date`, `Due Date (External)`, `BQE Project #`, `Region`, `ISO/TSO/Utility`, `Technology`, `Project Source`, and `Notes`.

It also recognizes app-specific columns such as `Scope`, `Priority`, `Allocated Hours`, `T-drive Link`, and `SharePoint Link`. Dates may be written as `YYYY-MM-DD`, `M/D/YYYY`, or Excel serial dates.

A `project-import-template.csv` file is included in this package.

## Notes
T-drive links work best when the app is opened as a local file on a Windows computer where the T: drive is mapped. Browsers or hosted websites may block local `file:///` links for security reasons.
