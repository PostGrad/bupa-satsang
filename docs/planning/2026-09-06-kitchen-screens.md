# Kitchen screens and volunteer journeys

Status: discussion draft, 2026-09-06. This expands the [kitchen proposal](2026-09-05-kitchen-proposal.md). Home behaviour, language, shopping-list-led bill entry, dish leftovers as quantity plus unit, and expense visibility are accepted. Saved-bill correction permissions, including after the meal, are also accepted: shoppers edit their own bills; kitchen head and cashier can correct any bill, with change history. Detailed layouts and remaining policies below are proposals.

## Shared entry and navigation

Sign in with Google. Open the current or upcoming assigned event; show an event chooser when several events fit. With no assignments, explain that event access must be granted rather than showing an empty kitchen dashboard. The event list remains available for switching and history.

The event header shows the date range and occasion. Kitchen shows a meal schedule grouped by date; each meal card shows its label/time, menu and planned devotee count. Use role-specific shortcuts within a shared event workspace. Multiple roles combine available actions without requiring a role switch. Proposed sections: Overview/Meals, Menu, Shopping, Expenses and Leftovers. Menu and Leftovers use an explicit meal selector; Shopping can combine selected meals; Expenses offers event, individual-meal and common-cost views. Their visibility follows the agreed permission matrix; a hidden button is not an authorization boundary.

English is the default. A Gujarati switch is accessible from the home/event screen and Settings, and remembers the volunteer's preference. Translate labels, validation and sync messages; preserve original dish and ingredient names.

## Suggested shortcuts for all five roles

| Role | Primary shortcuts | Useful supporting information |
| --- | --- | --- |
| Ravisabha head | Set each meal's menu and devotee count | Requirements and purchasing progress; meal outcome |
| Kitchen head | Prepare shopping list; assign purchasers | Menu/count, recorded purchases; add other expense; record leftovers |
| Shopping volunteer | My shopping list; add bill | Required quantities, their recorded purchases and pending sync |
| Chef | View menu; record leftovers | Ingredient requirements and recorded purchases |
| Cashier | View expenses; add other expense | Recorded bill detail, event total and breakups |

Confirmed expense visibility within an assigned event: all five roles see event/meal totals and the common-cost aggregate; both heads and the cashier see all bill details; shoppers see their own bill details. A chef-only role cannot see individual bills. Multiple roles combine these permissions. Recorded purchases do not by themselves prove delivery to the chef.

## Volunteer access and role administration

Accepted launch choice: designated community administrators manage volunteer access and all event roles. Community administration is an additional permission that an existing volunteer can hold. Ravisabha-head and kitchen-head roles alone cannot grant access or change roles.

The kitchen head can assign shopping-list tasks to volunteers who already have the shopper role in that event. This assigns work; it does not grant a new role.

Proposed administrator screens: Volunteers (approved, pending and disabled access) and Event team (members with one or more roles). Granting, changing or revoking access requires internet and records who made the change. Google sign-in alone grants no event access. Administrative permission does not automatically grant all kitchen data access; operational event roles govern that separately.

| Action within an assigned event | Ravisabha head | Kitchen head | Shopper | Chef | Cashier |
| --- | --- | --- | --- | --- | --- |
| See event/meal totals and common-cost aggregate | Yes | Yes | Yes | Yes | Yes |
| Read bill details | All | All | Own | No | All |
| Record a shopping bill | With shopper role | With shopper role | Own | With shopper role | With shopper role |
| Correct saved bills, also after the meal | No | All | Own | No | All |
| Add other expenses | No | Yes | No | No | Yes |
| Record dish leftovers | No | Yes | No | Yes | No |
| Grant access or event roles | Community-admin permission required | Community-admin permission required | Community-admin permission required | Community-admin permission required | Community-admin permission required |

Roles combine within their assigned scope. Corrections retain history. Proposed remaining defaults: kitchen head/cashier can correct other expenses; both heads/cashier can read their details; other roles see only permitted aggregate totals. Billing on another person's behalf is not a distinct launch permission and must not be introduced by assuming that bill-edit access includes bill creation for any purchaser.

## Dated meal schedule

Multi-day, multi-meal events are confirmed for launch. Event roles apply across all its meals. Show days as date headings, with meal cards beneath them, for example:

