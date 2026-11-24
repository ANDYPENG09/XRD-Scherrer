# Changelog

## v1.2.0 — 2026-11-24

- Add Tab ② multi-peak nonlinear deconvolution powered by a from-scratch analytic-Jacobian, multi-start, box-constrained Levenberg–Marquardt solver supporting 1–6 overlapping Pseudo-Voigt / Gaussian / Lorentzian sub-peaks with joint linear or SNIP baseline.
- Add quick templates (`PtCo L1₀ (220)+(202)` 64°–75°, `PtCo L1₀ (200)+(002)` 44°–52°, `Bimodal (111) small+large`) and smoothed negative second-derivative auto peak seeding.
- Report per-sub-peak 2θ, height, FWHM, integral breadth β, η, net area Aₖ, area/volume fraction, Scherrer Dₖ, fit goodness (R², Rwp, RMSE), sub-peak + residual plots, explicit total fitted area ΣAₖ vs fitted-baseline numerical area vs traditional endpoint-baseline area comparison, and inferred tetragonal lattice parameters a, c, c/a.
- Upgrade Tab ① `PtCo empirical (220)` mode to default to 64°–75° `(220)+(202)` 2-peak deconvolution (retaining a legacy single-peak SNIP toggle for comparison).
- Upgrade Tab ③ Multi-peak + Williamson–Hall with per-row single/doublet deconvolution and a `+ Load PtCo L1₀ (5 peaks)` preset decomposing `(111)`, `(200)`, `(002)`, `(220)`, and `(202)`.
- Add reciprocal-space Crystallite Size Distribution (CSD) inversion in Tab ② using exact spherical crystallite diffraction kernels I_S(s; D) (with Gaussian/Cauchy instrumental convolution) and volume/area-hybrid second-order Tikhonov-NNLS recovering continuous f_V(D) and f_N(D), PDF/CDF plots, bimodal mode detection, ⟨D⟩N ± σN, ⟨D⟩A, ⟨D⟩V, and D10/D50/D90.
- Add de Keijser (1982) Voigt decomposition + Krill–Birringer / Langford–Louër–Scardi lognormal cross-check with honest variance suppression for near-Gaussian profiles (⟨L⟩V/⟨L⟩A ≤ 9/8).
- Add drag-to-zoom / double-click-reset main pattern chart with active region shading, polydisperse/bimodal PtCo L1₀ demo data, EN / 中文 UI toggle, `Download CSD CSV` export, and expanded jsdom regression tests.

## v1.1.0 — 2026-10-02

- Add validated numeric-text and JSON input; normalize descending scans and reject duplicate/nonmonotonic angles, malformed/nonfinite rows and all-zero data.
- Add CSV/JSON result exports with units and method settings; invalidate stale results on input changes.
- Escape imported names, avoid large-scan plotting argument limits, and add numerical/DOM regression tests.
- Implement isotropic Williamson–Hall regression with at least three clean distinct reflections; report fit quality and reject nonphysical size/strain.
- Select Gaussian/Cauchy instrument correction independently of width mode.
- Correct the description of (220) as a fundamental reflection and remove unimplemented Kα₂-stripping claims.
- Label the SNIP width method as a Gaussian approximation; detect incomplete half-height crossings.
