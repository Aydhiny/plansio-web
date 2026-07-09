"use client";

import { useEffect, useState } from "react";
import type { ThemeConfig } from "@/lib/studio";
import s from "./ThemePanel.module.css";

/**
 * ThemePanel — edits the 7 brand colors that drive the site's warm/cool gradients.
 *
 * Each color is a *controlled* pair: a native <input type="color"> swatch and a
 * hex text field, both bound to the same value. The text field is intentionally
 * NOT forced to the canonical value on every keystroke — we only lift state when
 * the user has typed a complete, valid #rrggbb. That lets someone clear the box
 * and retype without the value snapping back mid-edit.
 */

type ColorKey = keyof ThemeConfig;

const WARM_KEYS: ColorKey[] = ["warm", "coral", "pink"];
const COOL_KEYS: ColorKey[] = ["blue", "violet", "mag"];

const LABELS: Record<ColorKey, string> = {
  warm: "Warm",
  coral: "Coral",
  pink: "Pink",
  blue: "Blue",
  violet: "Violet",
  mag: "Magenta",
};

const HEX_RE = /^#[0-9a-fA-F]{6}$/;

type Preset = { name: string; theme: ThemeConfig };

const PRESETS: Preset[] = [
  {
    name: "Sunset",
    theme: {
      warm: "#f7b231",
      coral: "#f36844",
      pink: "#d93d72",
      blue: "#2a3bed",
      violet: "#6a22d8",
      mag: "#b81fc4",
    },
  },
  {
    name: "Neon",
    theme: {
      warm: "#faff00",
      coral: "#ff2d55",
      pink: "#ff00a8",
      blue: "#00e0ff",
      violet: "#7a00ff",
      mag: "#ff00ff",
    },
  },
  {
    name: "Mono",
    theme: {
      warm: "#3a3a3a",
      coral: "#5c5c5c",
      pink: "#7d7d7d",
      blue: "#4a4a4a",
      violet: "#6b6b6b",
      mag: "#8c8c8c",
    },
  },
  {
    name: "Ocean",
    theme: {
      warm: "#2ec4b6",
      coral: "#20a4b5",
      pink: "#1d84b5",
      blue: "#1560bd",
      violet: "#3b3b98",
      mag: "#5352ed",
    },
  },
];

export default function ThemePanel({
  value,
  onChange,
}: {
  value: ThemeConfig;
  onChange: (v: ThemeConfig) => void;
}) {
  function setColor(key: ColorKey, hex: string) {
    onChange({ ...value, [key]: hex });
  }

  function gradient(keys: ColorKey[]): string {
    const stops = keys.map((k) => value[k]).join(", ");
    return `linear-gradient(90deg, ${stops})`;
  }

  return (
    <div className={s.panel}>
      <header className={s.head}>
        <h2 className={s.title}>Theme</h2>
        <p className={s.hint}>Brand colors driving the warm and cool gradients.</p>
      </header>

      <section className={s.presets}>
        <span className={s.groupLabel}>Presets</span>
        <div className={s.presetRow}>
          {PRESETS.map((p) => (
            <button
              key={p.name}
              type="button"
              className={s.preset}
              onClick={() => onChange(p.theme)}
            >
              <span
                className={s.presetSwatch}
                style={{
                  background: `linear-gradient(90deg, ${p.theme.warm}, ${p.theme.coral}, ${p.theme.pink}, ${p.theme.blue}, ${p.theme.violet}, ${p.theme.mag})`,
                }}
              />
              {p.name}
            </button>
          ))}
        </div>
      </section>

      <ColorGroup
        label="Warm"
        keys={WARM_KEYS}
        value={value}
        gradient={gradient(WARM_KEYS)}
        onColor={setColor}
      />

      <ColorGroup
        label="Cool"
        keys={COOL_KEYS}
        value={value}
        gradient={gradient(COOL_KEYS)}
        onColor={setColor}
      />
    </div>
  );
}

function ColorGroup({
  label,
  keys,
  value,
  gradient,
  onColor,
}: {
  label: string;
  keys: ColorKey[];
  value: ThemeConfig;
  gradient: string;
  onColor: (key: ColorKey, hex: string) => void;
}) {
  return (
    <section className={s.group}>
      <div className={s.groupHead}>
        <span className={s.groupLabel}>{label}</span>
      </div>

      <div className={s.preview} style={{ background: gradient }} aria-hidden="true" />

      <div className={s.rows}>
        {keys.map((key) => (
          <ColorRow
            key={key}
            label={LABELS[key]}
            value={value[key]}
            onColor={(hex) => onColor(key, hex)}
          />
        ))}
      </div>
    </section>
  );
}

function ColorRow({
  label,
  value,
  onColor,
}: {
  label: string;
  value: string;
  onColor: (hex: string) => void;
}) {
  // Local draft so the user can type freely (including invalid intermediate
  // states like "#f36") without the parent snapping the field back. We only
  // lift state up when the draft is a complete #rrggbb. When the value changes
  // externally (preset button, color swatch), the effect resyncs the draft.
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  function onText(raw: string) {
    const next = raw.startsWith("#") ? raw : `#${raw}`;
    setDraft(next);
    if (HEX_RE.test(next)) onColor(next.toLowerCase());
  }

  return (
    <div className={s.row}>
      <label className={s.rowLabel}>{label}</label>
      <div className={s.controls}>
        <span className={s.swatchWrap}>
          <input
            type="color"
            className={s.swatch}
            value={value}
            onChange={(e) => onColor(e.target.value)}
            aria-label={`${label} color`}
          />
        </span>
        <input
          type="text"
          className={s.hex}
          value={draft}
          spellCheck={false}
          autoComplete="off"
          maxLength={7}
          onChange={(e) => onText(e.target.value)}
          aria-label={`${label} hex value`}
        />
      </div>
    </div>
  );
}
