# XRD-Scherrer — Crystallite Size Analysis

A single-file, zero-dependency, **offline** HTML tool for estimating the
**coherently diffracting domain size** from XRD peak broadening via the
Scherrer equation. All processing runs locally in the browser — data never
leaves your device.

## Features

- **Single-peak** and **multi-peak + Williamson-Hall** modes.
- **PtCo empirical (220 integral)** mode — auto-analyzes the (220) reflection
  with a SNIP baseline + Gaussian integral breadth, with a TEM calibration
  factor `C`.
- **Standard Scherrer** (endpoint baseline) and **Optimized Scherrer**
  (SNIP baseline + Gaussian fit).
- FWHM / integral-breadth width modes; instrumental-broadening correction
  (Gaussian quadratic / Cauchy linear).
- SNR estimation and Kα₂ applicability check (auto-skipped when
  width/separation > 10).
- Built-in PtCo L1₀ demo data (desensitized reconstruction of a measured
  pattern).

## Formula

```
D = K·λ / (β·cosθ)
```

- `K` — shape factor (default 0.89)
- `λ` — wavelength (default 1.540598 Å, Cu Kα₁)
- `β` — sample broadening after instrumental correction (radians)
- `θ` — Bragg angle (2θ/2)

## Usage

Open `index.html` in any modern browser. Import a two-column XRD file
(`.xy .xye .csv .txt .dat .asc .ras .json`) or click **Load demo data**.

## Algorithms & references

- Scherrer (1918); Cullity & Stock, *Elements of X-Ray Diffraction*, 3rd ed.
- DTU Nanolab — instrumental broadening in T2T geometry.
- SNIP background: Ryan et al. (1988).
- Levenberg–Marquardt least squares, Gaussian peak fitting — standard methods
  implemented from scratch.

See `LICENSE_AUDIT.md` for the full license/copyright audit.

## Data & applicability

These tools are developed from my own measured XRD datasets. They are currently
best adapted for PtCo alloy (L1₀ ordering) and Pt/C catalysts. I will keep
extending them to more sample types as my measurement data grows.

## License

MIT © 2026 Yu Peng
