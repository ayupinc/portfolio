async function loadSqlScripts() {
  const blocks = document.querySelectorAll("[data-sql-src]");

  for (const block of blocks) {
    const source = block.getAttribute("data-sql-src");
    try {
      const response = await fetch(source);
      if (!response.ok) throw new Error(`Unable to load ${source}`);
      block.textContent = await response.text();
      hljs.highlightElement(block);
    } catch (error) {
      block.textContent = `Unable to load SQL script: ${source}`;
    }
  }
}

loadSqlScripts();
