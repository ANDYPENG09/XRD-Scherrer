# Changelog

## v1.1.0 — 2026-10-02

- Add validated numeric-text and JSON input; normalize descending scans and reject duplicate/nonmonotonic angles, malformed/nonfinite rows and all-zero data.
- Add CSV/JSON result exports with units and method settings; invalidate stale results on input changes.
- Escape imported names, avoid large-scan plotting argument limits, and add numerical/DOM regression tests.
- Implement isotropic Williamson–Hall regression with at least three clean distinct reflections; report fit quality and reject nonphysical size/strain.
- Select Gaussian/Cauchy instrument correction independently of width mode.
- Correct the description of (220) as a fundamental reflection and remove unimplemented Kα₂-stripping claims.
- Label the SNIP width method as a Gaussian approximation; detect incomplete half-height crossings.
