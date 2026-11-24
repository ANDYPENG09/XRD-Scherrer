# Changelog

## v1.2.2 — 2026-11-24

- Fix `(111)` crystallite size overestimation in multi-peak and single-peak analyses:
  - Add `1-peak LM (Pseudo-Voigt)` (`analyzeLM1`) mode to Tab ③ (`#peakRows`) and `Pseudo-Voigt LM (joint linear baseline)` to Tab ① (`#calcMode`) so isolated Voigt/Lorentzian peaks are fitted with a joint linear baseline instead of endpoint chords that truncate tails and inflate `D`.
  - Default `(111)` in `+ Load PtCo L1₀ (5 peaks)` (`35.5°–44.5°`) to `1-peak LM` (and adjust `(200)+(002)` to `43.5°–51.5°` to stay clear of the `53.6°` `(201)` superlattice tail), ensuring all 5 reflections use one consistent Pseudo-Voigt model.
  - Fix the built-in synthetic `demo()` pattern (`PEAKS`) where `(111)` previously had an artificially narrow hardcoded width (`6.01 nm` vs `4.26–4.81 nm` on other reflections, causing W–H `R² = 0.19`); all L1₀ reflections in `demo()` are now synthesized from a physically consistent `D = 4.6 nm, ε = 0.0015, η = 0.25` Pseudo-Voigt model (`D(111) ≈ 4.32 nm`, W–H `R² > 0.91`).
  - Add an automatic bilingual diagnostic note in Tab ③ whenever `(111)` still exceeds the median of other reflections by >25% on measured data (guiding users toward bimodal CSD or anisotropic strain review).

## v1.2.1 — 2026-11-24

- Add a prominent bilingual **Final Summary: Average Crystallite Size & Deviation Range** box at the bottom of every analysis panel (Tab ① single peak & PtCo `(220)+(202)`, Tab ② multi-peak deconvolution & CSD, Tab ③ multi-peak + Williamson–Hall).
- Report area-weighted mean ± RMS deviation, arithmetic mean ± sample SD (`±1σ` range), observed min–max range, median, RSD %, and W–H / empirical `D×C` reference values for multi-peak analyses, plus SNR/step-based uncertainty interval `[D−ΔD, D+ΔD]` for single-peak analyses.
- Add volume-weighted standard deviation `σ_V` to NNLS CSD inversion and display both `⟨D⟩V ± σV` / `⟨D⟩N ± σN` and `D10–D90` dispersion intervals in the CSD summary.
- Persist structured `summary` statistics in JSON exports and add summary mean/SD/interval and `CSD_sigmaV_nm` columns to CSV exports.

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
