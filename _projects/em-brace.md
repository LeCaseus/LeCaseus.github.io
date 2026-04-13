---
layout: project
title: eM-Brace
eyebrow: biomedical · thesis
status: none
description: "Carpal Tunnel Syndrome (CTS) is a prevalent musculoskeletal disorder caused by median nerve compression, leading to pain, numbness, and weakened grip strength. Conventional wrist splints often restrict wrist motion and lack therapeutic functions that promote recovery. This study introduces the eM-Brace, an autonomous wrist splint that integrates a surface electromyography (sEMG)-activated myofascial release massage system. sEMG sensors positioned on the Abductor Pollicis Brevis muscle detect rest conditions, triggering the massage mechanism only when the wrist is inactive. The device includes an Integrated Massager calibrated to deliver 1.36 kPa of therapeutic pressure, an Auto-Fit Module maintaining consistent support pressure of approximately 3.68 kPa, and a Motion Support Module that loosens during activity, allowing up to 10° flexion and 30° extension. Functional testing verified 100% accuracy in classifying muscle states and 80% accuracy in delivering target pressure. In beta testing with 15 participants subjected to induced CTS symptoms, 73% showed grip strength improvements exceeding 2.2 kg, and mean pain scores dropped from 3.27 to 0.33. The eM-Brace demonstrates a lightweight, noninvasive, and adaptive alternative to static splints."
thumbnail: /assets/portfolio_media/em-brace-snapshot.jpeg
date_range: 2024 – 2025
institution: Ateneo de Zamboanga University
type: Vargas & Salupado
pdf: /assets/em-brace-thesis.pdf
github: https://github.com/LeCaseus/eM-Brace_Codes
tags: [Carpal Tunnel Syndrome, sEMG, Myofascial Release, Wrist Splint]
---

<div class="project-section">
  <div class="section-label">manuscript</div>
  <div class="reader-toolbar">
    <div class="reader-nav">
      <button class="reader-btn" id="btn_prev" title="Previous page" disabled>&#8249;</button>
      <span class="reader-page-info" id="page_info">— / —</span>
      <button class="reader-btn" id="btn_next" title="Next page" disabled>&#8250;</button>
    </div>
    <div class="reader-zoom">
      <button class="reader-btn" id="btn_zoom_out" title="Zoom out">−</button>
      <span class="zoom-label" id="zoom_label">100%</span>
      <button class="reader-btn" id="btn_zoom_in" title="Zoom in">+</button>
      <button class="reader-btn reader-btn-fit" id="btn_zoom_fit" title="Fit to width">fit</button>
    </div>
  </div>
  <div class="reader-canvas-wrap" id="canvas_wrap">
    <div class="reader-loading" id="reader_loading">
      <div class="spinner"></div>
      <span>Loading manuscript</span>
    </div>
    <canvas id="pdf_canvas"></canvas>
  </div>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
<script>
  pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  const PDF_URL = "/assets/em-brace-thesis.pdf";
  let pdf_doc = null, current_page = 1, scale = 1.3;
  const canvas = document.getElementById("pdf_canvas");
  const ctx = canvas.getContext("2d");
  const loading = document.getElementById("reader_loading");
  const wrap = document.getElementById("canvas_wrap");
  function fit_scale() { return (wrap.clientWidth - 32) / 612; }
  function render_page(num) {
    pdf_doc.getPage(num).then((page) => {
      const viewport = page.getViewport({ scale });
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      page.render({ canvasContext: ctx, viewport }).promise.then(() => {
        loading.style.display = "none";
        canvas.style.display = "block";
        update_ui();
      });
    });
  }
  function update_ui() {
    document.getElementById("page_info").textContent = `${current_page} / ${pdf_doc.numPages}`;
    document.getElementById("btn_prev").disabled = current_page <= 1;
    document.getElementById("btn_next").disabled = current_page >= pdf_doc.numPages;
    document.getElementById("zoom_label").textContent = Math.round(scale * 100) + "%";
  }
  pdfjsLib.getDocument(PDF_URL).promise.then((pdf) => {
    pdf_doc = pdf;
    scale = fit_scale();
    render_page(current_page);
  }).catch(() => {
    loading.innerHTML = `<span>Could not load PDF — check the asset path.</span>`;
  });
  document.getElementById("btn_prev").addEventListener("click", () => { if (current_page > 1) { current_page--; render_page(current_page); } });
  document.getElementById("btn_next").addEventListener("click", () => { if (current_page < pdf_doc.numPages) { current_page++; render_page(current_page); } });
  document.getElementById("btn_zoom_in").addEventListener("click", () => { scale = Math.min(scale + 0.2, 3); render_page(current_page); });
  document.getElementById("btn_zoom_out").addEventListener("click", () => { scale = Math.max(scale - 0.2, 0.5); render_page(current_page); });
  document.getElementById("btn_zoom_fit").addEventListener("click", () => { scale = fit_scale(); render_page(current_page); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") { if (current_page < (pdf_doc?.numPages ?? 1)) { current_page++; render_page(current_page); } }
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") { if (current_page > 1) { current_page--; render_page(current_page); } }
  });
</script>