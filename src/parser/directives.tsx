import React, { useEffect, useState } from "react";

export const TextPlus = ({ text }: TextPlusInterface) => {
  const [parsedText, setParsedText] = useState<string[]>([]);

  useEffect(() => {
    const parsed = [];
    let remainingText = text;

    MarkdownRules.forEach(([rule, template]) => {
      const matches = [...remainingText.matchAll(rule)];

      if (matches.length > 0) {
        const parts = remainingText.split(rule);

        parts.forEach((part, index) => {
          parsed.push(index % 2 === 0 ? part : template(...matches[index / 2]));
        });

        remainingText = parts[parts.length - 1];
      }
    });

    if (remainingText) {
      parsed.push(remainingText);
    }

    setParsedText(parsed);
  }, [text]);

  return <div>{parsedText}</div>;
};

type MarkdownRule = [RegExp, (...matches: string[]) => JSX.Element];

const MarkdownRules: MarkdownRule[] = [
  // Header rules
  [/#{6}\s?([^\n]+)/g, (match, group) => <h6 key={match}>{group}</h6>],
  [/#{5}\s?([^\n]+)/g, (match, group) => <h5 key={match}>{group}</h5>],
  [/#{4}\s?([^\n]+)/g, (match, group) => <h4 key={match}>{group}</h4>],
  [/#{3}\s?([^\n]+)/g, (match, group) => <h3 key={match}>{group}</h3>],
  [/#{2}\s?([^\n]+)/g, (match, group) => <h2 key={match}>{group}</h2>],
  [/#{1}\s?([^\n]+)/g, (match, group) => <h1 key={match}>{group}</h1>],

  // Bold, italics, and paragraph rules
  [/\*\*\s?([^\n]+?)\*\*/g, (match, group) => <b key={match}>{group}</b>],
  [/\*\s?([^\n]+?)\*/g, (match, group) => <i key={match}>{group}</i>],
  [/__([^_]+?)__/g, (match, group) => <b key={match}>{group}</b>],
  [/_([^_`]+?)_/g, (match, group) => <i key={match}>{group}</i>],
  [/([^\n]+?\n?)/g, (match, group) => <p key={match}>{group}</p>],

  // Links
  [
    /\[([^\]]+)\]\(([^)]+)\)/g,
    (match, text, url) => (
      <a
        href={url}
        key={match}
        style={{ color: "#2A5DB0", textDecoration: "none" }}
      >
        {text}
      </a>
    ),
  ],

  // Highlights
  [
    /(`)(\s?[^\n,]+?\s?)(`)/g,
    (match, _, text) => (
      <span
        key={match}
        style={{
          backgroundColor: "grey",
          color: "black",
          textDecoration: "none",
          borderRadius: "3px",
          padding: "0 2px",
        }}
      >
        {text}
      </span>
    ),
  ],

  // Lists
  [
    /([^\n]+?)(\+)([^\n]+)/g,
    (match, _, listContent) => (
      <ul key={match}>
        <li>{listContent}</li>
      </ul>
    ),
  ],
  [
    /([^\n]+?)(\*)([^\n]+)/g,
    (match, _, listContent) => (
      <ul key={match}>
        <li>{listContent}</li>
      </ul>
    ),
  ],

  // Image
  [
    /!\[([^\]]+)\]\(([^)]+)\s"([^")]+)"\)/g,
    (match, altText, imageUrl, title) => (
      <img src={imageUrl} alt={altText} title={title} key={match} />
    ),
  ],
];

interface TextPlusInterface {
  text: string;
}
