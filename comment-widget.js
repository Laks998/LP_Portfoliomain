/* ==========================================================================
   COMMENT WIDGET — toggleable highlight-and-comment feature
   Requires the Supabase JS client loaded BEFORE this file:
   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

   FILL THESE IN before using — see supabase-setup.md for where to get them:
   ========================================================================== */
const CW_CONFIG = {
  supabaseUrl: "https://gkjjmuhmcoumrcpewrzh.supabase.co",
  supabaseAnonKey: "sb_publishable_8zYTe4NauJVtXFsvsJtqQg_lJMRhlpY",
  adminPassword: "IMTHEBOSS"       // client-side gate only — see setup notes on its limits
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
  let hintEl = null;

  // ---------- "Own comment" tracking (localStorage, per-browser, not real auth) ----------
  const CW_OWN_KEY = "cw_own_comments";

  function getOwnCommentIds() {
    try {
      return JSON.parse(localStorage.getItem(CW_OWN_KEY) || "[]");
    } catch (e) {
      return [];
    }
  }

  function addOwnCommentId(id) {
    const ids = getOwnCommentIds();
    ids.push(id);
    try {
      localStorage.setItem(CW_OWN_KEY, JSON.stringify(ids));
    } catch (e) {
      // localStorage unavailable (private browsing, etc.) — comment still
      // posts fine, the poster just won't see a self-delete option later.
    }
  }

  function removeOwnCommentId(id) {
    const ids = getOwnCommentIds().filter(existingId => existingId !== id);
    try {
      localStorage.setItem(CW_OWN_KEY, JSON.stringify(ids));
    } catch (e) {}
  }

  document.addEventListener("DOMContentLoaded", () => {
    buildToggle();
    document.querySelectorAll(".commentable").forEach(setupCommentableArea);
  });

  // ---------- Toggle button ----------
  function buildToggle() {
    const btn = document.createElement("button");
    btn.className = "cw-toggle";
    btn.innerHTML = `<span class="cw-toggle-dot"></span><span class="cw-toggle-text">Give your Feedback</span>`;

    hintEl = document.createElement("div");
    hintEl.className = "cw-hint";
    hintEl.textContent = "Click anywhere on the page to leave a comment";
    document.body.appendChild(hintEl);

    btn.addEventListener("click", () => {
      feedbackMode = !feedbackMode;
      btn.classList.toggle("is-active", feedbackMode);
      hintEl.classList.toggle("is-visible", feedbackMode);
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

  // Elements clicking on these should NOT open a comment — lets normal page
  // interactions (links, buttons, expandable sections, video controls, form
  // fields) keep working even while feedback mode is on.
  const CW_EXCLUDED_SELECTOR = ".cw-pin, .cw-popover, .cw-modal-overlay, a, button, summary, video, input, textarea, select";

  // ---------- Per-area setup ----------
  function setupCommentableArea(area) {
    const projectSlug = area.dataset.project;
    if (!projectSlug) {
      console.warn("Comment widget: .commentable element missing data-project attribute.", area);
      return;
    }

    area.addEventListener("click", (e) => {
      if (!feedbackMode) return;
      if (e.target.closest(CW_EXCLUDED_SELECTOR)) return;

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

      const { data, error } = await sb
        .from("comments")
        .insert({
          project_slug: projectSlug,
          x_pct: xPct,
          y_pct: yPct,
          comment: text,
          resolved: false
        })
        .select();

      if (error) {
        console.error("Comment widget: failed to post comment.", error);
        return;
      }

      if (data && data[0]) {
        addOwnCommentId(data[0].id);
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
    const isOwner = getOwnCommentIds().includes(row.id);
    const canManage = isAdmin || isOwner;

    let manageControls = "";
    if (canManage) {
      const resolveBtn = isAdmin
        ? `<button type="button" class="cw-btn cw-btn-primary cw-resolve">${row.resolved ? "Mark unresolved" : "Mark resolved"}</button>`
        : "";
      manageControls = `
        ${resolveBtn}
        <button type="button" class="cw-btn cw-btn-danger cw-delete">Delete</button>
      `;
    }

    pop.innerHTML = `
      <p>${escapeHtml(row.comment)}</p>
      <div class="cw-meta">${date}${row.resolved ? " — resolved" : ""}</div>
      <div class="cw-popover-actions" style="margin-top:0.5rem;">
        ${manageControls}
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

    const deleteBtn = pop.querySelector(".cw-delete");
    if (deleteBtn) {
      deleteBtn.addEventListener("click", async () => {
        const confirmed = await cwConfirm(
          "Are you sure you want to delete this feedback? This can't be undone.",
          "Delete Feedback?"
        );
        if (!confirmed) return;

        const { error } = await sb
          .from("comments")
          .delete()
          .eq("id", row.id);
        if (error) {
          console.error("Comment widget: failed to delete comment.", error);
          await cwAlert(
            "Couldn't delete this comment — check the console for details.",
            "Something went wrong"
          );
          return;
        }
        removeOwnCommentId(row.id);
        closePopover();
        loadPins(area);
      });
    }

    const unlockBtn = pop.querySelector(".cw-unlock");
    if (unlockBtn) {
      unlockBtn.addEventListener("click", async () => {
        const attempt = await cwPrompt(
          "Enter the admin password to manage comments on this page.",
          "Admin access",
          { isPassword: true }
        );
        if (attempt === null) return;
        if (attempt === CW_CONFIG.adminPassword) {
          isAdmin = true;
          openPinDetail(area, row, pinEl); // re-render with admin controls
        } else {
          await cwAlert("That password isn't correct.", "Incorrect password");
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

  // ==========================================================================
  // Custom modal dialogs — on-brand replacements for confirm() / alert() / prompt()
  // ==========================================================================

  function cwOpenOverlay() {
    const overlay = document.createElement("div");
    overlay.className = "cw-modal-overlay";

    const modal = document.createElement("div");
    modal.className = "cw-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");

    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => overlay.classList.add("is-visible"));

    return { overlay, modal };
  }

  function cwCloseOverlay(overlay, restoreFocusEl) {
    overlay.classList.remove("is-visible");
    document.body.style.overflow = "";
    window.setTimeout(() => overlay.remove(), 200);
    if (restoreFocusEl && typeof restoreFocusEl.focus === "function") {
      restoreFocusEl.focus();
    }
  }

  // Traps Tab within the modal's focusable elements while it's open.
  function cwTrapFocus(modal, e) {
    if (e.key !== "Tab") return;
    const focusable = modal.querySelectorAll("button, input, [tabindex]:not([tabindex='-1'])");
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function cwConfirm(message, title) {
    return new Promise((resolve) => {
      const lastFocused = document.activeElement;
      const { overlay, modal } = cwOpenOverlay();

      modal.innerHTML = `
        <div class="cw-modal-title">${escapeHtml(title || "Are you sure?")}</div>
        <p class="cw-modal-message">${escapeHtml(message)}</p>
        <div class="cw-modal-actions">
          <button type="button" class="cw-btn cw-btn-secondary cw-modal-cancel">Cancel</button>
          <button type="button" class="cw-btn cw-btn-danger cw-modal-ok">Delete</button>
        </div>
      `;

      const finish = (result) => {
        document.removeEventListener("keydown", onKeydown);
        cwCloseOverlay(overlay, lastFocused);
        resolve(result);
      };
      const onKeydown = (e) => {
        if (e.key === "Escape") finish(false);
        else cwTrapFocus(modal, e);
      };

      document.addEventListener("keydown", onKeydown);
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) finish(false);
      });
      modal.querySelector(".cw-modal-cancel").addEventListener("click", () => finish(false));
      modal.querySelector(".cw-modal-ok").addEventListener("click", () => finish(true));
      modal.querySelector(".cw-modal-ok").focus();
    });
  }

  function cwAlert(message, title) {
    return new Promise((resolve) => {
      const lastFocused = document.activeElement;
      const { overlay, modal } = cwOpenOverlay();

      modal.innerHTML = `
        <div class="cw-modal-title">${escapeHtml(title || "Notice")}</div>
        <p class="cw-modal-message">${escapeHtml(message)}</p>
        <div class="cw-modal-actions">
          <button type="button" class="cw-btn cw-btn-primary cw-modal-ok">OK</button>
        </div>
      `;

      const finish = () => {
        document.removeEventListener("keydown", onKeydown);
        cwCloseOverlay(overlay, lastFocused);
        resolve();
      };
      const onKeydown = (e) => {
        if (e.key === "Escape" || e.key === "Enter") finish();
        else cwTrapFocus(modal, e);
      };

      document.addEventListener("keydown", onKeydown);
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) finish();
      });
      modal.querySelector(".cw-modal-ok").addEventListener("click", finish);
      modal.querySelector(".cw-modal-ok").focus();
    });
  }

  function cwPrompt(message, title, options) {
    const opts = options || {};
    return new Promise((resolve) => {
      const lastFocused = document.activeElement;
      const { overlay, modal } = cwOpenOverlay();

      modal.innerHTML = `
        <div class="cw-modal-title">${escapeHtml(title || "Enter a value")}</div>
        <p class="cw-modal-message">${escapeHtml(message)}</p>
        <input
          type="${opts.isPassword ? "password" : "text"}"
          class="cw-modal-input"
          autocomplete="off"
        />
        <div class="cw-modal-actions">
          <button type="button" class="cw-btn cw-btn-secondary cw-modal-cancel">Cancel</button>
          <button type="button" class="cw-btn cw-btn-primary cw-modal-ok">Submit</button>
        </div>
      `;

      const input = modal.querySelector(".cw-modal-input");

      const finish = (result) => {
        document.removeEventListener("keydown", onKeydown);
        cwCloseOverlay(overlay, lastFocused);
        resolve(result);
      };
      const onKeydown = (e) => {
        if (e.key === "Escape") finish(null);
        else if (e.key === "Enter") finish(input.value);
        else cwTrapFocus(modal, e);
      };

      document.addEventListener("keydown", onKeydown);
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) finish(null);
      });
      modal.querySelector(".cw-modal-cancel").addEventListener("click", () => finish(null));
      modal.querySelector(".cw-modal-ok").addEventListener("click", () => finish(input.value));
      input.focus();
    });
  }
})();