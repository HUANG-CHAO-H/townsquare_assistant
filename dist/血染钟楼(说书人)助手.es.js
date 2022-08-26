/*! 
// ==UserScript==
// @name         血染钟楼(说书人)助手
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  向https://www.imdodo.com/tools/clocktower/页面注入一些JavaScript代码，来帮助说书人完成一些自动化操作，让说书人能够更加高效的工作
// @author       huangchao.hello
// @match        https://www.imdodo.com/tools/clocktower/
// @require      https://unpkg.com/react@18/umd/react.production.min.js
// @require      https://unpkg.com/react-dom@18/umd/react-dom.production.min.js
// @require      https://unpkg.com/@douyinfe/semi-ui@2.17.1/dist/umd/semi-ui.min.js
// @require      https://unpkg.com/@douyinfe/semi-icons@2.17.1/dist/umd/semi-icons.min.js
// @require      https://unpkg.com/@douyinfe/semi-illustrations@2.15.0/dist/umd/semi-illustrations.min.js
// @icon         <$ICON$>
// ==/UserScript==
 */
import R, { useState as m, useEffect as T, useMemo as H, useContext as V, useRef as W, useCallback as G } from "react";
import Y from "react-dom";
import { Table as X, Avatar as l, Badge as B, Tooltip as g, Button as k, Layout as K, Row as I, Col as w, TextArea as Q, SideSheet as Z } from "@douyinfe/semi-ui";
import { IconCustomerSupport as ee } from "@douyinfe/semi-icons";
var x = {}, _ = Y;
x.createRoot = _.createRoot, x.hydrateRoot = _.hydrateRoot;
const O = /* @__PURE__ */ new Set();
function P(e) {
  if (O.has(e))
    return;
  const t = document.createElement("link");
  t.rel = "stylesheet", t.type = "text/css", t.href = e, document.head.appendChild(t), O.add(e);
}
const N = /* @__PURE__ */ new Map();
async function te(e) {
  let t = N.get(e);
  if (t)
    return t;
  const n = await fetch(e);
  if (n.status !== 200) {
    console.error("\u52A0\u8F7DJSON\u8D44\u6E90\u5931\u8D25");
    return;
  }
  return t = await n.json(), N.set(e, t), t;
}
function S(e) {
  return new Promise((t) => setTimeout(t, e));
}
function p(e) {
  if (!e)
    return console.error("dispatchClickEvent Error: element \u4E0D\u5B58\u5728"), Promise.resolve(!1);
  const t = new MouseEvent("click", {
    bubbles: !0,
    cancelable: !0
  });
  return new Promise((n) => {
    setTimeout(() => n(!1), 50), e.addEventListener("click", () => n(!0), { once: !0 }), e.dispatchEvent(t);
  });
}
let h;
async function ne() {
  if (h)
    return h;
  const e = await te("https://raw.githubusercontent.com/bra1n/townsquare/develop/src/roles.json");
  if (e instanceof Array) {
    h = {};
    for (const t of e)
      h[t.id] = t;
    return h;
  }
}
function F() {
  return document.querySelector("div.modal-backdrop.game-state");
}
function re() {
  return document.querySelector("div.df-chat-detail");
}
async function D(e = !0) {
  let t = F();
  if (e) {
    if (t)
      return;
  } else if (!t)
    return;
  let n = null;
  for (let r = 0; r < 3; r++) {
    const u = document.querySelectorAll("div.menu > ul > li");
    if (!u || !u.length)
      throw new Error("\u672A\u6355\u83B7\u5230li\u6570\u7EC4");
    if (u.length === 9 && u[4].innerText.includes("JSON")) {
      n = u[4];
      break;
    }
    const s = document.querySelector("div.menu > ul > li.tabs > svg.fa-question");
    if (!s)
      throw new Error("\u672A\u6355\u83B7\u5230help\u6309\u94AE");
    await p(s), await S(100);
  }
  if (!n)
    throw new Error("\u672A\u6355\u6349\u5230JSON\u6309\u94AE");
  await p(n);
  for (let r = 0; r < 3; r++) {
    if (t = F(), e) {
      if (t)
        return;
    } else if (!t)
      return;
    await S(50);
  }
  throw new Error("JSON\u72B6\u6001\u5F39\u7A97\u5207\u6362\u5931\u8D25");
}
async function oe() {
  await D(!0);
  const e = document.querySelector("div.modal-backdrop.game-state div.slot > textarea");
  return e ? e.value : (console.error("\u6355\u83B7JSON\u5C55\u793A\u533A textarea \u5143\u7D20\u5931\u8D25"), "");
}
async function U(e) {
  const t = document.querySelectorAll("#townsquare > ul.circle > li");
  if (e < 1 || e > t.length)
    return console.error("userIndex \u8D85\u51FA\u4E86\u9884\u5B9A\u8303\u56F4", e), !1;
  const n = t[e - 1].querySelector("div.player");
  if (!n)
    return console.error("\u672A\u6355\u6349\u5230\u7528\u6237\u5EA7\u4F4D\u6240\u5728\u7684div"), !1;
  for (let u = 0; u < 3; u++) {
    const s = n.querySelector("ul.menu");
    if (s) {
      const i = s.lastChild;
      await p(i), await S(50);
      break;
    }
    await p(n.querySelector("div.name")), await S(50);
  }
  return document.querySelector("div.df-chat-detail") ? !0 : (console.error("\u6253\u5F00\u804A\u5929\u7A97\u53E3\u5931\u8D25"), !1);
}
async function ue() {
  const e = { userName: "", content: "" }, t = document.querySelector("div.df-chat-detail");
  if (!t)
    return console.error("readChatContent Error: \u672A\u6355\u6349\u5230\u804A\u5929\u7A97\u53E3"), e;
  let n = t.querySelector("div.title-wrap");
  return e.userName = (n == null ? void 0 : n.innerText) || "", n = t.querySelector("div.df-scroll_wrap"), e.content = (n == null ? void 0 : n.innerHTML) || "", e;
}
async function se(e, t = "", n = !1) {
  if (!await U(e))
    return !1;
  const r = re();
  if (!r)
    return console.error("\u6253\u5F00\u804A\u5929\u7A97\u53E3\u5931\u8D25"), !1;
  const u = r.querySelector("div.input-wrap > div > div#content");
  if (!u)
    return console.error("\u6355\u83B7\u804A\u5929\u8F93\u5165\u6846\u5143\u7D20\u5931\u8D25"), !1;
  u.innerHTML = t;
  const s = new InputEvent("input");
  if (u.dispatchEvent(s), n) {
    const i = r.querySelector(
      "div.input-wrap > div > div.btn"
    );
    if (!i)
      return console.error("\u6355\u83B7\u804A\u5929\u53D1\u9001\u6309\u94AE\u5931\u8D25"), !1;
    await p(i);
  }
  return !0;
}
var E = { exports: {} }, C = {};
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var ie = R, ae = Symbol.for("react.element"), le = Symbol.for("react.fragment"), ce = Object.prototype.hasOwnProperty, de = ie.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, fe = { key: !0, ref: !0, __self: !0, __source: !0 };
function j(e, t, n) {
  var r, u = {}, s = null, i = null;
  n !== void 0 && (s = "" + n), t.key !== void 0 && (s = "" + t.key), t.ref !== void 0 && (i = t.ref);
  for (r in t)
    ce.call(t, r) && !fe.hasOwnProperty(r) && (u[r] = t[r]);
  if (e && e.defaultProps)
    for (r in t = e.defaultProps, t)
      u[r] === void 0 && (u[r] = t[r]);
  return { $$typeof: ae, type: e, key: s, ref: i, props: u, _owner: de.current };
}
C.Fragment = le;
C.jsx = j;
C.jsxs = j;
(function(e) {
  e.exports = C;
})(E);
const J = E.exports.Fragment, o = E.exports.jsx, c = E.exports.jsxs, L = R.createContext(void 0);
function he(e) {
  const [t, n] = m(void 0), [r, u] = m(""), [s, i] = m("");
  T(() => {
    if (!e.assistantOpen)
      return;
    let a = "";
    const z = setInterval(async () => {
      ue().then((d) => {
        u(d.userName), i(d.content);
      });
      const b = await oe();
      if (!b || b === a)
        return;
      const v = JSON.parse(a = b);
      v.roles = v.roles || [];
      const $ = await ne() || {};
      for (const d of v.players) {
        const q = d.role;
        typeof q == "string" ? d.role = $[q] || null : d.role = null;
      }
      n(v);
    }, 500);
    return () => clearInterval(z);
  }, [e.assistantOpen]);
  const y = H(() => ({
    gameState: t,
    chatUser: r,
    chatContent: s,
    assistantOpen: e.assistantOpen
  }), [t, r, s, e.assistantOpen]);
  return /* @__PURE__ */ o(L.Provider, {
    value: y,
    children: e.children
  });
}
function M() {
  return V(L);
}
function me() {
  var n;
  const e = M(), t = ((n = e == null ? void 0 : e.gameState) == null ? void 0 : n.players) || [];
  return console.log(e), /* @__PURE__ */ o(X, {
    bordered: !0,
    columns: pe,
    dataSource: t,
    pagination: !1
  });
}
const pe = [{
  title: "\u5EA7\u4F4D\u53F7",
  dataIndex: "seatIndex",
  width: 50,
  render(e, t, n) {
    return String(n + 1);
  }
}, {
  title: "\u73A9\u5BB6",
  dataIndex: "name",
  width: 150,
  render(e, t) {
    const n = /* @__PURE__ */ o(l, {
      size: "small",
      src: t.avatarUrl,
      style: {
        marginRight: 12
      }
    });
    let r = n;
    return t.countUnread ? r = /* @__PURE__ */ o(B, {
      count: t.countUnread,
      type: "primary",
      children: n
    }) : t.isDead && (r = /* @__PURE__ */ o(B, {
      count: "\u6B7B\u4EA1",
      type: "danger",
      children: n
    })), t.isDead, /* @__PURE__ */ c("div", {
      children: [r, e]
    });
  }
}, {
  title: "\u89D2\u8272",
  width: 150,
  render(e, t) {
    const n = t.role;
    if (!n)
      return null;
    const r = `https://raw.githubusercontent.com/bra1n/townsquare/develop/src/assets/icons/${n.id}.png`;
    return /* @__PURE__ */ c("div", {
      children: [/* @__PURE__ */ o(l, {
        size: "small",
        src: r,
        style: {
          marginRight: 12
        }
      }), String(n.name)]
    });
  }
}, {
  title: "\u9996\u591C",
  width: 50,
  render(e, t) {
    const n = t.role;
    return n != null && n.firstNight ? /* @__PURE__ */ o(g, {
      content: n.firstNightReminder || "",
      children: /* @__PURE__ */ o(l, {
        size: "small",
        color: "red",
        shape: "square",
        alt: "0",
        children: n.firstNight
      })
    }) : null;
  }
}, {
  title: "\u975E\u9996\u591C",
  width: 50,
  render(e, t) {
    const n = t.role;
    return n != null && n.otherNight ? /* @__PURE__ */ o(g, {
      content: n.otherNightReminder || "",
      children: /* @__PURE__ */ o(l, {
        size: "small",
        color: "green",
        shape: "square",
        alt: "0",
        children: n.otherNight
      })
    }) : null;
  }
}, {
  title: "\u81EA\u5B9A\u4E49\u6807\u8BB0",
  width: 200,
  render(e, t) {
    const n = t.reminders;
    return n != null && n.length ? /* @__PURE__ */ o(J, {
      children: n.map((r) => {
        if (r.role === "custom")
          return /* @__PURE__ */ o(g, {
            content: r.name,
            children: /* @__PURE__ */ o(l, {
              size: "small",
              color: "green",
              alt: "0",
              children: r.name
            })
          });
        {
          const u = `https://raw.githubusercontent.com/bra1n/townsquare/develop/src/assets/icons/${r.role}.png`;
          return /* @__PURE__ */ o(g, {
            content: r.name,
            children: /* @__PURE__ */ o(l, {
              size: "small",
              src: u,
              alt: "0"
            })
          });
        }
      })
    }) : null;
  }
}, {
  title: "\u64CD\u4F5C",
  width: 100,
  render(e, t, n) {
    return /* @__PURE__ */ o(k, {
      icon: /* @__PURE__ */ o(ee, {
        style: {
          color: "#E91E63"
        }
      }),
      onClick: () => U(n + 1)
    });
  }
}];
function ye() {
  var y;
  const e = M(), [t, n] = m(""), r = W(null), u = () => {
    !t || se(s + 1, t, !0).then(() => {
      n(""), setTimeout(() => {
        const a = r.current;
        a && (a.scrollTop = a.scrollHeight);
      }, 500);
    });
  };
  if (!((y = e == null ? void 0 : e.gameState) != null && y.players))
    return null;
  const s = e.gameState.players.findIndex((a) => a.name === e.chatUser);
  if (s < 0)
    return null;
  const i = e.gameState.players[s];
  return /* @__PURE__ */ c(K, {
    style: {
      color: "black",
      padding: "10px",
      height: "100%"
    },
    children: [/* @__PURE__ */ c("div", {
      children: [/* @__PURE__ */ o(l, {
        color: "red",
        shape: "square",
        alt: "0",
        children: /* @__PURE__ */ o("span", {
          style: {
            fontSize: "large"
          },
          children: s + 1
        })
      }), /* @__PURE__ */ o(l, {
        src: i.avatarUrl,
        style: {
          marginRight: 12
        }
      }), i.name]
    }), /* @__PURE__ */ o("br", {}), /* @__PURE__ */ o("div", {
      children: "\u81EA\u5B9A\u4E49\u529F\u80FD\u5217\u8868"
    }), /* @__PURE__ */ o("br", {}), /* @__PURE__ */ o("div", {
      ref: r,
      style: ve,
      dangerouslySetInnerHTML: {
        __html: (e == null ? void 0 : e.chatContent) || ""
      }
    }), /* @__PURE__ */ o("br", {}), /* @__PURE__ */ c(I, {
      gutter: 16,
      type: "flex",
      align: "middle",
      children: [/* @__PURE__ */ o(w, {
        span: 20,
        children: /* @__PURE__ */ o(Q, {
          value: t,
          onChange: n,
          onEnterPress: u
        })
      }), /* @__PURE__ */ o(w, {
        span: 4,
        children: /* @__PURE__ */ o(k, {
          block: !0,
          onClick: u,
          children: "\u53D1\u9001"
        })
      })]
    })]
  });
}
const ve = {
  height: "60%",
  overflowX: "auto",
  overflowY: "scroll",
  borderStyle: "inset",
  borderWidth: "2px"
};
function ge() {
  const [e, t] = m(!1), n = G(() => t((r) => !r), []);
  return T(() => {
    D(!!e);
  }, [e]), /* @__PURE__ */ c(J, {
    children: [/* @__PURE__ */ o(k, {
      theme: "solid",
      type: "secondary",
      onClick: n,
      style: we,
      children: "\u52A9\u624B"
    }), /* @__PURE__ */ o(Z, {
      closeOnEsc: !0,
      placement: "bottom",
      height: "80%",
      headerStyle: Se,
      bodyStyle: Ee,
      visible: e,
      onCancel: n,
      children: /* @__PURE__ */ o(he, {
        assistantOpen: e,
        children: /* @__PURE__ */ c(I, {
          gutter: 16,
          style: A,
          children: [/* @__PURE__ */ o(w, {
            style: A,
            span: 16,
            children: /* @__PURE__ */ o(me, {})
          }), /* @__PURE__ */ o(w, {
            style: A,
            span: 8,
            children: /* @__PURE__ */ o(ye, {})
          })]
        })
      })
    })]
  });
}
const we = {
  position: "absolute",
  top: 0,
  left: "70%"
}, Se = {
  display: "none"
}, Ee = {
  padding: "0"
}, A = {
  height: "100%"
}, f = document.createElement("div");
f.id = "assist-root";
f.style.position = "absolute";
f.style.top = "0";
f.style.width = "100%";
document.body.appendChild(f);
P("https://unpkg.com/@douyinfe/semi-ui@2.17.1/dist/css/semi.css");
P("https://unpkg.com/@douyinfe/semi-icons@2.17.1/dist/css/semi-icons.css");
x.createRoot(f).render(/* @__PURE__ */ o(R.StrictMode, {
  children: /* @__PURE__ */ o(ge, {})
}));
