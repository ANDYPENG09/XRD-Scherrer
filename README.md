# XRD-Scherrer

Offline XRD **coherently diffracting domain-size** analysis. Single-file HTML with Scherrer, multi-peak and isotropic Williamson–Hall modes. **v1.1.0**.

**[Open the tool](https://andypeng09.github.io/xrd-toolkit/demos/scherrer/)** · [Download HTML](https://raw.githubusercontent.com/ANDYPENG09/XRD-Scherrer/main/index.html) · [XRD Toolkit](https://andypeng09.github.io/xrd-toolkit/)

## What it computes

- Scherrer: D = Kλ / (β cosθ), with θ = 2θ/2 and β in radians.
- Endpoint-baseline integration or SNIP baseline + Gaussian **width approximation**. The SNIP mode infers a Gaussian area from peak height/FWHM; it is not a nonlinear Gaussian fit.
- FWHM or integral breadth. Instrument correction is selected independently: quadratic subtraction for a Gaussian profile, linear for a Cauchy profile. Supply instrumental width of the same width definition; mixed profiles require a more complete treatment.
- Multi-peak isotropic Williamson–Hall: β cosθ = Kλ/D + 4ε sinθ. At least three distinct clean same-phase reflections; return intercept, slope, R², D and strain. Nonpositive intercepts/negative strain suppress physical outputs rather than being converted to positive values.
- PtCo (220) empirical cross-check with a positive TEM calibration factor C. (220) is a **fundamental** reflection; broadening/overlap/anisotropy determine its suitability.
- CSV/JSON exports with units and settings; input edits invalidate old results.

**Kα₂ stripping is not implemented.** Use monochromated or externally corrected data. Scherrer domain size is not particle diameter; microstrain, faults, anisotropy and overlap can bias it. A W-H line fit and high R² do not validate those assumptions.

## Use

Open `index.html`, load the synthetic demo or your numeric-text/JSON scan, check peak windows, choose width and instrumental-profile settings, and calculate. For W-H, add at least three isolated reflections. Compare (111)/(220) with caution if split or overlapping fundamentals are present.

Text: `.xy .xye .csv .txt .dat .asc .ras`. JSON: paired `x`/`y` arrays or point pairs/objects. Descending scans are normalized; nonfinite, all-zero, duplicate and nonmonotonic input is rejected. Incomplete FWHM crossings require a wider region.

## Validation

```bash
npm ci
npm test
```

Regressions recover the analytic Gaussian Scherrer width and a synthetic W-H case (D=50 nm, ε=0.001), exercise both instrument-profile corrections, reject nonphysical cases, and check parsing, exports and result invalidation. DOM/canvas mocks do not verify browser-pixel rendering.

References: Scherrer (1918); Williamson & Hall, Acta Metallurgica 1 (1953), 22–31, [doi:10.1016/0001-6160(53)90006-6](https://doi.org/10.1016/0001-6160(53)90006-6); Cullity & Stock, *Elements of X-Ray Diffraction*; Ryan et al. (1988), SNIP baseline.

[Changelog](CHANGELOG.md) · [License audit](LICENSE_AUDIT.md) · [MIT License](LICENSE)
