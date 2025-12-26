// Script codemod per sostituzione automatica pattern legacy pulsanti con componenti M3
// Usa jscodeshift o ts-migrate per applicare in batch
// Esegui: npx jscodeshift -t scripts/codemod-m3-buttons.js src/components/

/**
 * Sostituisce:
 * - <button className="button button-filled ..."> => <M3Button variant="filled" ...>
 * - <button className="button button-text ..."> => <M3Button variant="text" ...>
 * - <button className="icon-button ..."> => <M3IconButton ...>
 * - <button className="segmented-button ..."> => <M3SegmentedButton ...>
 *
 * Conserva props onClick, disabled, aria-label, children, ecc.
 */

const transformer = function (file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  // Sostituzione <button className="button button-filled ...">
  root.find(j.JSXElement, {
    openingElement: {
      name: { name: 'button' },
      attributes: arr => arr.some(attr =>
        attr.type === 'JSXAttribute' &&
        attr.name.name === 'className' &&
        attr.value.type === 'Literal' &&
        /button-filled/.test(attr.value.value)
      )
    }
  }).forEach(path => {
    path.node.openingElement.name.name = 'M3Button';
    // TODO: aggiungi variant="filled" e mappa altre props
  });

  // Sostituzione <button className="button button-text ...">
  root.find(j.JSXElement, {
    openingElement: {
      name: { name: 'button' },
      attributes: arr => arr.some(attr =>
        attr.type === 'JSXAttribute' &&
        attr.name.name === 'className' &&
        attr.value.type === 'Literal' &&
        /button-text/.test(attr.value.value)
      )
    }
  }).forEach(path => {
    path.node.openingElement.name.name = 'M3Button';
    // TODO: aggiungi variant="text"
  });

  // Sostituzione <button className="icon-button ...">
  root.find(j.JSXElement, {
    openingElement: {
      name: { name: 'button' },
      attributes: arr => arr.some(attr =>
        attr.type === 'JSXAttribute' &&
        attr.name.name === 'className' &&
        attr.value.type === 'Literal' &&
        /icon-button/.test(attr.value.value)
      )
    }
  }).forEach(path => {
    path.node.openingElement.name.name = 'M3IconButton';
    // TODO: mappa props icona
  });

  // Sostituzione <button className="segmented-button ...">
  root.find(j.JSXElement, {
    openingElement: {
      name: { name: 'button' },
      attributes: arr => arr.some(attr =>
        attr.type === 'JSXAttribute' &&
        attr.name.name === 'className' &&
        attr.value.type === 'Literal' &&
        /segmented-button/.test(attr.value.value)
      )
    }
  }).forEach(path => {
    path.node.openingElement.name.name = 'M3SegmentedButton';
    // TODO: mappa props
  });

  return root.toSource();
};

export default transformer;
