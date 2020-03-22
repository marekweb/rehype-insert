const unified = require("unified");
const rehypeParse = require("rehype-parse");
const rehypeStringify = require("rehype-stringify");
const h = require("hastscript");
const rehypeInsert = require(".");

function processDocument(input, optionsForRehypeInsert) {
  return unified()
    .use(rehypeParse, { fragment: true })
    .use(rehypeInsert, optionsForRehypeInsert)
    .use(rehypeStringify)
    .process(input);
}

test("prepend to an element", async () => {
  const input =
    `<div id="alpha">` +
    `<p class="a">alpha</p>` +
    `<p class="b">bravo</p>` +
    `</div>`;
  const options = {
    insertions: [
      { selector: "#alpha", insert: h("p", "zamboni"), action: "prepend" },
    ],
  };
  const expected =
    `<div id="alpha">` +
    `<p>zamboni</p>` +
    `<p class="a">alpha</p>` +
    `<p class="b">bravo</p>` +
    `</div>`;

  const output = await processDocument(input, options);
  expect(output.contents).toBe(expected);
});

test("append to an element", async () => {
  const input =
    `<div id="alpha">` +
    `<p class="a">alpha</p>` +
    `<p class="b">bravo</p>` +
    `</div>`;
  const options = {
    insertions: [
      { selector: "#alpha", insert: h("p", "zamboni"), action: "append" },
    ],
  };
  const expected =
    `<div id="alpha">` +
    `<p class="a">alpha</p>` +
    `<p class="b">bravo</p>` +
    `<p>zamboni</p>` +
    `</div>`;
  const output = await processDocument(input, options);
  expect(output.contents).toBe(expected);
});

test("replace contents of an element", async () => {
  const input =
    `<div id="alpha">` +
    `<p class="a">alpha</p>` +
    `<p class="b">bravo</p>` +
    `</div>`;
  const options = {
    insertions: [{ selector: "#alpha", insert: h("p", "zamboni") }],
  };
  const output = await processDocument(input, options);
  const expected = `<div id="alpha">` + `<p>zamboni</p>` + `</div>`;
  expect(output.contents).toBe(expected);
});

test("replace multiple texts", async () => {
  const input =
    `<div id="alpha">` +
    `<p class="a">alpha</p>` +
    `<p class="b">bravo</p>` +
    `</div>`;
  const options = {
    insertions: [
      { selector: "#alpha .a", insert: "apple" },
      { selector: "#alpha .b", insert: "banana" },
    ],
  };
  const output = await processDocument(input, options);
  const expected =
    `<div id="alpha">` +
    `<p class="a">apple</p>` +
    `<p class="b">banana</p>` +
    `</div>`;
  expect(output.contents).toBe(expected);
});

test("replace with multiple nodes", async () => {
  const input =
    `<div id="alpha">` +
    `<p class="a">alpha</p>` +
    `<p class="b">bravo</p>` +
    `</div>`;
  const options = {
    insertions: [
      { selector: "#alpha", insert: [h("p.c", "charlie"), h("p.d", "delta")] },
    ],
  };
  const output = await processDocument(input, options);
  const expected =
    `<div id="alpha">` +
    `<p class="c">charlie</p>` +
    `<p class="d">delta</p>` +
    `</div>`;
  expect(output.contents).toBe(expected);
});

test("readme example should work", async () => {
  const input =
    `<article>` +
    `<h1 id="title">Untitled</h1>` +
    `<section class="content">` +
    `<p>It was the best of times...</p>` +
    `</section>` +
    `</article>`;
  const options = {
    insertions: [
      { selector: "#title", insert: "A Tale of Two Cities" },
      {
        selector: ".content",
        insert: h("p", "It was the worst of times."),
        action: "append",
      },
    ],
  };
  const output = await processDocument(input, options);
  const expected =
    `<article>` +
    `<h1 id="title">A Tale of Two Cities</h1>` +
    `<section class="content">` +
    `<p>It was the best of times...</p>` +
    `<p>It was the worst of times.</p>` +
    `</section>` +
    `</article>`;
  expect(output.contents).toBe(expected);
});
