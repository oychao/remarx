import { GraphView } from '../main';

declare const graphData: GraphView;

const view = document.querySelector('#view');

if (view) {
  view.innerHTML = `<pre>${JSON.stringify(graphData, null, 2)}</pre>`;
}
