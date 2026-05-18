export const languages = [
  { label: "Auto detect", value: "auto", prism: "javascript" },
  { label: "JavaScript", value: "javascript", prism: "javascript", extension: "js" },
  { label: "TypeScript", value: "typescript", prism: "typescript", extension: "ts" },
  { label: "Python", value: "python", prism: "python", extension: "py" },
  { label: "Java", value: "java", prism: "java", extension: "java" },
  { label: "C++", value: "cpp", prism: "cpp", extension: "cpp" },
  { label: "C#", value: "csharp", prism: "csharp", extension: "cs" },
  { label: "Go", value: "go", prism: "go", extension: "go" },
  { label: "Rust", value: "rust", prism: "rust", extension: "rs" },
  { label: "PHP", value: "php", prism: "php", extension: "php" },
  { label: "Ruby", value: "ruby", prism: "ruby", extension: "rb" },
  { label: "Swift", value: "swift", prism: "swift", extension: "swift" }
];

export const targetLanguages = languages.filter((language) => language.value !== "auto");

export const sampleCode = `function summarizeCart(items) {
  let total = 0;

  for (var i = 0; i <= items.length; i++) {
    total += items[i].price * items[i].quantity;
  }

  return "$" + total.toFixed(2);
}`;
