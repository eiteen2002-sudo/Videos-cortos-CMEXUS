// Player + editor del video maestro FB_V01. Lee window.VIDEO_CONTENT (content/video-01.content.js).
// Cambios del editor se guardan en localStorage; "Descargar contenido" genera un nuevo .content.js para el repo.
(function () {
  const LS = 'FB_V01_content';
  let C = window.VIDEO_CONTENT;
  try { const s = localStorage.getItem(LS); if (s) C = JSON.parse(s); } catch (e) {}
  const overrides = {}; // nombre de archivo -> object URL (imágenes cargadas en sesión)
  const $ = (s) => document.querySelector(s);
  const el = (h) => { const d = document.createElement('div'); d.innerHTML = h.trim(); return d.firstChild; };
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const A = (f) => overrides[f] || `${C.assetDir}/${encodeURIComponent(f)}?v=${C.assetVersion}`;
  const opt = { caps: true, prop: false, guides: false };
  let t = 0, playing = false, last = 0, cur = -1, sel = 0;

  const total = () => C.scenes.reduce((a, s) => a + Number(s.duration || 0), 0);
  const fmt = (x) => `${Math.floor(x / 60)}:${String(Math.floor(x % 60)).padStart(2, '0')}`;
  const sceneAt = (x) => { let a = 0; for (let i = 0; i < C.scenes.length; i++) { const d = Number(C.scenes[i].duration); if (x < a + d) return [i, x - a]; a += d; } return [C.scenes.length - 1, Number(C.scenes.at(-1).duration)]; };
  const startOf = (i) => C.scenes.slice(0, i).reduce((a, s) => a + Number(s.duration), 0);

  const photo = (im, kb, dur) => im && im.file
    ? `<div class="ph ${kb ? 'kb' : ''}" style="--dur:${dur}s"><img src="${A(im.file)}" style="object-position:${esc(im.pos || '50% 50%')};transform:scale(${im.zoom || 1})" onerror="this.remove()"><div class="miss">${esc(im.file)}<br>(imagen no encontrada)</div></div>`
    : `<div class="ph"><div class="miss">Sin imagen</div></div>`;
  const logos = (s) => {
    if (s.logos === 'none' || !s.logos) return '';
    const L = C.logos, g = s.logos === 'lockup';
    return `<div class="logos ${s.logos === 'fulbright' ? '' : ''}"><img src="${A(L.fulbright)}" onerror="this.style.display='none'">${g ? `<img src="${A(L.comexus)}" onerror="this.style.display='none'">` : ''}</div>`;
  };
  const tag = (s) => (s.validar || (s.stats || []).some((x) => x.validar)) ? '<div class="tag">[POR VALIDAR]</div>' : '';

  const layouts = {
    photo: (s) => `${photo(s.images[0], true, s.duration)}<div class="shade"></div><div class="txt" style="bottom:200px"><h1 class="h1">${esc(s.headline)}</h1><p class="h2">${esc(s.subhead)}</p></div>`,
    stats: (s) => `<div style="position:absolute;inset:0;background:var(--gray)"></div><div class="txt dark" style="top:150px;color:var(--ocean)"><h1 class="h1">${esc(s.headline)}</h1></div><div class="stats">${(s.stats || []).map((x) => `<div class="stat"><b>${esc(x.value)}</b><span>${esc(x.label)}</span></div>`).join('')}</div>`,
    portraits: (s) => `<div class="txt dark" style="top:100px;color:var(--ocean)"><h1 class="h1" style="font-size:72px">${esc(s.headline)}</h1></div><div class="cards" style="top:260px;bottom:300px">${s.images.map((im) => `<div class="card">${photo(im)}<div class="cap">${esc(im.label)}<small>${esc(im.role || '')}</small></div></div>`).join('')}</div>`,
    bridge: (s) => { const n = s.nodes || ['', '']; return `<div class="sc bridge" style="animation:none"><div class="nodes"><div class="node" style="left:-25px"></div><div class="node" style="right:-25px"></div></div><div class="nodel" style="left:260px">${esc(n[0])}</div><div class="nodel" style="left:1660px">${esc(n[1])}</div><div class="txt" style="top:450px"><h1 class="h1" style="font-size:150px">${esc(s.headline)}</h1><p class="h2">${esc(s.subhead)}</p></div></div>`; },
    programs: (s) => `<div class="txt dark" style="top:90px;color:var(--ocean)"><h1 class="h1" style="font-size:72px">${esc(s.headline)}</h1></div><div class="cards">${s.images.map((im) => `<div class="card">${photo(im)}<div class="cap">${esc(im.label)}</div></div>`).join('')}</div>`,
    closing: (s) => `<div class="txt dark" style="top:330px;color:var(--ocean)"><h1 class="h1" style="color:var(--legacy)">${esc(s.headline)}</h1><p class="h2" style="font-weight:400">${esc(s.subhead)}</p></div>`
  };

  function sentences(s) {
    const txt = (opt.prop && s.vo_propuesta) || s.vo || '';
    return txt.match(/[^.!?]+[.!?]+(\s|$)|[^.!?]+$/g)?.map((x) => x.trim()).filter(Boolean) || [];
  }
  function caption(s, local) {
    const ss = sentences(s); if (!ss.length) return '';
    const w = ss.map((x) => x.length), tot = w.reduce((a, b) => a + b, 0);
    let acc = 0; const frac = local / Number(s.duration);
    for (let i = 0; i < ss.length; i++) { acc += w[i] / tot; if (frac <= acc) return ss[i]; }
    return ss.at(-1);
  }

  function renderScene(i) {
    const s = C.scenes[i], st = $('#stage');
    const body = (layouts[s.layout] || layouts.photo)(s);
    const wrap = s.layout === 'bridge' ? body : `<div class="sc">${body}${logos(s)}</div>`;
    st.innerHTML = wrap + '<div id="tag"></div><div id="cc"></div><div id="gd"></div>';
    $('#tag').innerHTML = tag(s); cur = i;
  }
  function frame() {
    const [i, local] = sceneAt(t);
    if (i !== cur) renderScene(i);
    $('#cc').innerHTML = opt.caps ? `<div class="cc">${esc(caption(C.scenes[i], local))}</div>` : '';
    $('#gd').innerHTML = opt.guides ? '<div class="guides"></div>' : '';
    $('#time').textContent = `${fmt(t)} / ${fmt(total())}`;
    $('#seek').value = (t / total()) * 1000;
  }
  function tick(now) { if (playing) { t += (now - last) / 1000; last = now; if (t >= total()) { t = total() - 0.01; playing = false; $('#play').textContent = '▶'; } frame(); } requestAnimationFrame(tick); }
  function fit() { const f = $('.stage-frame'); $('#stage').style.transform = `scale(${f.clientWidth / 1920})`; }
  function refresh(keepEditor) { cur = -1; frame(); if (!keepEditor) buildEditor(); }
  function seekTo(x) { t = Math.max(0, Math.min(total() - 0.01, x)); cur = -1; frame(); }

  // ---- Editor ----
  const save = () => { try { localStorage.setItem(LS, JSON.stringify(C)); } catch (e) {} };
  function field(label, key, obj, type, after) {
    const id = 'f' + Math.random().toString(36).slice(2);
    const html = type === 'area' ? `<textarea id="${id}">${esc(obj[key])}</textarea>` : `<input id="${id}" type="${type === 'num' ? 'number' : 'text'}" value="${esc(obj[key])}">`;
    return { html: `<label for="${id}">${label}</label>${html}`, bind() { $('#' + id).oninput = (e) => { obj[key] = type === 'num' ? Number(e.target.value) : e.target.value; save(); after ? after() : refresh(true); }; } };
  }
  function buildEditor() {
    const ed = $('#editor'), s = C.scenes[sel], binds = [];
    const F = (...a) => { const f = field(...a); binds.push(f.bind); return f.html; };
    ed.innerHTML = `<h3>Editor de contenido</h3>
      <p class="hint">Edita guion, textos, imágenes y duraciones. Se guarda en este navegador; “Descargar contenido” genera el archivo para el repo.</p>
      <div class="tabs">${C.scenes.map((x, i) => `<button class="${i === sel ? 'on' : ''}" data-i="${i}">${esc(x.id.replace('ESC', ''))} ${esc(x.name)}</button>`).join('')}</div>
      <div class="row" style="margin-top:8px"><button data-a="add" class="ghost">+ Escena</button><button data-a="dup" class="ghost">Duplicar</button><button data-a="del" class="ghost">Eliminar</button><button data-a="up" class="ghost">↑</button><button data-a="down" class="ghost">↓</button></div>
      <div class="sec"><h3>Escena ${esc(s.id)}</h3>
      ${F('Nombre', 'name', s, 'text', () => { refresh(true); renderTabs(); })}
      <label>Layout</label><select id="lay">${Object.keys(layouts).map((l) => `<option ${l === s.layout ? 'selected' : ''}>${l}</option>`).join('')}</select>
      ${F('Duración (s)', 'duration', s, 'num')}
      <label>Logos</label><select id="logo">${['none', 'fulbright', 'lockup'].map((l) => `<option ${l === (s.logos || 'none') ? 'selected' : ''}>${l}</option>`).join('')}</select>
      <label><input type="checkbox" id="val" ${s.validar ? 'checked' : ''}> Marcar [POR VALIDAR]</label>
      ${F('Título', 'headline', s, 'text')}${F('Subtítulo / fecha / URL', 'subhead', s, 'text')}</div>
      <div class="sec"><h3>Voiceover y captions</h3>
      ${F('VO actual', 'vo', s, 'area')}${F('VO propuesto (voz activa, pendiente de aprobación)', 'vo_propuesta', s, 'area')}
      <button data-a="applyprop" class="ghost" style="margin-top:6px">Usar propuesta como VO actual</button></div>
      ${s.layout === 'stats' ? `<div class="sec"><h3>Cifras</h3>${(s.stats || []).map((x, i) => `<div class="imgrow">${F('Valor', 'value', x, 'text')}${F('Etiqueta', 'label', x, 'text')}<label><input type="checkbox" data-sv="${i}" ${x.validar ? 'checked' : ''}> [POR VALIDAR]</label><button data-sd="${i}" class="ghost">Quitar</button></div>`).join('')}<button data-a="addstat" class="ghost">+ Cifra</button></div>` : ''}
      <div class="sec"><h3>Imágenes</h3>${(s.images || []).map((im, i) => `<div class="imgrow">
        ${F('Archivo (en ' + esc(C.assetDir) + ')', 'file', im, 'text')}
        ${'label' in im || s.layout === 'portraits' || s.layout === 'programs' ? F('Pie / nombre', 'label', im, 'text') : ''}
        ${s.layout === 'portraits' ? F('Rol', 'role', im, 'text') : ''}
        ${F('Encuadre (object-position)', 'pos', im, 'text')}${F('Zoom', 'zoom', im, 'num')}
        <div class="row" style="margin-top:6px"><input type="file" accept="image/*" data-up="${i}"><button data-id="${i}" class="ghost">Quitar</button></div></div>`).join('')}
        <button data-a="addimg" class="ghost">+ Imagen</button>
        <p class="hint">Subir un archivo solo lo previsualiza en esta sesión; para que quede en el repo, guarda ese archivo en ${esc(C.assetDir)}/ con el nombre indicado y sube la versión de assets.</p>
        ${F('Versión de assets (cache-bust ?v=)', 'assetVersion', C, 'num', () => refresh(true))}</div>
      <div class="sec"><h3>Proyecto</h3><div class="row"><button data-a="dl">Descargar contenido</button><button data-a="reset" class="ghost">Restaurar original</button></div></div>`;
    binds.forEach((b) => b());
    ed.querySelectorAll('.tabs button').forEach((b) => b.onclick = () => { sel = +b.dataset.i; seekTo(startOf(sel)); buildEditor(); });
    $('#lay').onchange = (e) => { s.layout = e.target.value; save(); refresh(true); buildEditor(); };
    $('#logo').onchange = (e) => { s.logos = e.target.value; save(); refresh(true); };
    $('#val').onchange = (e) => { s.validar = e.target.checked; save(); refresh(true); };
    ed.querySelectorAll('[data-sv]').forEach((c) => c.onchange = () => { s.stats[+c.dataset.sv].validar = c.checked; save(); refresh(true); });
    ed.querySelectorAll('[data-sd]').forEach((b) => b.onclick = () => { s.stats.splice(+b.dataset.sd, 1); save(); refresh(); });
    ed.querySelectorAll('[data-id]').forEach((b) => b.onclick = () => { s.images.splice(+b.dataset.id, 1); save(); refresh(); });
    ed.querySelectorAll('[data-up]').forEach((inp) => inp.onchange = () => { const f = inp.files[0], im = s.images[+inp.dataset.up]; if (!f) return; if (!im.file) im.file = f.name; overrides[im.file] = URL.createObjectURL(f); refresh(true); });
    ed.querySelectorAll('[data-a]').forEach((b) => b.onclick = () => action(b.dataset.a));
  }
  const renderTabs = () => { const ed = $('#editor'); ed.querySelectorAll('.tabs button').forEach((b, i) => b.textContent = `${C.scenes[i].id.replace('ESC', '')} ${C.scenes[i].name}`); };
  function action(a) {
    const s = C.scenes[sel];
    if (a === 'add') { C.scenes.splice(sel + 1, 0, { id: 'ESC' + String(C.scenes.length + 1).padStart(2, '0'), name: 'Nueva', layout: 'photo', duration: 10, logos: 'none', headline: 'Nuevo título', subhead: '', images: [{ file: '', pos: '50% 50%', zoom: 1 }], vo: '', vo_propuesta: '' }); sel++; }
    if (a === 'dup') { C.scenes.splice(sel + 1, 0, JSON.parse(JSON.stringify(s))); sel++; }
    if (a === 'del' && C.scenes.length > 1 && confirm('¿Eliminar esta escena?')) { C.scenes.splice(sel, 1); sel = Math.max(0, sel - 1); }
    if (a === 'up' && sel > 0) { [C.scenes[sel - 1], C.scenes[sel]] = [C.scenes[sel], C.scenes[sel - 1]]; sel--; }
    if (a === 'down' && sel < C.scenes.length - 1) { [C.scenes[sel + 1], C.scenes[sel]] = [C.scenes[sel], C.scenes[sel + 1]]; sel++; }
    if (a === 'applyprop') s.vo = s.vo_propuesta;
    if (a === 'addstat') (s.stats = s.stats || []).push({ value: '0', label: 'Label', validar: true });
    if (a === 'addimg') (s.images = s.images || []).push({ file: '', pos: '50% 50%', zoom: 1 });
    if (a === 'reset' && confirm('¿Descartar los cambios locales y volver al contenido del repo?')) { localStorage.removeItem(LS); location.reload(); return; }
    if (a === 'dl') {
      const blob = new Blob([`// Contenido editable del Video 1 (FB_V01).\nwindow.VIDEO_CONTENT = ${JSON.stringify(C, null, 2)};\n`], { type: 'text/javascript' });
      const u = document.createElement('a'); u.href = URL.createObjectURL(blob); u.download = 'video-01.content.js'; u.click(); return;
    }
    save(); cur = -1; seekTo(Math.min(t, total() - 0.01)); buildEditor();
  }

  $('#play').onclick = () => { playing = !playing; last = performance.now(); if (t >= total() - 0.02) t = 0; $('#play').textContent = playing ? '❚❚' : '▶'; };
  $('#seek').oninput = (e) => seekTo((e.target.value / 1000) * total());
  $('#optCaps').onchange = (e) => { opt.caps = e.target.checked; frame(); };
  $('#optProp').onchange = (e) => { opt.prop = e.target.checked; frame(); };
  $('#optGuides').onchange = (e) => { opt.guides = e.target.checked; frame(); };
  document.addEventListener('keydown', (e) => { if (e.code === 'Space' && !/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) { e.preventDefault(); $('#play').click(); } });
  window.addEventListener('resize', fit);
  fit(); frame(); buildEditor(); requestAnimationFrame(tick);
})();
