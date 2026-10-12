# Prompt ① — STATUS QUERY (progress check, safe to paste into the Goal session at any time)

STATUS QUERY — report current progress on the KB Goal. Do NOT continue analysis; answer only.

Produce a structured completion report with exactly these sections:

1. LOOP STATUS — current Loop Me iteration number; current phase (ANALYZE or VERIFY); elapsed time vs. plan.
2. MANIFEST NUMBERS — recompute from MANIFEST.json and the KB files on disk (do not estimate from memory): total files; excluded by category (test / auto-generated / other, with counts); analyzed; pending; percentages.
3. PER-LAYER COMPLETION — for each of L0, L1, L2, L3, L4: does it exist? Estimated % of its planned content written? What major parts are missing?
4. PER-MODULE TABLE — one row per crate/subsystem (every rust/* crate, python, java, protos): MANIFEST analyzed %, L1 doc status (none / partial / complete), L2 file-doc count vs. source-file count.
5. VERIFICATION — which of the 5 VERIFY checks have ever passed; all still-open failures from verification-log.md.
6. BOTTLENECK & FORECAST — what consumes the most time per loop iteration; honest estimate of remaining iterations/time to reach the current Definition of Done.
