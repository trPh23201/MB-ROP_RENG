# Dynamic Brand Colors — Fix Walkthrough

## Root Cause: Hermes Engine Caches Getter Results

JavaScript [get](file:///f:/work/react-native/RopReng/src/presentation/theme/colors.ts#73-136) accessors defined on object literals are **cached by the Hermes engine** — the getter function body executes once, then subsequent accesses return the cached result without re-executing the getter.

### Evidence

```
[debugPrimary] descriptor type: GETTER          ← Getter EXISTS on the object
[debugPrimary] store.primary.p1: #f00000       ← Store has CORRECT updated value
[debugPrimary] this.primary.p1:  #faedc0       ← Getter returns STALE cached value
```

A `console.log` placed **inside** the getter body **never appeared** in logs, confirming Hermes skips re-execution.

## Fix: `Proxy` Instead of Getters

Replaced all `get primary() { ... }` style getters with a `Proxy` object. `Proxy.get` traps **must fire on every access** per the JS specification — Hermes cannot cache them.

### Before (broken)
```typescript
const API_COLORS = {
  get primary() {
    return { p1: store.primary.p1, ... }; // Hermes caches first result
  },
};
```

### After (working)
```typescript
export const API_COLORS = new Proxy(STATIC, {
  get(_target, prop) {
    const s = readStore(); // Fires every time
    if (prop === 'primary') return { p1: s.primary.p1, ... };
    return _target[prop];  // Static props (background, semantic, etc.)
  },
});
```

## Files Changed

| File | Change |
|------|--------|
| [colors.ts](file:///f:/work/react-native/RopReng/src/presentation/theme/colors.ts) | Rewrote `API_COLORS` from getter-based object to `Proxy`-based |
| [SelectBrandScreen.tsx](file:///f:/work/react-native/RopReng/src/presentation/screens/select-brand/SelectBrandScreen.tsx) | Cleaned up diagnostic logs |

## Validation

✅ Brand 3 → Brand 4: colors update instantly  
✅ Brand 4 → Brand 3: colors update instantly  
✅ `API_COLORS.primary.p1` returns correct value after each switch
