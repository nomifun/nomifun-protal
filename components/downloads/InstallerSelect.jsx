"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Icon from "@/components/Icon";

export default function InstallerSelect({
  id,
  label,
  labelledBy,
  describedBy,
  placeholder,
  options,
  value,
  onChange,
}) {
  const [open, setOpen] = useState(false);
  const [activeValue, setActiveValue] = useState(value);
  const [position, setPosition] = useState({ side: "bottom", maxHeight: 320 });
  const field = useRef(null);
  const trigger = useRef(null);
  const list = useRef(null);
  const search = useRef({ text: "", time: 0 });
  const selected = options.find((option) => option.value === value);
  const active =
    options.find((option) => option.value === activeValue) ||
    selected ||
    options[0];
  const activeIndex = options.indexOf(active);
  const labelId = id + "-label";
  const valueId = id + "-value";
  const listId = id + "-options";
  const optionId = (option) => id + "-option-" + option.value.replace(":", "-");

  useEffect(() => {
    if (!open) return;
    const dismiss = (event) => {
      if (!field.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, [open]);

  useLayoutEffect(() => {
    if (!open) return;
    const place = () => {
      const bounds = trigger.current.getBoundingClientRect();
      const below = window.innerHeight - bounds.bottom - 16;
      const above = bounds.top - 16;
      const side =
        below < Math.min(list.current.scrollHeight, 320) && above > below
          ? "top"
          : "bottom";
      const maxHeight = Math.max(
        0,
        Math.min(320, side === "top" ? above : below),
      );
      setPosition((previous) =>
        previous.side === side && previous.maxHeight === maxHeight
          ? previous
          : { side, maxHeight },
      );
    };
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open, options]);

  useEffect(() => {
    if (!open) return;
    const option = list.current?.querySelector('[data-active="true"]');
    if (!option) return;
    const top = option.offsetTop;
    const bottom = top + option.offsetHeight;
    if (top < list.current.scrollTop) list.current.scrollTop = top;
    else if (bottom > list.current.scrollTop + list.current.clientHeight)
      list.current.scrollTop = bottom - list.current.clientHeight;
  }, [open, active, position.maxHeight]);

  const show = (option = selected || options[0]) => {
    setActiveValue(option?.value);
    search.current = { text: "", time: 0 };
    setOpen(true);
  };
  const choose = (option) => {
    if (!option) return;
    onChange(option.value);
    setOpen(false);
    trigger.current.focus({ preventScroll: true });
  };
  const handleKeyDown = (event) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!open)
        show(
          selected || options[event.key === "ArrowUp" ? options.length - 1 : 0],
        );
      else
        setActiveValue(
          options[
            Math.max(
              0,
              Math.min(
                options.length - 1,
                activeIndex + (event.key === "ArrowDown" ? 1 : -1),
              ),
            )
          ]?.value,
        );
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      show(options[event.key === "Home" ? 0 : options.length - 1]);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (open) choose(active);
      else show();
    } else if (event.key === "Escape" && open) {
      event.preventDefault();
      event.stopPropagation();
      setOpen(false);
    } else if (event.key === "Tab") {
      setOpen(false);
    } else if (
      event.key.length === 1 &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.altKey
    ) {
      const now = Date.now();
      const text =
        (now - search.current.time < 600 ? search.current.text : "") +
        event.key.toLowerCase();
      search.current = { text, time: now };
      const query = [...text].every((character) => character === text[0])
        ? text[0]
        : text;
      const ordered = [
        ...options.slice(activeIndex + 1),
        ...options.slice(0, activeIndex + 1),
      ];
      const match = ordered.find((option) =>
        `${option.label} ${option.format}`.toLowerCase().startsWith(query),
      );
      if (match) {
        event.preventDefault();
        setActiveValue(match.value);
        setOpen(true);
      }
    }
  };

  return (
    <div
      className="release-package-field"
      ref={field}
      data-open={open}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <label className="release-package-label" id={labelId} htmlFor={id}>
        {label}
      </label>
      <div className="release-package-select">
        <button
          type="button"
          className="release-package-trigger"
          id={id}
          ref={trigger}
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
          aria-labelledby={[labelledBy, labelId, valueId]
            .filter(Boolean)
            .join(" ")}
          aria-describedby={describedBy}
          aria-activedescendant={open && active ? optionId(active) : undefined}
          onClick={() => (open ? setOpen(false) : show())}
          onKeyDown={handleKeyDown}
        >
          <span className="release-package-icon" aria-hidden="true">
            <Icon name="Cpu" size={18} />
          </span>
          <span className="release-package-value" id={valueId}>
            <span className="release-package-architecture">
              {selected?.label || placeholder}
            </span>
            {selected && (
              <span className="release-package-format">{selected.format}</span>
            )}
          </span>
          <Icon name="CaretDown" size={15} className="release-package-caret" />
        </button>
        {open && (
          <ul
            className="release-package-menu"
            id={listId}
            ref={list}
            role="listbox"
            aria-labelledby={[labelledBy, labelId].filter(Boolean).join(" ")}
            data-placement={position.side}
            data-lenis-prevent
            style={{ maxHeight: position.maxHeight }}
          >
            {options.map((option) => (
              <li
                className="release-package-option"
                id={optionId(option)}
                key={option.value}
                role="option"
                aria-selected={option.value === value}
                aria-label={`${option.label} · ${option.format}`}
                aria-describedby={optionId(option) + "-description"}
                data-active={option.value === active?.value}
                onPointerMove={() => setActiveValue(option.value)}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => choose(option)}
              >
                <span className="release-package-option-copy">
                  <span className="release-package-option-title">
                    {option.label}
                  </span>
                  <span
                    className="release-package-option-description"
                    id={optionId(option) + "-description"}
                  >
                    {option.description}
                  </span>
                </span>
                <span className="release-package-format" aria-hidden="true">
                  {option.format}
                </span>
                <span className="release-package-check" aria-hidden="true">
                  {option.value === value && (
                    <Icon name="Check" size={13} weight="bold" />
                  )}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
