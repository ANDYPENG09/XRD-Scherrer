# XRD-Scherrer

Offline XRD **coherently diffracting domain-size & crystallite size distribution (CSD)** analysis. Single-file zero-dependency HTML with Scherrer, multi-peak nonlinear Pseudo-Voigt deconvolution, reciprocal-space spherical-kernel CSD inversion, isotropic Williamson–Hall, and final average size + deviation range summaries. **v1.2.1**.

**[Open the tool](https://andypeng09.github.io/xrd-toolkit/demos/scherrer/)** · [Download HTML](https://raw.githubusercontent.com/ANDYPENG09/XRD-Scherrer/main/index.html) · [XRD Toolkit](https://andypeng09.github.io/xrd-toolkit/)

## What it computes

- **Single-peak Scherrer (Tab ①):** D = Kλ / (β cosθ), with θ = 2θ/2 and β in radians. Supports endpoint-baseline trapezoidal integration, SNIP + Gaussian width approximation, and an upgraded **PtCo empirical (220)+(202) deconvolution** mode (defaults to 64°–75° 2-peak Pseudo-Voigt LM fit to recover full doublet tail area, with a legacy single-peak SNIP toggle for comparison).
- **Multi-peak nonlinear deconvolution (Tab ②):** From-scratch analytic-Jacobian, multi-start, box-constrained Levenberg–Marquardt fitter supporting 1–6 overlapping Pseudo-Voigt / Gaussian / Lorentzian sub-peaks with joint linear or SNIP baseline. Includes quick templates for `PtCo L1₀ (220)+(202)` (64°–75°), `PtCo L1₀ (200)+(002)` (44°–52°), `Bimodal (111) small+large` (co-centered narrow+broad), and smoothed negative second-derivative auto-seeding.
  - Reports each sub-peak 2θ, height, FWHM, integral breadth β, mixing factor η, net area Aₖ, area/volume fraction, individual Scherrer size Dₖ, fit quality (R², Rwp, RMSE), sub-peak + residual plots, an explicit area comparison (**analytic ΣAₖ vs fitted-baseline numerical area vs traditional endpoint-baseline area**), and a **final average crystallite size & deviation range summary** (area-weighted mean ± deviation, arithmetic mean ± sample SD, min–max range).
  - Automatically infers tetragonal L1₀ lattice constants **a**, **c**, and **c/a** when `(220)+(202)` or `(200)+(002)` is fitted.
- **Crystallite Size Distribution (CSD) inversion (Tab ②):** Isolates any fitted sub-peak by subtracting the fitted baseline and neighboring overlapping sub-peaks (or defaults to `Composite` for co-centered bimodal peaks), maps to reciprocal space s = 2sinθ/λ − s₀, and inverts exact spherical crystallite diffraction kernels I_S(s; D) (with Gaussian/Cauchy instrumental convolution) using volume/area-hybrid second-order Tikhonov-NNLS to recover continuous f_V(D) and f_N(D) (PDF/CDF toggle, bimodal mode detection, ⟨D⟩N ± σN, ⟨D⟩A = ⟨D³⟩/⟨D²⟩, ⟨D⟩V ± σV, and D10–D90 dispersion intervals).
  - Cross-checked against **de Keijser (1982)** Voigt decomposition + **Krill–Birringer / Langford–Louër–Scardi** lognormal analysis; near-Gaussian profiles (⟨L⟩V/⟨L⟩A ≤ 9/8) honestly suppress nonphysical variance.
- **Multi-peak + Williamson–Hall (Tab ③):** β cosθ = Kλ/D + 4ε sinθ with per-row single-peak or 2-peak deconvolution, a `+ Load PtCo L1₀ (5 peaks)` preset extracting `(111)`, `(200)`, `(002)`, `(220)`, and `(202)`, and a **final summary** reporting area-weighted mean ± deviation, arithmetic mean ± SD, min–max range, and W–H size side-by-side. Nonpositive intercepts or negative strain suppress physical outputs rather than clamping.
- **Interactive UX & exports:** Drag-to-zoom / double-click-reset main chart with active region shading, EN / 中文 toggle, standard and polydisperse/bimodal PtCo L1₀ synthetic demos, and traceable JSON / CSV / **CSD CSV** exports (including summary mean & deviation columns) with automatic invalidation on input edits.

**Kα₂ stripping is not implemented.** Use monochromated or externally corrected data. Scherrer domain size and spherical CSD assume negligible microstrain/faulting in the isolated reflection; microstrain, anisotropy, and unresolved doublets can bias size and distribution tails.

## Use

Open `index.html` (or download `XRD-Scherrer-v1.2.0.html` from Releases), load a built-in demo or your numeric-text/JSON scan (`.xy .xye .csv .txt .dat .asc .ras .json`), select a tab, and run fitting/CSD/W–H. Descending scans are normalized; nonfinite, all-zero, duplicate, and nonmonotonic inputs are rejected.

## Validation

```bash
npm ci
npm test
```

Regressions verify parsing, analytic Gaussian Scherrer width, Gaussian/Cauchy instrument corrections, `(220)+(202)` doublet area recovery vs endpoint underestimation, tetragonal `a/c/c/a`, lognormal and bimodal spherical NNLS CSD recovery, Gaussian instrument-convolved CSD, Krill–Birringer variance suppression on pure Gaussians, PtCo L1₀ 5-peak W–H, bilingual switching, CSD CSV export, and input invalidation.

References: Scherrer (1918); Stokes & Wilson (1942); Williamson & Hall, *Acta Metall.* 1 (1953), 22–31; de Keijser et al., *J. Appl. Cryst.* 15 (1982), 308–314; Ryan et al. (1988), SNIP baseline; Krill & Birringer, *Phil. Mag. A* 77 (1998), 621–640; Langford, Louër & Scardi, *J. Appl. Cryst.* 33 (2000), 964–974; Scardi & Leoni, *Acta Cryst.* A57 (2001), 604–613; Cullity & Stock, *Elements of X-Ray Diffraction*.

[Changelog](CHANGELOG.md) · [License audit](LICENSE_AUDIT.md) · [MIT License](LICENSE)
