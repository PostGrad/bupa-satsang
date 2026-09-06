# Task 35: Build durable shopping-led bill entry and correction

> Execute this card only after a user starts development and its dependencies are accepted. Stop after this card. Follow [the execution guide](../execution-guide.md); no Android/iOS compilation, emulator, push or deployment is authorized by this plan.

**Dependencies:** [21](./21-add-bill-corrections-dependent-bases-and-voids.md), [30](./30-implement-recovery-drafts-and-pending-cost-projection.md), [31](./31-wire-web-sessions-event-navigation-and-browser-fixtures.md), [34](./34-build-requirement-planning-and-consolidated-shopping-views.md)

**Risk/review:** Review required. A reviewer must check both requirement coverage and actual behavior; review-required cards need a capable reviewer or human familiar with the risk.

**Read:** [Binding decisions](../decisions.md); [Contracts](../contracts.md) and [Test fixtures](../test-fixtures.md), sections **C3/C5; F1/F5; bill-entry screen journey**. Read [Data/API map](../data-api.md) when this card changes persistence or an endpoint.

**Files to inspect/change:**

- `apps/client/app/events/[eventId]/bills/{new,[billId]}.tsx`
- `apps/client/src/features/bills/{BillForm,BillList}.tsx`
- `tests/web/bill-entry.spec.ts`

**Consumes:** Accepted dependency outputs and the named shared contracts. Do not change another task's public signature to make this task easier.

**Produces:** React Hook Form+Zod bill form using EventRepository/enqueueMutation; own-create and authorized correction.

## Implementation steps

- [ ] Inspect the named existing files and capture the actual base commit/worktree changes. Add a missing package manifest/test target only if the card's new package requires it; preserve pinned framework versions.
- [ ] Add the following regression example and the explicit cases below to the named test file. Supply imports from the packages/harnesses named in the references. For behavior work, run it before implementation and record the expected missing behavior failure. Configuration and operational cards instead validate the concrete artifact; do not create a fake passing service.

```ts
test('saves an actual bill',async({signedInPage:page})=>{
 await page.getByRole('button',{name:'Add bill',exact:true}).click();
 await page.getByLabel('Item name',{exact:true}).fill('Tomatoes');
 await page.getByLabel('Quantity',{exact:true}).fill('4');
 await page.getByLabel('Line amount',{exact:true}).fill('160.00');
 await page.getByRole('button',{name:'Save bill',exact:true}).click();
 await expect(page.getByText(/Saved on this device|Synced/)).toBeVisible();
});
```

**Required cases:** Item name/Quantity/Unit/Category/Line amount labels; actual amount differs from plan; extra item valid; vendor/reference optional; durable save before success; storage error retains form; drafts survive navigation.

- [ ] **Implementation action 1:** Use bill160 form fixture with kg/Vegetables selected explicitly by the browser harness; production defaults cannot infer incompatible unit/category.
- [ ] **Implementation action 2:** Initialize UUIDs once per draft and prevent duplicate local saves on double-tap.
- [ ] **Implementation action 3:** Create purchaser from active identity, never an editable field.
- [ ] **Implementation action 4:** Corrections use current version or queued predecessor.
- [ ] **Implementation action 5:** Show line total and bill total with exact strings.
- [ ] **Implementation action 6:** Keep allocations initially visible as Common event cost until task36 supplies editor.
- [ ] **Implementation action 7:** Wait for local transaction before navigate/success; retain failed input.
- [ ] Run the focused verification commands below. A failed prerequisite is recorded as blocked or pending, never passed. Native/external acceptance remains pending until its gate is explicitly opened.

```sh
pnpm test:web tests/web/bill-entry.spec.ts
pnpm typecheck
```

- [ ] Self-review the diff against the cases and forbidden scope, then request task review with a diff and real output. Fix blocking findings and rerun only covering checks. Record the handoff/accepted commit in [Progress](../progress.md); do not start the next card automatically.

## Done means

The stated public output exists, all applicable listed cases pass, no unrelated feature or breaking interface was added, and evidence is recorded. External-gate preparation may be complete with execution pending; it does not satisfy the release gate.
