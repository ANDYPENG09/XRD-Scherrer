const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {JSDOM,VirtualConsole}=require('jsdom');

const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
const errors=[];
const vc=new VirtualConsole();
vc.on('jsdomError',e=>errors.push(e));
const dom=new JSDOM(html,{
  runScripts:'dangerously',
  virtualConsole:vc,
  beforeParse(w){
    w.HTMLCanvasElement.prototype.getContext=()=>new Proxy({},{get:()=>()=>{}});
    w.URL.createObjectURL=()=>'blob:test';
    w.URL.revokeObjectURL=()=>{};
    w.HTMLAnchorElement.prototype.click=()=>{};
  }
});
const w=dom.window, doc=w.document, evalJS=s=>w.eval(s);

// 1. Initial load & backward-compatible parsing tests
assert.equal(errors.length,0,`XRD-Scherrer initial script errors: ${errors.map(e=>e.message).join('; ')}`);
assert.deepEqual(JSON.parse(JSON.stringify(evalJS('parse("Angle Intensity\\n40 1\\n41 2\\n42 1")'))),{x:[40,41,42],y:[1,2,1]});
assert.equal(evalJS('parse("42 1\\n41 2\\n40 1").x[0]'),40);
assert.equal(evalJS('parse(\'{"x":[40,41,42],"y":[1,2,1]}\').x.length'),3);
for(const text of ['40 1\n40 2\n41 1','40 1\n42 2\n41 1','40 0\n41 0\n42 0','40 1\n41 NaN\n42 1','40 1\n41 1e999\n42 1']){
  w.badText=text;
  assert.throws(()=>evalJS('parse(badText)'));
}

// 2. Analytic Gaussian Scherrer, Gaussian/Cauchy instrument correction, and Williamson-Hall (v1.1.0 regressions)
evalJS('state.x=[];state.y=[];for(let i=0;i<=2000;i++){const x=38+i*.002;state.x.push(x);state.y.push(10+100*Math.exp(-4*Math.log(2)*((x-40)/.5)**2));}onLoaded();');
const expected=0.89*1.540598/(0.5*Math.PI/180*Math.cos(40*Math.PI/360))/10;
assert(Math.abs(evalJS('analyze(38,42).D')/expected-1)<1e-4,'Analytic Gaussian Scherrer domain size');
evalJS("$('mode').value='integral';$('inst').value=.1;$('broadeningModel').value='gaussian';");
assert(Math.abs(evalJS('analyze(38,42).correctedDeg**2-(analyze(38,42).integralBreadth**2-.01)'))<1e-10,'Gaussian quadratic subtraction');
evalJS("$('broadeningModel').value='cauchy';");
assert(Math.abs(evalJS('analyze(38,42).correctedDeg-(analyze(38,42).integralBreadth-.1)'))<1e-10,'Cauchy linear subtraction');
assert.throws(()=>evalJS("$('inst').value=100;analyze(38,42)"));
evalJS("$('inst').value=0;$('broadeningModel').value='gaussian';$('mode').value='fwhm';");
evalJS("$('left').value=38;$('right').value=42;");
doc.getElementById('calc').click();
assert(evalJS('state.analysis.peaks[0].D')>0,'Single peak calc produces D>0');
assert.equal(evalJS('state.analysis.tool_version'),'1.2.1','Tool version is 1.2.1');
assert(evalJS('state.analysis.summary && state.analysis.summary.count===1 && state.analysis.summary.interval_low_nm<=state.analysis.summary.mean_nm && state.analysis.summary.interval_high_nm>=state.analysis.summary.mean_nm'),'Single-peak summary provides mean and deviation interval');

const wh=evalJS('williamsonHall([40,60,80].map(peak=>{const theta=peak*Math.PI/360;return{peak,correctedDeg:(.89*.1540598/50+.001*4*Math.sin(theta))/Math.cos(theta)*180/Math.PI};}),.89,1.540598)');
assert(Math.abs(wh.D_nm-50)<1e-8,'W-H recovers D=50 nm');
assert(Math.abs(wh.strain-0.001)<1e-10,'W-H recovers strain=0.001');
assert(Math.abs(wh.r2-1)<1e-10,'W-H R2=1');
assert.equal(evalJS('williamsonHall([{peak:40,correctedDeg:1}],.89,1.540598).D_nm'),null);
assert.equal(evalJS('williamsonHall([40,60,80].map(peak=>({peak,correctedDeg:(.02-.001*4*Math.sin(peak*Math.PI/360))/Math.cos(peak*Math.PI/360)*180/Math.PI})),.89,1.540598).D_nm'),null);

