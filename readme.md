# rehype-insert

[**rehype**][rehype] plugin to insert HTML fragments into specified locations in
a parsed HTML tree.

Provide a HTML fragment to be inserted in the form of a [**HAST**][hast] tree.
The fragment can be a string (which will insert a text node), a HAST node, or an
array of HAST nodes.

Select an element in the target HTML tree by providing a selector string.
Supports any selector which can be used by
[**hast-util-select**][hast-util-select].

HAST trees can be created by parsing HTML content with [**rehype-parse**][rehype-parse] or by
using [**hastscript**][hastscript].

## Installation

The module is experimental and isn't published on NPM yet, but can be installed
directly from the GitHub repository.

```sh
npm install marekweb/rehype-insert
```

```js
const rehypeInsert = require("rehype-insert");
```

## Example Usage

Take this HTML fragment, which is going to be parsed with
[**rehype-parse**][rehype-parse]:

```html
<article>
  <h1 id="title">Untitled</h1>
  <section class="content">
    <p>It was the best of times...</p>
  </section>
</article>
```

By running `rehype-insert` as a plugin with the following options, we can insert
text and elements into the HTML fragment.

```js
const h = require("hastscript");

const optionsForInsert = [
  {
    selector: "#title",
    insert: "A Tale of Two Cities",
  },
  {
    selector: ".content",
    insert: h("p", "It was the worst of times."),
    action: "append",
  },
];
```

To use `rehype-insert` as a plugin, here's how we connect it to the processor,
between the parse step and the stringify step:

```js
const unified = require("unified");
const rehypeParse = require("rehype-parse");
const rehypeStringify = require("rehype-stringify");
const rehypeInsert = require("rehype-insert");

unified()
  .use(rehypeParse, { fragment: true })
  .use(rehypeInsert, optionsForInsert) // <-- attach the rehype-insert plugin
  .use(rehypeStringify)
  .process(input)
  .then((output) => {
    console.log(output.contents);
  });
```

Here's the output. Notice that we replaced the text in the `#title` element, and we appended a new element to `.content`:

```html
<article>
  <h1 id="title">A Tale of Two Cities</h1>
  <section class="content">
    <p>It was the best of times...</p>
    <p>It was the worst of times.</p>
  </section>
</article>
```

## API

### `rehype().use(rehypeInsert[, options])`

##### `options`: an options object or an array of options objects (for multiple insertions)

###### `options.selector`

Element selector string, as supported by
[**hast-util-select**][hast-util-select]

###### `options.insert`

Content to insert inside of the selected node. Possible types of values:

- a [**HAST**][hast] node
- an array of [**HAST**][hast] nodes
- a string (will be converted to a text node)

###### `options.action` (default: `'replace'`)

Type of insert action to perform:

- `replace` (default): replace existing content in the selected node (if any) with
  the new content.
- `append`: conserve the selected node's children and append the content to the
  children.
- `prepend`: conserve the selected node's children and prepend the content to the
  children.

## License

MIT © Marek Zaluski

[rehype]: https://github.com/rehypejs/rehype
[rehype-parse]:
  https://github.com/rehypejs/rehype/tree/master/packages/rehype-parse
[hast-util-select]: https://github.com/syntax-tree/hast-util-select
[hast]: https://github.com/syntax-tree/hast
[hastscript]: https://github.com/syntax-tree/hastscript
