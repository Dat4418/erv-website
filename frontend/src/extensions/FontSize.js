// src/extensions/FontSize.js
import { Mark, mergeAttributes } from "@tiptap/core";

export const FontSize = Mark.create({
  name: "fontSize",
  priority: 1000,
  addOptions() {
    return { HTMLAttributes: {} };
  },
  addAttributes() {
    return {
      size: {
        default: null,
        parseHTML: (element) => element.style.fontSize || null,
        renderHTML: (attrs) => {
          if (!attrs.size) {
            return {};
          }
          return { style: `font-size: ${attrs.size}` };
        },
      },
    };
  },
  parseHTML() {
    return [
      {
        tag: "span[style]",
        getAttrs: (dom) => {
          const size = dom.style.fontSize;
          return size ? { size } : false;
        },
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },
  addCommands() {
    return {
      setFontSize:
        (size) =>
        ({ chain }) => {
          return chain().setMark(this.name, { size }).run();
        },
      unsetFontSize:
        () =>
        ({ chain }) => {
          return chain().unsetMark(this.name).run();
        },
    };
  },
});