// 2b. Unit test summarizeSizes (arithmetic mean ± sample SD, area-weighted mean ± RMS deviation, min-max range)
const sumCheck=evalJS('summarizeSizes([{D:4,area:100},{D:6,area:300},{D:8,area:100}])');
assert.equal(sumCheck.count,3);
assert(Math.abs(sumCheck.mean_nm-6)<1e-12,'Arithmetic mean = 6');
assert(Math.abs(sumCheck.sd_nm-2)<1e-12,'Sample SD = 2');
assert(Math.abs(sumCheck.weighted_mean_nm-6)<1e-12,'Area-weighted mean = 6');
assert(Math.abs(sumCheck.weighted_sd_nm-Math.sqrt(1.6))<1e-12,'Area-weighted RMS deviation');
assert.equal(sumCheck.min_nm,4);assert.equal(sumCheck.max_nm,8);
assert.equal(sumCheck.interval_low_nm,4);assert.equal(sumCheck.interval_high_nm,8);

// 3. (220)+(202) overlapping doublet deconvolution: area recovery, endpoint underestimation & tetragonal c/a
const deconvCheck=evalJS(`(()=>{
  const xs=[];for(let i=0;i<=550;i++)xs.push(64+i*11/550);
  const A1=420, A2=240, w1=1.35, e1=0.55, w2=1.45, e2=0.50;
  const h1=A1/pvIntegralBreadth(w1,e1), h2=A2/pvIntegralBreadth(w2,e2);
  const ys=xs.map(x=>55-0.35*(x-64)+evalPV(x,h1,68.45,w1,e1)+evalPV(x,h2,70.46,w2,e2));
  const f=fitMultiPeakLM(xs,ys,[{label:'(220)',mu:68.3,fwhm:1.1,shift:1.5},{label:'(202)',mu:70.6,fwhm:1.1,shift:1.5}],{shape:'pvoigt',baseline:'linear'});
  return{r2:f.r2,total:f.totalFittedArea,endArea:f.endpointBaselineArea,A1:f.peaks[0].area,A2:f.peaks[1].area,lattice:f.lattice};
})()`);
assert(deconvCheck.r2>0.9999,'(220)+(202) fit R2 > 0.9999');
assert(Math.abs(deconvCheck.total-660)/660<0.005,'(220)+(202) total fitted area within 0.5%');
assert(Math.abs(deconvCheck.A1-420)/420<0.01,'(220) sub-peak area within 1%');
assert(Math.abs(deconvCheck.A2-240)/240<0.01,'(202) sub-peak area within 1%');
assert(deconvCheck.endArea<deconvCheck.total*0.92,'Traditional endpoint baseline underestimates broad doublet area');
assert.equal(deconvCheck.lattice.pair,'(220)+(202)');
assert(Math.abs(deconvCheck.lattice.a-3.8737)<0.005,'Lattice a recovered from (220)+(202)');
assert(Math.abs(deconvCheck.lattice.c-3.6870)<0.005,'Lattice c recovered from (220)+(202)');
assert(Math.abs(deconvCheck.lattice.cOverA-0.9518)<0.003,'c/a recovered from (220)+(202)');

