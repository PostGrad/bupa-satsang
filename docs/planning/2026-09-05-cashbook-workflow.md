# Ravisabha workflow and workbook mapping

Updated: 2026-09-06. The current expense-only requirements below supersede the earlier cashbook, advance and reimbursement proposal. The workbook describes historical practice and does not define the app's whole scope.

## Confirmed workflow

1. Ravisabha head provides menu and planned devotee count.
2. Kitchen head lists required items/quantities and assigns purchasers.
3. Purchasers buy goods, hand them to the chef and enter itemwise bills in the app.
4. Cashier or kitchen head can enter other event expenses. The app reports the final amount with breakups.
5. Kitchen head or chef records how much of each prepared menu item is left at the end of the meal.
6. Purchases and bill entry work offline and automatically sync later.
7. All five roles use the app directly at launch. English is the default UI language, with a Gujarati switch.
8. Gmail-based login is interpreted as Sign in with Google, with Google handling account recovery.
9. No user file uploads; bills are structured entries only.

No inventory, fund accounts, income/cashbook balances, carry-over, advance or reimbursement/payment-tracking features are required. Previous two-party reimbursement markers are superseded by the explicit expense-only scope. An event may span several days and meals. Each dated meal has its own menu/headcount and leftovers; those observations are not inventory carried to another meal or event.

## Workbook evidence retained for migration

`Ravisabha Cashbook 2026.xlsx` was inspected read-only on 2026-09-05 through sheet structure, representative ranges and stored formula relationships. It was not edited or fully financially audited.

There are 37 sheets: Source, Summary, Cashbook, BUPA and 33 numbered event sheets. Numbered events span December 2025 to August 2026. Multiple events can share a date, so date alone is not an ID.

| Evidence | Current use |
| --- | --- |
| Summary!B2:I5 | Event/date/occasion/menu/count/host metadata; detail links identify event sheets. |
| Summary!G3 and referenced event C4 | A column labelled budget can link to bill expenditure. Import by meaning, not label alone. |
| 33_30-08-2026!B2:F4 | Event metadata and an unknown headcount. Preserve missing values rather than inventing attendance. |
| 33_30-08-2026!B6:G12; 24_15-06-2026!B6:I10 | Repeated dish sections with items, quantities, units and amounts. Use expense details once, not adjoining subtotals again. |
| Source!B2:C19 | People and group labels are mixed. Do not turn every source label into a volunteer account or assume it is the purchaser. |
| Cashbook!B4:G6; BUPA!B4:G6 | Historical income/expense ledgers. Their fund/income/payment functions are outside the app; only a separately verified expense with no existing event-line duplicate could be considered for migration. |
| Cashbook!F2:J13 | Historical balances and denomination counts. Do not create balance, carry-over or physical cash reconciliation features from these cells. |

Observed units include Gram, Kilogram, Liter and Packet. Gujarati dish/item/occasion labels vary in spelling and whitespace. Preserve original text with reviewed canonical aliases. General sections mix ingredients such as oil/spices with service costs such as gas and vessel cleaning; distinguish ingredient lines from other expenses.

Migration is a maintainer-run process from the supplied local workbook, with preview, row provenance and repeat-run protection. There is no in-app import upload. Do not import one bill again as an event summary, person subtotal or cashbook disbursement. Never treat income, advances or reimbursement entries as expenses. Historical source data does not establish future recipes, actual attendance or leftover quantities. Preserve separate events even when dates match. Repeated dish sections do not imply separate meals; establish historical meal grouping from reviewed evidence. Expenses without a supported meal allocation import as common event cost.

## Proposed data handling

One expense total includes accepted bill lines and other expenses, excluding drafts, voided records and locally pending writes not yet accepted by the server. Confirmed breakups are category, item, bill and shopping volunteer, respecting bill visibility. Each full breakdown reconciles to the same total, including an Other expenses bucket where needed. Dish-cost reporting is excluded from launch. Per-meal expense reporting is confirmed: bill-line/other-expense allocations plus common event costs reconcile to the event total; a shared purchase is not copied into every meal. No separate finance approval step is assumed.

Purchaser identity and recorder identity are distinct when another authorised volunteer assists. Including after the meal, shoppers edit their own bills; kitchen head and cashier can correct any bill. Changes retain author and history. There is no expense finalise/reopen workflow. Chef and kitchen-head leftovers refer to a prepared dish in a particular meal, with quantity/unit and recorder; zero differs from not recorded. A stale competing edit must not silently overwrite the other entry.

Purchases, bills, other expenses and dish leftovers all work offline and automatically sync. Offline state must survive restart, retry safely and resolve conflicts/revoked access explicitly. Auto-sync on reconnect/resume is required; killed-app/background execution cannot promise immediate sync. See the [current specification](2026-09-05-kitchen-proposal.md) for the durable queue, idempotency and conflict handling.

## Screen questions remaining

Review proposed detailed role shortcuts, other-expense form and permission details. Expense breakups are settled. English default with Gujarati switch is confirmed. Home opens the current or upcoming assigned event with role-specific shortcuts, with an event chooser when several events fit. Leftovers use quantity plus a suitable unit per dish (kg, litres, pieces or vessels), with no assumed vessel capacity. Bill entry starts from the shopping list with actual quantities/amounts and an option to add extra items. See [screen journeys](2026-09-06-kitchen-screens.md). All five roles see event/meal totals and common event costs; both heads and cashier see all bills; shoppers see their own bills. Screens should avoid accounting terminology for excluded fund or payment features.
