# License & Copyright Audit — XRD-Scherrer

**Updated:** 2026-11-24 (v1.2.0)  ·  **Owner:** Yu Peng (ANDYPENG09)

## 1. Code ownership
- `XRD-Scherrer` is **original work** by Yu Peng (ANDYPENG09).
- **No third-party source code** is copied or vendored into the runtime HTML. All functions (parsing, plotting, baseline, nonlinear fitting, spherical kernel evaluation, NNLS solver, Voigt decomposition, UI, exports) are written from first principles in vanilla JavaScript.
- **Zero runtime dependencies**: no bundled npm packages, no CDNs, no external libraries. Pure HTML + CSS + Canvas + JS in a single offline file (`index.html`). (`jsdom` is a dev-only test dependency in `package.json` and is never shipped in `index.html`.)

## 2. Algorithms (all standard scientific methods, implemented independently)
| Algorithm | Origin / citation | Implementation |
|---|---|---|
| Scherrer equation D = Kλ/(β·cosθ) | Scherrer (1918); Cullity & Stock, *Elements of X-Ray Diffraction* | From-scratch |
| Instrumental broadening correction (Gaussian quadratic / Cauchy linear) | Standard XRD practice; DTU Nanolab guidance | From-scratch |
| Isotropic Williamson–Hall regression | Williamson & Hall, *Acta Metall.* 1 (1953), 22–31 | From-scratch |
| SNIP morphological baseline | Ryan et al., *SNIP background algorithm* (1988) | From-scratch |
| Multi-peak Pseudo-Voigt / Gaussian / Lorentzian deconvolution | Analytic-Jacobian, box-constrained multi-start Levenberg–Marquardt (Levenberg 1944 / Marquardt 1963) | From-scratch |
| Exact spherical crystallite diffraction kernel I_S(s; D) | Stokes & Wilson (1942); Scardi & Leoni, *Acta Cryst.* A57 (2001), 604–613 | From-scratch (exact closed-form + Taylor small-q series + Gaussian/Cauchy instrument convolution) |
| Volume/area-hybrid second-order Tikhonov-NNLS CSD inversion | Lawson & Hanson (1974), *Solving Least Squares Problems*; Tikhonov regularization | From-scratch active-set Gram NNLS |
| Empirical Voigt decomposition & lognormal CSD cross-check | de Keijser et al., *J. Appl. Cryst.* 15 (1982), 308–314; Krill & Birringer, *Phil. Mag. A* 77 (1998), 621–640; Langford, Louër & Scardi, *J. Appl. Cryst.* 33 (2000), 964–974 | From-scratch (with overflow-safe Abramowitz & Stegun 7.1.26 `erfcx`) |

These are published mathematical/scientific methods, not copyrightable code; all implementations are original and literature is cited in the tool's `REFERENCES` constant.

## 3. Data
- Built-in demo datasets (`demo()` and `demoBimodal()`) are **purely synthetic patterns** generated analytically in JavaScript (Gaussian or spherical-kernel lognormal/bimodal profiles at standard public PtCo L1₀ P4/mmm peak positions).
- **No third-party datasets or proprietary raw experimental scans** are embedded.

## 4. License
- Declared license: **MIT** (OSI-approved, permissive).
- Accompanied by [LICENSE](LICENSE) and [README.md](README.md).

## 5. Copyright notice
© 2026 Yu Peng. All rights reserved under the MIT License.

## 6. Risk assessment
| Risk | Level | Mitigation |
|---|---|---|
| Third-party runtime code infringement | **None** — all runtime code original, zero external dependencies | — |
| Third-party data infringement | **None** — built-in demos are analytically synthesized from public L1₀ positions | — |
| Trademark conflict | **None** — "XRD", "Scherrer", "Williamson–Hall", "PtCo L1₀" are generic scientific terms | — |
| Missing license/attribution | **None** — LICENSE, README, and literature references included | — |