// 4. Lognormal spherical CSD recovery via NNLS
const lognCheck=evalJS(`(()=>{
  const lam=1.540598, lamNm=lam/10, center=40.304, D0=8.0, sig=0.30;
  const xs=[];for(let i=0;i<=400;i++)xs.push(35+i*10.6/400);
  const prof=sphericalProfile2Theta(xs,center,lam,lognormalSphereWeights(D0,sig,51));
  const s0=2*Math.sin(center*Math.PI/360)/lamNm;
  const sArr=xs.map(tt=>2*Math.sin(tt*Math.PI/360)/lamNm-s0);
  const csd=invertCSD_NNLS(sArr,prof,{Dmin:1,Dmax:60,regMode:'auto'});
  return{r2:csd.r2,DN:csd.D_N,DA:csd.D_A,DV:csd.D_V,sigV:csd.sigma_V,trueDN:D0*Math.exp(.5*sig*sig),trueDA:D0*Math.exp(2.5*sig*sig),trueDV:D0*Math.exp(3.5*sig*sig)};
})()`);
assert(lognCheck.r2>0.998,'Lognormal CSD R2 > 0.998');
assert(lognCheck.sigV>0,'Lognormal CSD computes positive sigma_V');
assert(Math.abs(lognCheck.DV-lognCheck.trueDV)/lognCheck.trueDV<0.12,'Lognormal NNLS <D>V within 12%');
assert(Math.abs(lognCheck.DA-lognCheck.trueDA)/lognCheck.trueDA<0.15,'Lognormal NNLS <D>A within 15%');
assert(Math.abs(lognCheck.DN-lognCheck.trueDN)/lognCheck.trueDN<0.25,'Lognormal NNLS <D>N within 25%');

// 5. Bimodal spherical CSD recovery & mode detection + instrument convolution
const bimCheck=evalJS(`(()=>{
  const lam=1.540598, lamNm=lam/10, center=40.304;
  const xs=[];for(let i=0;i<=500;i++)xs.push(33+i*14.6/500);
  const wBim=[...lognormalSphereWeights(4.0,0.16,25).map(([D,w])=>[D,0.45*w]),...lognormalSphereWeights(18.0,0.15,25).map(([D,w])=>[D,0.55*w])];
  const prof=sphericalProfile2Theta(xs,center,lam,wBim);
  const s0=2*Math.sin(center*Math.PI/360)/lamNm;
  const sArr=xs.map(tt=>2*Math.sin(tt*Math.PI/360)/lamNm-s0);
  const csd=invertCSD_NNLS(sArr,prof,{Dmin:1,Dmax:60,regMode:'auto'});
  const instBetaS=(Math.cos(center*Math.PI/360)/lamNm)*(0.15*Math.PI/180);
  const kG=convolvedSphericalKernel(sArr,12,instBetaS,'gaussian','integral');
  const csdG=invertCSD_NNLS(sArr,kG,{Dmin:1,Dmax:50,instBetaS,instModel:'gaussian',widthMode:'integral',regMode:'low'});
  return{bimodal:csd.bimodal,modes:csd.modes,convDV:csdG.D_V};
})()`);
assert.equal(bimCheck.bimodal,true,'Bimodal spherical CSD detects two modes');
assert(bimCheck.modes[0].D_peak>2.5&&bimCheck.modes[0].D_peak<6.5,'Small mode near 4 nm');
assert(bimCheck.modes[1].D_peak>13&&bimCheck.modes[1].D_peak<25,'Large mode near 18 nm');
assert(Math.abs(bimCheck.convDV-12)<1.5,'Instrument-convolved 12 nm sphere recovered');

// 6. Krill-Birringer via de Keijser (1982): honest Gaussian suppression vs valid Voigt lognormal
const kbGauss=evalJS('krillBirringerCSD(40.3, 0.8, 0.8*SQRT_PI_4LN2, 1.540598, 0, "gaussian", "integral")');
assert.equal(kbGauss.suppressed,true,'Krill-Birringer honestly suppresses variance on pure Gaussian');
assert.equal(kbGauss.sigma,null);
assert.equal(kbGauss.D_N,null);
const kbVoigt=evalJS('krillBirringerCSD(40.3, 0.8, pvIntegralBreadth(0.8, 0.75), 1.540598, 0, "gaussian", "integral")');
assert.equal(kbVoigt.suppressed,false,'Krill-Birringer returns lognormal parameters on Lorentzian-rich Voigt');
assert(kbVoigt.D_V>kbVoigt.D_A&&kbVoigt.D_A>kbVoigt.D_N&&kbVoigt.sigma>0);

