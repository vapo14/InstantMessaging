var bigInt = (function (e) {
  "use strict";
  function o(e, t) {
    (this.value = e), (this.sign = t), (this.isSmall = !1);
  }
  function u(e) {
    (this.value = e), (this.sign = e < 0), (this.isSmall = !0);
  }
  function a(e) {
    return -r < e && e < r;
  }
  function f(e) {
    return e < 1e7
      ? [e]
      : e < 1e14
      ? [e % 1e7, Math.floor(e / 1e7)]
      : [e % 1e7, Math.floor(e / 1e7) % 1e7, Math.floor(e / 1e14)];
  }
  function l(e) {
    c(e);
    var n = e.length;
    if (n < 4 && O(e, i) < 0)
      switch (n) {
        case 0:
          return 0;
        case 1:
          return e[0];
        case 2:
          return e[0] + e[1] * t;
        default:
          return e[0] + (e[1] + e[2] * t) * t;
      }
    return e;
  }
  function c(e) {
    var t = e.length;
    while (e[--t] === 0);
    e.length = t + 1;
  }
  function h(e) {
    var t = new Array(e),
      n = -1;
    while (++n < e) t[n] = 0;
    return t;
  }
  function p(e) {
    return e > 0 ? Math.floor(e) : Math.ceil(e);
  }
  function d(e, n) {
    var r = e.length,
      i = n.length,
      s = new Array(r),
      o = 0,
      u = t,
      a,
      f;
    for (f = 0; f < i; f++)
      (a = e[f] + n[f] + o), (o = a >= u ? 1 : 0), (s[f] = a - o * u);
    while (f < r) (a = e[f] + o), (o = a === u ? 1 : 0), (s[f++] = a - o * u);
    return o > 0 && s.push(o), s;
  }
  function v(e, t) {
    return e.length >= t.length ? d(e, t) : d(t, e);
  }
  function m(e, n) {
    var r = e.length,
      i = new Array(r),
      s = t,
      o,
      u;
    for (u = 0; u < r; u++)
      (o = e[u] - s + n), (n = Math.floor(o / s)), (i[u] = o - n * s), (n += 1);
    while (n > 0) (i[u++] = n % s), (n = Math.floor(n / s));
    return i;
  }
  function g(e, n) {
    var r = e.length,
      i = n.length,
      s = new Array(r),
      o = 0,
      u = t,
      a,
      f;
    for (a = 0; a < i; a++)
      (f = e[a] - o - n[a]), f < 0 ? ((f += u), (o = 1)) : (o = 0), (s[a] = f);
    for (a = i; a < r; a++) {
      f = e[a] - o;
      if (!(f < 0)) {
        s[a++] = f;
        break;
      }
      (f += u), (s[a] = f);
    }
    for (; a < r; a++) s[a] = e[a];
    return c(s), s;
  }
  function y(e, t, n) {
    var r, i;
    return (
      O(e, t) >= 0 ? (r = g(e, t)) : ((r = g(t, e)), (n = !n)),
      (r = l(r)),
      typeof r == "number" ? (n && (r = -r), new u(r)) : new o(r, n)
    );
  }
  function b(e, n, r) {
    var i = e.length,
      s = new Array(i),
      a = -n,
      f = t,
      c,
      h;
    for (c = 0; c < i; c++)
      (h = e[c] + a),
        (a = Math.floor(h / f)),
        (h %= f),
        (s[c] = h < 0 ? h + f : h);
    return (
      (s = l(s)), typeof s == "number" ? (r && (s = -s), new u(s)) : new o(s, r)
    );
  }
  function w(e, n) {
    var r = e.length,
      i = n.length,
      s = r + i,
      o = h(s),
      u = t,
      a,
      f,
      l,
      p,
      d;
    for (l = 0; l < r; ++l) {
      p = e[l];
      for (var v = 0; v < i; ++v)
        (d = n[v]),
          (a = p * d + o[l + v]),
          (f = Math.floor(a / u)),
          (o[l + v] = a - f * u),
          (o[l + v + 1] += f);
    }
    return c(o), o;
  }
  function E(e, n) {
    var r = e.length,
      i = new Array(r),
      s = t,
      o = 0,
      u,
      a;
    for (a = 0; a < r; a++)
      (u = e[a] * n + o), (o = Math.floor(u / s)), (i[a] = u - o * s);
    while (o > 0) (i[a++] = o % s), (o = Math.floor(o / s));
    return i;
  }
  function S(e, t) {
    var n = [];
    while (t-- > 0) n.push(0);
    return n.concat(e);
  }
  function x(e, t) {
    var n = Math.max(e.length, t.length);
    if (n <= 400) return w(e, t);
    n = Math.ceil(n / 2);
    var r = e.slice(n),
      i = e.slice(0, n),
      s = t.slice(n),
      o = t.slice(0, n),
      u = x(i, o),
      a = x(r, s),
      f = x(v(i, r), v(o, s));
    return v(v(u, S(g(g(f, u), a), n)), S(a, 2 * n));
  }
  function T(e, n, r) {
    return e < t ? new o(E(n, e), r) : new o(w(n, f(e)), r);
  }
  function N(e) {
    var n = e.length,
      r = h(n + n),
      i = t,
      s,
      o,
      u,
      a,
      f;
    for (u = 0; u < n; u++) {
      a = e[u];
      for (var l = 0; l < n; l++)
        (f = e[l]),
          (s = a * f + r[u + l]),
          (o = Math.floor(s / i)),
          (r[u + l] = s - o * i),
          (r[u + l + 1] += o);
    }
    return c(r), r;
  }
  function C(e, n) {
    var r = e.length,
      i = n.length,
      s = t,
      o = h(n.length),
      u = n[i - 1],
      a = Math.ceil(s / (2 * u)),
      f = E(e, a),
      c = E(n, a),
      p,
      d,
      v,
      m,
      g,
      y,
      b;
    f.length <= r && f.push(0), c.push(0), (u = c[i - 1]);
    for (d = r - i; d >= 0; d--) {
      (p = s - 1),
        f[d + i] !== u && (p = Math.floor((f[d + i] * s + f[d + i - 1]) / u)),
        (v = 0),
        (m = 0),
        (y = c.length);
      for (g = 0; g < y; g++)
        (v += p * c[g]),
          (b = Math.floor(v / s)),
          (m += f[d + g] - (v - b * s)),
          (v = b),
          m < 0 ? ((f[d + g] = m + s), (m = -1)) : ((f[d + g] = m), (m = 0));
      while (m !== 0) {
        (p -= 1), (v = 0);
        for (g = 0; g < y; g++)
          (v += f[d + g] - s + c[g]),
            v < 0 ? ((f[d + g] = v + s), (v = 0)) : ((f[d + g] = v), (v = 1));
        m += v;
      }
      o[d] = p;
    }
    return (f = L(f, a)[0]), [l(o), l(f)];
  }
  function k(e, n) {
    var r = e.length,
      i = n.length,
      s = [],
      o = [],
      u = t,
      a,
      f,
      c,
      h,
      p;
    while (r) {
      o.unshift(e[--r]);
      if (O(o, n) < 0) {
        s.push(0);
        continue;
      }
      (f = o.length),
        (c = o[f - 1] * u + o[f - 2]),
        (h = n[i - 1] * u + n[i - 2]),
        f > i && (c = (c + 1) * u),
        (a = Math.ceil(c / h));
      do {
        p = E(n, a);
        if (O(p, o) <= 0) break;
        a--;
      } while (a);
      s.push(a), (o = g(o, p));
    }
    return s.reverse(), [l(s), l(o)];
  }
  function L(e, n) {
    var r = e.length,
      i = h(r),
      s = t,
      o,
      u,
      a,
      f;
    a = 0;
    for (o = r - 1; o >= 0; --o)
      (f = a * s + e[o]), (u = p(f / n)), (a = f - u * n), (i[o] = u | 0);
    return [i, a | 0];
  }
  function A(e, n) {
    var r,
      i = Q(n),
      s = e.value,
      a = i.value,
      c;
    if (a === 0) throw new Error("Cannot divide by zero");
    if (e.isSmall)
      return i.isSmall ? [new u(p(s / a)), new u(s % a)] : [G[0], e];
    if (i.isSmall) {
      if (a === 1) return [e, G[0]];
      if (a == -1) return [e.negate(), G[0]];
      var h = Math.abs(a);
      if (h < t) {
        (r = L(s, h)), (c = l(r[0]));
        var d = r[1];
        return (
          e.sign && (d = -d),
          typeof c == "number"
            ? (e.sign !== i.sign && (c = -c), [new u(c), new u(d)])
            : [new o(c, e.sign !== i.sign), new u(d)]
        );
      }
      a = f(h);
    }
    var v = O(s, a);
    if (v === -1) return [G[0], e];
    if (v === 0) return [G[e.sign === i.sign ? 1 : -1], G[0]];
    s.length + a.length <= 200 ? (r = C(s, a)) : (r = k(s, a)), (c = r[0]);
    var m = e.sign !== i.sign,
      g = r[1],
      y = e.sign;
    return (
      typeof c == "number"
        ? (m && (c = -c), (c = new u(c)))
        : (c = new o(c, m)),
      typeof g == "number"
        ? (y && (g = -g), (g = new u(g)))
        : (g = new o(g, y)),
      [c, g]
    );
  }
  function O(e, t) {
    if (e.length !== t.length) return e.length > t.length ? 1 : -1;
    for (var n = e.length - 1; n >= 0; n--)
      if (e[n] !== t[n]) return e[n] > t[n] ? 1 : -1;
    return 0;
  }
  function M(e) {
    var t = e.abs();
    if (t.isUnit()) return !1;
    if (t.equals(2) || t.equals(3) || t.equals(5)) return !0;
    if (t.isEven() || t.isDivisibleBy(3) || t.isDivisibleBy(5)) return !1;
    if (t.lesser(25)) return !0;
  }
  function H(e) {
    return (
      ((typeof e == "number" || typeof e == "string") && +Math.abs(e) <= t) ||
      (e instanceof o && e.value.length <= 1)
    );
  }
  function B(e, t, n) {
    t = Q(t);
    var r = e.isNegative(),
      i = t.isNegative(),
      s = r ? e.not() : e,
      o = i ? t.not() : t,
      u = [],
      a = [],
      f = !1,
      l = !1;
    while (!f || !l)
      s.isZero()
        ? ((f = !0), u.push(r ? 1 : 0))
        : r
        ? u.push(s.isEven() ? 1 : 0)
        : u.push(s.isEven() ? 0 : 1),
        o.isZero()
          ? ((l = !0), a.push(i ? 1 : 0))
          : i
          ? a.push(o.isEven() ? 1 : 0)
          : a.push(o.isEven() ? 0 : 1),
        (s = s.over(2)),
        (o = o.over(2));
    var c = [];
    for (var h = 0; h < u.length; h++) c.push(n(u[h], a[h]));
    var p = bigInt(c.pop()).negate().times(bigInt(2).pow(c.length));
    while (c.length) p = p.add(bigInt(c.pop()).times(bigInt(2).pow(c.length)));
    return p;
  }
  function I(e) {
    var n = e.value,
      r = typeof n == "number" ? n | j : (n[0] + n[1] * t) | F;
    return r & -r;
  }
  function q(e, t) {
    return (e = Q(e)), (t = Q(t)), e.greater(t) ? e : t;
  }
  function R(e, t) {
    return (e = Q(e)), (t = Q(t)), e.lesser(t) ? e : t;
  }
  function U(e, t) {
    (e = Q(e).abs()), (t = Q(t).abs());
    if (e.equals(t)) return e;
    if (e.isZero()) return t;
    if (t.isZero()) return e;
    var n = G[1],
      r,
      i;
    while (e.isEven() && t.isEven())
      (r = Math.min(I(e), I(t))),
        (e = e.divide(r)),
        (t = t.divide(r)),
        (n = n.multiply(r));
    while (e.isEven()) e = e.divide(I(e));
    do {
      while (t.isEven()) t = t.divide(I(t));
      e.greater(t) && ((i = t), (t = e), (e = i)), (t = t.subtract(e));
    } while (!t.isZero());
    return n.isUnit() ? e : e.multiply(n);
  }
  function z(e, t) {
    return (e = Q(e).abs()), (t = Q(t).abs()), e.divide(U(e, t)).multiply(t);
  }
  function W(e, n) {
    (e = Q(e)), (n = Q(n));
    var r = R(e, n),
      i = q(e, n),
      s = i.subtract(r);
    if (s.isSmall) return r.add(Math.round(Math.random() * s));
    var a = s.value.length - 1,
      f = [],
      c = !0;
    for (var h = a; h >= 0; h--) {
      var d = c ? s.value[h] : t,
        v = p(Math.random() * d);
      f.unshift(v), v < d && (c = !1);
    }
    return (f = l(f)), r.add(typeof f == "number" ? new u(f) : new o(f, !1));
  }
  function V(e) {
    var t = e.value;
    return (
      typeof t == "number" && (t = [t]),
      t.length === 1 && t[0] <= 36
        ? "0123456789abcdefghijklmnopqrstuvwxyz".charAt(t[0])
        : "<" + t + ">"
    );
  }
  function $(e, t) {
    t = bigInt(t);
    if (t.isZero()) {
      if (e.isZero()) return "0";
      throw new Error("Cannot convert nonzero numbers to base 0.");
    }
    if (t.equals(-1))
      return e.isZero()
        ? "0"
        : e.isNegative()
        ? new Array(1 - e).join("10")
        : "1" + new Array(+e).join("01");
    var n = "";
    e.isNegative() && t.isPositive() && ((n = "-"), (e = e.abs()));
    if (t.equals(1)) return e.isZero() ? "0" : n + new Array(+e + 1).join(1);
    var r = [],
      i = e,
      s;
    while (i.isNegative() || i.compareAbs(t) >= 0) {
      (s = i.divmod(t)), (i = s.quotient);
      var o = s.remainder;
      o.isNegative() && ((o = t.minus(o).abs()), (i = i.next())), r.push(V(o));
    }
    return r.push(V(i)), n + r.reverse().join("");
  }
  function J(e) {
    if (a(+e)) {
      var t = +e;
      if (t === p(t)) return new u(t);
      throw "Invalid integer: " + e;
    }
    var r = e[0] === "-";
    r && (e = e.slice(1));
    var i = e.split(/e/i);
    if (i.length > 2) throw new Error("Invalid integer: " + f.join("e"));
    if (i.length === 2) {
      var s = i[1];
      s[0] === "+" && (s = s.slice(1)), (s = +s);
      if (s !== p(s) || !a(s))
        throw new Error("Invalid integer: " + s + " is not a valid exponent.");
      var f = i[0],
        l = f.indexOf(".");
      l >= 0 && ((s -= f.length - l), (f = f.slice(0, l) + f.slice(l + 1)));
      if (s < 0)
        throw new Error("Cannot include negative exponent part for integers");
      (f += new Array(s + 1).join("0")), (e = f);
    }
    var h = /^([0-9][0-9]*)$/.test(e);
    if (!h) throw new Error("Invalid integer: " + e);
    var d = [],
      v = e.length,
      m = n,
      g = v - m;
    while (v > 0) d.push(+e.slice(g, v)), (g -= m), g < 0 && (g = 0), (v -= m);
    return c(d), new o(d, r);
  }
  function K(e) {
    return a(e) ? new u(e) : J(e.toString());
  }
  function Q(e) {
    return typeof e == "number" ? K(e) : typeof e == "string" ? J(e) : e;
  }
  var t = 1e7,
    n = 7,
    r = 9007199254740992,
    i = f(r),
    s = Math.log(r);
  (o.prototype.add = function (e) {
    var t,
      n = Q(e);
    if (this.sign !== n.sign) return this.subtract(n.negate());
    var r = this.value,
      i = n.value;
    return n.isSmall
      ? new o(m(r, Math.abs(i)), this.sign)
      : new o(v(r, i), this.sign);
  }),
    (o.prototype.plus = o.prototype.add),
    (u.prototype.add = function (e) {
      var t = Q(e),
        n = this.value;
      if (n < 0 !== t.sign) return this.subtract(t.negate());
      var r = t.value;
      if (t.isSmall) {
        if (a(n + r)) return new u(n + r);
        r = f(Math.abs(r));
      }
      return new o(m(r, Math.abs(n)), n < 0);
    }),
    (u.prototype.plus = u.prototype.add),
    (o.prototype.subtract = function (e) {
      var t = Q(e);
      if (this.sign !== t.sign) return this.add(t.negate());
      var n = this.value,
        r = t.value;
      return t.isSmall ? b(n, Math.abs(r), this.sign) : y(n, r, this.sign);
    }),
    (o.prototype.minus = o.prototype.subtract),
    (u.prototype.subtract = function (e) {
      var t = Q(e),
        n = this.value;
      if (n < 0 !== t.sign) return this.add(t.negate());
      var r = t.value;
      return t.isSmall ? new u(n - r) : b(r, Math.abs(n), n >= 0);
    }),
    (u.prototype.minus = u.prototype.subtract),
    (o.prototype.negate = function () {
      return new o(this.value, !this.sign);
    }),
    (u.prototype.negate = function () {
      var e = this.sign,
        t = new u(-this.value);
      return (t.sign = !e), t;
    }),
    (o.prototype.abs = function () {
      return new o(this.value, !1);
    }),
    (u.prototype.abs = function () {
      return new u(Math.abs(this.value));
    }),
    (o.prototype.multiply = function (e) {
      var n,
        r = Q(e),
        i = this.value,
        s = r.value,
        u = this.sign !== r.sign,
        a;
      if (r.isSmall) {
        if (s === 0) return G[0];
        if (s === 1) return this;
        if (s === -1) return this.negate();
        a = Math.abs(s);
        if (a < t) return new o(E(i, a), u);
        s = f(a);
      }
      return i.length + s.length > 4e3 ? new o(x(i, s), u) : new o(w(i, s), u);
    }),
    (o.prototype.times = o.prototype.multiply),
    (u.prototype._multiplyBySmall = function (e) {
      return a(e.value * this.value)
        ? new u(e.value * this.value)
        : T(Math.abs(e.value), f(Math.abs(this.value)), this.sign !== e.sign);
    }),
    (o.prototype._multiplyBySmall = function (e) {
      return e.value === 0
        ? G[0]
        : e.value === 1
        ? this
        : e.value === -1
        ? this.negate()
        : T(Math.abs(e.value), this.value, this.sign !== e.sign);
    }),
    (u.prototype.multiply = function (e) {
      return Q(e)._multiplyBySmall(this);
    }),
    (u.prototype.times = u.prototype.multiply),
    (o.prototype.square = function () {
      return new o(N(this.value), !1);
    }),
    (u.prototype.square = function () {
      var e = this.value * this.value;
      return a(e) ? new u(e) : new o(N(f(Math.abs(this.value))), !1);
    }),
    (o.prototype.divmod = function (e) {
      var t = A(this, e);
      return { quotient: t[0], remainder: t[1] };
    }),
    (u.prototype.divmod = o.prototype.divmod),
    (o.prototype.divide = function (e) {
      return A(this, e)[0];
    }),
    (u.prototype.over =
      u.prototype.divide =
      o.prototype.over =
        o.prototype.divide),
    (o.prototype.mod = function (e) {
      return A(this, e)[1];
    }),
    (u.prototype.remainder =
      u.prototype.mod =
      o.prototype.remainder =
        o.prototype.mod),
    (o.prototype.pow = function (e) {
      var t = Q(e),
        n = this.value,
        r = t.value,
        i,
        s,
        o;
      if (r === 0) return G[1];
      if (n === 0) return G[0];
      if (n === 1) return G[1];
      if (n === -1) return t.isEven() ? G[1] : G[-1];
      if (t.sign) return G[0];
      if (!t.isSmall)
        throw new Error("The exponent " + t.toString() + " is too large.");
      if (this.isSmall && a((i = Math.pow(n, r)))) return new u(p(i));
      (s = this), (o = G[1]);
      for (;;) {
        r & !0 && ((o = o.times(s)), --r);
        if (r === 0) break;
        (r /= 2), (s = s.square());
      }
      return o;
    }),
    (u.prototype.pow = o.prototype.pow),
    (o.prototype.modPow = function (e, t) {
      (e = Q(e)), (t = Q(t));
      if (t.isZero()) throw new Error("Cannot take modPow with modulus 0");
      var n = G[1],
        r = this.mod(t);
      if (r.isZero()) return G[0];
      while (e.isPositive())
        e.isOdd() && (n = n.multiply(r).mod(t)),
          (e = e.divide(2)),
          (r = r.square().mod(t));
      return n;
    }),
    (u.prototype.modPow = o.prototype.modPow),
    (o.prototype.compareAbs = function (e) {
      var t = Q(e),
        n = this.value,
        r = t.value;
      return t.isSmall ? 1 : O(n, r);
    }),
    (u.prototype.compareAbs = function (e) {
      var t = Q(e),
        n = Math.abs(this.value),
        r = t.value;
      return t.isSmall ? ((r = Math.abs(r)), n === r ? 0 : n > r ? 1 : -1) : -1;
    }),
    (o.prototype.compare = function (e) {
      if (e === Infinity) return -1;
      if (e === -Infinity) return 1;
      var t = Q(e),
        n = this.value,
        r = t.value;
      return this.sign !== t.sign
        ? t.sign
          ? 1
          : -1
        : t.isSmall
        ? this.sign
          ? -1
          : 1
        : O(n, r) * (this.sign ? -1 : 1);
    }),
    (o.prototype.compareTo = o.prototype.compare),
    (u.prototype.compare = function (e) {
      if (e === Infinity) return -1;
      if (e === -Infinity) return 1;
      var t = Q(e),
        n = this.value,
        r = t.value;
      return t.isSmall
        ? n == r
          ? 0
          : n > r
          ? 1
          : -1
        : n < 0 !== t.sign
        ? n < 0
          ? -1
          : 1
        : n < 0
        ? 1
        : -1;
    }),
    (u.prototype.compareTo = u.prototype.compare),
    (o.prototype.equals = function (e) {
      return this.compare(e) === 0;
    }),
    (u.prototype.eq = u.prototype.equals = o.prototype.eq = o.prototype.equals),
    (o.prototype.notEquals = function (e) {
      return this.compare(e) !== 0;
    }),
    (u.prototype.neq =
      u.prototype.notEquals =
      o.prototype.neq =
        o.prototype.notEquals),
    (o.prototype.greater = function (e) {
      return this.compare(e) > 0;
    }),
    (u.prototype.gt =
      u.prototype.greater =
      o.prototype.gt =
        o.prototype.greater),
    (o.prototype.lesser = function (e) {
      return this.compare(e) < 0;
    }),
    (u.prototype.lt = u.prototype.lesser = o.prototype.lt = o.prototype.lesser),
    (o.prototype.greaterOrEquals = function (e) {
      return this.compare(e) >= 0;
    }),
    (u.prototype.geq =
      u.prototype.greaterOrEquals =
      o.prototype.geq =
        o.prototype.greaterOrEquals),
    (o.prototype.lesserOrEquals = function (e) {
      return this.compare(e) <= 0;
    }),
    (u.prototype.leq =
      u.prototype.lesserOrEquals =
      o.prototype.leq =
        o.prototype.lesserOrEquals),
    (o.prototype.isEven = function () {
      return (this.value[0] & 1) === 0;
    }),
    (u.prototype.isEven = function () {
      return (this.value & 1) === 0;
    }),
    (o.prototype.isOdd = function () {
      return (this.value[0] & 1) === 1;
    }),
    (u.prototype.isOdd = function () {
      return (this.value & 1) === 1;
    }),
    (o.prototype.isPositive = function () {
      return !this.sign;
    }),
    (u.prototype.isPositive = function () {
      return this.value > 0;
    }),
    (o.prototype.isNegative = function () {
      return this.sign;
    }),
    (u.prototype.isNegative = function () {
      return this.value < 0;
    }),
    (o.prototype.isUnit = function () {
      return !1;
    }),
    (u.prototype.isUnit = function () {
      return Math.abs(this.value) === 1;
    }),
    (o.prototype.isZero = function () {
      return !1;
    }),
    (u.prototype.isZero = function () {
      return this.value === 0;
    }),
    (o.prototype.isDivisibleBy = function (e) {
      var t = Q(e),
        n = t.value;
      return n === 0
        ? !1
        : n === 1
        ? !0
        : n === 2
        ? this.isEven()
        : this.mod(t).equals(G[0]);
    }),
    (u.prototype.isDivisibleBy = o.prototype.isDivisibleBy),
    (o.prototype.isPrime = function () {
      var t = M(this);
      if (t !== e) return t;
      var n = this.abs(),
        r = n.prev(),
        i = [2, 3, 5, 7, 11, 13, 17, 19],
        s = r,
        o,
        u,
        a,
        f;
      while (s.isEven()) s = s.divide(2);
      for (a = 0; a < i.length; a++) {
        f = bigInt(i[a]).modPow(s, n);
        if (f.equals(G[1]) || f.equals(r)) continue;
        for (u = !0, o = s; u && o.lesser(r); o = o.multiply(2))
          (f = f.square().mod(n)), f.equals(r) && (u = !1);
        if (u) return !1;
      }
      return !0;
    }),
    (u.prototype.isPrime = o.prototype.isPrime),
    (o.prototype.isProbablePrime = function (t) {
      var n = M(this);
      if (n !== e) return n;
      var r = this.abs(),
        i = t === e ? 5 : t;
      for (var s = 0; s < i; s++) {
        var o = bigInt.randBetween(2, r.minus(2));
        if (!o.modPow(r.prev(), r).isUnit()) return !1;
      }
      return !0;
    }),
    (u.prototype.isProbablePrime = o.prototype.isProbablePrime),
    (o.prototype.next = function () {
      var e = this.value;
      return this.sign ? b(e, 1, this.sign) : new o(m(e, 1), this.sign);
    }),
    (u.prototype.next = function () {
      var e = this.value;
      return e + 1 < r ? new u(e + 1) : new o(i, !1);
    }),
    (o.prototype.prev = function () {
      var e = this.value;
      return this.sign ? new o(m(e, 1), !0) : b(e, 1, this.sign);
    }),
    (u.prototype.prev = function () {
      var e = this.value;
      return e - 1 > -r ? new u(e - 1) : new o(i, !0);
    });
  var _ = [1];
  while (_[_.length - 1] <= t) _.push(2 * _[_.length - 1]);
  var D = _.length,
    P = _[D - 1];
  (o.prototype.shiftLeft = function (e) {
    if (!H(e))
      return e.isNegative()
        ? this.shiftRight(e.abs())
        : this.times(G[2].pow(e));
    e = +e;
    if (e < 0) return this.shiftRight(-e);
    var t = this;
    while (e >= D) (t = t.multiply(P)), (e -= D - 1);
    return t.multiply(_[e]);
  }),
    (u.prototype.shiftLeft = o.prototype.shiftLeft),
    (o.prototype.shiftRight = function (e) {
      var t;
      if (!H(e))
        return e.isNegative()
          ? this.shiftLeft(e.abs())
          : ((t = this.divmod(G[2].pow(e))),
            t.remainder.isNegative() ? t.quotient.prev() : t.quotient);
      e = +e;
      if (e < 0) return this.shiftLeft(-e);
      var n = this;
      while (e >= D) {
        if (n.isZero()) return n;
        (t = A(n, P)),
          (n = t[1].isNegative() ? t[0].prev() : t[0]),
          (e -= D - 1);
      }
      return (t = A(n, _[e])), t[1].isNegative() ? t[0].prev() : t[0];
    }),
    (u.prototype.shiftRight = o.prototype.shiftRight),
    (o.prototype.not = function () {
      return this.negate().prev();
    }),
    (u.prototype.not = o.prototype.not),
    (o.prototype.and = function (e) {
      return B(this, e, function (e, t) {
        return e & t;
      });
    }),
    (u.prototype.and = o.prototype.and),
    (o.prototype.or = function (e) {
      return B(this, e, function (e, t) {
        return e | t;
      });
    }),
    (u.prototype.or = o.prototype.or),
    (o.prototype.xor = function (e) {
      return B(this, e, function (e, t) {
        return e ^ t;
      });
    }),
    (u.prototype.xor = o.prototype.xor);
  var j = 1 << 30,
    F = ((t & -t) * (t & -t)) | j,
    X = function (e, t) {
      var n = G[0],
        r = G[1],
        i = e.length;
      if (2 <= t && t <= 36 && i <= s / Math.log(t))
        return new u(parseInt(e, t));
      t = Q(t);
      var o = [],
        a,
        f = e[0] === "-";
      for (a = f ? 1 : 0; a < e.length; a++) {
        var l = e[a].toLowerCase(),
          c = l.charCodeAt(0);
        if (48 <= c && c <= 57) o.push(Q(l));
        else if (97 <= c && c <= 122) o.push(Q(l.charCodeAt(0) - 87));
        else {
          if (l !== "<") throw new Error(l + " is not a valid character");
          var h = a;
          do a++;
          while (e[a] !== ">");
          o.push(Q(e.slice(h + 1, a)));
        }
      }
      o.reverse();
      for (a = 0; a < o.length; a++)
        (n = n.add(o[a].times(r))), (r = r.times(t));
      return f ? n.negate() : n;
    };
  (o.prototype.toString = function (t) {
    t === e && (t = 10);
    if (t !== 10) return $(this, t);
    var n = this.value,
      r = n.length,
      i = String(n[--r]),
      s = "0000000",
      o;
    while (--r >= 0) (o = String(n[r])), (i += s.slice(o.length) + o);
    var u = this.sign ? "-" : "";
    return u + i;
  }),
    (u.prototype.toString = function (t) {
      return t === e && (t = 10), t != 10 ? $(this, t) : String(this.value);
    }),
    (o.prototype.valueOf = function () {
      return +this.toString();
    }),
    (o.prototype.toJSNumber = o.prototype.valueOf),
    (u.prototype.valueOf = function () {
      return this.value;
    }),
    (u.prototype.toJSNumber = u.prototype.valueOf);
  var G = function (e, t) {
    return typeof e == "undefined"
      ? G[0]
      : typeof t != "undefined"
      ? +t === 10
        ? Q(e)
        : X(e, t)
      : Q(e);
  };
  for (var Y = 0; Y < 1e3; Y++) (G[Y] = new u(Y)), Y > 0 && (G[-Y] = new u(-Y));
  return (
    (G.one = G[1]),
    (G.zero = G[0]),
    (G.minusOne = G[-1]),
    (G.max = q),
    (G.min = R),
    (G.gcd = U),
    (G.lcm = z),
    (G.isInstance = function (e) {
      return e instanceof o || e instanceof u;
    }),
    (G.randBetween = W),
    G
  );
})();
typeof module != "undefined" &&
  module.hasOwnProperty("exports") &&
  (module.exports = bigInt);