| Day | Meal | Planned devotees |
| --- | --- | --- |
| Day 1 | Morning snacks | 100 |
| Day 1 | Lunch | 250 |
| Day 1 | Dinner | 200 |
| Day 2 | Morning snacks | 150 |
| Day 2 | Lunch | 300 |

These are example values, not defaults. Allow afternoon snacks, breakfast, dinner and custom labels without fixing the number of meals per day. Highlight the current/next meal, but allow volunteers to select another meal and retain that selection in an open form. Do not combine these counts into a claim about unique devotees.

Each meal keeps a stable ID when its date/time changes. Completing a meal does not finish the remaining meals or lock expense entry. Referenced meals/menu entries cannot be deleted in a way that loses leftovers, purchases or offline drafts.

## Menu and requirements

After selecting a dated meal, Ravisabha head selects or enters its dishes and planned devotee count. Kitchen head creates a manual ingredient list with quantity and unit and assigns shopping volunteers. Reusing ingredient names reduces repeated typing. Recipe-based automatic estimation remains outside the first release.

Show the requested quantity separately from purchased quantity. If the same ingredient serves several dishes or meals, the shopping view can aggregate compatible quantities while preserving all source requirement references. Offer selected-meals, day and whole-event planning views. Never assume packet sizes or convert between incompatible units.

## Shopping and bill entry

Accepted approach: start from the shopping list, enter actual quantities and amounts, and allow extra items.

1. Open My shopping list and choose Add bill.
2. Select the items purchased on this bill. A bill can cover requirements for multiple meals, or only part of the list; multiple bills can reference the same requirement.
3. Enter each item's actual quantity, unit and line amount. Display the planned quantity for reference without treating it as a purchase already made. Use a numeric keypad on Android and convenient keyboard movement on web.
4. Add unplanned items through Add item. Link matching same-event requirements when appropriate; preserve the original plan instead of rewriting it to match purchases.
5. Review the calculated total and save. Vendor and bill reference are optional; date defaults to today. There is no payment-method field or receipt upload.

Proposed monetary input is the total amount for each line, matching itemwise bills. Unit-price entry is not required for the first version. The saved bill contains its own description, quantity, unit and amount so later planning edits cannot change historical expense records.

Use one bill for one vendor transaction where applicable. Shopping status derives from recorded quantities with their sync state; a bulk line is counted once even when it links multiple meal requirements. Links alone do not imply a per-meal split. For 8 kg bought against combined 5 kg lunch and 5 kg dinner requirements, show 8/10 kg for the combined group without claiming both meals are fulfilled; selecting an item for a draft does not mark it purchased. Partial purchases remain visible, and excess quantities can be flagged without blocking valid entry. Two volunteers' separate bills remain separate records even when buying the same ingredient.

## Other expenses and totals

Kitchen head or cashier chooses Add other expense, enters description, category, amount and date, then saves. This supports costs such as vessel cleaning without requiring ingredient quantity. An expense already included in a bill must not be entered again here.

Expenses shows the event total and links to bills and other entries. Confirmed breakups are category, item, bill and shopping volunteer. Dish-cost reporting and allocation are excluded from launch. Include Other expenses as a distinct bucket wherever an item, bill or shopping volunteer does not apply. Expenses remain editable after the meal, with change history and the same permissions. There is no finalise/reopen action; totals reflect current saved records. Proposed default view: category totals, with switches to item, bill and shopping volunteer. Proposed aggregate category totals can accompany the total for all roles, but detailed reports must obey bill visibility and must not return hidden bill records through drilldowns or exports. Label a shopper-only detail view My expenses, with its own subtotal; do not present it as a complete breakdown of the event total. Detail visibility for other-expense records follows the same proposed rule as bills; confirm this when finalising the permission matrix.

## Meal cost assignment

Confirmed: track per-meal costs alongside the event total. Each bill line or other expense has a Used for selector: a single dated meal, Split across meals, or Common event cost. Starting from a meal's shopping list can suggest that meal, but the volunteer reviews the assignment; requirement links must not silently distribute money.

For a single meal, assign the full source amount. For a split, enter exact amounts beside selected meals and show the common remainder live. Proposed convenience: assign all lines of a bill to one meal, implemented as individual line allocations, with line-by-line changes available. Keep the bill one record. Saving expenses without a known split remains possible by leaving them common.

Examples: an INR 1,000 rice line assigned INR 400 to Day 1 lunch and INR 350 to Day 2 lunch leaves INR 250 common. An INR 200 cleaning charge assigned fully to dinner is an Other expense with zero common remainder. Common event cost and Other expenses are separate concepts.