// 7. UI end-to-end: Tab 1 PtCo (220)+(202) deconv, Tab 2 Deconv+CSD & CSD CSV, Tab 3 PtCo L10 5-peak W-H, exports & invalidation
doc.getElementById('demoBimodalBtn').click();
doc.getElementById('calcMode').value='ptco';
doc.getElementById('calcMode').dispatchEvent(new w.Event('change',{bubbles:true}));
assert.equal(Number(doc.getElementById('left').value),64);
assert.equal(Number(doc.getElementById('right').value),75);
doc.getElementById('calc').click();
assert.equal(evalJS('state.analysis.method'),'ptco_deconv');
assert.equal(evalJS('state.analysis.peaks.length'),2);
assert(evalJS('state.analysis.summary.count===2 && state.analysis.summary.weighted_mean_nm>0'),'PtCo deconv summary populated');
assert(doc.getElementById('singleResult').innerHTML.includes('summary-box'),'PtCo deconv renders final summary box');
assert(evalJS('state.analysis.lattice.cOverA')>0.9&&evalJS('state.analysis.lattice.cOverA')<1.0);

// Tab 2: Bimodal (111) preset -> Deconv -> Composite CSD -> Export CSD CSV
doc.getElementById('calcMode').value='standard';
doc.getElementById('calcMode').dispatchEvent(new w.Event('change',{bubbles:true}));
doc.getElementById('deconvTab').click();
doc.getElementById('presetBimodal').click();
doc.getElementById('runDeconv').click();
assert.equal(evalJS('state.analysis.method'),'deconvolution');
assert(doc.getElementById('deconvResult').innerHTML.includes('summary-box'),'Deconv renders final summary box');
assert.equal(doc.getElementById('csdTarget').value,'composite','Co-centered bimodal defaults CSD target to composite');
assert.equal(doc.getElementById('exportCSDCSV').disabled,true,'CSD CSV disabled before CSD runs');
doc.getElementById('runCSD').click();
assert.equal(evalJS('state.analysis.csd.nnls.bimodal'),true,'Bimodal demo (111) CSD detects bimodal modes');
assert(evalJS('state.analysis.csd.nnls.sigma_V')>0,'CSD stores sigma_V');
assert(doc.getElementById('csdResult').innerHTML.includes('summary-box'),'CSD renders final summary box');
assert.equal(doc.getElementById('exportCSDCSV').disabled,false,'CSD CSV enabled after CSD runs');
assert(evalJS('csdCSV(state.analysis.csd)').includes('D_nm'),'CSD CSV has header');
assert(evalJS('analysisCSV(state.analysis)').includes('summary_mean_nm'),'Analysis CSV includes summary columns');
doc.getElementById('exportJSON').click();
doc.getElementById('exportCSV').click();
doc.getElementById('exportCSDCSV').click();

// Tab 3: PtCo L10 5-peak W-H
doc.getElementById('demo').click();
doc.getElementById('multiTab').click();
doc.getElementById('ptcoL10').click();
doc.getElementById('multiCalc').click();
assert.equal(evalJS('state.analysis.method'),'multi_peak');
assert.equal(evalJS('state.analysis.peaks.length'),5,'PtCo L10 preset extracts 5 reflections for W-H');
assert.equal(evalJS('state.analysis.summary.count'),5,'Multi-peak summary aggregates all 5 peaks');
assert(evalJS('state.analysis.summary.min_nm<=state.analysis.summary.mean_nm && state.analysis.summary.mean_nm<=state.analysis.summary.max_nm'));
assert(doc.getElementById('multiResult').innerHTML.includes('summary-box'),'Multi-peak renders final summary box');
assert(evalJS('state.analysis.lattice.pair')==='(200)+(002)'||evalJS('state.analysis.lattice.pair')==='(220)+(202)');

// Language toggle & input invalidation
doc.getElementById('langToggle').click();
assert.equal(evalJS('state.lang'),'zh');
doc.getElementById('langToggle').click();
assert.equal(evalJS('state.lang'),'en');

const input=doc.querySelector('input[type=number]');
input.dispatchEvent(new w.Event('input',{bubbles:true}));
assert.equal(evalJS('state.analysis'),null,'Input edit invalidates state.analysis');
assert.equal(doc.getElementById('exportCSV').disabled,true,'Input edit disables exportCSV');
assert.equal(doc.getElementById('exportCSDCSV').disabled,true,'Input edit disables exportCSDCSV');

console.log('XRD-Scherrer v1.2.1: parsing, analytic Scherrer, size summaries, (220)+(202) deconvolution, lattice c/a, NNLS lognormal & bimodal CSD, Krill-Birringer suppression, L10 5-peak W-H, exports and invalidation passed');
dom.window.close();
