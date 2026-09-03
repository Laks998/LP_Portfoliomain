/* ==========================================================================
   COMMENT WIDGET — toggleable highlight-and-comment feature
   Requires the Supabase JS client loaded BEFORE this file:
   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

   FILL THESE IN before using — see supabase-setup.md for where to get them:
   ========================================================================== */
const CW_CONFIG = {
  supabaseUrl: "YOUR_SUPABASE_PROJECT_URL",      // e.g. https://xxxx.supabase.co
  supabaseAnonKey: "YOUR_SUPABASE_ANON_KEY",
  adminPassword: "CHOOSE_A_SIMPLE_PASSWORD"       // client-side gate only — see setup notes on its limits
};

(function () {
  if (typeof window.supabase === "undefined") {
    console.error("Comment widget: Supabase client script not found. Add the CDN <script> tag before comment-widget.js.");
    return;
  }

  const sb = window.supabase.createClient(CW_CONFIG.supabaseUrl, CW_CONFIG.supabaseAnonKey);

  let feedbackMode = false;
  let isAdmin = false;
  let openPopover = null;

  document.addEventListener("DOMContentLoaded", () => {
    buildToggle();
    document.querySelectorAll(".commentable").forEach(setupCommentableArea);
  });

  // ---------- Toggle button ----------
  function buildToggle() {
    const btn = document.createElement("button");
    btn.className = "cw-toggle";
    btn.innerHTML = `<span class="cw-toggle-dot"></span><span class="cw-toggle-text">Feedback</span>`;
    btn.addEventListener("click", () => {
      feedbackMode = !feedbackMode;
      btn.classList.toggle("is-active", feedbackMode);
      document.querySelectorAll(".commentable").forEach(el => {
        el.classList.toggle("cw-mode-active", feedbackMode);
      });
      closePopover();
      if (feedbackMode) {
        document.querySelectorAll(".commentable").forEach(loadPins);
      } else {
        document.querySelectorAll(".cw-pin").forEach(p => p.remove());
      }
    });
    document.body.appendChild(btn);
  }

  // ---------- Per-area setup ----------
  function setupCommentableArea(area) {
    const projectSlug = area.dataset.project;
    if (!projectSlug) {
      console.warn("Comment widget: .commentable element missing data-project attribute.", area);
      return;
    }

    area.addEventListener("click", (e) => {
      if (!feedbackMode) return;
      if (e.target.closest(".cw-pin") || e.target.closest(".cw-popover")) return;

      const rect = area.getBoundingClientRect();
      const xPct = ((e.clientX - rect.left) / rect.width) * 100;
      const yPct = ((e.clientY - rect.top) / rect.height) * 100;
      openNewCommentForm(area, projectSlug, xPct, yPct);
    });
  }

  // ---------- Load + render existing pins ----------
  async function loadPins(area) {
    const projectSlug = area.dataset.project;
    const { data, error } = await sb
      .from("comments")
      .select("*")
      .eq("project_slug", projectSlug)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Comment widget: failed to load pins.", error);
      return;
    }

    area.querySelectorAll(".cw-pin").forEach(p => p.remove());
    data.forEach((row, i) => renderPin(area, row, i + 1));
  }

  function renderPin(area, row, number) {
    const pin = document.createElement("div");
    pin.className = "cw-pin" + (row.resolved ? " cw-resolved" : "");
    pin.style.left = row.x_pct + "%";
    pin.style.top = row.y_pct + "%";
    pin.textContent = number;
    pin.addEventListener("click", (e) => {
      e.stopPropagation();
      openPinDetail(area, row, pin);
    });
    area.appendChild(pin);
  }

  // ---------- New comment popover ----------
  function openNewCommentForm(area, projectSlug, xPct, yPct) {
    closePopover();

    const pop = document.createElement("div");
    pop.className = "cw-popover";
    pop.style.left = xPct + "%";
    pop.style.top = yPct + "%";
    pop.innerHTML = `
      <div class="cw-popover-label">Leave a comment</div>
      <textarea placeholder="What should change here?"></textarea>
      <input type="text" class="cw-hp" tabindex="-1" autocomplete="off" />
      <div class="cw-popover-actions">
        <button type="button" class="cw-btn cw-btn-secondary cw-cancel">Cancel</button>
        <button type="button" class="cw-btn cw-btn-primary cw-submit">Post</button>
      </div>
    `;
    area.appendChild(pop);
    openPopover = pop;
    pop.querySelector("textarea").focus();

    pop.querySelector(".cw-cancel").addEventListener("click", closePopover);
    pop.querySelector(".cw-submit").addEventListener("click", async () => {
      const text = pop.querySelector("textarea").value.trim();
      const honeypot = pop.querySelector(".cw-hp").value;
      if (honeypot) return; // bot filled the hidden field — silently drop
      if (!text) return;

      const { error } = await sb.from("comments").insert({
        project_slug: projectSlug,
        x_pct: xPct,
        y_pct: yPct,
        comment: text,
        resolved: false
      });

      if (error) {
        console.error("Comment widget: failed to post comment.", error);
        return;
      }

      closePopover();
      loadPins(area);
    });
  }

  // ---------- Existing pin detail popover ----------
  function openPinDetail(area, row, pinEl) {
    closePopover();

    const pop = document.createElement("div");
    pop.className = "cw-popover";
    pop.style.left = row.x_pct + "%";
    pop.style.top = row.y_pct + "%";

    const date = new Date(row.created_at).toLocaleDateString();
    let adminControls = "";
    if (isAdmin) {
      adminControls = `<button type="button" class="cw-btn cw-btn-primary cw-resolve">
        ${row.resolved ? "Mark unresolved" : "Mark resolved"}
      </button>`;
    }

    pop.innerHTML = `
      <p>${escapeHtml(row.comment)}</p>
      <div class="cw-meta">${date}${row.resolved ? " — resolved" : ""}</div>
      <div class="cw-popover-actions" style="margin-top:0.5rem;">
        ${adminControls}
        <button type="button" class="cw-btn cw-btn-secondary cw-close">Close</button>
      </div>
      ${isAdmin ? "" : `<button type="button" class="cw-admin-link cw-unlock">Admin</button>`}
    `;
    area.appendChild(pop);
    openPopover = pop;

    pop.querySelector(".cw-close").addEventListener("click", closePopover);

    const resolveBtn = pop.querySelector(".cw-resolve");
    if (resolveBtn) {
      resolveBtn.addEventListener("click", async () => {
        const { error } = await sb
          .from("comments")
          .update({ resolved: !row.resolved })
          .eq("id", row.id);
        if (error) {
          console.error("Comment widget: failed to update resolved state.", error);
          return;
        }
        closePopover();
        loadPins(area);
      });
    }

    const unlockBtn = pop.querySelector(".cw-unlock");
    if (unlockBtn) {
      unlockBtn.addEventListener("click", () => {
        const attempt = prompt("Admin password:");
        if (attempt === CW_CONFIG.adminPassword) {
          isAdmin = true;
          openPinDetail(area, row, pinEl); // re-render with admin controls
        } else if (attempt !== null) {
          alert("Incorrect password.");
        }
      });
    }
  }

  function closePopover() {
    if (openPopover) {
      openPopover.remove();
      openPopover = null;
    }
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }
})();