Reject amounts exceeding the source cost, duplicate meal allocations and meals from another event. If a source amount is lowered, require its allocations to be corrected in the same save. Editing cost assignments uses the same bill/expense permissions and offline change history.

Show event total, a table of dated meal totals and Common event costs. Meal totals include only attributed amounts; do not imply that common costs have already been apportioned. Category/item/bill/shopper drilldowns for a meal use that meal's allocated amounts and obey bill visibility. A shopper's detail subtotal can differ from the full meal total because other bills are hidden.

## Leftovers

Chef or kitchen head selects a dated meal and sees that meal's dishes and records what remains after the meal. Accepted measure: quantity and a suitable unit for each dish, such as kg, litres, pieces or vessels. A unit must be selected with the quantity. Preserve vessel counts without assuming weight, volume or a standard vessel size. Distinguish zero left from not yet recorded. Recording leftovers does not close expense entry, reduce expenditure or create inventory for the next event. Proposed model: one current observation per meal-menu-entry ID with change history. If the chef and kitchen head edit the same observation, or both create its first entry for the same meal while offline, show the competing values for resolution rather than summing them. The same dish in a different meal has a separate observation and does not conflict.

## Offline and recovery experience

Confirmed: purchases, bills, other expenses and leftovers all support offline entry and automatic sync. Download the dated meal schedule and relevant menu/requirement context along with the event. A queued leftover retains its exact meal-menu-entry ID, even after midnight or a schedule edit. The same save/sync states apply to each form.

Before leaving for the market, a volunteer can see whether the assigned event and shopping list are available on the device. Offline bill entry uses the same form. After durable local save, show Saved on this device; then Syncing, Synced or Needs attention as appropriate.

Keep the server-confirmed total distinct from this device's pending expenses. An expired session retains the bill and requests sign-in before sync. A conflicting edit or revoked access preserves the entered data for resolution. Completing a meal does not block late bill sync. Do not ask a volunteer to re-enter an entire bill after a failed request. Automatic sync resumes when the running app can reach the service; reopening resumes queued work.

## Remaining discussion

Multi-day meals and per-meal costs with explicit allocations/common costs are confirmed. Review the proposed shortcut/layout defaults, other-expense permissions, administrator screens and leftover conflict interaction as a coherent design. Administrator event creation remains a proposed default in the platform specification; meal scheduling and per-meal menu/headcount management are part of the kitchen design. Keycloak is the working identity choice. The [architecture](../superpowers/specs/2026-09-06-kitchen-architecture.md) and [delivery plan](../superpowers/plans/2026-09-06-kitchen-delivery.md) define the proposed universal UI, storage/sync implementation and build sequence.


## Acceptance examples

- A shopper selects tomatoes from the list, records 4 kg for INR 160 offline, restarts the app and sees the saved bill. Reconnecting syncs it once even if a request must be retried.
- The same shopper sees the event total but cannot retrieve another shopper's bill through the screen, API, downloaded cache or export. A kitchen head can read and correct that bill, with change history.
- After the meal, a late INR 50 expense increases the latest server total by INR 50. No reopening is required.
- Chef records zero rotlis left; another dish remains blank. The screen distinguishes none left from not recorded.
- Chef and kitchen head independently enter leftovers for the same dish in the same meal offline. The app retains both proposed values for resolution rather than silently overwriting or adding them.
- A kitchen head assigns shopping tasks to an existing event shopper but cannot grant someone a new event role without community-admin permission.
- A complete item, bill or shopper breakdown includes Other expenses where needed and reconciles to the same event total. A shopper-only breakdown is clearly limited to their own records.

- A two-day event shows several meals per day with different menus/headcounts. Lunch rotli leftovers and dinner rotli leftovers remain independent, including offline edits.
- One bulk purchase references requirements from several meals and contributes its amount once to the event total. No per-meal cost is inferred from those links; explicit source allocations produce meal totals and the common-cost remainder.
- A meal rescheduled while a device is offline keeps its ID; queued leftovers retain their intended meal instead of being reassigned by date or label.
- An INR 1,000 shared bill line allocated INR 400 and INR 350 to two dated meals produces those meal totals and INR 250 common, with no increase beyond INR 1,000 at event level.
- Two volunteers edit the same bill's allocation offline; one accepted update cannot silently overwrite the other's amount split. A different meal's independent leftover remains unaffected.
